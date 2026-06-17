import { motion } from "framer-motion";
import { useSiteMode } from "../hooks/useSiteMode";
import { cardMotion, staggerCard, VIEWPORT } from "../utils/animations";

const accentMap = {
  lime: {
    text: "text-lime",
    border: "border-lime/20",
    bg: "from-lime/10",
    glow: "bg-lime/10",
  },
  gold: {
    text: "text-gold",
    border: "border-gold/20",
    bg: "from-gold/10",
    glow: "bg-gold/10",
  },
  rose: {
    text: "text-rose-400",
    border: "border-rose-500/20",
    bg: "from-rose-500/10",
    glow: "bg-rose-500/10",
  },
  cyan: {
    text: "text-cyan",
    border: "border-cyan/20",
    bg: "from-cyan/10",
    glow: "bg-cyan/10",
  },
};

function HeroStat({ stat, accent, index }) {
  const styles = accentMap[accent] ?? accentMap.lime;

  return (
    <motion.article
      custom={index}
      variants={staggerCard}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      {...cardMotion}
      className={`glass card-hover card-hover-lime relative overflow-hidden rounded-3xl border ${styles.border} bg-gradient-to-br ${styles.bg} to-transparent p-5 md:p-6`}
    >
      <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full blur-3xl ${styles.glow}`} />
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-3xl">{stat.icon}</span>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-500">{stat.label}</p>
          <p className={`mt-1 font-display text-xl font-bold md:text-2xl ${styles.text}`}>{stat.value}</p>
          {stat.note && <p className="mt-2 max-w-[200px] text-xs italic leading-relaxed text-slate-500">({stat.note})</p>}
        </div>
        <svg viewBox="0 0 80 48" className="h-12 w-20 shrink-0 opacity-80" aria-hidden="true">
          <polyline
            points="0,40 12,28 24,32 36,18 48,22 60,8 72,12 80,4"
            fill="none"
            stroke="#5cff8d"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </motion.article>
  );
}

function MeterStat({ stat, accent, index }) {
  const styles = accentMap[accent] ?? accentMap.gold;
  const meter = stat.meter ?? 90;

  return (
    <motion.article
      custom={index}
      variants={staggerCard}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      {...cardMotion}
      className={`glass card-hover card-hover-gold rounded-2xl border ${styles.border} bg-[#0d0a04]/60 p-5 md:p-6`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{stat.icon}</span>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{stat.label}</p>
          <p className={`mt-0.5 font-display text-lg font-bold ${styles.text}`}>{stat.value}</p>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex justify-between font-mono text-[9px] text-slate-600">
          <span>Reserve level</span>
          <span className={styles.text}>{meter}%</span>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/5">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-gold/70 to-gold"
            initial={{ width: 0 }}
            whileInView={{ width: `${meter}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
      {stat.note && <p className="mt-3 text-xs italic text-slate-500">({stat.note})</p>}
    </motion.article>
  );
}

function SplitStat({ stat, accent, index }) {
  const styles = accentMap[accent] ?? accentMap.rose;

  return (
    <motion.article
      custom={index}
      variants={staggerCard}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      {...cardMotion}
      className={`glass card-hover card-hover-rose grid grid-cols-[1fr_auto] gap-3 overflow-hidden rounded-2xl border ${styles.border} p-0`}
    >
      <div className="p-5 md:p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{stat.label}</p>
        <p className={`mt-2 font-display text-lg font-bold ${styles.text}`}>{stat.value}</p>
        {stat.note && <p className="mt-2 text-xs italic leading-relaxed text-slate-500">({stat.note})</p>}
      </div>
      <div className={`flex w-20 flex-col items-center justify-center border-l ${styles.border} bg-gradient-to-b ${styles.bg} to-transparent md:w-24`}>
        <span className="text-3xl">{stat.icon}</span>
        <span className="mt-2 rotate-90 font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-rose-400/80">
          HOLD
        </span>
      </div>
    </motion.article>
  );
}

function BannerStat({ stat, accent, index }) {
  const styles = accentMap[accent] ?? accentMap.cyan;

  return (
    <motion.article
      custom={index}
      variants={staggerCard}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      {...cardMotion}
      className={`glass card-hover relative overflow-hidden rounded-2xl border ${styles.border} p-5 md:p-6`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan/60 to-transparent" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{stat.icon}</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{stat.label}</p>
            <p className={`mt-0.5 font-display text-lg font-bold ${styles.text}`}>{stat.value}</p>
          </div>
        </div>
        <span className="rounded-full border border-cyan/25 bg-cyan/10 px-3 py-1 font-mono text-[10px] font-bold text-cyan">
          MOON
        </span>
      </div>
      {stat.note && <p className="mt-3 border-t border-white/5 pt-3 text-xs italic text-slate-500">({stat.note})</p>}
    </motion.article>
  );
}

function DefaultStat({ stat, index }) {
  return (
    <motion.article
      custom={index}
      variants={staggerCard}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      {...cardMotion}
      className="glass card-hover card-hover-gold rounded-2xl border-gold/10 p-5 md:p-6"
    >
      <span className="text-2xl">{stat.icon}</span>
      <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-500">{stat.label}</p>
      <p className="mt-1 font-display text-lg font-bold text-lime md:text-xl">{stat.value}</p>
      {stat.note && <p className="mt-2 text-xs italic leading-relaxed text-slate-500">({stat.note})</p>}
    </motion.article>
  );
}

export default function QuickStats() {
  const { data } = useSiteMode();
  const { quickStats } = data;

  const renderStat = (stat, index) => {
    const accent = stat.accent ?? "lime";

    switch (stat.layout) {
      case "hero":
        return <HeroStat key={stat.label} stat={stat} accent={accent} index={index} />;
      case "meter":
        return <MeterStat key={stat.label} stat={stat} accent={accent} index={index} />;
      case "split":
        return <SplitStat key={stat.label} stat={stat} accent={accent} index={index} />;
      case "banner":
        return <BannerStat key={stat.label} stat={stat} accent={accent} index={index} />;
      default:
        return <DefaultStat key={stat.label} stat={stat} index={index} />;
    }
  };

  return (
    <section id="stats" className="relative border-b border-white/5 bg-[#07101e]/40 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{quickStats.map(renderStat)}</div>
      </div>
    </section>
  );
}