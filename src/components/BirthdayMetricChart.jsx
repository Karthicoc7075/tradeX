import { motion } from "framer-motion";

const TONE_COLORS = {
  green: { stroke: "#5cff8d", fill: "#5cff8d", soft: "rgba(92,255,141,0.18)" },
  blue: { stroke: "#55d6ff", fill: "#55d6ff", soft: "rgba(85,214,255,0.18)" },
  red: { stroke: "#f43f5e", fill: "#f43f5e", soft: "rgba(244,63,94,0.18)" },
};

function ChartShell({ children, className = "" }) {
  return (
    <div className={`mt-3 overflow-hidden rounded-xl border border-white/5 bg-black/25 ${className}`}>
      {children}
    </div>
  );
}

function AreaChart({ tone, seed, animate, staticChart, heightClass }) {
  const colors = TONE_COLORS[tone] ?? TONE_COLORS.green;
  const w = 160;
  const h = 72;
  const points = Array.from({ length: 12 }, (_, i) => {
    const y = h - (18 + ((i * 11 + seed * 7) % 48));
    return [i * 14 + 4, y];
  });
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]} ${p[1]}`).join(" ");
  const area = `${line} L${points[points.length - 1][0]} ${h} L${points[0][0]} ${h} Z`;

  return (
    <ChartShell className="p-2">
      <svg viewBox={`0 0 ${w} ${h}`} className={`${heightClass} w-full`} aria-hidden="true">
        <path d={area} fill={colors.soft} />
        {staticChart || !animate ? (
          <path d={line} fill="none" stroke={colors.stroke} strokeWidth="2.5" strokeLinecap="round" />
        ) : (
          <motion.path
            d={line}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          />
        )}
      </svg>
    </ChartShell>
  );
}

function StackedBars({ tone, seed, animate, staticChart, heightClass }) {
  const colors = TONE_COLORS[tone] ?? TONE_COLORS.green;
  const rows = [92, 78, 64, 88, 71].map((pct, i) => Math.max(35, pct - ((seed + i) % 12)));

  return (
    <ChartShell className="space-y-2 p-3">
      {rows.map((pct, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-8 font-mono text-[8px] text-slate-600">F{i + 1}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
            {staticChart || !animate ? (
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: colors.stroke }} />
            ) : (
              <motion.div
                className="h-full rounded-full"
                style={{ background: colors.stroke }}
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
              />
            )}
          </div>
        </div>
      ))}
      <svg viewBox="0 0 160 8" className={`${heightClass} w-full opacity-0`} aria-hidden="true" />
    </ChartShell>
  );
}

function PulseSpark({ tone, seed, animate, staticChart, heightClass }) {
  const colors = TONE_COLORS[tone] ?? TONE_COLORS.green;
  const w = 160;
  const h = 72;
  const points = Array.from({ length: 10 }, (_, i) => ({
    x: i * 16 + 6,
    y: h - (20 + ((i * 17 + seed * 5) % 45)),
  }));
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");

  return (
    <ChartShell className="border-dashed border-gold/15 bg-gold/[0.04] p-2">
      <svg viewBox={`0 0 ${w} ${h}`} className={`${heightClass} w-full`} aria-hidden="true">
        <path d={line} fill="none" stroke={colors.stroke} strokeWidth="1.5" strokeDasharray="4 5" opacity="0.45" />
        {points.map((p, i) =>
          staticChart || !animate ? (
            <circle key={i} cx={p.x} cy={p.y} r={i % 2 === 0 ? 3.5 : 2.5} fill={i % 3 === 0 ? "#ffdf6b" : colors.stroke} />
          ) : (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={i % 2 === 0 ? 3.5 : 2.5}
              fill={i % 3 === 0 ? "#ffdf6b" : colors.stroke}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.04 * i, duration: 0.25 }}
            />
          ),
        )}
      </svg>
    </ChartShell>
  );
}

function RingGauge({ tone, animate, staticChart, heightClass }) {
  const colors = TONE_COLORS[tone] ?? TONE_COLORS.blue;
  const r = 28;
  const c = 2 * Math.PI * r;
  const dash = c * 0.72;

  return (
    <ChartShell className="flex items-center justify-center gap-4 bg-[#081222]/80 p-3">
      <svg viewBox="0 0 80 80" className="h-16 w-16 shrink-0" aria-hidden="true">
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        {staticChart || !animate ? (
          <circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`}
            transform="rotate(-90 40 40)"
          />
        ) : (
          <motion.circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`}
            transform="rotate(-90 40 40)"
            initial={{ strokeDasharray: `0 ${c}` }}
            whileInView={{ strokeDasharray: `${dash} ${c}` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          />
        )}
        <text x="40" y="44" textAnchor="middle" fill={colors.stroke} fontSize="14" fontWeight="700">
          +1
        </text>
      </svg>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Level Up</p>
        <p className="mt-1 font-mono text-xs text-cyan">XP +365 days</p>
        <p className="mt-2 text-[10px] text-slate-600">Wisdom compounding...</p>
      </div>
      <svg viewBox="0 0 160 8" className={`${heightClass} hidden w-full`} aria-hidden="true" />
    </ChartShell>
  );
}

function MiniCandles({ tone, seed, heightClass }) {
  const bull = tone !== "red";
  const green = "#5cff8d";
  const red = "#f43f5e";
  const w = 160;
  const h = 72;
  const candles = Array.from({ length: 9 }, (_, i) => {
    const open = 30 + ((i * 9 + seed) % 25);
    const close = open + (bull ? 8 : -6) + ((i % 3) - 1) * 4;
    const high = Math.max(open, close) + 6;
    const low = Math.min(open, close) - 5;
    return { open, close, high, low, x: i * 17 + 8 };
  });

  return (
    <ChartShell className="border-gold/15 bg-[#120d05]/50 p-2">
      <svg viewBox={`0 0 ${w} ${h}`} className={`${heightClass} w-full`} aria-hidden="true">
        {candles.map((c, i) => {
          const color = c.close >= c.open ? green : red;
          const bodyTop = h - Math.max(c.open, c.close);
          const bodyH = Math.max(Math.abs(c.close - c.open), 3);
          return (
            <g key={i}>
              <line x1={c.x} y1={h - c.high} x2={c.x} y2={h - c.low} stroke={color} strokeWidth="1" />
              <rect x={c.x - 4} y={bodyTop} width="8" height={bodyH} fill={color} rx="1" />
            </g>
          );
        })}
      </svg>
    </ChartShell>
  );
}

function WaterfallDecline({ seed, heightClass }) {
  const blocks = [68, 54, 41, 28, 18].map((h, i) => Math.max(10, h - ((seed + i) % 8)));

  return (
    <ChartShell className="border-rose-500/20 bg-rose-950/20 p-3">
      <div className="flex h-[72px] items-end justify-between gap-1.5">
        {blocks.map((h, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-rose-600/80 to-rose-400/50"
              style={{ height: `${h}%` }}
            />
            <span className="font-mono text-[7px] text-rose-400/70">-{12 + i * 7}%</span>
          </div>
        ))}
      </div>
      <svg viewBox="0 0 160 8" className={`${heightClass} hidden w-full`} aria-hidden="true" />
    </ChartShell>
  );
}

export default function BirthdayMetricChart({
  variant = "area",
  tone = "green",
  seed = 0,
  animate = true,
  staticChart = false,
}) {
  const heightClass = "h-[72px] md:h-20";
  const toneKey = tone === "red" ? "red" : tone === "blue" ? "blue" : "green";
  const props = { tone: toneKey, seed, animate, staticChart, heightClass };

  switch (variant) {
    case "stacked":
      return <StackedBars {...props} />;
    case "pulse":
      return <PulseSpark {...props} />;
    case "ring":
      return <RingGauge {...props} />;
    case "candles":
      return <MiniCandles {...props} />;
    case "waterfall":
      return <WaterfallDecline {...props} />;
    case "area":
    default:
      return <AreaChart {...props} />;
  }
}