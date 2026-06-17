import { useEffect, useRef } from "react";

const KONAMI_KARTHI_SEQUENCE = [
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "k",
  "a",
  "r",
  "t",
  "h",
  "i",
];

const KONAMI_UP_FIVE_SEQUENCE = ["ArrowUp", "ArrowUp", "ArrowUp", "ArrowUp", "ArrowUp"];

const RESET_MS = 4000;

function isTypingTarget(target) {
  if (!target) return false;
  const tag = target.tagName?.toLowerCase();
  return tag === "input" || tag === "textarea" || target.isContentEditable;
}

function normalizeEventKey(event) {
  if (event.key.startsWith("Arrow")) return event.key;
  return event.key.length === 1 ? event.key.toLowerCase() : event.key;
}

function createMatcher(sequence) {
  let index = 0;
  let resetTimer = null;

  return function match(key) {
    const expected = sequence[index];
    if (key === expected) {
      index += 1;
      if (resetTimer) window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => {
        index = 0;
      }, RESET_MS);

      if (index === sequence.length) {
        index = 0;
        if (resetTimer) window.clearTimeout(resetTimer);
        return true;
      }
      return false;
    }

    index = key === sequence[0] ? 1 : 0;
    if (resetTimer) window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => {
      index = 0;
    }, RESET_MS);
    return false;
  };
}

export function useKonamiUnlock({ enabledKarthi, enabledUpFive, onKarthiMatch, onUpFiveMatch }) {
  const karthiMatcherRef = useRef(createMatcher(KONAMI_KARTHI_SEQUENCE));
  const upFiveMatcherRef = useRef(createMatcher(KONAMI_UP_FIVE_SEQUENCE));

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isTypingTarget(event.target)) return;

      const key = normalizeEventKey(event);

      if (enabledKarthi && karthiMatcherRef.current(key)) {
        onKarthiMatch?.();
        return;
      }

      if (enabledUpFive && upFiveMatcherRef.current(key)) {
        onUpFiveMatch?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabledKarthi, enabledUpFive, onKarthiMatch, onUpFiveMatch]);
}