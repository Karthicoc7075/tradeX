import { motion } from "framer-motion";

const TONE_COLORS = {
  green: { stroke: "#5cff8d", fill: "#5cff8d", soft: "rgba(92,255,141,0.18)" },
  blue: { stroke: "#55d6ff", fill: "#55d6ff", soft: "rgba(85,214,255,0.18)" },
  red: { stroke: "#f43f5e", fill: "#f43f5e", soft: "rgba(244,63,94,0.18)" },
};

const CHART_HEIGHT = "h-[88px]";

function ChartShell({ children, className = "" }) {
  return (
    <div className={`mt-auto overflow-hidden rounded-xl border border-slate-800/75 bg-black/30 ${className}`}>
      {children}
    </div>
  );
}

function ChartGrid({ width, height }) {
  return [0.33, 0.66].map((pct) => {
    const y = height * pct;
    return (
      <line key={pct} x1="0" y1={y} x2={width} y2={y} stroke="#b6d1e5" strokeOpacity="0.07" />
    );
  });
}

function AreaChart({ tone, seed, animate, staticChart }) {
  const colors = TONE_COLORS[tone] ?? TONE_COLORS.green;
  const w = 280;
  const h = 88;
  const points = Array.from({ length: 14 }, (_, i) => {
    const y = h - (16 + ((i * 11 + seed * 7) % 52));
    return [i * 19 + 6, y];
  });
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]} ${p[1]}`).join(" ");
  const area = `${line} L${points[points.length - 1][0]} ${h} L${points[0][0]} ${h} Z`;

  return (
    <ChartShell className="p-2.5">
      <svg viewBox={`0 0 ${w} ${h}`} className={`${CHART_HEIGHT} w-full`} aria-hidden="true" preserveAspectRatio="none">
        <ChartGrid width={w} height={h} />
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

function StackedBars({ tone, seed, animate, staticChart }) {
  const colors = TONE_COLORS[tone] ?? TONE_COLORS.green;
  const rows = [
    { label: "Core", pct: 92 },
    { label: "Squad", pct: 78 },
    { label: "VIP", pct: 64 },
    { label: "New", pct: 88 },
    { label: "Hold", pct: 71 },
  ].map((row, i) => ({ ...row, pct: Math.max(35, row.pct - ((seed + i) % 12)) }));

  return (
    <ChartShell className="space-y-2.5 p-3">
      {rows.map((row, i) => (
        <div key={row.label} className="flex items-center gap-2">
          <span className="w-9 shrink-0 font-mono text-[8px] font-bold uppercase text-slate-600">{row.label}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
            {staticChart || !animate ? (
              <div className="h-full rounded-full" style={{ width: `${row.pct}%`, background: colors.stroke }} />
            ) : (
              <motion.div
                className="h-full rounded-full"
                style={{ background: colors.stroke }}
                initial={{ width: 0 }}
                whileInView={{ width: `${row.pct}%` }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
              />
            )}
          </div>
          <span className="w-7 shrink-0 text-right font-mono text-[8px] text-slate-500">{row.pct}%</span>
        </div>
      ))}
    </ChartShell>
  );
}

function PulseSpark({ tone, seed, animate, staticChart }) {
  const colors = TONE_COLORS[tone] ?? TONE_COLORS.green;
  const w = 280;
  const h = 88;
  const points = Array.from({ length: 12 }, (_, i) => ({
    x: i * 22 + 8,
    y: h - (18 + ((i * 17 + seed * 5) % 50)),
  }));
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");

  return (
    <ChartShell className="border-dashed border-gold/20 bg-gold/[0.05] p-2.5">
      <svg viewBox={`0 0 ${w} ${h}`} className={`${CHART_HEIGHT} w-full`} aria-hidden="true" preserveAspectRatio="none">
        <ChartGrid width={w} height={h} />
        <path d={line} fill="none" stroke={colors.stroke} strokeWidth="1.5" strokeDasharray="4 5" opacity="0.4" />
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

function RingGauge({ tone, animate, staticChart }) {
  const colors = TONE_COLORS[tone] ?? TONE_COLORS.blue;
  const r = 30;
  const c = 2 * Math.PI * r;
  const dash = c * 0.72;

  return (
    <ChartShell className="flex items-center justify-center gap-4 bg-[#081222]/90 p-3">
      <svg viewBox="0 0 80 80" className="h-[72px] w-[72px] shrink-0" aria-hidden="true">
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" />
        {staticChart || !animate ? (
          <circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="5"
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
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`}
            transform="rotate(-90 40 40)"
            initial={{ strokeDasharray: `0 ${c}` }}
            whileInView={{ strokeDasharray: `${dash} ${c}` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          />
        )}
        <text x="40" y="44" textAnchor="middle" fill={colors.stroke} fontSize="13" fontWeight="700">
          +1
        </text>
      </svg>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Level Up</p>
        <p className="mt-1 font-mono text-xs font-bold text-cyan">XP +365 days</p>
        <p className="mt-1.5 text-[10px] leading-relaxed text-slate-600">Wisdom compounding...</p>
      </div>
    </ChartShell>
  );
}

