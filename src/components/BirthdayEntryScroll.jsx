import { useEffect, useRef } from "react";
import { useSiteMode } from "../hooks/useSiteMode";
import { suspendScreenshotGuard } from "../utils/screenshotGuardControl";

/** On first switch to Birthday mode, land on the Hero section before any other interaction. */
export default function BirthdayEntryScroll() {
  const { isBirthday } = useSiteMode();
  const wasBirthdayRef = useRef(false);

  useEffect(() => {
    if (isBirthday && !wasBirthdayRef.current) {
      suspendScreenshotGuard(6000);

      const scrollToHero = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        document.getElementById("top")?.scrollIntoView({ behavior: "smooth", block: "start" });
      };

      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
        window.setTimeout(scrollToHero, 120);
      });
    }

    wasBirthdayRef.current = isBirthday;
  }, [isBirthday]);

  return null;
}