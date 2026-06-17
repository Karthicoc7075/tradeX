import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaPhone, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSectionHref } from "../hooks/useSectionHref";
import { useSiteMode } from "../hooks/useSiteMode";
import { fireMassiveConfetti, firePartyModeBurst } from "../utils/confetti";
import { suspendScreenshotGuard } from "../utils/screenshotGuardControl";
import { buildContactWhatsAppUrl, CONTACT_PHONE_DISPLAY, getContactPhoneHref } from "../utils/whatsapp";
import { Balloons, Fireworks } from "./BackgroundEffects";
import TradexLogo from "./TradexLogo";
import { PrimaryButton } from "./UI";

const FOOTER_LOGO_CLICKS_REQUIRED = 3;
const FOOTER_LOGO_CLICK_WINDOW_MS = 2500;

function FooterLink({ href, label }) {
  const to = useSectionHref(href);

  return (
    <Link
      to={to}
      onClick={() => suspendScreenshotGuard(1200)}
      className="text-sm font-semibold text-slate-400 transition-colors hover:text-white"
    >
      {label}
    </Link>
  );
}

export default function Footer() {
  const { isBirthday, data, canOpenAccessModal, openFooterAccessKeyModal } = useSiteMode();
  const { footerLinks } = data;
  const offerHref = useSectionHref("#offer");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const confettiFired = useRef(false);
  const [burst, setBurst] = useState(false);
  const footerLogoClicksRef = useRef(0);
  const footerClickTimerRef = useRef(null);

  useEffect(() => {
    if (isBirthday && inView && !confettiFired.current) {
      confettiFired.current = true;
      window.setTimeout(() => fireMassiveConfetti(), 600);
    }
  }, [inView, isBirthday]);

  useEffect(() => {
    return () => {
      if (footerClickTimerRef.current) window.clearTimeout(footerClickTimerRef.current);
    };
  }, []);

  const handleFooterLogoClick = () => {
    suspendScreenshotGuard(1000);
    if (!canOpenAccessModal) return;

    footerLogoClicksRef.current += 1;
    if (footerLogoClicksRef.current >= FOOTER_LOGO_CLICKS_REQUIRED) {
      suspendScreenshotGuard(1500);
      openFooterAccessKeyModal();
      footerLogoClicksRef.current = 0;
    }

    if (footerClickTimerRef.current) window.clearTimeout(footerClickTimerRef.current);
    footerClickTimerRef.current = window.setTimeout(() => {
      footerLogoClicksRef.current = 0;
    }, FOOTER_LOGO_CLICK_WINDOW_MS);
  };

  const launchCelebration = () => {
    setBurst(true);
    firePartyModeBurst();
    fireMassiveConfetti();
  };

  if (isBirthday) {
    return (
      <footer ref={ref} id="celebration" className="relative overflow-hidden bg-[#030810] py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(92,255,141,0.12),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
        <Balloons opacity={0.45} motionFloat />
        {burst && <Fireworks count={8} />}

        <div className="relative z-10 mx-auto max-w-5xl px-5 text-center md:px-8">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9, y: 32 }}
            animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 0.85, ease: [0.25, 0.1, 0.25, 1] }}
            className="hero-headline-glow font-display text-5xl font-bold leading-[0.9] tracking-[-0.04em] text-white sm:text-6xl md:text-7xl lg:text-8xl"
          >
            HAPPY BIRTHDAY
            <span className="mt-2 block lime-gradient">THARUN</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.55 }}
            className="mx-auto mt-7 max-w-lg text-base leading-relaxed text-slate-400 md:text-lg"
          >
            This whole trading empire was built just for you. Stay happy, eat cake, and remember someone is always bullish on you.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 }} className="mt-8">
            <PrimaryButton onClick={launchCelebration} arrow={false} className="px-8 py-3.5">
              🎉 More Confetti
            </PrimaryButton>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.65 }} className="mt-10 text-xs text-slate-600">
            © 2026 TRADEX · Made for you by <span className="gold-gradient font-semibold">Legend</span>
          </motion.p>
        </div>
      </footer>
    );
  }

  return (
    <footer data-screenshot-safe="true" className="relative border-t border-white/5 bg-[#030810] py-14 md:py-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <div className="relative z-10 mx-auto max-w-6xl px-5 md:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          <div className="text-center md:text-left">
            <button
              type="button"
              onClick={handleFooterLogoClick}
              className="group rounded-xl text-left transition-opacity hover:opacity-90"
              aria-label="TRADEX"
            >
              <TradexLogo size="md" showTagline />
            </button>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500">
              Institutional-grade trading education. Building confident, disciplined traders since inception.
            </p>
            <div className="mt-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Contact</p>
              <p className="mt-1 font-display text-sm font-bold text-white">Tharun</p>
              <p className="mt-0.5 font-mono text-sm font-semibold text-slate-300">{CONTACT_PHONE_DISPLAY}</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
                <a
                  href={getContactPhoneHref()}
                  onClick={() => suspendScreenshotGuard(1200)}
                  className="inline-flex items-center gap-2 rounded-xl border border-lime/25 bg-lime/10 px-4 py-2.5 text-xs font-bold text-lime transition-colors hover:bg-lime/15"
                >
                  <FaPhone className="text-sm" />
                  Call
                </a>
                <a
                  href={buildContactWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => suspendScreenshotGuard(1200)}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-bold text-slate-200 transition-colors hover:border-lime/25 hover:text-lime"
                >
                  <FaWhatsapp className="text-sm text-[#25D366]" />
                  Message
                </a>
              </div>
            </div>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {footerLinks.map((link) => (
              <FooterLink key={link.href} href={link.href} label={link.label} />
            ))}
          </nav>
        </div>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
          <p className="text-xs text-slate-600">© 2026 TRADEX Trading Academy. All rights reserved.</p>
          <p className="text-xs text-slate-600">
            <Link to={offerHref} onClick={() => suspendScreenshotGuard(1200)} className="text-slate-500 transition-colors hover:text-lime">
              Privacy Policy
            </Link>
            <span className="mx-3 text-slate-700">·</span>
            <Link to={offerHref} onClick={() => suspendScreenshotGuard(1200)} className="text-slate-500 transition-colors hover:text-lime">
              Terms of Service
            </Link>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}