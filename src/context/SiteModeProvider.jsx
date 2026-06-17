import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getSiteData } from "../data/index";
import {
  attemptKonamiKarthiUnlock,
  attemptKonamiUpFiveUnlock,
  claimAccessCode,
  getMainAccessStatus,
  initializeSecrets,
  subscribeUnlockStatus,
} from "../services/unlockService";
import { SITE_MODES } from "../utils/siteMode";
import { fireMassiveConfetti, firePartyModeBurst, fireRocketBurstConfetti } from "../utils/confetti";
import { suspendScreenshotGuard } from "../utils/screenshotGuardControl";
import { SiteModeContext } from "./SiteModeContext";
import { withMergedAccessCodes } from "../services/unlockService";

function normalizeKey(value) {
  return String(value ?? "").trim();
}

const INITIAL_UNLOCK_STATE = {
  mainAccess: { codes: [], history: [] },
  konamiMultiple: { code: "", usedCount: 0, history: [] },
  konamiOneTime: { code: "", used: false, usedAt: null, history: [] },
  loading: true,
  configured: false,
};

const BIRTHDAY_PATH = "/birthday";

export default function SiteModeProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [unlockState, setUnlockState] = useState(INITIAL_UNLOCK_STATE);
  const [birthdaySessionActive, setBirthdaySessionActive] = useState(false);
  const [keyModalOpen, setKeyModalOpen] = useState(false);
  const [accessKeyError, setAccessKeyError] = useState("");
  const [unlocking, setUnlocking] = useState(false);
  const [partyMode, setPartyMode] = useState(false);
  const birthdaySessionRef = useRef(false);

  useEffect(() => {
    let unsubscribe = () => {};

    const bootUnlockService = async () => {
      await initializeSecrets();
      unsubscribe = subscribeUnlockStatus(setUnlockState);
    };

    bootUnlockService();

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    birthdaySessionRef.current = birthdaySessionActive;
  }, [birthdaySessionActive]);

  useEffect(() => {
    if (!birthdaySessionActive) {
      setPartyMode(false);
    }
  }, [birthdaySessionActive]);

  const togglePartyMode = useCallback(() => {
    setPartyMode((prev) => !prev);
  }, []);

  useEffect(() => {
    if (location.pathname === BIRTHDAY_PATH && !birthdaySessionRef.current) {
      navigate("/", { replace: true });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    const onHashChange = () => suspendScreenshotGuard(1200);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const mode = birthdaySessionActive ? SITE_MODES.BIRTHDAY : SITE_MODES.TRADE;

  const mainAccessStatus = useMemo(
    () => getMainAccessStatus(unlockState.mainAccess),
    [unlockState.mainAccess],
  );

  const canOpenAccessModal = unlockState.configured && !unlockState.loading;
  const canNavbarOpenAccessModal =
    canOpenAccessModal && mainAccessStatus.hasCode && !mainAccessStatus.anyUsed;

  const canUseKonamiKarthi = unlockState.configured && !unlockState.loading;

  const canUseKonamiUpFive =
    unlockState.configured && !unlockState.loading && !unlockState.konamiOneTime.used;

  const activateBirthdaySession = useCallback(
    (options = {}) => {
      const { unlockPatch, ...patch } = options;

      suspendScreenshotGuard(5000);
      setKeyModalOpen(false);
      setAccessKeyError("");
      birthdaySessionRef.current = true;
      setBirthdaySessionActive(true);
      setPartyMode(true);
      setUnlockState((prev) => ({
        ...prev,
        ...patch,
        ...(unlockPatch ? unlockPatch(prev) : {}),
      }));
      navigate({ pathname: BIRTHDAY_PATH, hash: "" });
      window.scrollTo({ top: 0, behavior: "auto" });
      fireMassiveConfetti();
      firePartyModeBurst();
      window.setTimeout(() => fireRocketBurstConfetti(), 500);
    },
    [navigate],
  );

  const submitUnlockKey = useCallback(
    async (enteredKey) => {
      setUnlocking(true);
      setAccessKeyError("");
      const result = await claimAccessCode(enteredKey);
      setUnlocking(false);

      if (result.ok && result.session) {
        const claimedCode = normalizeKey(result.claimedCode ?? enteredKey);
        activateBirthdaySession({
          unlockPatch: (prev) => {
            const merged = withMergedAccessCodes(prev.mainAccess);
            return {
              mainAccess: {
                ...merged,
                codes: merged.codes.map((entry) =>
                  entry.code === claimedCode
                    ? { ...entry, used: true, usedAt: Date.now() }
                    : entry,
                ),
              },
            };
          },
        });
      }

      return result;
    },
    [activateBirthdaySession],
  );

  const triggerKonamiKarthi = useCallback(async () => {
    if (!canUseKonamiKarthi) {
      return { ok: false, reason: "disabled", session: false };
    }

    const result = await attemptKonamiKarthiUnlock();

    if (result.ok && result.session) {
      activateBirthdaySession({
        unlockPatch: (prev) => ({
          konamiMultiple: {
            ...prev.konamiMultiple,
            usedCount: result.useCount,
          },
        }),
      });
    }

    return result;
  }, [canUseKonamiKarthi, activateBirthdaySession]);

  const triggerKonamiUpFive = useCallback(async () => {
    if (!canUseKonamiUpFive) {
      return { ok: false, reason: "disabled", session: false };
    }

    const result = await attemptKonamiUpFiveUnlock();

    if (result.ok && result.session) {
      activateBirthdaySession({
        unlockPatch: (prev) => ({
          konamiOneTime: {
            ...prev.konamiOneTime,
            used: true,
            usedAt: Date.now(),
          },
        }),
      });
    }

    return result;
  }, [canUseKonamiUpFive, activateBirthdaySession]);

  const openFooterAccessKeyModal = useCallback(() => {
    if (!canOpenAccessModal) return;
    setAccessKeyError("");
    setKeyModalOpen(true);
  }, [canOpenAccessModal]);

  const closeAccessKeyModal = useCallback(() => {
    setKeyModalOpen(false);
    setAccessKeyError("");
  }, []);

  const value = useMemo(
    () => ({
      mode,
      isBirthday: mode === SITE_MODES.BIRTHDAY,
      isTrade: mode === SITE_MODES.TRADE,
      data: getSiteData(mode),
      unlockState,
      mainAccessStatus,
      birthdaySessionActive,
      partyMode,
      togglePartyMode,
      canOpenAccessModal,
      canNavbarOpenAccessModal,
      openFooterAccessKeyModal,
      canUseKonamiKarthi,
      canUseKonamiUpFive,
      keyModalOpen,
      setKeyModalOpen,
      closeAccessKeyModal,
      submitUnlockKey,
      triggerKonamiKarthi,
      triggerKonamiUpFive,
      unlocking,
      accessKeyError,
    }),
    [
      mode,
      unlockState,
      mainAccessStatus,
      birthdaySessionActive,
      partyMode,
      togglePartyMode,
      canOpenAccessModal,
      canNavbarOpenAccessModal,
      openFooterAccessKeyModal,
      canUseKonamiKarthi,
      canUseKonamiUpFive,
      keyModalOpen,
      closeAccessKeyModal,
      submitUnlockKey,
      triggerKonamiKarthi,
      triggerKonamiUpFive,
      unlocking,
      accessKeyError,
    ],
  );

  return <SiteModeContext.Provider value={value}>{children}</SiteModeContext.Provider>;
}