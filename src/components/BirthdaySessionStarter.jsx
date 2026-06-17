import { useEffect, useRef } from "react";
import { useMusic } from "../hooks/useMusic";
import { useSiteMode } from "../hooks/useSiteMode";

/** Starts birthday music immediately when the secret session unlocks. */
export default function BirthdaySessionStarter() {
  const { isBirthday } = useSiteMode();
  const { startBirthdayPlayback } = useMusic();
  const startedRef = useRef(false);

  useEffect(() => {
    if (!isBirthday) {
      startedRef.current = false;
      return;
    }

    if (startedRef.current) return;
    startedRef.current = true;
    startBirthdayPlayback();
  }, [isBirthday, startBirthdayPlayback]);

  return null;
}