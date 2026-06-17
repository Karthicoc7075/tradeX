/** Shared animation config — performance-first, 0.3–0.6s, viewport once */

export const VIEWPORT = { once: true, amount: 0.2 };
export const VIEWPORT_SECTION = { once: true, amount: 0.15 };
export const STAGGER_DELAY = 0.08;

/** Spring physics for layout-driven movement */
export const LAYOUT_SPRING = { type: "spring", stiffness: 300, damping: 30 };

/** Shared layoutId keys for cross-component morph transitions */
export const LAYOUT_IDS = {
  entryPortal: "entry-portal",
  bonusPortal: "bonus-portal",
  adviceActive: "advice-active-card",
  adviceTab: "advice-tab-indicator",
  navTab: "nav-tab-indicator",
};

export const staggerCard = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * STAGGER_DELAY,
      duration: 0.45,
      ease: "easeOut",
    },
  }),
};

/** Stagger + layout spring — for grids that reflow on interaction */
export const layoutStaggerCard = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * STAGGER_DELAY,
      layout: LAYOUT_SPRING,
      opacity: { duration: 0.45, ease: "easeOut" },
      y: { duration: 0.45, ease: "easeOut" },
    },
  }),
};

export const adviceListItem = {
  initial: { opacity: 0, x: -16, scale: 0.96 },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { ...LAYOUT_SPRING, opacity: { duration: 0.35 } },
  },
  exit: {
    opacity: 0,
    x: 16,
    scale: 0.96,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export const adviceDetailReveal = {
  initial: { opacity: 0, height: 0 },
  animate: {
    opacity: 1,
    height: "auto",
    transition: { ...LAYOUT_SPRING, opacity: { duration: 0.35, delay: 0.05 } },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export const sectionReveal = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const modalBackdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

export const modalPanel = {
  hidden: { opacity: 0, scale: 0.92, y: 28 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    x: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 28,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  shake: {
    x: [0, -8, 8, -6, 6, 0],
    transition: { x: { duration: 0.4, ease: "easeInOut" } },
  },
};

export const advicePop = {
  initial: { opacity: 0, scale: 0.88, y: 20 },
  animate: {
    opacity: 1,
    scale: [0.88, 1.05, 1],
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export const buttonMotion = {
  whileHover: { scale: 1.04 },
  whileTap: { scale: 0.96 },
  transition: { duration: 0.2, ease: "easeOut" },
};

/** Smooth hover lift + press feedback for glass cards */
export const cardMotion = {
  whileHover: { y: -6, transition: { duration: 0.35, ease: "easeOut" } },
  whileTap: { scale: 0.97, y: -2, transition: { duration: 0.18, ease: "easeOut" } },
};

/** Scale-based variant for expandable advice card */
export const adviceCardMotion = {
  whileHover: { scale: 1.015, transition: { duration: 0.3, ease: "easeOut" } },
  whileTap: { scale: 0.985, transition: { duration: 0.18, ease: "easeOut" } },
};

export const heroStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

export const heroWord = {
  hidden: { opacity: 0, y: 36, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export const heroGlow = {
  animate: {
    scale: [1, 1.03, 1],
    textShadow: [
      "0 0 20px rgba(92,255,141,0.2), 0 0 40px rgba(92,255,141,0.1)",
      "0 0 32px rgba(92,255,141,0.45), 0 0 64px rgba(255,223,107,0.2)",
      "0 0 20px rgba(92,255,141,0.2), 0 0 40px rgba(92,255,141,0.1)",
    ],
  },
  transition: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};