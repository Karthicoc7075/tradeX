import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FaArrowTrendUp } from "react-icons/fa6";
import { useSiteMode } from "../hooks/useSiteMode";
import { VIEWPORT } from "../utils/animations";
import { fireSubtleConfetti } from "../utils/confetti";
import Tooltip from "./Tooltip";
import { SectionTitle } from "./UI";

export default function TradingTerminal() {
  const { data } = useSiteMode();
  const { tradingAssets, copy } = data;
  const terminalCopy = copy.tradingTerminal;
  const [selected, setSelected] = useState(tradingAssets[0]);
  const [pnl, setPnl] = useState(null);
  const [balance, setBalance] = useState(100000);

  const trade = (side) => {
    const delta = (Math.random() * 8000 + 500) * (side === "buy" ? 1 : -1);
    const next = balance + delta;
    setBalance(next);
    setPnl({ side, amount: delta, total: next });
    if (delta > 0) fireSubtleConfetti();
    window.setTimeout(() => setPnl(null), 2800);
  };

  return (
    <section id="terminal" className="relative border-y border-white/5 bg-[#07101e]/55 py-24 md:py-32">
      <div className="pointer-events-none absolute right-0 top-1/4 h-64 w-64 rounded-full bg-lime/5 blur-[100px]" />
      <div className="relative mx-auto max-w-6xl px-5 md:px-8">
        <SectionTitle
          theme="birthday"
          eyebrow={terminalCopy.eyebrow}
          title={
            <>
              Live Trading <span className="lime-gradient">Terminal</span>
            </>
          }
          copy={terminalCopy.copy}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          className="glass card-hover card-hover-lime overflow-hidden rounded-3xl border-white/10"
        >
          <div className="h-px bg-gradient-to-r from-transparent via-lime/40 to-transparent" />

          <div className="flex flex-col gap-3 border-b border-white/8 bg-black/25 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-2 rounded-full border border-lime/20 bg-lime/10 px-3 py-1">
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-lime"
                  animate={{ opacity: [1, 0.35, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-lime">
                  {terminalCopy.liveBadge}
                </span>
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[10px] text-slate-400">
                {terminalCopy.exchange}
              </span>
            </div>
            <p className="font-mono text-xs text-slate-400">
              Balance{" "}
              <span className="font-bold text-white">₹{balance.toLocaleString("en-IN")}</span>
            </p>
          </div>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <div className="border-b border-white/8 p-4 lg:border-b-0 lg:border-r lg:p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{terminalCopy.watchlistLabel}</p>
                <span className="text-[10px] text-slate-600">{tradingAssets.length} assets</span>
              </div>

              <div className="grid max-h-[280px] grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2 lg:max-h-[340px] lg:grid-cols-1">
                {tradingAssets.map((asset) => {
                  const active = selected.id === asset.id;
                  return (
                    <Tooltip key={asset.id} text={asset.tooltip} className="block w-full">
                      <motion.button
                        type="button"
                        onClick={() => setSelected(asset)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-3 text-left transition-colors sm:px-4 ${
                          active
                            ? "border-lime/30 bg-lime/10 ring-1 ring-lime/20"
                            : "border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                        }`}
                      >
                        <span className="flex min-w-0 items-center gap-2.5">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/5 text-lg">
                            {asset.emoji}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate font-display text-sm font-bold text-white">{asset.symbol}</span>
                            <span className="block truncate text-[10px] text-slate-500">{asset.name}</span>
                          </span>
                        </span>
                        <span className="shrink-0 font-mono text-xs font-bold text-lime sm:text-sm">
                          ₹{asset.price.toFixed(2)}
                        </span>
                      </motion.button>
                    </Tooltip>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col p-4 sm:p-5 md:p-6">
              <div className="rounded-2xl border border-white/8 bg-[#050f1c]/60 p-4 md:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5 text-3xl">
                      {selected.emoji}
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-bold text-white md:text-2xl">{selected.name}</h3>
                      <p className="mt-0.5 font-mono text-xs text-slate-500">{selected.symbol}/INR</p>
                      <p className="mt-2 max-w-[220px] text-[11px] leading-relaxed text-slate-500">{selected.tooltip}</p>
                    </div>
                  </div>
                  <motion.div
                    key={selected.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-right"
                  >
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">Last price</p>
                    <p className="font-display text-2xl font-bold text-white md:text-3xl">₹{selected.price.toFixed(2)}</p>
                  </motion.div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    { label: "Signal", value: "STRONG BUY", tone: "text-lime" },
                    { label: "Risk", value: "LOW", tone: "text-cyan" },
                    { label: "Trend", value: "+24.7%", tone: "text-lime" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-white/8 bg-white/[0.03] px-2 py-2.5 text-center sm:px-3"
                    >
                      <p className="text-[9px] uppercase tracking-wider text-slate-500">{stat.label}</p>
                      <p className={`mt-1 font-mono text-[10px] font-bold sm:text-xs ${stat.tone}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <motion.button
                  type="button"
                  onClick={() => trade("buy")}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-xl bg-lime py-3.5 font-display text-sm font-extrabold text-[#04130a] shadow-glow sm:py-4"
                >
                  BUY {selected.symbol}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => trade("sell")}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-xl border border-rose-500/35 bg-rose-500/10 py-3.5 font-display text-sm font-extrabold text-rose-400 sm:py-4"
                >
                  SELL {selected.symbol}
                </motion.button>
              </div>

              <div className="mt-4 min-h-[88px]">
                <AnimatePresence mode="wait">
                  {pnl ? (
                    <motion.div
                      key={`${pnl.side}-${pnl.amount}`}
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6 }}
                      className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 ${
                        pnl.amount > 0
                          ? "border-lime/25 bg-lime/10"
                          : "border-rose-500/25 bg-rose-500/10"
                      }`}
                    >
                      <div className="text-left">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {pnl.side === "buy" ? "Position opened" : "Position closed"}
                        </p>
                        <p
                          className={`mt-1 font-display text-lg font-bold ${
                            pnl.amount > 0 ? "text-lime" : "text-rose-400"
                          }`}
                        >
                          {pnl.amount > 0 ? "+" : ""}₹{Math.abs(pnl.amount).toFixed(0)} P&L
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {pnl.amount > 0 ? terminalCopy.pnlWin : terminalCopy.pnlLoss}
                        </p>
                      </div>
                      {pnl.amount > 0 && (
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-lime/15 text-lime">
                          <FaArrowTrendUp />
                        </span>
                      )}
                    </motion.div>
                  ) : (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex h-full items-center justify-center rounded-xl border border-dashed border-white/10 py-6 text-center text-xs text-slate-600"
                    >
                      {terminalCopy.emptyPnl}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}