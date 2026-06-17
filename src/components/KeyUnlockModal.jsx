import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaKey, FaTimes } from "react-icons/fa";
import { modalBackdrop } from "../utils/animations";

const ERROR_MESSAGES = {
  wrong_key: "Wrong da key 😅",
  key_already_used: "Already used key da. One time only. Need key? Ask your friend.",
  already_used: "This backup unlock was already used globally. Try another key or Konami backup.",
  firebase_not_configured: "Unlock service is not configured yet.",
  missing_keys_config: "Access codes missing. Set VITE_UNLOCK_KEYS in .env and refresh once.",
  transaction_failed: "Unlock failed — check your internet and try again.",
};

function formatError(reason, code, message) {
  const base = ERROR_MESSAGES[reason] ?? "Unable to unlock. Please try again.";
  if (reason === "transaction_failed" && message) {
    return `${base} (${message})`;
  }
  const detail = code === "permission-denied" ? " (Firestore permission denied)" : "";
  return `${base}${detail}`;
}

export default function KeyUnlockModal({
  open,
  onClose,
  onSubmit,
  submitting = false,
  initialError = "",
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && initialError) {
      setError(formatError(initialError));
    }
  }, [open, initialError]);

  const handleClose = () => {
    setValue("");
    setError("");
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const result = await onSubmit(value);
    if (!result?.ok) {
      setError(formatError(result?.reason, result?.code, result?.error));
      return;
    }

    setValue("");
    setError("");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          data-screenshot-safe="true"
          className="fixed inset-0 z-[95] grid place-items-center bg-[#020711]/75 px-5 backdrop-blur-md"
          variants={modalBackdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleClose}
        >
          <motion.form
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
            onSubmit={handleSubmit}
            className="glass w-full max-w-sm rounded-2xl border border-white/12 p-5 shadow-2xl"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold/10 text-gold">
                  <FaKey className="text-sm" />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Private Access</p>
                  <h2 className="font-display text-lg font-bold text-white">Enter Access Code</h2>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <FaTimes className="text-xs" />
              </button>
            </div>

            <input
              type="text"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="Access code"
              autoComplete="off"
              autoFocus
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 font-mono text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-lime/30 focus:ring-1 focus:ring-lime/15"
            />

            {error && <p className="mt-3 text-xs font-medium text-rose-400">{error}</p>}

            <button
              type="submit"
              disabled={submitting || !value.trim()}
              className="mt-4 w-full rounded-xl bg-lime py-3 text-sm font-extrabold text-[#04130a] transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Verifying..." : "Unlock"}
            </button>

            <p className="mt-3 text-center text-[10px] leading-relaxed text-slate-600">
              Each access code works once globally. Stored in Firebase secrets/main_access.
            </p>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}