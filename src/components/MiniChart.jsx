import { motion } from "framer-motion";

export default function MiniChart({ tone = "green", seed = 0, animate = true, size = "sm", staticChart = false }) {
  const up = tone !== "red";
  const stroke = up ? "#5cff8d" : tone === "blue" ? "#55d6ff" : "#f43f5e";
  const isMedium = size === "md";
  const compact = size === "sm";

  const barCount = compact ? 12 : isMedium ? 14 : 16;
  const bars = Array.from({ length: barCount }, (_, i) => {
    const h = 20 + ((i * 13 + seed * 9) % 70);
    return up ? h : Math.max(15, 90 - h);
  });

  const step = compact ? 10 : 11;
  const viewHeight = compact ? 50 : isMedium ? 72 : 90;
  const viewWidth = compact ? 120 : isMedium ? 160 : 180;
  const pathPoints = bars
    .map((h, i) => `${i === 0 ? "M" : "L"}${i * step + 4} ${viewHeight - h * (compact ? 0.6 : 0.68)}`)
    .join(" ");

  const padding = compact ? "p-2" : "p-2.5";
  const heightClass = compact ? "h-12" : isMedium ? "h-[72px] md:h-20" : "h-24";

  const pathEl = (
    <path
      d={pathPoints}
      fill="none"
      stroke={stroke}
      strokeWidth={compact ? 2 : 2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );

  return (
    <div className={`mt-3 overflow-hidden rounded-xl border border-white/5 bg-black/20 ${padding}`}>
      <svg viewBox={`0 0 ${viewWidth} ${viewHeight}`} className={`${heightClass} w-full`} aria-hidden="true">
        {[viewHeight * 0.4, viewHeight * 0.7].map((y) => (
          <line key={y} x1="0" y1={y} x2={viewWidth} y2={y} stroke="#b6d1e5" strokeOpacity="0.06" />
        ))}

        {staticChart || !animate ? (
          pathEl
        ) : (
          <motion.path
            d={pathPoints}
            fill="none"
            stroke={stroke}
            strokeWidth={compact ? 2 : 2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        )}

        {bars.map((h, i) => {
          const barHeight = h * (compact ? 0.35 : 0.42);
          const barY = viewHeight - barHeight;
          const barWidth = compact ? 6 : 7;
          const x = i * step + 1;

          if (staticChart || !animate) {
            return (
              <rect
                key={i}
                x={x}
                y={barY}
                width={barWidth}
                height={barHeight}
                rx="1"
                fill={stroke}
                fillOpacity={0.35}
              />
            );
          }

          return (
            <motion.rect
              key={i}
              x={x}
              y={barY}
              width={barWidth}
              height={barHeight}
              rx="1"
              fill={stroke}
              fillOpacity={0.35}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.02 + i * 0.02, duration: 0.2 }}
              style={{ transformOrigin: `${x + barWidth / 2}px ${viewHeight}px` }}
            />
          );
        })}
      </svg>
    </div>
  );
}