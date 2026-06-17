import { motion } from "framer-motion";
import { FaCheck, FaGift } from "react-icons/fa";
import { FaCakeCandles } from "react-icons/fa6";
import { FaGraduationCap } from "react-icons/fa6";
import { useEnrollModal } from "../hooks/useEnrollModal";
import { useSiteMode } from "../hooks/useSiteMode";
import { cardMotion, LAYOUT_IDS, layoutStaggerCard, sectionReveal, VIEWPORT } from "../utils/animations";
import SecretQr from "./SecretQr";
import { PrimaryButton } from "./UI";

export default function Offer({ onClaim, bonusOpen = false, giftClaimed = false }) {
  const { data, isBirthday } = useSiteMode();
  const { offerBundle } = data;
  const {
    badge,
    eyebrow,
    title,
    subtitle,
    originalPrice,
    price,
    priceTagline,
    stamp,
    personalNote,
    perks,
    cta,
    ctaSub,
    ctaTag,
    finePrint,
    modal,
    valueLabel,
  } = offerBundle;
  const { openEnrollModal } = useEnrollModal();

  const handleAction = () => {
    if (isBirthday) {
      onClaim?.();
    } else {
      openEnrollModal();
    }
  };

  if (!isBirthday) {
    return (
      <section id="offer" className="relative overflow-hidden py-24 md:py-32">
        <div className="pointer-events-none absolute left-1/4 top-1/3 h-72 w-72 rounded-full bg-lime/[0.04] blur-[90px]" />
        <div className="relative mx-auto max-w-3xl px-5 md:px-8">
          <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={VIEWPORT} className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-[#0c1628]/95 via-[#0a1220] to-[#0d1a14]/90 p-6 md:p-10">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-lime/20 bg-lime/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-lime">{badge}</span>
              <p className="mt-4 font-mono text-xs font-bold uppercase tracking-[0.22em] text-gold/80">{eyebrow}</p>
              <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-white md:text-4xl">{title}</h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-400 md:text-base">{subtitle}</p>
            </div>
            <div className="mt-10 rounded-2xl border border-white/8 bg-white/[0.03] p-6 text-center md:p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Program Fee</p>
              <p className="mt-3 font-display text-2xl font-semibold text-slate-500 line-through decoration-rose-400/80 decoration-2">{originalPrice}</p>
              <p className="lime-gradient mt-2 font-display text-5xl font-bold tracking-tight md:text-6xl">{price}</p>
              <p className="mt-3 text-sm font-medium text-slate-300">{priceTagline}</p>
            </div>
            <div className="mt-8 grid gap-3">
              {perks.map((perk, index) => (
                <motion.div key={perk.title} custom={index} variants={layoutStaggerCard} initial="hidden" whileInView="visible" viewport={VIEWPORT} {...cardMotion} className="flex items-start gap-4 rounded-xl border border-white/8 bg-[#07101e]/50 px-4 py-4">
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-lime/10 text-lime"><FaCheck className="text-xs" /></span>
                  <div>
                    <h3 className="font-display text-sm font-bold text-white">{perk.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">{perk.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-10 border-t border-white/8 pt-8 text-center">
              <PrimaryButton onClick={handleAction} arrow={false} className="w-full max-w-md px-8 py-4 text-base">
                <FaGraduationCap />
                {cta}
              </PrimaryButton>
              <p className="mt-3 text-sm text-slate-500">{ctaSub}</p>
              <p className="mx-auto mt-4 max-w-lg text-xs leading-relaxed text-slate-600">{finePrint}</p>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="offer" className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute left-1/4 top-1/3 h-72 w-72 rounded-full bg-gold/[0.04] blur-[90px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-0 h-80 w-80 rounded-full bg-gold/[0.06] blur-[100px]" />
      <div className="relative mx-auto max-w-5xl px-5 md:px-8">
        <motion.div variants={sectionReveal} initial="hidden" whileInView="visible" viewport={VIEWPORT} className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-[#0c1628]/95 via-[#0a1220] to-[#0d1a14]/90 p-6 md:p-10">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          {stamp && (
            <div className="corner-ribbon" aria-hidden>
              <span className="corner-ribbon__strip">{stamp}</span>
            </div>
          )}
          <div className="mb-10 text-center md:mb-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
              <FaCakeCandles className="text-[9px]" />
              {badge}
            </span>
            <p className="mt-4 font-mono text-xs font-bold uppercase tracking-[0.22em] text-gold/80">{eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-white md:text-4xl lg:text-[2.5rem]">{title}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base">{subtitle}</p>
          </div>
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
            {personalNote && (
              <motion.div initial={{ opacity: 0, rotate: -1.5, y: 16 }} whileInView={{ opacity: 1, rotate: -1.2, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.55, ease: "easeOut" }} className="relative">
                <div className="absolute -right-2 -top-3 z-10 rounded-md bg-gold/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#2a1f05] shadow-md">Handwritten</div>
                <div className="relative overflow-hidden rounded-2xl border border-[#d4c4a0]/25 bg-[#f8f1df] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.28)] md:p-8">
                  <div className="pointer-events-none absolute inset-0 opacity-[0.35]" style={{ backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, rgba(180,160,120,0.22) 27px, rgba(180,160,120,0.22) 28px)" }} />
                  <div className="relative">
                    <p className="font-hand text-3xl font-semibold text-[#3d3428] md:text-4xl">{personalNote.greeting}</p>
                    <div className="mt-5 space-y-4">
                      {personalNote.lines.map((line) => (
                        <p key={line} className="font-hand text-xl leading-relaxed text-[#4a4034] md:text-2xl">{line}</p>
                      ))}
                    </div>
                    {personalNote.signOff && (
                      <p className="mt-8 font-hand text-2xl font-semibold text-[#2f4a35] md:text-3xl">{personalNote.signOff}</p>
                    )}
                    {personalNote.postscript && (
                      <p className="mt-4 font-hand text-lg italic text-[#6b5f4f] md:text-xl">{personalNote.postscript}</p>
                    )}
                    {personalNote.qrSecret && (
                      <div className="relative z-10 mt-6 flex flex-col items-center gap-3 rounded-xl border border-dashed border-[#c9b896]/70 bg-[#f3ebda]/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
                        <div className="text-center sm:text-left">
                          <p className="font-hand text-xl font-semibold text-[#3d3428] md:text-2xl">
                            {personalNote.qrSecret.title} 🤫
                          </p>
                        </div>
                        <SecretQr
                          value={personalNote.qrSecret.payload}
                          size={88}
                          theme="letter"
                          label={personalNote.qrSecret.hint}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
            <div className="flex flex-col">
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{valueLabel ?? "Birthday package"}</p>
                <p className="mt-2 font-display text-xl font-semibold text-slate-500 line-through decoration-rose-400/80 decoration-2">{originalPrice}</p>
                <p className="lime-gradient mt-1 font-display text-5xl font-bold tracking-tight">{price}</p>
                <p className="mt-2 text-sm font-medium text-slate-300">{priceTagline}</p>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold/15 text-gold"><FaGift /></span>
                <div>
                  <p className="text-sm font-bold text-white">Birthday bonus perks</p>
                  <p className="text-xs text-slate-500">Gift onnum illa — treat matter da 😂</p>
                </div>
              </div>
              <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {perks.map((perk, index) => (
                  <motion.div key={perk.title} custom={index} variants={layoutStaggerCard} initial="hidden" whileInView="visible" viewport={VIEWPORT} {...cardMotion} className="rounded-xl border border-white/8 bg-[#07101e]/50 px-4 py-3">
                    <div className="flex items-start gap-3">
                      <span className="text-lg">{perk.emoji}</span>
                      <div>
                        <h3 className="font-display text-sm font-bold text-white">{perk.title}</h3>
                        <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{perk.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-10 border-t border-white/8 pt-8 md:mt-12">
            {giftClaimed ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto flex w-full max-w-xl flex-col items-center rounded-2xl border border-lime/25 bg-lime/[0.06] p-5 md:p-6"
              >
                <div className="flex items-center gap-4">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl border border-lime/25 bg-lime/10 text-2xl text-lime">
                    <FaCheck />
                  </span>
                  <div className="text-left">
                    <p className="font-display text-lg font-bold text-white md:text-xl">
                      {modal?.openedCta ?? "Gift opened"}
                    </p>
                    <p className="text-sm text-slate-400">{modal?.openedSub ?? "Already claimed da"}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAction}
                  className="mt-4 text-xs font-bold uppercase tracking-wider text-lime transition-opacity hover:opacity-80"
                >
                  {modal?.reopenLabel ?? "Read message again"}
                </button>
              </motion.div>
            ) : (
              <motion.button
                type="button"
                onClick={handleAction}
                layoutId={bonusOpen ? undefined : LAYOUT_IDS.bonusPortal}
                layout={!bonusOpen}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="btn-bonus-glow group relative mx-auto flex w-full max-w-xl flex-col items-center overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-[#1a2f4a] via-[#12243d] to-[#0f2a1c] p-5 shadow-gold transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(255,223,107,0.15)] md:p-6"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/10 to-gold/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative flex items-center gap-4">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gold/15 text-2xl text-gold transition-transform duration-300 group-hover:scale-110">
                    <FaGift />
                  </span>
                  <div className="text-left">
                    <p className="font-display text-lg font-bold text-white md:text-xl">{cta}</p>
                    <p className="text-sm leading-relaxed text-slate-400">{ctaSub}</p>
                    {ctaTag && (
                      <p className="mt-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-lime/80">
                        {ctaTag}
                      </p>
                    )}
                  </div>
                </div>
              </motion.button>
            )}
            <p className="mx-auto mt-4 max-w-lg text-center text-xs leading-relaxed text-slate-500">{finePrint}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}