import { useKonamiUnlock } from "../hooks/useKonamiUnlock";
import { useSiteMode } from "../hooks/useSiteMode";

/** Invisible global listener for backup Konami unlock sequences. */
export default function KonamiListener() {
  const { canUseKonamiKarthi, canUseKonamiUpFive, triggerKonamiKarthi, triggerKonamiUpFive } =
    useSiteMode();

  useKonamiUnlock({
    enabledKarthi: canUseKonamiKarthi,
    enabledUpFive: canUseKonamiUpFive,
    onKarthiMatch: triggerKonamiKarthi,
    onUpFiveMatch: triggerKonamiUpFive,
  });

  return null;
}