import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaBirthdayCake, FaCheckCircle, FaLock } from "react-icons/fa";
import { modalBackdrop, modalPanel } from "../utils/animations";
import { PrimaryButton } from "./UI";

export const THARUN_DOB = "2005-06-18";

const ACCESS_DENIED = "Access Denied. Only Tharun can enter this portal 😂";

export default function DobModal({ open, onSubmit, dismissible = false }) {
  const [dob, setDob] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setDob("");
      setError("");
      setShake(false);
      setSuccess(false);
    }
  }, [open]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (success) return;

    if (!dob) {
      setError("Please enter your date of birth.");
      return;
    }

    if (dob !== THARUN_DOB) {
      setError(ACCESS_DENIED);
      setShake(true);
      window.setTimeout(() => setShake(false), 450);
      return;
    }

    setError("");
    setSuccess(true);
    window.setTimeout(() => onSubmit(), 650);
  };

  const handleBackdropClick = () => {
    if (dismissible) return;
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] grid place-items-center bg-[#020711]/92 px-5 backdrop-blur-lg"
          variants={modalBackdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleBackdropClick}
        >
          <motion.div
            variants={modalPanel}
            initial="hidden"
            animate={
              success
                ? { opacity: 1, scale: 1.05, y: 0, x: 0 }
                : shake
                  ? { opacity: 1, scale: 1, y: 0, x: [0, -8, 8, -6, 6, 0] }
                  : "visible"
            }
            exit="exit"
            transition={{
              opacity: { duration: 0.35, ease: "easeOut" },
              scale: { duration: 0.45, ease: "easeOut" },
              x: { duration: 0.4, ease: "easeInOut" },
            }}
            onClick={(e) => e.stopPropagation()}
            className={`glass relative w-full max-w-md overflow-hidden rounded-3xl border p-7 md:p-9 ${
              success
                ? "border-lime/40 shadow-glow"
                : error === ACCESS_DENIED
                  ? "border-rose-500/30"
                  : "border-lime/15"
            }`}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime to-transparent" />

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="py-4 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.05 }}
                    className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-lime/15 text-3xl text-lime"
                  >
                    <FaCheckCircle />
                  </motion.div>
                  <h2 className="font-display text-2xl font-bold text-white">Access Granted!</h2>
                  <p className="mt-3 text-sm text-slate-400">Welcome Tharun da — taking you to the Hero Section...</p>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl border border-lime/20 bg-lime/10 text-2xl text-lime">
                    <FaBirthdayCake />
                  </div>

                  <div className="mb-2 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gold">
                    <FaLock className="text-[10px]" />
                    Portal Verification
                  </div>

                  <h2 className="text-center font-display text-2xl font-bold text-white md:text-3xl">
                    Enter your Date of Birth to access the portal
                  </h2>

                  <p className="mt-3 text-center text-sm text-slate-400">
                    Only the birthday boy can enter 😉
                  </p>

                  <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                    <div>
                      <label htmlFor="dob" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                        Date of Birth
                      </label>
                      <input
                        id="dob"
                        type="date"
                        value={dob}
                        autoFocus
                        onChange={(e) => {
                          setDob(e.target.value);
                          setError("");
                        }}
                        className={`w-full rounded-xl border bg-white/[0.04] px-4 py-3.5 text-white outline-none transition-colors duration-200 [color-scheme:dark] focus:ring-1 ${
                          error === ACCESS_DENIED
                            ? "border-rose-500/40 focus:border-rose-500/50 focus:ring-rose-500/20"
                            : "border-white/10 focus:border-lime/40 focus:ring-lime/30"
                        }`}
                      />
                      <p className="mt-2 text-center text-[11px] text-slate-600">
                        Format: 18-Jun-2005 (18-06-2005)
                      </p>

                      <AnimatePresence mode="wait">
                        {error && (
                          <motion.p
                            key={error}
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className={`mt-3 text-center text-sm font-semibold leading-relaxed ${
                              error === ACCESS_DENIED ? "text-rose-400" : "text-slate-400"
                            }`}
                          >
                            {error}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <PrimaryButton type="submit" className="w-full py-4 text-base">
                      Verify & Enter
                    </PrimaryButton>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}