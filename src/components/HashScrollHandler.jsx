import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { suspendScreenshotGuard } from "../utils/screenshotGuardControl";

/** Scrolls to hash targets after route or hash navigation without tripping screenshot guard. */
export default function HashScrollHandler() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    suspendScreenshotGuard(1500);
  }, [pathname]);

  useEffect(() => {
    if (!hash) return undefined;

    suspendScreenshotGuard(1500);
    const targetId = hash.replace("#", "");

    const timer = window.setTimeout(() => {
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (targetId === "top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 80);

    return () => window.clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}