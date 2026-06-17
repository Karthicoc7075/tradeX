import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSiteMode } from "../hooks/useSiteMode";

const toneStyles = {
  lime: "border-lime/25 bg-lime/[0.06]",
  gold: "border-gold/25 bg-gold/[0.06]",
  cyan: "border-cyan/25 bg-cyan/[0.06]",
};

export default function TradingToasts() {
  const { data } = useSiteMode();
  const { tradingToasts } = data;
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = window.setTimeout(() => setVisible(true), 4000);
    const cycle = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % tradingToasts.length);
        setVisible(true);
      }, 400);
    }, 14000);

    return () => {
      window.clearTimeout(showTimer);
      window.clearInterval(cycle);
    };
  }, [tradingToasts.length]);

  useEffect(() => {
    if (!visible) return undefined;
    const hide = window.setTimeout(() => setVisible(false), 5000);
    return () => window.clearTimeout(hide);
  }, [visible, index]);

  const toast = tradingToasts[index];
  const tone = toneStyles[toast.tone] ?? toneStyles.lime;

  return (
    <div className="pointer-events-none fixed bottom-24 left-5 z-[70] max-w-xs md:bottom-6 md:left-6">
      <AnimatePresence>
        {visible && (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -16, scale: 0.96 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className={`glass rounded-xl border px-4 py-3 shadow-lg ${tone}`}
          >
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
              {toast.tag}
            </p>
            <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-200">
              {toast.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}