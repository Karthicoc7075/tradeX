import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Route, Routes } from "react-router-dom";
import Achievements from "./components/Achievements";
import AdviceGenerator from "./components/AdviceGenerator";
import BackgroundMusic from "./components/BackgroundMusic";
import BirthdayEntryScroll from "./components/BirthdayEntryScroll";
import BirthdayModal from "./components/BirthdayModal";
import Footer from "./components/Footer";
import GrowthChart from "./components/GrowthChart";
import HashScrollHandler from "./components/HashScrollHandler";
import Hero from "./components/Hero";
import MeetTrainer from "./components/MeetTrainer";
import KeyUnlockModal from "./components/KeyUnlockModal";
import KonamiListener from "./components/KonamiListener";
import LoadingScreen from "./components/LoadingScreen";
import MarketNews from "./components/MarketNews";
import Offer from "./components/Offer";
import Performance from "./components/Performance";
import PortfolioHoldings from "./components/PortfolioHoldings";
import QuickStats from "./components/QuickStats";
import RoastSection from "./components/RoastSection";
import ScrollMusicStarter from "./components/ScrollMusicStarter";
import ScrollProgress from "./components/ScrollProgress";

import ScreenshotGuard from "./components/ScreenshotGuard";
import SectionDivider from "./components/SectionDivider";
import SiteHeader from "./components/SiteHeader";
import Testimonials from "./components/Testimonials";
import TradingDesk from "./components/TradingDesk";
import TradingTerminal from "./components/TradingTerminal";
import TradingToasts from "./components/TradingToasts";
import MusicProvider from "./context/MusicProvider";
import { useFavicon } from "./hooks/useFavicon";
import { usePerformanceMode } from "./hooks/usePerformanceMode";
import { useScreenshotGuard } from "./hooks/useScreenshotGuard";
import { useSiteMode } from "./hooks/useSiteMode";
import { useScrollReveal } from "./hooks/useScrollReveal";
import { fireMassiveConfetti } from "./utils/confetti";

function SiteContent() {
  const {
    isBirthday,
    keyModalOpen,
    closeAccessKeyModal,
    submitUnlockKey,
    unlocking,
    canOpenAccessModal,
    accessKeyError,
  } = useSiteMode();
  const { isBlocked: screenshotBlocked } = useScreenshotGuard(isBirthday);
  const { isLite } = usePerformanceMode(isBirthday);
  useFavicon(isBirthday);
  const [bonusOpen, setBonusOpen] = useState(false);
  const [giftClaimed, setGiftClaimed] = useState(false);
  const progress = useScrollReveal();

  const claimBonus = () => {
    setGiftClaimed(true);
    setBonusOpen(true);
    if (isBirthday) fireMassiveConfetti();
  };

  return (
    <motion.div
      key={isBirthday ? "birthday" : "trade"}
      initial={isLite ? false : { opacity: 0, y: 8 }}
      animate={isLite ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="noise relative min-h-screen overflow-x-hidden bg-ink text-slate-100"
    >
      <HashScrollHandler />
      <BirthdayEntryScroll />
      <ScrollProgress progress={progress} />
      {isBirthday && <ScrollMusicStarter />}
      <SiteHeader />
      {isBirthday && <TradingToasts />}
      {isBirthday && <BirthdayModal open={bonusOpen} onClose={() => setBonusOpen(false)} grand />}

      <KonamiListener />

      {canOpenAccessModal && (
        <KeyUnlockModal
          open={keyModalOpen}
          onClose={closeAccessKeyModal}
          onSubmit={submitUnlockKey}
          submitting={unlocking}
          initialError={accessKeyError}
        />
      )}

      <Hero />

      {!isBirthday && <MeetTrainer />}

      {isBirthday && (
        <>
          <MarketNews />
          <SectionDivider variant="gradient" />
          <QuickStats />
        </>
      )}

      <main>
        <Performance />
        <SectionDivider />
        {isBirthday && <TradingDesk />}
        <GrowthChart />
        {isBirthday && <TradingTerminal />}
        <Achievements />
        <SectionDivider />
        <AdviceGenerator />
        {isBirthday && <PortfolioHoldings />}
        {!isBirthday && <Testimonials />}
        {isBirthday && <RoastSection />}
        <SectionDivider variant="gradient" />
        <Offer onClaim={claimBonus} bonusOpen={bonusOpen} giftClaimed={giftClaimed} />
      </main>

      <SectionDivider variant="gradient" />
      <Footer />
      {isBirthday && <BackgroundMusic visible />}
      {isBirthday && <ScreenshotGuard active={screenshotBlocked} />}
    </motion.div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <MusicProvider>
      <AnimatePresence mode="wait">
        {loading && <LoadingScreen key="loading" onComplete={() => setLoading(false)} />}
      </AnimatePresence>
      {!loading && (
        <Routes>
          <Route path="/" element={<SiteContent />} />
          <Route path="/birthday" element={<SiteContent />} />
        </Routes>
      )}
    </MusicProvider>
  );
}