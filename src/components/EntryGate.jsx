import { motion } from "framer-motion";
import { LAYOUT_IDS, LAYOUT_SPRING } from "../utils/animations";
import { Balloons, FloatingParticles, MarketBackground } from "./BackgroundEffects";

const ticker = [
  ["TGI", "+100%"],
  ["ACCESS", "RESTRICTED"],
  ["THARUN", "BULLISH"],
  ["CAKE", "+1000%"],
];

export default function EntryGate({ onEnter, portalActive = false }) {
  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.55 }}
      className="fixed inset-0 z-[100] flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink"
    >
      <MarketBackground />
      <FloatingParticles />
      <Balloons opacity={0.28} />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-5 text-center md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75 }}
        >
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lime-gradient font-display text-5xl font-bold tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-8xl"
          >
            TRADEX
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.6 }}
            className="mt-4 font-display text-3xl font-bold leading-tight tracking-[-0.02em] text-white sm:text-4xl md:text-5xl lg:text-6xl"
          >
            Birthday Edition for{" "}
            <span className="gold-gradient">Tharun</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 }}
            className="mx-auto mt-7 max-w-xl text-base leading-7 text-slate-400 md:text-lg"
          >
            A premium trading experience created specially for the legend.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.52 }}
            className="mt-12 md:mt-14"
          >
            <motion.button
              onClick={onEnter}
              layoutId={portalActive ? undefined : LAYOUT_IDS.entryPortal}
              layout
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.97 }}
              animate={{
                boxShadow: [
                  "0 0 28px rgba(92,255,141,0.4), 0 0 56px rgba(92,255,141,0.18), inset 0 1px 0 rgba(255,255,255,0.2)",
                  "0 0 48px rgba(92,255,141,0.65), 0 0 90px rgba(92,255,141,0.28), inset 0 1px 0 rgba(255,255,255,0.25)",
                  "0 0 28px rgba(92,255,141,0.4), 0 0 56px rgba(92,255,141,0.18), inset 0 1px 0 rgba(255,255,255,0.2)",
                ],
              }}
              transition={{
                layout: LAYOUT_SPRING,
                boxShadow: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
              }}
              className="rounded-2xl bg-lime px-14 py-5 font-display text-base font-extrabold tracking-wide text-[#04130a] md:px-16 md:py-6 md:text-lg"
            >
              Are you ready to enter?
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 overflow-hidden border-t border-white/5 bg-[#07101e]/90 py-3 backdrop-blur">
        <div className="ticker flex w-max">
          {[...ticker, ...ticker].map(([name, value], index) => (
            <div key={`${name}-${index}`} className="mx-7 flex items-center gap-3 text-xs">
              <span className="font-bold text-slate-300">{name}</span>
              <span className={name === "ACCESS" ? "text-gold" : "text-lime"}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}