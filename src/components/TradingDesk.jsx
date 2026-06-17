import { AnimatePresence, motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import { useFundedAccountSimulator } from "../hooks/useFundedAccountSimulator";
import { useSiteMode } from "../hooks/useSiteMode";
import LiveEquityFlowChart from "./LiveEquityFlowChart";
import { VIEWPORT } from "../utils/animations";
import { fireSubtleConfetti } from "../utils/confetti";
import { SectionTitle } from "./UI";

function ForexChart({ candles, price }) {
  const visible = candles.slice(-40);
  const prices = visible.flatMap((c) => [c.high, c.low]);
  const min = Math.min(...prices) - 0.0002;
  const max = Math.max(...prices) + 0.0002;
  const range = max - min || 0.001;

  const w = 560;
  const h = 220;
  const candleW = w / visible.length;
  const y = (val) => h - ((val - min) / range) * (h - 16) - 8;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" preserveAspectRatio="none" aria-hidden="true">
      {[0.25, 0.5, 0.75].map((pct) => {
        const lineY = 8 + (h - 16) * pct;
        return (
          <line key={pct} x1="0" y1={lineY} x2={w} y2={lineY} stroke="#b6d1e5" strokeOpacity="0.07" />
        );
      })}

      {visible.map((c, i) => {
        const bull = c.close >= c.open;
        const color = bull ? "#5cff8d" : "#f43f5e";
        const x = i * candleW + candleW * 0.2;
        const bodyTop = y(Math.max(c.open, c.close));
        const bodyBottom = y(Math.min(c.open, c.close));
        const bodyH = Math.max(bodyBottom - bodyTop, 1.5);

        return (
          <g key={c.id ?? i}>
            <line x1={x + candleW * 0.3} y1={y(c.high)} x2={x + candleW * 0.3} y2={y(c.low)} stroke={color} strokeWidth="1" />
            <rect x={x} y={bodyTop} width={candleW * 0.6} height={bodyH} fill={color} rx="0.5" />
          </g>
        );
      })}

      <motion.line
        x1="0"
        y1={y(price)}
        x2={w}
        y2={y(price)}
        stroke="#55d6ff"
        strokeWidth="1"
        strokeDasharray="4 4"
        strokeOpacity="0.7"
        animate={{ strokeOpacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      />
    </svg>
  );
}

export default function TradingDesk() {
  const { data } = useSiteMode();
  const deskCopy = data.copy.tradingDesk;
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { margin: "120px 0px", amount: 0.1 });
  const {
    pair,
    price,
    bid,
    ask,
    spread,
    direction,
    candles,
    balance,
    equity,
    dailyPnL,
    equityFlow,
    tickCount,
    applyTrade,
  } = useFundedAccountSimulator(inView);

  const [lotSize, setLotSize] = useState("0.10");
  const [stopLoss, setStopLoss] = useState("1.0820");
  const [takeProfit, setTakeProfit] = useState("1.0880");
  const [tradeCount, setTradeCount] = useState(0);
  const [orderPopup, setOrderPopup] = useState(null);
  const [roastMsg, setRoastMsg] = useState(false);

  const executeTrade = (side) => {
    const lots = parseFloat(lotSize) || 0.1;
    const profit = (Math.random() > 0.38 ? 1 : -1) * (Math.random() * 95 + 8) * lots * 10;

    applyTrade(profit);

    const nextCount = tradeCount + 1;
    setTradeCount(nextCount);
    if (nextCount >= 3 && !roastMsg) setRoastMsg(true);

    if (profit > 0) fireSubtleConfetti();

    setOrderPopup({
      side,
      profit,
      price: side === "buy" ? ask : bid,
      lots,
    });

    window.setTimeout(() => setOrderPopup(null), 3200);
  };

  const dailyUp = dailyPnL >= 0;
  const equityUp = equityFlow.length >= 2 && equityFlow[equityFlow.length - 1].value >= equityFlow[0].value;

  return (
    <section id="desk" ref={sectionRef} className="relative border-y border-slate-800/60 bg-[#050d18] py-16 md:py-28">
      <div className="pointer-events-none absolute left-0 top-1/3 h-72 w-72 rounded-full bg-cyan/5 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-5 md:px-8">
        <SectionTitle
          theme="birthday"
          eyebrow={deskCopy.eyebrow}
          title={
            <>
              Tharun&apos;s <span className="lime-gradient">Trading Desk</span>
            </>
          }
          copy={deskCopy.copy}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          className="glass overflow-hidden rounded-2xl border-slate-800/75 sm:rounded-3xl"
        >
          <div className="h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent" />

          <div className="flex flex-col gap-3 border-b border-slate-800/70 bg-black/30 px-3 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-5">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-5">
              <span className="rounded-full border border-slate-800/80 bg-slate-900/40 px-2.5 py-1 font-mono text-[10px] text-slate-400">
                🎂 {deskCopy.fundedBadge}
              </span>
              <span className="flex items-center gap-2 rounded-full border border-lime/20 bg-lime/10 px-2.5 py-1">
                <motion.span
                  className="dashboard-live-dot h-1.5 w-1.5 rounded-full bg-lime"
                  animate={{ opacity: inView ? [1, 0.35, 1] : 1 }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
                <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-lime sm:text-[10px]">
                  {deskCopy.liveBadge}
                </span>
              </span>
              <span className="font-display text-sm font-bold text-white md:text-base">{pair}</span>
              <motion.span
                key={price}
                initial={{ opacity: 0.6, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className={`font-mono text-base font-bold sm:text-lg md:text-xl ${direction === "up" ? "text-lime" : "text-rose-400"}`}
              >
                {price.toFixed(5)}
                {direction === "up" ? (
                  <FaArrowUp className="ml-1 inline text-xs" />
                ) : (
                  <FaArrowDown className="ml-1 inline text-xs" />
                )}
              </motion.span>
            </div>
            <div className="flex flex-wrap gap-3 font-mono text-[10px] sm:gap-4 sm:text-[11px] md:text-xs">
              <span className="text-slate-500">
                Bid <span className="font-bold text-rose-400">{bid.toFixed(5)}</span>
              </span>
              <span className="text-slate-500">
                Ask <span className="font-bold text-lime">{ask.toFixed(5)}</span>
              </span>
              <span className="text-slate-500">
                Spread <span className="font-bold text-cyan">{spread} pips</span>
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="border-b border-slate-800/70 p-3 md:p-4 lg:border-b-0 lg:border-r">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {deskCopy.chartLabel}
                </span>
                <span className="rounded border border-lime/20 bg-lime/10 px-2 py-0.5 text-[9px] font-bold text-lime">
                  {deskCopy.liveBadge}
                </span>
              </div>
              <div className="h-[180px] overflow-hidden rounded-xl border border-slate-800/75 bg-[#030a14]/80 sm:h-[200px] md:h-[240px] lg:h-[260px]">
                <ForexChart candles={candles} price={price} />
              </div>

              <div className="mt-3 rounded-xl border border-slate-800/75 bg-[#030a14]/70 p-2.5 sm:p-3">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {deskCopy.equityFlowLabel ?? "Live equity flow"}
                  </span>
                  <div className="flex items-center gap-2 font-mono text-[9px] text-slate-600">
                    <span className={equityUp ? "text-lime" : "text-rose-400"}>
                      {equityUp ? "▲ Flow bullish" : "▼ Flow easing"}
                    </span>
                    <span>#{tickCount}</span>
                  </div>
                </div>
                <div className="h-[100px] sm:h-[120px] md:h-[130px]">
                  <LiveEquityFlowChart points={equityFlow} direction={direction} />
                </div>
                <p className="mt-2 text-center text-[10px] italic text-slate-500">
                  {deskCopy.equityFlowNote ?? "Funded account curve updating live"}
                </p>
              </div>

              <p className="mt-2 text-center text-[10px] italic text-slate-500">{deskCopy.capitalNote}</p>
            </div>

            <div className="flex flex-col gap-4 p-3 sm:p-4 md:p-5">
              <div className="rounded-2xl border border-slate-800/75 bg-black/25 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Funded Account</p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {[
                    { label: "Balance", value: `$${balance.toFixed(2)}`, tone: "text-white" },
                    { label: "Equity", value: `$${equity.toFixed(2)}`, tone: direction === "up" ? "text-lime" : "text-white" },
                    { label: "Margin Used", value: "12%", tone: "text-cyan" },
                    {
                      label: "Daily P&L",
                      value: `${dailyUp ? "+" : ""}$${dailyPnL.toFixed(2)}`,
                      tone: dailyUp ? "text-lime" : "text-rose-400",
                    },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-[9px] uppercase tracking-wider text-slate-600">{item.label}</p>
                      <motion.p
                        key={item.value}
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 1 }}
                        className={`mt-0.5 font-mono text-sm font-bold ${item.tone}`}
                      >
                        {item.value}
                      </motion.p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800/75 bg-black/25 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">New Order</p>
                <div className="mt-3 space-y-2.5">
                  {[
                    { label: "Lot Size", value: lotSize, set: setLotSize, placeholder: "0.10" },
                    { label: "Stop Loss", value: stopLoss, set: setStopLoss, placeholder: "1.0820" },
                    { label: "Take Profit", value: takeProfit, set: setTakeProfit, placeholder: "1.0880" },
                  ].map((field) => (
                    <label key={field.label} className="block">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">{field.label}</span>
                      <input
                        type="text"
                        value={field.value}
                        onChange={(e) => field.set(e.target.value)}
                        placeholder={field.placeholder}
                        className="mt-1 w-full rounded-lg border border-slate-800/80 bg-slate-900/40 px-3 py-2.5 font-mono text-sm text-white outline-none focus:border-lime/30 focus:ring-1 focus:ring-lime/15"
                      />
                    </label>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <motion.button
                    type="button"
                    onClick={() => executeTrade("buy")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="rounded-xl bg-lime py-3.5 font-display text-sm font-extrabold text-[#04130a] shadow-glow"
                  >
                    BUY
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => executeTrade("sell")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="rounded-xl bg-rose-500 py-3.5 font-display text-sm font-extrabold text-white shadow-[0_0_24px_rgba(244,63,94,0.25)]"
                  >
                    SELL
                  </motion.button>
                </div>
              </div>

              <AnimatePresence>
                {roastMsg && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-lime/20 bg-lime/10 px-3 py-2.5 text-center text-xs font-semibold text-lime"
                  >
                    {deskCopy.roast}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {orderPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[85] grid place-items-center bg-black/50 px-5 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.88, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="glass w-full max-w-sm rounded-2xl border border-slate-700/80 p-6 text-center shadow-2xl"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime">Order Filled!</p>
              <p className="mt-2 font-display text-xl font-bold text-white">
                {orderPopup.side.toUpperCase()} {orderPopup.lots} lots @ {orderPopup.price.toFixed(5)}
              </p>
              <p
                className={`mt-3 font-display text-2xl font-bold ${
                  orderPopup.profit >= 0 ? "text-lime" : "text-rose-400"
                }`}
              >
                {orderPopup.profit >= 0 ? "+" : ""}${orderPopup.profit.toFixed(2)}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                {orderPopup.profit >= 0 ? deskCopy.orderWin : deskCopy.orderLoss}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}