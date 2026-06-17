import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaBars, FaBirthdayCake, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSectionHref } from "../hooks/useSectionHref";
import { useSiteMode } from "../hooks/useSiteMode";
import { suspendScreenshotGuard } from "../utils/screenshotGuardControl";
import TradexLogo from "./TradexLogo";

const LOGO_CLICKS_REQUIRED = 5;
const LOGO_CLICK_WINDOW_MS = 2500;

function NavLink({ href, label, onNavigate, className }) {
  const to = useSectionHref(href);

  return (
    <Link
      to={to}
      onClick={() => {
        suspendScreenshotGuard(1200);
        onNavigate?.();
      }}
      className={
        className ??
        "rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
      }
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const { data, isBirthday, canNavbarOpenAccessModal, setKeyModalOpen } = useSiteMode();
  const { navLinks } = data;
  const homeHref = useSectionHref("#top");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const logoClicksRef = useRef(0);
  const clickTimerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    return () => {
      if (clickTimerRef.current) window.clearTimeout(clickTimerRef.current);
    };
  }, []);

  const handleLogoClick = (e) => {
    e.preventDefault();
    suspendScreenshotGuard(1000);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMenuOpen(false);

    if (!canNavbarOpenAccessModal) return;

    logoClicksRef.current += 1;
    if (logoClicksRef.current >= LOGO_CLICKS_REQUIRED) {
      suspendScreenshotGuard(1500);
      setKeyModalOpen(true);
      logoClicksRef.current = 0;
    }

    if (clickTimerRef.current) window.clearTimeout(clickTimerRef.current);
    clickTimerRef.current = window.setTimeout(() => {
      logoClicksRef.current = 0;
    }, LOGO_CLICK_WINDOW_MS);
  };

  return (
    <nav
      data-screenshot-safe="true"
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? "border-white/10 bg-ink/92 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          : "border-transparent bg-ink/50 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3 md:px-8 md:py-3.5">
        <Link to={homeHref} onClick={handleLogoClick} className="flex shrink-0 items-center">
          <TradexLogo size="md" showTagline />
        </Link>

        <div className="hidden items-center gap-0.5 xl:flex">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span
            className={`hidden items-center gap-1.5 rounded-full border px-3 py-1.5 sm:flex ${
              isBirthday
                ? "border-gold/30 bg-gold/10"
                : "border-lime/20 bg-lime/10"
            }`}
          >
            {isBirthday ? (
              <>
                <FaBirthdayCake className="text-[11px] text-gold" aria-hidden="true" />
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-gold"
                  animate={{ opacity: [1, 0.35, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold">Birthday</span>
              </>
            ) : (
              <>
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-lime"
                  animate={{ opacity: [1, 0.35, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
                <span className="text-[10px] font-bold uppercase tracking-wider text-lime">Markets Open</span>
              </>
            )}
          </span>

          <button
            type="button"
            onClick={() => {
              suspendScreenshotGuard(800);
              setMenuOpen((v) => !v);
            }}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-slate-300 xl:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/8 bg-ink/95 xl:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  onNavigate={() => setMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/5 hover:text-white"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}