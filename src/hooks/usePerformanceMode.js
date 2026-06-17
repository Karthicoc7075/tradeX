import { useEffect, useMemo } from "react";

function detectLowEndDevice() {
  if (typeof window === "undefined") return false;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;

  const memory = navigator.deviceMemory;
  if (memory && memory <= 4) return true;

  const cores = navigator.hardwareConcurrency;
  if (cores && cores <= 4) return true;

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 1024;

  return coarse && narrow;
}

/** Lite mode trims animations and heavy effects for smooth scrolling on basic devices. */
export function usePerformanceMode(isBirthday = false) {
  const isLite = useMemo(
    () => isBirthday || detectLowEndDevice(),
    [isBirthday],
  );

  useEffect(() => {
    document.documentElement.classList.toggle("perf-lite", isLite);
    return () => document.documentElement.classList.remove("perf-lite");
  }, [isLite]);

  return { isLite };
}