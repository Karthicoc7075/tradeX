import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaArrowDown, FaBell } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useEnrollModal } from "../hooks/useEnrollModal";
import { useMusic } from "../hooks/useMusic";
import { usePerformanceMode } from "../hooks/usePerformanceMode";
import { useSectionHref } from "../hooks/useSectionHref";
import { useSiteMode } from "../hooks/useSiteMode";
import { suspendScreenshotGuard } from "../utils/screenshotGuardControl";
import { fadeIn, heroStagger, heroWord } from "../utils/animations";
import { firePartyModeBurst, fireRocketBurstConfetti, fireSubtleConfetti } from "../utils/confetti";
import { Balloons, FloatingParticles, HeroCandleBackground, MarketBackground, RocketBurstBackground } from "./BackgroundEffects";
import { PrimaryButton } from "./UI";
import SoundBars from "./SoundBars";

export default function Hero() {
  const { isBirthday, partyMode, togglePartyMode } = useSiteMode();
  const { isLite } = usePerformanceMode(isBirthday);
  const wordVariant = isLite ? fadeIn : heroWord;
  const { openEnrollModal } = useEnrollModal();
  const { play, pause } = useMusic();
  const navigate = useNavigate();
  const performanceHref = useSectionHref("#performance");
  const curriculumHref = useSectionHref("#achievements");
  const trainerHref = useSectionHref("#trainer");
  const offerHref = useSectionHref("#offer");
  const [showAlert, setShowAlert] = useState(false);
  const [confettiFired, setConfettiFired] = useState(false);

  useEffect(() => {
    if (!isBirthday) return;
    const alertTimer = window.setTimeout(() => setShowAlert(true), 2400);
    if (!confettiFired && !isLite) {
      setConfettiFired(true);
      const confettiTimer = window.setTimeout(() => fireRocketBurstConfetti(), 700);
      return () => {
        window.clearTimeout(alertTimer);
        window.clearTimeout(confettiTimer);
      };
    }
    return () => window.clearTimeout(alertTimer);
  }, [isBirthday, confettiFired, isLite]);

  const goToSection = (href) => {
    suspendScreenshotGuard(1200);
    navigate(href);
  };

  const handleEnroll = () => {
    if (isBirthday) {
      fireSubtleConfetti();
      goToSection(offerHref);
      return;
    }
    openEnrollModal();
  };

  const handlePartyMode = async () => {
    if (partyMode) {
      togglePartyMode();
      pause();
      return;
    }
    togglePartyMode();
    firePartyModeBurst();
    fireRocketBurstConfetti();
    await play();
  };

  return (
    <header id="top" className="relative isolate flex min-h-screen items-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <MarketBackground lite={isLite} />
        <FloatingParticles lite={isLite} />
        {isBirthday && (
          <>
            <HeroCandleBackground lite={isLite} />
            <RocketBurstBackground lite={isLite} intense={partyMode} />
            <Balloons
              lite={isLite}
              opacity={partyMode ? 0.6 : 0.38}
              motionFloat={!isLite && partyMode}
            />
          </>
        )}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(92,255,141,0.06),transparent_55%)]" />
        {isBirthday && (
          <motion.div
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: partyMode ? 1 : 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/15 via-transparent to-emerald-900/10" />
          </motion.div>
        )}
      </div>

      <div className="relative z-20 mx-auto w-full max-w-4xl px-5 pb-20 pt-32 text-center md:px-8 md:pb-24 md:pt-40">
        <motion.div initial={isLite ? false : "hidden"} animate={isLite ? undefined : "visible"} variants={isLite ? undefined : heroStagger}>
          {isBirthday && (
            <motion.p
              variants={wordVariant}
              className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.35em] text-gold md:text-xs"
            >
              🎂 Birthday Special Edition
            </motion.p>
          )}

          <motion.h1
            variants={wordVariant}
            className="font-display text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {isBirthday ? (
              <>
                Happy Birthday
                <span className="mt-2 block lime-gradient">THARUN</span>
              </>
            ) : (
              <>
                TRADEX TRADING
                <span className="mt-2 block lime-gradient">ACADEMY</span>
              </>
            )}
          </motion.h1>

          <motion.p
            variants={wordVariant}
            className="mx-auto mt-6 font-display text-xl font-semibold text-slate-200 md:text-2xl"
          >
            {isBirthday ? (
              <>
                Learn Trading From The Legend
                <span className="text-slate-400"> – </span>
                <span className="gold-gradient">THARUN</span>
              </>
            ) : (
              <span className="gold-gradient">Learn Trading in 7 Days</span>
            )}
          </motion.p>

          {isBirthday ? (
            <motion.p
              variants={wordVariant}
              className="mx-auto mt-4 font-display text-base font-medium text-slate-400 md:text-lg"
            >
              Building confidence since birth.
            </motion.p>
          ) : (
            <motion.p
              variants={wordVariant}
              className="mx-auto mt-4 max-w-2xl font-display text-base font-medium text-slate-400 md:text-lg"
            >
              Build real market skills with practical training
            </motion.p>
          )}

          {isBirthday && (
            <motion.p
              variants={wordVariant}
              className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500 md:text-base"
            >
              Plot twist: this whole trading empire is actually a birthday gift. Bullish on cake, friendship, and green candles in life.
            </motion.p>
          )}

          {!isBirthday && (
            <motion.p
              variants={wordVariant}
              className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500 md:text-base"
            >
              India&apos;s premier trading education platform. Institutional-grade curriculum,
              proven mentorship, and measurable results for serious traders.
            </motion.p>
          )}

          <motion.div
            variants={wordVariant}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          >
            <PrimaryButton onClick={handleEnroll} arrow={false} className="w-full sm:w-auto">
              {isBirthday ? "Claim Birthday Bonus" : "Enroll Now"}
            </PrimaryButton>
            {isBirthday && (
              <motion.button
                type="button"
                onClick={handlePartyMode}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full rounded-xl border px-6 py-3.5 text-sm font-bold sm:w-auto ${
                  partyMode
                    ? "party-mode-active border-gold/40 bg-gradient-to-r from-gold/25 to-lime/20 text-gold"
                    : "border-white/15 bg-white/[0.04] text-white hover:border-lime/25"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  {partyMode && <SoundBars className="bg-gold" />}
                  {partyMode ? "Turn Party Mode Off 🎉" : "Turn Party Mode On 🎉"}
                </span>
              </motion.button>
            )}
            <button
              type="button"
              onClick={() => goToSection(isBirthday ? performanceHref : curriculumHref)}
              className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-bold text-slate-200 transition-colors hover:border-lime/25 hover:text-white sm:w-auto"
            >
              {isBirthday ? "View Performance" : "View Curriculum"}
            </button>
          </motion.div>

          {isBirthday && showAlert && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="mx-auto mt-8 inline-flex max-w-md items-start gap-3 rounded-2xl border border-white/10 bg-[#0a1628]/80 px-4 py-3 text-left backdrop-blur-md"
            >
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-lime/10 text-lime">
                <FaBell className="text-xs" />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">System Notification</p>
                <p className="mt-1 text-sm text-slate-300">Market analysis complete. Result: It&apos;s a birthday website.</p>
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-14 inline-flex text-slate-500"
        >
          <Link
            to={isBirthday ? performanceHref : trainerHref}
            onClick={() => suspendScreenshotGuard(1200)}
            className="inline-flex"
            aria-label="Scroll down"
          >
            <FaArrowDown className="animate-bounce" />
          </Link>
        </motion.div>
      </div>
    </header>
  );
}