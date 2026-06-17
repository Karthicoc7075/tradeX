import { useCallback, useEffect, useRef, useState } from "react";
import {
  isScreenshotGuardSuspended,
  isScreenshotSafeTarget,
} from "../utils/screenshotGuardControl";

const GRACE_PERIOD_MS = 4500;

function freezePage() {
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
  document.body.style.pointerEvents = "none";
  document.body.style.userSelect = "none";
  document.body.dataset.screenshotBlocked = "true";
}

function unfreezePage() {
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
  document.body.style.pointerEvents = "";
  document.body.style.userSelect = "";
  delete document.body.dataset.screenshotBlocked;
}

const SCREENSHOT_KEYS = new Set(["3", "4", "5"]);
const SCREENSHOT_CODES = new Set(["Digit3", "Digit4", "Digit5", "PrintScreen"]);

/** Only returns true for keyboard shortcuts that definitively capture the screen. */
function isConfirmedScreenshotShortcut(event) {
  const { key, code, metaKey, shiftKey } = event;

  if (key === "PrintScreen" || code === "PrintScreen") return true;

  if (metaKey && shiftKey && (SCREENSHOT_KEYS.has(key) || SCREENSHOT_CODES.has(code))) {
    return true;
  }

  return false;
}

function shouldIgnoreEvent(event) {
  return isScreenshotGuardSuspended() || isScreenshotSafeTarget(event.target);
}

function addGuardListeners(target, handlers, opts) {
  Object.entries(handlers).forEach(([event, handler]) => {
    target.addEventListener(event, handler, opts);
  });
}

function removeGuardListeners(target, handlers, opts) {
  Object.entries(handlers).forEach(([event, handler]) => {
    target.removeEventListener(event, handler, opts);
  });
}

const FALLBACK_GUARD_ID = "tradex-screenshot-guard-fallback";

function showInstantGuardOverlay() {
  if (document.getElementById(FALLBACK_GUARD_ID)) return;

  const overlay = document.createElement("div");
  overlay.id = FALLBACK_GUARD_ID;
  overlay.setAttribute("role", "alertdialog");
  overlay.style.cssText = [
    "position:fixed",
    "inset:0",
    "z-index:2147483647",
    "display:flex",
    "align-items:center",
    "justify-content:center",
    "background:#000",
    "padding:24px",
    "text-align:center",
    "pointer-events:auto",
  ].join(";");

  overlay.innerHTML = `
    <div style="max-width:640px;font-family:Inter,system-ui,sans-serif;color:#fff">
      <h1 style="margin:0;font-size:clamp(1.75rem,5.5vw,3.25rem);font-weight:700;line-height:1.12">
        Dei da… screenshot edukkadha da 😅
      </h1>
      <p style="margin:24px 0 0;font-size:clamp(1.1rem,3.5vw,1.5rem);color:#e2e8f0">
        Idhu full page access disable agirum
      </p>
    </div>
  `;

  document.body.appendChild(overlay);
}

function removeInstantGuardOverlay() {
  document.getElementById(FALLBACK_GUARD_ID)?.remove();
}

export function useScreenshotGuard(enabled) {
  const [isBlocked, setIsBlocked] = useState(false);
  const triggeredRef = useRef(false);
  const comboArmedRef = useRef(false);
  const armedRef = useRef(false);
  const graceTimerRef = useRef(null);

  const triggerBlock = useCallback(() => {
    if (triggeredRef.current || !enabled || !armedRef.current || isScreenshotGuardSuspended()) {
      return;
    }

    triggeredRef.current = true;
    comboArmedRef.current = false;
    showInstantGuardOverlay();
    freezePage();
    setIsBlocked(true);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      triggeredRef.current = false;
      comboArmedRef.current = false;
      armedRef.current = false;
      if (graceTimerRef.current) window.clearTimeout(graceTimerRef.current);
      setIsBlocked(false);
      removeInstantGuardOverlay();
      unfreezePage();
      return undefined;
    }

    if (isBlocked) return undefined;

    armedRef.current = false;
    if (graceTimerRef.current) window.clearTimeout(graceTimerRef.current);
    graceTimerRef.current = window.setTimeout(() => {
      armedRef.current = true;
    }, GRACE_PERIOD_MS);

    const onKeyDown = (event) => {
      if (shouldIgnoreEvent(event)) return;

      const { metaKey, shiftKey, key } = event;

      if (metaKey && shiftKey && (key === "Meta" || key === "Shift")) {
        comboArmedRef.current = true;
      }

      if (comboArmedRef.current && metaKey && shiftKey && SCREENSHOT_KEYS.has(key)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        triggerBlock();
        return;
      }

      if (isConfirmedScreenshotShortcut(event)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        triggerBlock();
      }
    };

    const onKeyUp = (event) => {
      if (shouldIgnoreEvent(event)) return;

      if (isConfirmedScreenshotShortcut(event)) {
        event.preventDefault();
        triggerBlock();
        return;
      }

      if (!event.metaKey && !event.shiftKey) comboArmedRef.current = false;
    };

    const opts = { capture: true, passive: false };

    const windowHandlers = {
      keydown: onKeyDown,
      keyup: onKeyUp,
    };

    addGuardListeners(window, windowHandlers, opts);
    addGuardListeners(document, windowHandlers, opts);

    return () => {
      if (graceTimerRef.current) window.clearTimeout(graceTimerRef.current);
      removeGuardListeners(window, windowHandlers, opts);
      removeGuardListeners(document, windowHandlers, opts);
    };
  }, [enabled, isBlocked, triggerBlock]);

  useEffect(
    () => () => {
      removeInstantGuardOverlay();
      unfreezePage();
    },
    [],
  );

  return { isBlocked };
}