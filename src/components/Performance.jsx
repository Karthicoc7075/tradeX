import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import BirthdayMetricChart from "./BirthdayMetricChart";
import { usePerformanceMode } from "../hooks/usePerformanceMode";
import { useSiteMode } from "../hooks/useSiteMode";
import { VIEWPORT } from "../utils/animations";
import AnimatedMetricValue from "./AnimatedMetricValue";
import MiniChart from "./MiniChart";
import { SectionTitle } from "./UI";

const tradeDetail = {
  green: "Metric outperforming benchmark. Trend remains constructive on current timeframe.",
  blue: "Steady growth indicator. Consistent with long-term academy expansion targets.",
  red: "Controlled drawdown within risk parameters. Capital preservation protocols active.",
};

const birthdayDetail = {
  green: "Bullish momentum confirmed. Friends & cake sectors outperforming market average.",
  blue: "Steady growth metric. Hold position — age experience compounding nicely.",
  red: "Minor drawdown detected — cake expenses only. Recovery expected before next treat da.",
};

const birthdayCardStyles = {
  radiant:
    "border-lime/25 bg-gradient-to-br from-lime/[0.09] via-[#07101e]/95 to-cyan/[0.05] shadow-[inset_0_1px_0_rgba(92,255,141,0.14)]",
  terminal: "border-cyan/25 bg-[#06111f]/95",
  inbox: "border-dashed border-gold/35 bg-gradient-to-br from-gold/[0.07] via-[#0c0a04]/80 to-transparent",
  gauge: "border-cyan/25 bg-[#071525]/95 ring-1 ring-cyan/12",
  commodity: "border-gold/30 bg-gradient-to-br from-[#100c04]/90 via-[#0a1628]/85 to-[#07101e]/90",
  alert: "border-rose-500/40 bg-gradient-to-br from-rose-950/40 via-[#120808]/85 to-[#07101e]/90 ring-1 ring-rose-500/18",
};

const toneUi = {
  green: {
    value: "text-lime",
    glow: "bg-lime/10",
    icon: "bg-lime/10 text-lime",
    hover: "card-hover-lime",
    ring: "ring-lime/25",
    signal: "border-lime/25 bg-lime/10 text-lime",
    signalLabel: "STRONG BUY",
  },
  blue: {
    value: "text-cyan",
    glow: "bg-cyan/10",
    icon: "bg-cyan/10 text-cyan",
    hover: "card-hover-lime",
    ring: "ring-cyan/25",
    signal: "border-cyan/25 bg-cyan/10 text-cyan",
    signalLabel: "HOLD",
  },
  red: {
    value: "text-rose-400",
    glow: "bg-rose-500/10",
    icon: "bg-rose-500/10 text-rose-400",
    hover: "card-hover-rose",
    ring: "ring-rose-500/25",
    signal: "border-rose-500/30 bg-rose-500/10 text-rose-400",
    signalLabel: "CAUTION",
  },
};

const cardReveal = {
  hidden: { opacity: 0, y: 12 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.3, ease: "easeOut" },
  }),
};

const cardRevealLite = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { delay: i * 0.02, duration: 0.2 },
  }),
};

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function Performance() {
  const { data, isBirthday } = useSiteMode();
  const { isLite } = usePerformanceMode(isBirthday);
  const { metrics, copy } = data;
  const [expanded, setExpanded] = useState(null);
  const detailCopy = isBirthday ? birthdayDetail : tradeDetail;
  const reveal = isLite ? cardRevealLite : cardReveal;
  const chartAnimate = useMemo(() => !prefersReducedMotion(), []);

  return (
    <section id="performance" className="relative mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
      <SectionTitle
        eyebrow={copy.performance.eyebrow}
        title={copy.performance.title}
        copy={copy.performance.subtitle}
        theme={isBirthday ? "birthday" : "default"}
      />

      {isBirthday && (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-800/80 bg-[#06111f]/70 px-4 py-3">
          <span className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-lime">
            <span className="dashboard-live-dot h-2 w-2 rounded-full bg-lime" />
            Live feed active
          </span>
          <span className="hidden h-4 w-px bg-slate-800/80 sm:block" />
          <span className="font-mono text-[10px] text-slate-500">6 metrics · zero fake data · max sentiment</span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric, index) => {
          const tone = metric.tone === "red" ? "red" : metric.tone === "blue" ? "blue" : "green";
          const ui = toneUi[tone];
          const down = tone === "red";
          const isExpanded = expanded === metric.label;
          const birthdayShell = isBirthday ? birthdayCardStyles[metric.cardStyle] ?? "" : "";
          const valueSize =
            metric.value.length > 12 ? "text-lg md:text-xl" : metric.value.length > 8 ? "text-xl md:text-2xl" : "text-2xl md:text-3xl";

          return (
            <motion.article
              key={metric.label}
              custom={index}
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
              onClick={() => setExpanded(isExpanded ? null : metric.label)}
              className={`card-hover ${ui.hover} relative flex min-h-[300px] cursor-pointer flex-col overflow-hidden rounded-2xl border p-5 transition-shadow md:min-h-[320px] ${
                isBirthday ? birthdayShell : "glass"
              } ${isExpanded ? `sm:col-span-2 ${ui.ring} ring-1` : "border-slate-800/75"}`}
            >
              {!isBirthday && (
                <div className={`pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full blur-2xl ${ui.glow} perf-blur`} />
              )}

              {isBirthday && metric.emoji ? (
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-800/80 bg-slate-900/40 text-xl shadow-inner">
                      {metric.emoji}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-white">{metric.label}</p>
                      <p className="mt-1 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-slate-500">
                        <span className="dashboard-live-dot h-1.5 w-1.5 shrink-0 rounded-full bg-lime/80" />
                        {metric.chartLabel ?? "Live feed"}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <span className={`rounded-md border px-2 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider ${ui.signal}`}>
                      {ui.signalLabel}
                    </span>
                    <span className={`grid h-8 w-8 place-items-center rounded-lg ${ui.icon}`}>
                      {down ? <FaArrowTrendDown className="text-sm" /> : <FaArrowTrendUp className="text-sm" />}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-400">{metric.label}</p>
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${ui.icon}`}>
                    {down ? <FaArrowTrendDown className="text-sm" /> : <FaArrowTrendUp className="text-sm" />}
                  </span>
                </div>
              )}

              <AnimatedMetricValue
                value={metric.value}
                staticValue={isLite}
                className={`mt-4 block break-words font-display font-bold leading-tight ${valueSize} ${ui.value} ${
                  isBirthday && metric.cardStyle === "terminal" ? "font-mono tracking-tight" : ""
                }`}
              />

              <p
                className={`mt-2 line-clamp-3 text-sm leading-relaxed text-slate-400 ${
                  isBirthday ? "italic text-slate-500" : ""
                }`}
              >
                {isBirthday ? `“${metric.comment}”` : metric.comment}
              </p>

              {isBirthday ? (
                <BirthdayMetricChart
                  variant={metric.chartVariant ?? "area"}
                  tone={tone}
                  seed={index}
                  animate={chartAnimate}
                  staticChart={!chartAnimate}
                />
              ) : (
                <div className="mt-auto">
                  <MiniChart
                    tone={tone}
                    seed={index}
                    size="sm"
                    animate={!isLite}
                    staticChart={isLite}
                  />
                </div>
              )}

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    key="metric-detail"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 border-t border-slate-800/70 pt-4">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-lime">Analyst Deep Dive</p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-300">
                        {detailCopy[tone] ?? detailCopy.green}
                      </p>
                      <p className="mt-2 text-xs text-slate-500">Tap card again to collapse</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}