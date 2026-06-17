import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useState } from "react";
import confetti from "canvas-confetti";
import { FaBolt, FaChevronDown, FaHistory, FaQuoteLeft, FaSignal } from "react-icons/fa";
import { useSiteMode } from "../hooks/useSiteMode";
import {
  adviceCardMotion,
  adviceDetailReveal,
  adviceListItem,
  advicePop,
  LAYOUT_IDS,
  LAYOUT_SPRING,
} from "../utils/animations";
import { CONFETTI_COLORS } from "../utils/confetti";
import { PrimaryButton, SectionTitle } from "./UI";

const TABS = [
  { id: "live", label: "Live Signal", icon: FaSignal },
  { id: "history", label: "Trade Log", icon: FaHistory },
];

export default function AdviceGenerator() {
  const { data, isBirthday } = useSiteMode();
  const { advice, adviceMeta, copy } = data;
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("live");
  const [history, setHistory] = useState([]);
  const meta = adviceMeta[index];

  const generate = () => {
    let next = Math.floor(Math.random() * advice.length);
    if (next === index) next = (next + 1) % advice.length;
    setIndex(next);
    setExpanded(false);
    setHistory((prev) => [
      { id: `${Date.now()}-${next}`, text: advice[next], adviceIndex: next, signal: adviceMeta[next].signal },
      ...prev.slice(0, 5),
    ]);
    if (isBirthday) {
      confetti({ particleCount: 24, spread: 50, origin: { y: 0.7 }, colors: CONFETTI_COLORS });
    }
  };

  return (
    <section id="advice" className="relative overflow-hidden border-y border-white/5 bg-[#07101e]/55 py-24 md:py-32">
      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/5 blur-[90px]" />
      <div className="relative mx-auto max-w-5xl px-5 text-center md:px-8">
        <SectionTitle eyebrow={copy.advice.eyebrow} title={copy.advice.title} copy={copy.advice.subtitle} centered />

        <LayoutGroup>
          <div className="mx-auto mb-8 inline-flex rounded-2xl border border-white/10 bg-white/[0.03] p-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-colors duration-200 ${active ? "text-lime" : "text-slate-500 hover:text-slate-300"}`}
                >
                  {active && <motion.span layoutId={LAYOUT_IDS.adviceTab} className="absolute inset-0 rounded-xl border border-lime/20 bg-lime/10" transition={LAYOUT_SPRING} />}
                  <Icon className="relative z-10 text-xs" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>

        <div className="glass mx-auto max-w-3xl rounded-3xl border-gold/10 p-7 md:p-12">
          <FaQuoteLeft className="mx-auto mb-6 text-2xl text-gold/50" />
          <AnimatePresence mode="wait">
            {activeTab === "live" ? (
              <motion.div key="live-view" layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4, ease: "easeOut" }}>
                <motion.div layout className="min-h-32">
                  <LayoutGroup>
                    <motion.div layout layoutId={expanded ? LAYOUT_IDS.adviceActive : undefined} transition={LAYOUT_SPRING} {...adviceCardMotion} onClick={() => setExpanded((v) => !v)} className="advice-card-hover cursor-pointer rounded-2xl border border-lime/20 bg-[#0a1628]/80 p-6 text-left md:p-8">
                      <AnimatePresence mode="wait">
                        <motion.p key={index} variants={advicePop} initial="initial" animate="animate" exit="exit" className={`font-display font-bold leading-snug text-white ${isBirthday ? "text-xl md:text-3xl" : "text-xl md:text-2xl"}`}>
                          &ldquo;{advice[index]}&rdquo;
                        </motion.p>
                      </AnimatePresence>
                      <AnimatePresence initial={false}>
                        {expanded && (
                          <motion.div layout key="advice-details" variants={adviceDetailReveal} initial="initial" animate="animate" exit="exit" className="overflow-hidden">
                            <div className="mt-6 border-t border-lime/15 pt-6">
                              <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime">Strategy Breakdown</p>
                              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                {["Strategy", "Signal", "Confidence", "Timeframe"].map((label, i) => {
                                  const values = [meta.strategy, meta.signal, `${meta.confidence}%`, meta.timeframe];
                                  const tones = ["text-white", "text-lime", "text-gold", "text-cyan"];
                                  return (
                                    <div key={label} className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
                                      <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
                                      <p className={`mt-1 font-semibold ${tones[i]}`}>{values[i]}</p>
                                    </div>
                                  );
                                })}
                              </div>
                              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                                Risk level: <span className="text-white">{meta.risk}</span>
                                {isBirthday ? " — Tharun ku mattum custom alpha." : "."} Click again to collapse.
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <motion.div layout className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
                        <span>{expanded ? "Tap to collapse" : "Tap card for full analysis"}</span>
                        <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={LAYOUT_SPRING}><FaChevronDown /></motion.span>
                      </motion.div>
                    </motion.div>
                  </LayoutGroup>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div key="history-view" layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="min-h-32 text-left">
                {history.length === 0 ? (
                  <motion.p layout className="rounded-2xl border border-dashed border-white/10 py-12 text-center text-sm text-slate-500">
                    No strategies logged yet — generate your first insight below.
                  </motion.p>
                ) : (
                  <motion.ul layout className="space-y-3">
                    <AnimatePresence initial={false}>
                      {history.map((item, listIndex) => (
                        <motion.li key={item.id} layout variants={adviceListItem} initial="initial" animate="animate" exit="exit" transition={{ layout: LAYOUT_SPRING, delay: listIndex * 0.04 }} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-[#0a1628]/70 p-4">
                          <span className="shrink-0 rounded-lg bg-lime/10 px-2 py-1 font-mono text-[10px] font-bold text-lime">#{history.length - listIndex}</span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold leading-relaxed text-white md:text-base">&ldquo;{item.text}&rdquo;</p>
                            <p className="mt-1 text-xs text-gold">{item.signal}</p>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </motion.ul>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <PrimaryButton onClick={generate} className="mt-8 px-8 py-4 text-base">
            <FaBolt />
            {copy.advice.button}
          </PrimaryButton>
          <p className="mt-5 text-[10px] uppercase tracking-[0.18em] text-slate-600">{copy.advice.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}