function MiniCandles({ seed, animate, staticChart }) {
  const green = "#5cff8d";
  const red = "#f43f5e";
  const w = 280;
  const h = 88;
  const candles = Array.from({ length: 12 }, (_, i) => {
    const open = 28 + ((i * 9 + seed) % 22);
    const forceRed = i % 4 === 0;
    const close = open + (forceRed ? -5 - (i % 3) : 6 + (i % 4));
    const high = Math.max(open, close) + 5;
    const low = Math.min(open, close) - 4;
    return { open, close, high, low, x: i * 22 + 10 };
  });

  return (
    <ChartShell className="border-gold/20 bg-[#120d05]/55 p-2.5">
      <svg viewBox={`0 0 ${w} ${h}`} className={`${CHART_HEIGHT} w-full`} aria-hidden="true" preserveAspectRatio="none">
        <ChartGrid width={w} height={h} />
        {candles.map((c, i) => {
          const color = c.close >= c.open ? green : red;
          const bodyTop = h - Math.max(c.open, c.close);
          const bodyH = Math.max(Math.abs(c.close - c.open), 3);
          const body = (
            <g key={i}>
              <line x1={c.x} y1={h - c.high} x2={c.x} y2={h - c.low} stroke={color} strokeWidth="1.2" strokeOpacity="0.9" />
              <rect x={c.x - 5} y={bodyTop} width="10" height={bodyH} fill={color} fillOpacity="0.88" rx="1" />
            </g>
          );

          if (staticChart || !animate) return body;

          return (
            <motion.g
              key={i}
              initial={{ opacity: 0, scaleY: 0 }}
              whileInView={{ opacity: 1, scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03, duration: 0.2 }}
              style={{ transformOrigin: `${c.x}px ${h}px` }}
            >
              <line x1={c.x} y1={h - c.high} x2={c.x} y2={h - c.low} stroke={color} strokeWidth="1.2" strokeOpacity="0.9" />
              <rect x={c.x - 5} y={bodyTop} width="10" height={bodyH} fill={color} fillOpacity="0.88" rx="1" />
            </motion.g>
          );
        })}
      </svg>
    </ChartShell>
  );
}

function WaterfallDecline({ seed }) {
  const blocks = [72, 58, 44, 30, 20].map((h, i) => Math.max(12, h - ((seed + i) % 8)));

  return (
    <ChartShell className="border-rose-500/25 bg-rose-950/25 p-3">
      <div className={`flex ${CHART_HEIGHT} items-end justify-between gap-1.5`}>
        {blocks.map((h, i) => (
          <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-rose-600/85 to-rose-400/55"
              style={{ height: `${h}%` }}
            />
            <span className="font-mono text-[7px] font-bold text-rose-400/80">-{10 + i * 8}%</span>
          </div>
        ))}
      </div>
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
  const toneKey = tone === "red" ? "red" : tone === "blue" ? "blue" : "green";
  const props = { tone: toneKey, seed, animate, staticChart };

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