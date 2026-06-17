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

export default function GrowthChart() {
  const { data, isBirthday } = useSiteMode();
  const { isLite } = usePerformanceMode(isBirthday);
  const { chartMilestones, copy } = data;
  const ref = useRef(null);
  const visible = useInView(ref, { once: true, amount: 0.4 });
  const [celebrated, setCelebrated] = useState(false);
  const { line, fill } = useMemo(() => buildGrowthChartPaths(chartMilestones), [chartMilestones]);

  const startLabel = isBirthday ? "Age 1" : "2019";
  const endLabel = "2026";

  useEffect(() => {
    if (isBirthday && visible && !celebrated && !isLite) {
      setCelebrated(true);
      const timer = window.setTimeout(fireHeroConfettiBomb, 1600);
      return () => window.clearTimeout(timer);
    }
  }, [visible, celebrated, isBirthday, isLite]);

  return (
    <section id="analytics" ref={ref} className="relative border-y border-white/5 bg-[#07101e]/55 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionTitle eyebrow={copy.growth.eyebrow} title={copy.growth.title} copy={copy.growth.subtitle} />
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          {...cardMotion}
          className="glass card-hover card-hover-gold rounded-3xl border-gold/10 p-4 md:p-8"
        >
          <div className="mb-6 flex flex-col justify-between gap-4 border-b border-white/5 pb-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs text-slate-500">TGI / LIFETIME</p>
              <p className="mt-1 font-display text-2xl font-bold text-white">
                {isBirthday ? "All-Time Happiness" : "Cumulative Performance"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-display text-2xl font-bold text-lime">{copy.growth.ytd}</p>
                <p className="text-[10px] uppercase tracking-widest text-slate-500">{copy.growth.ytdLabel}</p>
              </div>
              <span className="rounded-lg bg-lime/10 px-3 py-2 text-xs font-bold text-lime">STRONG BUY</span>
            </div>
          </div>

          <div className="overflow-visible px-2 pb-2 md:px-3">
            <div className="w-full min-w-0">
              <svg
                viewBox={`${CHART_VIEWBOX.x} ${CHART_VIEWBOX.y} ${CHART_VIEWBOX.width} ${CHART_VIEWBOX.height}`}
                className="block h-[240px] w-full md:h-[300px] lg:h-[340px]"
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

                <line x1="0" y1="200" x2={CHART_PLOT_WIDTH} y2="200" stroke={CHART_GREEN} strokeOpacity="0.2" strokeWidth="1" />

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
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter={isLite ? undefined : "url(#glow)"}
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
                        r={isLast ? 9 : 7}
                        fill="#07101e"
                        stroke={isLast ? "#ffdf6b" : CHART_GREEN}
                        strokeWidth={isLast ? 3.5 : 3}
                      />
                      {isLast && (
                        <circle cx={point.x} cy={point.y} r={14} fill="#ffdf6b" fillOpacity={0.12} />
                      )}
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
                    </motion.g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="mt-2 flex justify-between border-t border-white/5 pt-4 font-mono text-[10px] uppercase tracking-wider text-slate-600">
            <span className="font-bold text-lime">{startLabel}</span>
            <span className="font-bold text-lime">{endLabel}</span>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className={`mx-auto mt-8 max-w-2xl text-center leading-relaxed ${isBirthday ? "font-display text-lg font-semibold text-gold md:text-xl" : "text-sm text-slate-500 md:text-base"}`}
        >
          {copy.growth.footer}
        </motion.p>
      </div>
    </section>
  );
}