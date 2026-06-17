let suspendedUntil = 0;

export function suspendScreenshotGuard(durationMs = 800) {
  suspendedUntil = Date.now() + durationMs;
}

export function isScreenshotGuardSuspended() {
  return Date.now() < suspendedUntil;
}

export function isScreenshotSafeTarget(target) {
  if (!target || typeof target.closest !== "function") return false;
  return Boolean(target.closest("[data-screenshot-safe]"));
}