import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSiteMode } from "../hooks/useSiteMode";
import TradexLogo from "./TradexLogo";

const CANDLES = [
  { x: 24, h: 42, y: 58, bull: true },
  { x: 48, h: 28, y: 72, bull: false },
  { x: 72, h: 50, y: 50, bull: true },
  { x: 96, h: 35, y: 65, bull: true },
  { x: 120, h: 22, y: 78, bull: false },
  { x: 144, h: 55, y: 45, bull: true },
  { x: 168, h: 38, y: 62, bull: true },
  { x: 192, h: 30, y: 70, bull: false },
  { x: 216, h: 48, y: 52, bull: true },
  { x: 240, h: 60, y: 40, bull: true },
  { x: 264, h: 45, y: 55, bull: true },
  { x: 288, h: 68, y: 32, bull: true },
];

const CHART_LINE = "M8 95 L32 88 L56 82 L80 74 L104 78 L128 62 L152 68 L176 52 L200 58 L224 42 L248 48 L272 28 L296 18";
const LOAD_DURATION = 3200;

export default function LoadingScreen({ onComplete }) {
  const { data } = useSiteMode();
  const { loadingSteps, copy } = data;
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      const next = Math.min(100, (elapsed / LOAD_DURATION) * 100);
      setProgress(next);
      setStepIndex(Math.min(loadingSteps.length - 1, Math.floor((next / 100) * loadingSteps.length)));
      if (elapsed < LOAD_DURATION) requestAnimationFrame(tick);
      else window.setTimeout(onComplete, 400);
    };
    const frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onComplete, loadingSteps.length]);

  return (
    <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.55, ease: "easeOut" }} className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-ink px-5">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-35" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(92,255,141,0.09),transparent_55%)]" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative w-full max-w-lg">
        <div className="mb-8 flex justify-center"><TradexLogo size="xl" /></div>
        <div className="glass overflow-hidden rounded-2xl border-white/10 p-4 md:p-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">TGI / LIVE</p>
              <p className="font-display text-sm font-bold text-white">Tharun Growth Index</p>
            </div>
            <span className="flex items-center gap-1.5 rounded-full border border-lime/20 bg-lime/10 px-2.5 py-1">
              <motion.span className="h-1.5 w-1.5 rounded-full bg-lime" animate={{ opacity: [1, 0.35, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
              <span className="text-[9px] font-bold uppercase tracking-wider text-lime">Live</span>
            </span>
          </div>
          <svg viewBox="0 0 320 110" className="h-auto w-full" aria-hidden="true">
            <defs>
              <linearGradient id="loaderFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5cff8d" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#5cff8d" stopOpacity="0" />
              </linearGradient>
              <filter id="loaderGlow"><feGaussianBlur stdDeviation="2.5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            {[30, 55, 80].map((y) => <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="#b6d1e5" strokeOpacity="0.08" />)}
            {CANDLES.map((candle, index) => {
              const color = candle.bull ? "#5cff8d" : "#f43f5e";
              const bodyTop = candle.y;
              const bodyBottom = candle.y + candle.h;
              return (
                <motion.g key={candle.x} initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }} transition={{ delay: 0.15 + index * 0.08, duration: 0.35, ease: "easeOut" }} style={{ transformOrigin: `${candle.x}px ${bodyBottom}px` }}>
                  <line x1={candle.x} y1={bodyTop - 6} x2={candle.x} y2={bodyBottom + 4} stroke={color} strokeWidth="1.5" />
                  <rect x={candle.x - 5} y={bodyTop} width="10" height={candle.h} rx="1" fill={color} fillOpacity={candle.bull ? 0.85 : 0.7} />
                </motion.g>
              );
            })}
            <motion.path d={`${CHART_LINE} L296 110 L8 110 Z`} fill="url(#loaderFill)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }} />
            <motion.path d={CHART_LINE} fill="none" stroke="#5cff8d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#loaderGlow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4, duration: 1.8, ease: "easeOut" }} />
          </svg>
          <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
            <p className="font-display text-lg font-bold text-lime">{copy.loaderYtd}</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">{copy.loaderYtdLabel}</p>
          </div>
        </div>
        <h1 className="mt-8 text-center font-display text-xl font-bold text-white md:text-2xl">Loading Tharun&apos;s Trading Empire...</h1>
        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/8">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-lime via-cyan to-gold" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-4 min-h-[1.25rem] text-center font-mono text-xs text-slate-500">{loadingSteps[stepIndex]}</p>
        <p className="mt-2 text-center text-[10px] uppercase tracking-[0.2em] text-slate-600">{Math.round(progress)}%</p>
      </motion.div>
    </motion.div>
  );
}