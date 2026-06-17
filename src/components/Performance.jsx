import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
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
    "border-lime/25 bg-gradient-to-br from-lime/[0.08] via-transparent to-cyan/[0.04] shadow-[inset_0_1px_0_rgba(92,255,141,0.12)]",
  terminal:
    "rounded-xl border-l-4 border-l-cyan/70 border-white/10 bg-[#06111f]/90 font-mono",
  inbox: "rounded-3xl border border-dashed border-gold/30 bg-gold/[0.04]",
  gauge: "border-cyan/20 bg-[#071525]/90 ring-1 ring-cyan/10",
  commodity: "rounded-xl border border-gold/25 bg-[#100c04]/70",
  alert: "border-rose-500/35 bg-rose-950/25 ring-1 ring-rose-500/15",
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

export default function Performance() {
  const { data, isBirthday } = useSiteMode();
  const { isLite } = usePerformanceMode(isBirthday);
  const { metrics, copy } = data;
  const [expanded, setExpanded] = useState(null);
  const detailCopy = isBirthday ? birthdayDetail : tradeDetail;
  const reveal = isLite ? cardRevealLite : cardReveal;

  return (
    <section id="performance" className="relative mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
      <SectionTitle eyebrow={copy.performance.eyebrow} title={copy.performance.title} copy={copy.performance.subtitle} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric, index) => {
          const down = metric.tone === "red";
          const blue = metric.tone === "blue";
          const isExpanded = expanded === metric.label;
          const valueColor = down ? "text-rose-400" : blue ? "text-cyan" : "text-lime";
          const glowColor = down ? "bg-rose-500/10" : blue ? "bg-cyan/10" : "bg-lime/10";
          const iconBg = down ? "bg-rose-500/10 text-rose-400" : blue ? "bg-cyan/10 text-cyan" : "bg-lime/10 text-lime";
          const hoverClass = down ? "card-hover-rose" : blue ? "card-hover-lime" : "card-hover-lime";
          const birthdayShell = isBirthday ? birthdayCardStyles[metric.cardStyle] ?? "" : "";

          return (
            <motion.article
              key={metric.label}
              custom={index}
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
              onClick={() => setExpanded(isExpanded ? null : metric.label)}
              className={`glass card-hover ${hoverClass} relative cursor-pointer overflow-hidden rounded-2xl p-5 transition-shadow ${birthdayShell} ${
                isExpanded ? "sm:col-span-2 ring-1 ring-lime/20" : ""
              }`}
            >
              <div className={`absolute right-0 top-0 h-20 w-20 rounded-full blur-2xl ${glowColor} perf-blur`} />

              {isBirthday && metric.emoji ? (
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-xl">
                      {metric.emoji}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-300">{metric.label}</p>
                      <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-slate-600">
                        {metric.chartLabel ?? "Live feed"}
                      </p>
                    </div>
                  </div>
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${iconBg}`}>
                    {down ? <FaArrowTrendDown className="text-sm" /> : <FaArrowTrendUp className="text-sm" />}
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-400">{metric.label}</p>
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${iconBg}`}>
                    {down ? <FaArrowTrendDown className="text-sm" /> : <FaArrowTrendUp className="text-sm" />}
                  </span>
                </div>
              )}

              <AnimatedMetricValue
                value={metric.value}
                staticValue={isLite}
                className={`mt-4 block font-display font-bold ${
                  metric.value.length > 14 ? "text-xl" : "text-2xl md:text-3xl"
                } ${valueColor} ${isBirthday && metric.cardStyle === "terminal" ? "font-mono tracking-tight" : ""}`}
              />
              <p className={`mt-2 line-clamp-2 text-sm leading-relaxed text-slate-400 ${isBirthday ? "italic" : ""}`}>
                {isBirthday ? `“${metric.comment}”` : metric.comment}
              </p>

              {isBirthday ? (
                <BirthdayMetricChart
                  variant={metric.chartVariant ?? "area"}
                  tone={metric.tone === "red" ? "red" : metric.tone === "blue" ? "blue" : "green"}
                  seed={index}
                  animate={!isLite}
                  staticChart={isLite}
                />
              ) : (
                <MiniChart
                  tone={metric.tone === "red" ? "red" : metric.tone === "blue" ? "blue" : "green"}
                  seed={index}
                  size="sm"
                  animate={!isLite}
                  staticChart={isLite}
                />
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
                    <div className="mt-4 border-t border-white/8 pt-4">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-lime">Analyst Deep Dive</p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-300">
                        {detailCopy[metric.tone] ?? detailCopy.green}
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