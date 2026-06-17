import { useCallback, useEffect, useRef, useState } from "react";

const PAIR = "EUR/USD";
const BASE_PRICE = 1.08452;
const SPREAD_PIPS = 1.2;
const TICK_MS = 2400;
const MAX_CANDLES = 44;
const MAX_FLOW_POINTS = 64;

function generateCandles(count, startPrice) {
  const candles = [];
  let price = startPrice;

  for (let i = 0; i < count; i += 1) {
    const open = price;
    const delta = (Math.random() - 0.47) * 0.00065;
    const close = Math.max(1.07, Math.min(1.1, open + delta));
    const high = Math.max(open, close) + Math.random() * 0.00035;
    const low = Math.min(open, close) - Math.random() * 0.00035;
    candles.push({ id: i, open, high, low, close });
    price = close;
  }

  return candles;
}

function generateInitialFlow(startEquity, count = 36) {
  const points = [];
  let value = startEquity - 120;

  for (let i = 0; i < count; i += 1) {
    value += (Math.random() - 0.4) * 18;
    points.push({ id: i, value: Math.max(startEquity - 200, value) });
  }

  points[points.length - 1] = { id: count - 1, value: startEquity };
  return points;
}

function appendFlowPoint(flow, value) {
  const next = [...flow, { id: Date.now(), value }];
  if (next.length > MAX_FLOW_POINTS) next.shift();
  return next;
}

export function useFundedAccountSimulator(enabled = true, options = {}) {
  const {
    startBalance = 4872.45,
    startEquity = 4965.2,
    startDailyPnL = 87.3,
  } = options;

  const tickRef = useRef(0);
  const [candles, setCandles] = useState(() => generateCandles(40, BASE_PRICE));
  const [price, setPrice] = useState(BASE_PRICE);
  const [bid, setBid] = useState(BASE_PRICE - SPREAD_PIPS * 0.00005);
  const [ask, setAsk] = useState(BASE_PRICE + SPREAD_PIPS * 0.00005);
  const [direction, setDirection] = useState("up");
  const [balance, setBalance] = useState(startBalance);
  const [equity, setEquity] = useState(startEquity);
  const [dailyPnL, setDailyPnL] = useState(startDailyPnL);
  const [equityFlow, setEquityFlow] = useState(() => generateInitialFlow(startEquity));
  const [tickCount, setTickCount] = useState(0);

  const tick = useCallback(() => {
    tickRef.current += 1;
    const move = (Math.random() - 0.46) * 0.00018;
    const up = move >= 0;

    setPrice((prev) => {
      const next = Math.max(1.078, Math.min(1.092, prev + move));
      setDirection(up ? "up" : "down");
      setBid(next - SPREAD_PIPS * 0.00005);
      setAsk(next + SPREAD_PIPS * 0.00005);

      setCandles((current) => {
        const copy = [...current];
        const last = { ...copy[copy.length - 1] };
        last.close = next;
        last.high = Math.max(last.high, next);
        last.low = Math.min(last.low, next);

        if (tickRef.current % 6 === 0) {
          copy.push({ id: Date.now(), open: next, high: next, low: next, close: next });
          if (copy.length > MAX_CANDLES) copy.shift();
        } else {
          copy[copy.length - 1] = last;
        }

        return copy;
      });

      const floatDelta = (Math.random() * 9 + 2) * (up ? 1 : -1);
      setEquity((current) => {
        const nextEquity = Math.max(4600, current + floatDelta);
        setEquityFlow((flow) => appendFlowPoint(flow, nextEquity));
        return nextEquity;
      });
      setDailyPnL((current) => current + floatDelta * 0.35);

      return next;
    });

    setTickCount((count) => count + 1);
  }, []);

  const applyTrade = useCallback((profit) => {
    setBalance((current) => current + profit);
    setEquity((current) => {
      const nextEquity = current + profit;
      setEquityFlow((flow) => appendFlowPoint(flow, nextEquity));
      return nextEquity;
    });
    setDailyPnL((current) => current + profit);
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    const id = window.setInterval(tick, TICK_MS);
    return () => window.clearInterval(id);
  }, [enabled, tick]);

  return {
    pair: PAIR,
    price,
    bid,
    ask,
    spread: SPREAD_PIPS,
    direction,
    candles,
    balance,
    equity,
    dailyPnL,
    equityFlow,
    tickCount,
    applyTrade,
  };
}