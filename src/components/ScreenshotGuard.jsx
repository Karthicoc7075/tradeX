import { motion } from "framer-motion";
import { createPortal } from "react-dom";

export default function ScreenshotGuard({ active }) {
  if (!active) return null;

  return createPortal(
    <motion.div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="screenshot-guard-title"
      aria-describedby="screenshot-guard-desc"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.08, ease: "easeOut" }}
      className="pointer-events-auto fixed inset-0 z-[99999] flex min-h-[100dvh] items-center justify-center bg-black px-6"
      onContextMenu={(event) => event.preventDefault()}
      onMouseDown={(event) => event.preventDefault()}
      onTouchStart={(event) => event.preventDefault()}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.22, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl text-center"
      >
        <h1
          id="screenshot-guard-title"
          className="font-display text-[clamp(1.85rem,5.5vw,3.5rem)] font-bold leading-[1.12] tracking-tight text-white"
        >
          Dei da… screenshot edukkadha da{" "}
          <span className="inline-block" role="img" aria-label="sweat smile">
            😅
          </span>
        </h1>

        <p id="screenshot-guard-desc" className="mt-6 font-display text-xl text-slate-200 sm:text-2xl">
          Idhu full page access disable agirum
        </p>
      </motion.div>
    </motion.div>,
    document.body,
  );
}