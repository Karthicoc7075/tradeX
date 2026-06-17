import { motion } from "framer-motion";

const candles = Array.from({ length: 5 }, (_, index) => ({
  id: index,
  left: `${4 + ((index * 17) % 92)}%`,
  top: `${8 + ((index * 23) % 78)}%`,
  green: index % 3 !== 0,
  height: 22 + (index % 5) * 8,
}));

const particles = Array.from({ length: 6 }, (_, index) => ({
  id: index,
  left: `${(index * 17.3) % 100}%`,
  size: 4 + (index % 3),
  color: ["#5cff8d", "#ffdf6b", "#55d6ff"][index % 3],
  duration: 8 + (index % 4) * 2,
  delay: (index % 6) * 0.8,
}));

export function MarketBackground({ lite = false }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="grid-bg absolute inset-0" />
      {!lite && (
        <>
          <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-blue-500/10 blur-[100px] perf-blur" />
          <div className="absolute -right-24 top-56 h-80 w-80 rounded-full bg-lime/10 blur-[100px] perf-blur" />
        </>
      )}
      {!lite &&
        candles.map((candle) => (
          <div
            key={candle.id}
            className="absolute opacity-15 candle-drift"
            style={{ left: candle.left, top: candle.top, animationDelay: `${candle.id * -0.8}s` }}
          >
            <div
              className={`mx-auto w-px ${candle.green ? "bg-lime" : "bg-rose-500"}`}
              style={{ height: candle.height + 24 }}
            />
            <div
              className={`absolute left-1/2 top-3 w-2.5 -translate-x-1/2 rounded-sm ${
                candle.green ? "bg-lime" : "bg-rose-500"
              }`}
              style={{ height: candle.height }}
            />
          </div>
        ))}
    </div>
  );
}

export function FloatingParticles({ lite = false }) {
  if (lite) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle-rise absolute rounded-sm"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity: 0.45,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

const balloonColors = [
  "bg-gradient-to-br from-lime to-emerald-600",
  "bg-gradient-to-br from-cyan to-blue-600",
  "bg-gradient-to-br from-gold to-amber-600",
  "bg-gradient-to-br from-rose-400 to-purple-600",
];

export function Balloons({ dense = false, opacity = 0.5, motionFloat = false, lite = false }) {
  const items = lite ? 4 : dense ? 8 : 6;
  const useMotion = motionFloat && !lite;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true" style={{ opacity }}>
      {Array.from({ length: items }, (_, index) => {
        const balloon = (
          <>
            <div className={`h-12 w-9 rounded-[50%_50%_46%_46%] md:h-14 md:w-11 ${balloonColors[index % 4]}`} />
            <div className="mx-auto h-12 w-px bg-white/25 md:h-16" />
          </>
        );

        const style = {
          left: `${4 + ((index * 19) % 90)}%`,
          top: `${10 + ((index * 29) % 70)}%`,
        };

        if (useMotion) {
          return (
            <motion.div
              key={index}
              className="absolute"
              style={style}
              animate={{ y: [0, -18, 0], x: [0, index % 2 === 0 ? 10 : -10, 0] }}
              transition={{
                duration: 7 + (index % 3),
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.2,
              }}
            >
              <div className="balloon-static">{balloon}</div>
            </motion.div>
          );
        }

        return (
          <div key={index} className="balloon absolute" style={{ ...style, animationDelay: `${index * -1.3}s` }}>
            {balloon}
          </div>
        );
      })}
    </div>
  );
}

export function Fireworks({ count = 5 }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className="firework absolute"
          style={{
            left: `${12 + ((index * 17) % 76)}%`,
            top: `${15 + ((index * 23) % 55)}%`,
            animationDelay: `${index * 0.45}s`,
          }}
        />
      ))}
    </div>
  );
}

const HERO_CANDLE_GREEN = "#5cff8d";
const HERO_CANDLE_RED = "#f43f5e";

