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