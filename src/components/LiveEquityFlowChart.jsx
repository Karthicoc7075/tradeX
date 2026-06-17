import { motion } from "framer-motion";
import { useMemo } from "react";

const FLOW_GREEN = "#5cff8d";
const FLOW_CYAN = "#55d6ff";

export default function LiveEquityFlowChart({ points = [], direction = "up", className = "" }) {
  const { line, fill, lastY, trendUp } = useMemo(() => {
    if (points.length < 2) {
      return { line: "", fill: "", lastY: 0, trendUp: true };
    }

    const values = points.map((p) => p.value);
    const min = Math.min(...values) - 24;
    const max = Math.max(...values) + 24;
    const range = max - min || 1;

    const w = 480;
    const h = 120;
    const padX = 4;
    const padY = 8;
    const plotW = w - padX * 2;
    const plotH = h - padY * 2;

    const coords = points.map((point, index) => {
      const x = padX + (index / (points.length - 1)) * plotW;
      const y = padY + plotH - ((point.value - min) / range) * plotH;
      return [x, y];
    });

    const pathLine = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c[0]} ${c[1]}`).join(" ");
    const last = coords[coords.length - 1];
    const first = coords[0];
    const pathFill = `${pathLine} L${last[0]} ${h} L${first[0]} ${h} Z`;

    return {
      line: pathLine,
      fill: pathFill,
      lastY: last[1],
      trendUp: values[values.length - 1] >= values[0],
    };
  }, [points]);

  const stroke = trendUp || direction === "up" ? FLOW_GREEN : "#f43f5e";

  if (points.length < 2) {
    return (
      <div className={`flex h-full items-center justify-center font-mono text-[10px] text-slate-600 ${className}`}>
        Warming up live flow…
      </div>
    );
  }

  return (
    <svg viewBox="0 0 480 120" className={`h-full w-full ${className}`} preserveAspectRatio="none" aria-hidden="true">
      {[0.33, 0.66].map((pct) => (
        <line key={pct} x1="0" y1={120 * pct} x2="480" y2={120 * pct} stroke="#b6d1e5" strokeOpacity="0.07" />
      ))}

      <path d={fill} fill={stroke} fillOpacity="0.12" />
      <motion.path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={{ d: line }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      />

      <motion.line
        x1="0"
        y1={lastY}
        x2="480"
        y2={lastY}
        stroke={FLOW_CYAN}
        strokeWidth="1"
        strokeDasharray="5 4"
        animate={{ strokeOpacity: [0.35, 0.9, 0.35] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />

      <circle cx="476" cy={lastY} r="3.5" fill={stroke} />
      <circle cx="476" cy={lastY} r="7" fill={stroke} fillOpacity="0.2" />
    </svg>
  );
}