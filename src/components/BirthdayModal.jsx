import { AnimatePresence, motion } from "framer-motion";
import { FaCheck, FaEnvelopeOpen, FaTimes } from "react-icons/fa";
import { useSiteMode } from "../hooks/useSiteMode";
import { LAYOUT_IDS, LAYOUT_SPRING, modalBackdrop } from "../utils/animations";
import { PrimaryButton } from "./UI";

export default function BirthdayModal({ open, onClose, grand = false }) {
  const { data } = useSiteMode();
  const { modal, personalNote } = data.offerBundle;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] grid place-items-center bg-[#020711]/85 px-5 backdrop-blur-lg"
          variants={modalBackdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            layoutId={LAYOUT_IDS.bonusPortal}
            layout
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{
              layout: LAYOUT_SPRING,
              opacity: { duration: 0.35, ease: "easeOut" },
              scale: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
              y: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
            }}
            onClick={(event) => event.stopPropagation()}
            className="glass relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/12 p-7 text-center md:p-10"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime/50 to-transparent" />
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-lime/8 blur-3xl" />

            <button
              onClick={onClose}
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/5 text-slate-400 transition-colors duration-200 hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <FaTimes />
            </button>

            {grand ? (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 }}
                  className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-lime/25 bg-lime/10 text-lime shadow-glow"
                >
                  <FaEnvelopeOpen className="text-2xl" />
                </motion.div>

                <motion.span
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 }}
                  className="inline-flex items-center gap-2 rounded-full border border-lime/25 bg-lime/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-lime"
                >
                  <FaCheck className="text-[9px]" />
                  {modal.eyebrow}
                </motion.span>

                <motion.h2
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16 }}
                  className="mt-4 font-display text-2xl font-bold leading-snug text-white md:text-3xl"
                >
                  <span className="lime-gradient">{modal.title}</span>
                </motion.h2>

                {modal.subtitle && (
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mx-auto mt-3 max-w-sm text-sm text-slate-400"
                  >
                    {modal.subtitle}
                  </motion.p>
                )}

                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.24 }}
                  className="mx-auto mt-4 max-w-sm leading-7 text-slate-300"
                >
                  {modal.body}
                </motion.p>

                {modal.steps?.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.28 }}
                    className="mx-auto mt-6 grid max-w-sm gap-2"
                  >
                    {modal.steps.map((step) => (
                      <div
                        key={step.label}
                        className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-4 py-2.5"
                      >
                        <span className="text-xs text-slate-500">{step.label}</span>
                        <span className="font-mono text-xs font-bold text-lime">{step.value}</span>
                      </div>
                    ))}
                  </motion.div>
                )}

                {modal.highlight && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.34 }}
                    className="mx-auto mt-5 inline-block rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-cyan"
                  >
                    {modal.highlight}
                  </motion.p>
                )}

                {personalNote?.signOff && (
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.38 }}
                    className="mx-auto mt-5 max-w-sm font-hand text-2xl leading-relaxed text-lime/90"
                  >
                    {personalNote.signOff}
                  </motion.p>
                )}


              </>
            ) : (
              <>
                <div className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-lime">Market Alert — Priority</div>
                <h2 className="font-display text-2xl font-bold leading-snug text-white md:text-3xl">🎉 Happy Birthday Tharun!</h2>
                <p className="mx-auto mt-4 max-w-sm leading-7 text-slate-300">
                  May your profits stay green and your vibes stay unlimited da machi.
                </p>
              </>
            )}

            <PrimaryButton onClick={onClose} className="mt-7 w-full">
              {grand ? modal.button : "Enter Trading Floor"}
            </PrimaryButton>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}