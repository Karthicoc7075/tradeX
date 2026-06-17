import confetti from "canvas-confetti";

export const CONFETTI_COLORS = ["#5cff8d", "#55d6ff", "#ffffff", "#ffdf6b", "#ff5d8f"];

export const HERO_CONFETTI_COLORS = [
  "#5cff8d",
  "#55d6ff",
  "#ffffff",
  "#ffdf6b",
  "#ff5d8f",
  "#ff6b6b",
  "#c9ff6b",
  "#a855f7",
  "#f97316",
  "#38bdf8",
];

export function fireSubtleConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    startVelocity: 28,
    origin: { y: 0.55 },
    colors: CONFETTI_COLORS,
  });
}

export function fireDobSuccessConfetti() {
  confetti({
    particleCount: 200,
    spread: 100,
    startVelocity: 35,
    origin: { y: 0.6 },
    colors: CONFETTI_COLORS,
  });
  window.setTimeout(() => {
    confetti({
      particleCount: 100,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.65 },
      colors: CONFETTI_COLORS,
    });
    confetti({
      particleCount: 100,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.65 },
      colors: CONFETTI_COLORS,
    });
  }, 200);
}

export function fireMassiveConfetti() {
  const duration = 3000;
  const end = Date.now() + duration;

  const burst = () => {
    if (Date.now() > end) return;
    confetti({
      particleCount: 18,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.7 },
      colors: CONFETTI_COLORS,
    });
    confetti({
      particleCount: 18,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.7 },
      colors: CONFETTI_COLORS,
    });
  };

  burst();
  const interval = window.setInterval(burst, 120);
  window.setTimeout(() => window.clearInterval(interval), duration);
}

/** Hero-grade multi-burst confetti — intense, longer, celebratory */
export function fireHeroConfettiBomb() {
  const colors = HERO_CONFETTI_COLORS;
  const duration = 5500;
  const end = Date.now() + duration;

  confetti({
    particleCount: 220,
    spread: 165,
    startVelocity: 58,
    origin: { x: 0.5, y: 0.32 },
    colors,
    scalar: 1.25,
    ticks: 320,
  });

  window.setTimeout(() => {
    confetti({
      particleCount: 140,
      angle: 55,
      spread: 88,
      origin: { x: 0.05, y: 0.55 },
      colors,
      startVelocity: 48,
    });
    confetti({
      particleCount: 140,
      angle: 125,
      spread: 88,
      origin: { x: 0.95, y: 0.55 },
      colors,
      startVelocity: 48,
    });
  }, 180);

  window.setTimeout(() => {
    confetti({
      particleCount: 110,
      spread: 120,
      origin: { x: 0.5, y: 0.58 },
      colors,
      startVelocity: 42,
    });
  }, 420);

  window.setTimeout(() => {
    confetti({
      particleCount: 90,
      angle: 90,
      spread: 360,
      origin: { x: 0.5, y: 0.45 },
      colors,
      startVelocity: 35,
      scalar: 0.9,
    });
  }, 750);

  const interval = window.setInterval(() => {
    if (Date.now() > end) {
      window.clearInterval(interval);
      return;
    }

    confetti({
      particleCount: 40,
      angle: 50 + Math.random() * 80,
      spread: 50 + Math.random() * 35,
      origin: { x: Math.random() * 0.6 + 0.2, y: 0.45 + Math.random() * 0.25 },
      colors,
      startVelocity: 28 + Math.random() * 22,
    });
  }, 160);

  window.setTimeout(() => {
    confetti({
      particleCount: 180,
      spread: 130,
      origin: { y: 0.5, x: 0.5 },
      colors,
      startVelocity: 50,
    });
    window.clearInterval(interval);
  }, duration - 400);
}

/** Light party burst — one-shot, won't freeze the page */
export function firePartyModeBurst() {
  const colors = CONFETTI_COLORS;

  confetti({
    particleCount: 55,
    spread: 72,
    startVelocity: 32,
    origin: { x: 0.5, y: 0.45 },
    colors,
    disableForReducedMotion: true,
  });

  window.setTimeout(() => {
    confetti({
      particleCount: 35,
      angle: 60,
      spread: 55,
      origin: { x: 0.15, y: 0.55 },
      colors,
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 35,
      angle: 120,
      spread: 55,
      origin: { x: 0.85, y: 0.55 },
      colors,
      disableForReducedMotion: true,
    });
  }, 180);
}