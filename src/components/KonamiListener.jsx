import { useCallback } from "react";
import { useKonamiUnlock } from "../hooks/useKonamiUnlock";
import { useMusic } from "../hooks/useMusic";
import { useSiteMode } from "../hooks/useSiteMode";

/** Invisible global listener for backup Konami unlock sequences. */
export default function KonamiListener() {
  const { canUseKonamiKarthi, canUseKonamiUpFive, triggerKonamiKarthi, triggerKonamiUpFive } =
    useSiteMode();
  const { startBirthdayPlayback } = useMusic();

  const onKarthiMatch = useCallback(async () => {
    const result = await triggerKonamiKarthi();
    if (result?.ok) await startBirthdayPlayback();
    return result;
  }, [startBirthdayPlayback, triggerKonamiKarthi]);

  const onUpFiveMatch = useCallback(async () => {
    const result = await triggerKonamiUpFive();
    if (result?.ok) await startBirthdayPlayback();
    return result;
  }, [startBirthdayPlayback, triggerKonamiUpFive]);

  useKonamiUnlock({
    enabledKarthi: canUseKonamiKarthi,
    enabledUpFive: canUseKonamiUpFive,
    onKarthiMatch,
    onUpFiveMatch,
  });

  return null;
}