function buildMixedCandles(count, seed = 0, startLevel = 36) {
  const redPattern = [0, 2, 5, 7, 10, 13, 16, 18, 21, 24, 27, 30];
  const items = [];
  let level = startLevel;

  for (let i = 0; i < count; i += 1) {
    const open = level;
    const forceRed = redPattern.includes((i + seed) % 11) || (i + seed) % 4 === 0;
    const delta = forceRed ? -(2 + ((i + seed) % 5)) : 2 + ((i + seed * 3) % 6);
    const close = open + delta;
    const high = Math.max(open, close) + 3 + ((i + seed) % 4);
    const low = Math.min(open, close) - 2 - ((i + seed) % 3);
    items.push({ id: `${seed}-${i}`, open, close, high, low });
    level = close + ((i + seed) % 3 === 0 ? -1 : 1);
  }

  return items;
}

const HERO_BG_CANDLES = buildMixedCandles(52, 1, 34);

const HERO_CANDLE_CLUSTERS = [
  { id: "tl", left: "3%", top: "10%", scale: 0.72, seed: 2, count: 8, drift: "-1.6s" },
  { id: "tr", left: "78%", top: "7%", scale: 0.8, seed: 5, count: 7, drift: "-3.1s" },
  { id: "ml", left: "8%", top: "34%", scale: 0.65, seed: 8, count: 6, drift: "-0.8s" },
  { id: "mc", left: "44%", top: "22%", scale: 0.7, seed: 11, count: 9, drift: "-2.4s" },
  { id: "mr", left: "70%", top: "30%", scale: 0.68, seed: 14, count: 7, drift: "-4.2s" },
  { id: "br", left: "84%", top: "48%", scale: 0.75, seed: 17, count: 8, drift: "-1.2s" },
  { id: "bl", left: "14%", top: "52%", scale: 0.7, seed: 20, count: 7, drift: "-3.8s" },
  { id: "bc", left: "52%", top: "44%", scale: 0.62, seed: 23, count: 6, drift: "-2.9s" },
];

function candleY(val, min, max, height, pad = 14) {
  const range = max - min || 1;
  return height - ((val - min) / range) * (height - pad) - pad / 2;
}

function renderCandleGroup(candles, width, height, candleWidth = 9) {
  const prices = candles.flatMap((c) => [c.high, c.low]);
  const min = Math.min(...prices) - 4;
  const max = Math.max(...prices) + 4;
  const step = (width - 16) / candles.length;
  const y = (val) => candleY(val, min, max, height);

  return candles.map((c, i) => {
    const bull = c.close >= c.open;
    const color = bull ? HERO_CANDLE_GREEN : HERO_CANDLE_RED;
    const x = 8 + i * step;
    const bodyTop = y(Math.max(c.open, c.close));
    const bodyBottom = y(Math.min(c.open, c.close));
    const bodyH = Math.max(bodyBottom - bodyTop, 2);
    const cx = x + candleWidth * 0.45;

    return (
      <g key={c.id}>
        <line x1={cx} y1={y(c.high)} x2={cx} y2={y(c.low)} stroke={color} strokeWidth="1.1" strokeOpacity="0.98" />
        <rect x={x} y={bodyTop} width={candleWidth} height={bodyH} fill={color} fillOpacity="0.94" rx="0.5" />
      </g>
    );
  });
}

function renderWideCandleGroup(candles, width, height, candleW) {
  const prices = candles.flatMap((c) => [c.high, c.low]);
  const min = Math.min(...prices) - 6;
  const max = Math.max(...prices) + 6;
  const y = (val) => candleY(val, min, max, height, 24);

  return candles.map((c, i) => {
    const bull = c.close >= c.open;
    const color = bull ? HERO_CANDLE_GREEN : HERO_CANDLE_RED;
    const x = i * candleW + candleW * 0.2;
    const bodyTop = y(Math.max(c.open, c.close));
    const bodyBottom = y(Math.min(c.open, c.close));
    const bodyH = Math.max(bodyBottom - bodyTop, 2);
    const cx = x + candleW * 0.3;

    return (
      <g key={c.id}>
        <line x1={cx} y1={y(c.high)} x2={cx} y2={y(c.low)} stroke={color} strokeWidth="1.2" strokeOpacity="0.95" />
        <rect x={x} y={bodyTop} width={candleW * 0.6} height={bodyH} fill={color} fillOpacity="0.92" rx="0.5" />
      </g>
    );
  });
}

