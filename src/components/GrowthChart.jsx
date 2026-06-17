import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { usePerformanceMode } from "../hooks/usePerformanceMode";
import { useSiteMode } from "../hooks/useSiteMode";
import { buildGrowthChartPaths } from "../utils/chartPath";
import { cardMotion } from "../utils/animations";
import { fireHeroConfettiBomb } from "../utils/confetti";
import { SectionTitle } from "./UI";

const CHART_GREEN = "#5cff8d";
const CHART_PLOT_WIDTH = 600;
const CHART_PAD = 10;
const CHART_VIEWBOX = {
  x: -CHART_PAD,
  y: 0,
  width: CHART_PLOT_WIDTH + CHART_PAD * 2,
  height: 240,
};

function milestoneAnchor(index, total) {
  if (index === 0) return "start";
  if (index === total - 1) return "end";
  return "middle";
}

function useNarrowScreen(maxWidth = 639) {
  const [narrow, setNarrow] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(`(max-width: ${maxWidth}px)`).matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${maxWidth}px)`);
    const onChange = () => setNarrow(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [maxWidth]);

  return narrow;
}

function MobileMilestoneLegend({ milestones, isBirthday }) {
  return (
    <ul className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-800/70 pt-3 sm:hidden">
      {milestones.map((point, index) => {
        const isLast = index === milestones.length - 1;
        return (
          <li
            key={point.label}
            className={`rounded-lg border border-slate-800/75 bg-slate-900/35 px-2.5 py-2 ${
              isLast && milestones.length % 2 !== 0 ? "col-span-2" : ""
            }`}
          >
            <p className={`font-mono text-[10px] font-bold ${isLast && isBirthday ? "text-gold" : "text-lime"}`}>
              {point.label}
            </p>
            <p className="mt-0.5 text-[9px] leading-snug text-slate-500">{point.sub}</p>
          </li>
        );
      })}
    </ul>
  );
}

export default function GrowthChart() {
  const { data, isBirthday } = useSiteMode();
  const { isLite } = usePerformanceMode(isBirthday);
  const { chartMilestones, copy } = data;
  const ref = useRef(null);
  const isNarrow = useNarrowScreen();
  const visible = useInView(ref, { once: true, amount: 0.4 });
  const [celebrated, setCelebrated] = useState(false);
  const { line, fill } = useMemo(() => buildGrowthChartPaths(chartMilestones), [chartMilestones]);

  const startLabel = isBirthday ? "Age 1" : "2019";
  const endLabel = "2026";
  const sectionBorder = isBirthday ? "border-slate-800/60" : "border-white/5";

  useEffect(() => {
    if (isBirthday && visible && !celebrated && !isLite) {
      setCelebrated(true);
      const timer = window.setTimeout(fireHeroConfettiBomb, 1600);
      return () => window.clearTimeout(timer);
    }
  }, [visible, celebrated, isBirthday, isLite]);

  return (
    <section
      id="analytics"
      ref={ref}
      className={`relative border-y ${sectionBorder} bg-[#07101e]/55 py-16 md:py-32`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-8">
        <SectionTitle
          eyebrow={copy.growth.eyebrow}
          title={copy.growth.title}
          copy={copy.growth.subtitle}
          theme={isBirthday ? "birthday" : "default"}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          {...cardMotion}
          className="glass card-hover card-hover-gold overflow-hidden rounded-2xl border-gold/10 p-3 sm:rounded-3xl sm:p-4 md:p-8"
        >
          <div
            className={`mb-4 flex flex-col gap-3 border-b pb-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pb-5 ${
              isBirthday ? "border-slate-800/70" : "border-white/5"
            }`}
          >
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 sm:text-xs">TGI / LIFETIME</p>
              <p className="mt-1 font-display text-base font-bold leading-tight text-white sm:text-2xl">
                {isBirthday ? "All-Time Happiness" : "Cumulative Performance"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <div className="min-w-0">
                <p className="font-display text-xl font-bold text-lime sm:text-2xl">{copy.growth.ytd}</p>
                <p className="text-[9px] uppercase tracking-wider text-slate-500 sm:text-[10px] sm:tracking-widest">
                  {copy.growth.ytdLabel}
                </p>
              </div>
              <span className="shrink-0 rounded-lg bg-lime/10 px-2.5 py-1.5 text-[10px] font-bold text-lime sm:px-3 sm:py-2 sm:text-xs">
                {isNarrow ? "BUY" : "STRONG BUY"}
              </span>
            </div>
          </div>

          <div className="overflow-hidden px-0 pb-1 sm:overflow-visible sm:px-2 sm:pb-2 md:px-3">
            <div className="w-full min-w-0">
              <svg
                viewBox={`${CHART_VIEWBOX.x} ${CHART_VIEWBOX.y} ${CHART_VIEWBOX.width} ${CHART_VIEWBOX.height}`}
                className="block h-[190px] w-full sm:h-[240px] md:h-[300px] lg:h-[340px]"
                preserveAspectRatio="xMidYMid meet"
                overflow="visible"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART_GREEN} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={CHART_GREEN} stopOpacity="0" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {[40, 85, 130, 175].map((y) => (
                  <line key={y} x1="0" y1={y} x2={CHART_PLOT_WIDTH} y2={y} stroke="#b6d1e5" strokeOpacity="0.08" />
                ))}

                <line
                  x1="0"
                  y1="200"
                  x2={CHART_PLOT_WIDTH}
                  y2="200"
                  stroke={CHART_GREEN}
                  strokeOpacity="0.2"
                  strokeWidth="1"
                />

                <motion.path
                  d={fill}
                  fill="url(#growthFill)"
                  initial={{ opacity: 0 }}
                  animate={visible ? { opacity: 1 } : {}}
                  transition={{ delay: 1, duration: 1 }}
                />
                <motion.path
                  d={line}
                  fill="none"
                  stroke={CHART_GREEN}
                  strokeWidth={isNarrow ? 3 : 4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter={isLite || isNarrow ? undefined : "url(#glow)"}
                  initial={isLite ? false : { pathLength: 0 }}
                  animate={visible ? (isLite ? { opacity: 1 } : { pathLength: 1 }) : {}}
                  transition={{ duration: isLite ? 0.4 : 2.8, ease: "easeOut" }}
                />

                {chartMilestones.map((point, index) => {
                  const isFirst = index === 0;
                  const isLast = index === chartMilestones.length - 1;
                  const anchor = milestoneAnchor(index, chartMilestones.length);

                  return (
                    <motion.g
                      key={point.label}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={visible ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.7 + index * 0.25, type: "spring" }}
                    >
                      <line
                        x1={point.x}
                        y1={point.y + 10}
                        x2={point.x}
                        y2="200"
                        stroke={CHART_GREEN}
                        strokeOpacity="0.16"
                        strokeDasharray="3 4"
                      />
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r={isLast ? (isNarrow ? 7 : 9) : isNarrow ? 5.5 : 7}
                        fill="#07101e"
                        stroke={isLast ? "#ffdf6b" : CHART_GREEN}
                        strokeWidth={isLast ? (isNarrow ? 2.5 : 3.5) : isNarrow ? 2 : 3}
                      />
                      {isLast && (
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r={isNarrow ? 10 : 14}
                          fill="#ffdf6b"
                          fillOpacity="0.12"
                        />
                      )}
                      {!isNarrow && (
                        <>
                          <text
                            x={point.x}
                            y="218"
                            textAnchor={anchor}
                            fill={isLast ? "#ffdf6b" : isFirst ? "#5cff8d" : "#94a3b8"}
                            fontSize={isLast ? 11 : 10}
                            fontWeight="700"
                          >
                            {point.label}
                          </text>
                          <text
                            x={point.x}
                            y="232"
                            textAnchor={anchor}
                            fill={isLast ? "#cbd5e1" : "#64748b"}
                            fontSize="8.5"
                          >
                            {point.sub}
                          </text>
                        </>
                      )}
                    </motion.g>
                  );
                })}
              </svg>
            </div>
          </div>

          {isNarrow && <MobileMilestoneLegend milestones={chartMilestones} isBirthday={isBirthday} />}

          <div
            className={`mt-2 flex justify-between border-t pt-3 font-mono text-[9px] uppercase tracking-wider text-slate-600 sm:pt-4 sm:text-[10px] ${
              isBirthday ? "border-slate-800/70" : "border-white/5"
            }`}
          >
            <span className="font-bold text-lime">{startLabel}</span>
            <span className="font-bold text-lime">{endLabel}</span>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className={`mx-auto mt-6 max-w-2xl px-1 text-center leading-relaxed sm:mt-8 ${
            isBirthday
              ? "font-display text-sm font-semibold text-gold sm:text-lg md:text-xl"
              : "text-sm text-slate-500 md:text-base"
          }`}
        >
          {copy.growth.footer}
        </motion.p>
      </div>
    </section>
  );
}