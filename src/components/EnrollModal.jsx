import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FaGraduationCap, FaTimes, FaWhatsapp } from "react-icons/fa";
import { modalBackdrop } from "../utils/animations";
import { buildEnrollmentWhatsAppUrl } from "../utils/whatsapp";

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

export default function EnrollModal({ open, onClose }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const reset = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setSubmitted(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: "" }));
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = "Full name is required";
    if (!form.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address";
    }
    if (!form.phone.trim()) {
      nextErrors.phone = "Phone number is required";
    } else if (!/^[+\d\s()-]{8,}$/.test(form.phone.trim())) {
      nextErrors.phone = "Enter a valid phone number";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    const url = buildEnrollmentWhatsAppUrl({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      message: form.message,
    });

    window.open(url, "_blank", "noopener,noreferrer");
    setSubmitted(true);
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
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
            className="glass w-full max-w-md rounded-2xl border border-white/12 p-5 shadow-2xl md:p-6"
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-lime/10 text-lime">
                  <FaGraduationCap className="text-sm" />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Course Enrollment</p>
                  <h2 className="font-display text-lg font-bold text-white">Enroll in TradeX</h2>
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

            {submitted ? (
              <div className="text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#25D366]/15 text-[#25D366]">
                  <FaWhatsapp className="text-2xl" />
                </span>
                <p className="mt-4 font-display text-lg font-bold text-white">Details sent to our team via WhatsApp!</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Complete the message in WhatsApp and hit send. Our team will get back to you shortly.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-6 w-full rounded-xl bg-lime py-3 text-sm font-extrabold text-[#04130a] transition-opacity hover:bg-[#80ffa5]"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="enroll-name" className="mb-1.5 block text-xs font-semibold text-slate-400">
                    Full Name
                  </label>
                  <input
                    id="enroll-name"
                    type="text"
                    value={form.name}
                    onChange={updateField("name")}
                    placeholder="Your full name"
                    autoComplete="name"
                    autoFocus
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-lime/30 focus:ring-1 focus:ring-lime/15"
                  />
                  {errors.name && <p className="mt-1.5 text-xs text-rose-400">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="enroll-email" className="mb-1.5 block text-xs font-semibold text-slate-400">
                    Email
                  </label>
                  <input
                    id="enroll-email"
                    type="email"
                    value={form.email}
                    onChange={updateField("email")}
                    placeholder="you@email.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-lime/30 focus:ring-1 focus:ring-lime/15"
                  />
                  {errors.email && <p className="mt-1.5 text-xs text-rose-400">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="enroll-phone" className="mb-1.5 block text-xs font-semibold text-slate-400">
                    Phone Number
                  </label>
                  <input
                    id="enroll-phone"
                    type="tel"
                    value={form.phone}
                    onChange={updateField("phone")}
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-lime/30 focus:ring-1 focus:ring-lime/15"
                  />
                  {errors.phone && <p className="mt-1.5 text-xs text-rose-400">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="enroll-message" className="mb-1.5 block text-xs font-semibold text-slate-400">
                    Message <span className="font-normal text-slate-600">(optional)</span>
                  </label>
                  <textarea
                    id="enroll-message"
                    value={form.message}
                    onChange={updateField("message")}
                    placeholder="Any questions or notes..."
                    rows={3}
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-lime/30 focus:ring-1 focus:ring-lime/15"
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-lime py-3.5 text-sm font-extrabold text-[#04130a] transition-opacity hover:bg-[#80ffa5]"
                >
                  <FaWhatsapp />
                  Send via WhatsApp
                </button>

                <p className="text-center text-[10px] leading-relaxed text-slate-600">
                  Opens WhatsApp with your details pre-filled. Just tap send to complete enrollment.
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}