function HeroCandleCluster({ left, top, scale, seed, count, drift }) {
  const candles = buildMixedCandles(count, seed, 28 + (seed % 9));
  const w = 96;
  const h = 56;

  return (
    <div
      className="hero-candle-cluster candle-drift absolute"
      style={{ left, top, animationDelay: drift }}
    >
      <div style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
        <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden="true">
          {renderCandleGroup(candles, w, h, 8)}
        </svg>
      </div>
    </div>
  );
}

export function HeroCandleBackground({ lite = false }) {
  const candles = lite ? HERO_BG_CANDLES.slice(-30) : HERO_BG_CANDLES;
  const w = 1200;
  const h = 280;
  const candleW = w / candles.length;
  const clusters = lite ? HERO_CANDLE_CLUSTERS.slice(0, 5) : HERO_CANDLE_CLUSTERS;

  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden="true">
      {clusters.map((cluster) => (
        <HeroCandleCluster key={cluster.id} {...cluster} />
      ))}

      <div className="absolute inset-x-0 bottom-0 h-[58%] opacity-[0.24] md:h-[62%] md:opacity-[0.3]">
        <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" preserveAspectRatio="none">
          {[0.25, 0.5, 0.75].map((pct) => {
            const lineY = 12 + (h - 24) * pct;
            return (
              <line key={pct} x1="0" y1={lineY} x2={w} y2={lineY} stroke="#b6d1e5" strokeOpacity="0.06" />
            );
          })}
          {renderWideCandleGroup(candles, w, h, candleW)}
        </svg>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#030810] via-[#030810]/42 to-[#030810]/12" />
    </div>
  );
}

const ROCKET_BURSTS = [
  { id: 0, left: "6%", drift: "14px", delay: 0, color: "#ffdf6b", burstTop: "20%", sx: "28px", sy: "-22px" },
  { id: 1, left: "24%", drift: "-10px", delay: 1.1, color: "#5cff8d", burstTop: "16%", sx: "-24px", sy: "-16px" },
  { id: 2, left: "48%", drift: "6px", delay: 2.2, color: "#55d6ff", burstTop: "14%", sx: "18px", sy: "-26px" },
  { id: 3, left: "72%", drift: "-12px", delay: 3.3, color: "#ff5d8f", burstTop: "18%", sx: "-30px", sy: "-20px" },
  { id: 4, left: "88%", drift: "8px", delay: 4.4, color: "#ffdf6b", burstTop: "22%", sx: "22px", sy: "-18px" },
];

const ROCKET_BURSTS_LITE = ROCKET_BURSTS.slice(0, 3);

const FOOTER_CONFETTI = [
  { id: 0, left: "8%", color: "#5cff8d", width: 6, height: 14, delay: 0, duration: 9 },
  { id: 1, left: "22%", color: "#ffdf6b", width: 5, height: 12, delay: 1.4, duration: 11 },
  { id: 2, left: "38%", color: "#55d6ff", width: 7, height: 16, delay: 2.8, duration: 10 },
  { id: 3, left: "54%", color: "#ff5d8f", width: 5, height: 13, delay: 0.6, duration: 12 },
  { id: 4, left: "68%", color: "#ffdf6b", width: 6, height: 15, delay: 3.2, duration: 9.5 },
  { id: 5, left: "82%", color: "#5cff8d", width: 5, height: 11, delay: 1.8, duration: 10.5 },
  { id: 6, left: "92%", color: "#55d6ff", width: 6, height: 14, delay: 4.1, duration: 11.5 },
];

const FOOTER_SPARKLES = [
  { id: 0, left: "12%", top: "18%", delay: 0, size: 3 },
  { id: 1, left: "28%", top: "42%", delay: 0.8, size: 4 },
  { id: 2, left: "45%", top: "24%", delay: 1.6, size: 3 },
  { id: 3, left: "61%", top: "52%", delay: 2.4, size: 5 },
  { id: 4, left: "74%", top: "30%", delay: 3.2, size: 3 },
  { id: 5, left: "88%", top: "46%", delay: 4, size: 4 },
];

