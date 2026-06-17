import { useCallback, useEffect, useRef, useState } from "react";

const PAIR = "EUR/USD";
const BASE_PRICE = 1.08452;
const SPREAD_PIPS = 1.2;

function generateCandles(count, startPrice) {
  const candles = [];
  let price = startPrice;
  for (let i = 0; i < count; i++) {
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

export function useForexSimulator(enabled = true) {
  const tickRef = useRef(0);
  const [candles, setCandles] = useState(() => generateCandles(40, BASE_PRICE));
  const [price, setPrice] = useState(BASE_PRICE);
  const [bid, setBid] = useState(BASE_PRICE - SPREAD_PIPS * 0.00005);
  const [ask, setAsk] = useState(BASE_PRICE + SPREAD_PIPS * 0.00005);
  const [direction, setDirection] = useState("up");

  const tick = useCallback(() => {
    tickRef.current += 1;
    const move = (Math.random() - 0.46) * 0.00018;
    setPrice((prev) => {
      const next = Math.max(1.078, Math.min(1.092, prev + move));
      setDirection(move >= 0 ? "up" : "down");
      setBid(next - SPREAD_PIPS * 0.00005);
      setAsk(next + SPREAD_PIPS * 0.00005);

      setCandles((current) => {
        const copy = [...current];
        const last = { ...copy[copy.length - 1] };
        last.close = next;
        last.high = Math.max(last.high, next);
        last.low = Math.min(last.low, next);

        if (tickRef.current % 8 === 0) {
          copy.push({
            id: Date.now(),
            open: next,
            high: next,
            low: next,
            close: next,
          });
          if (copy.length > 44) copy.shift();
        } else {
          copy[copy.length - 1] = last;
        }
        return copy;
      });

      return next;
    });
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    const id = window.setInterval(tick, 3500);
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
  };
}