const FOOTER_FLOATERS = ["🎂", "🎉", "✨", "🎈"];

export function FooterCelebrationBackground({ intense = false }) {
  const confettiCount = intense ? FOOTER_CONFETTI.length : 5;
  const sparkleCount = intense ? FOOTER_SPARKLES.length : 4;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="footer-aurora absolute inset-x-0 bottom-0 h-2/3" />
      <div className="footer-aurora footer-aurora-alt absolute inset-x-0 bottom-0 h-1/2" />

      {FOOTER_CONFETTI.slice(0, confettiCount).map((piece) => (
        <span
          key={piece.id}
          className="footer-confetti absolute rounded-sm"
          style={{
            left: piece.left,
            width: piece.width,
            height: piece.height,
            backgroundColor: piece.color,
            animationDuration: `${piece.duration}s`,
            animationDelay: `${piece.delay}s`,
          }}
        />
      ))}

      {FOOTER_SPARKLES.slice(0, sparkleCount).map((sparkle) => (
        <span
          key={sparkle.id}
          className="footer-sparkle absolute rounded-full bg-white"
          style={{
            left: sparkle.left,
            top: sparkle.top,
            width: sparkle.size,
            height: sparkle.size,
            animationDelay: `${sparkle.delay}s`,
          }}
        />
      ))}

      {FOOTER_FLOATERS.map((emoji, index) => (
        <span
          key={emoji}
          className="footer-float-emoji absolute text-lg opacity-40 md:text-xl"
          style={{
            left: `${10 + index * 22}%`,
            top: `${20 + (index % 2) * 28}%`,
            animationDelay: `${index * 1.1}s`,
          }}
        >
          {emoji}
        </span>
      ))}

      <Fireworks count={intense ? 10 : 5} />
    </div>
  );
}

export function RocketBurstBackground({ intense = false, lite = false }) {
  const rockets = lite ? ROCKET_BURSTS_LITE : intense ? [...ROCKET_BURSTS, ...ROCKET_BURSTS.map((r) => ({ ...r, id: r.id + 10, delay: r.delay + 0.55, left: `calc(${r.left} + 4%)` }))] : ROCKET_BURSTS;

  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(255,140,60,0.08),transparent_55%)]" />
      {rockets.map((rocket) => (
        <div
          key={rocket.id}
          className="rocket-burst-unit"
          style={{
            left: rocket.left,
            ["--drift"]: rocket.drift,
            ["--rocket-color"]: rocket.color,
            ["--burst-color"]: rocket.color,
            animationDelay: `${rocket.delay}s`,
          }}
        >
          <div
            className="rocket-ship"
            style={{
              ["--drift"]: rocket.drift,
              ["--rocket-color"]: rocket.color,
              animationDelay: `${rocket.delay}s`,
            }}
          />
          <div
            className="rocket-trail"
            style={{
              ["--rocket-color"]: rocket.color,
              animationDelay: `${rocket.delay}s`,
            }}
          />
          <div
            className="rocket-explosion"
            style={{
              top: rocket.burstTop,
              ["--burst-color"]: rocket.color,
              animationDelay: `${rocket.delay}s`,
            }}
          />
          <span
            className="rocket-spark"
            style={{
              top: rocket.burstTop,
              left: "50%",
              ["--burst-color"]: rocket.color,
              ["--sx"]: rocket.sx,
              ["--sy"]: rocket.sy,
              animationDelay: `${rocket.delay}s`,
            }}
          />
          <span
            className="rocket-spark"
            style={{
              top: rocket.burstTop,
              left: "50%",
              ["--burst-color"]: "#ffffff",
              ["--sx"]: `calc(${rocket.sx} * -0.6)`,
              ["--sy"]: `calc(${rocket.sy} * 0.8)`,
              animationDelay: `${rocket.delay + 0.05}s`,
            }}
          />
        </div>
      ))}
      <Fireworks count={intense ? 10 : lite ? 4 : 7} />
    </div>
  );
}