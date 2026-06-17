import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaAward, FaChartLine, FaGlobe, FaShieldHalved, FaSliders } from "react-icons/fa6";
import { useSiteMode } from "../hooks/useSiteMode";
import { adviceDetailReveal, cardMotion, layoutStaggerCard, LAYOUT_SPRING, VIEWPORT } from "../utils/animations";
import { SectionTitle } from "./UI";

const iconMap = {
  shield: FaShieldHalved,
  chart: FaChartLine,
  risk: FaSliders,
  strategy: FaChartLine,
  globe: FaGlobe,
  award: FaAward,
};

export default function Achievements() {
  const { data, isBirthday } = useSiteMode();
  const { achievements, copy } = data;
  const [expanded, setExpanded] = useState(null);

  return (
    <section id="achievements" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <SectionTitle eyebrow={copy.achievements.eyebrow} title={copy.achievements.title} copy={copy.achievements.subtitle} />
      <motion.div layout className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((item, index) => {
          const isExpanded = expanded === item.title;
          const Icon = item.icon ? iconMap[item.icon] : null;

          return (
            <motion.article
              key={item.title}
              layout
              custom={index}
              variants={layoutStaggerCard}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
              transition={{ layout: LAYOUT_SPRING }}
              {...cardMotion}
              onClick={() => setExpanded(isExpanded ? null : item.title)}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className={`glass card-hover card-hover-gold group relative cursor-pointer overflow-hidden rounded-2xl border-white/10 p-6 hover:border-gold/30 ${
                isExpanded ? "md:col-span-2 ring-1 ring-gold/25" : ""
              }`}
            >
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold/10 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
              <div className="flex items-start justify-between">
                {isBirthday ? (
                  <span className="text-4xl transition-transform duration-300 group-hover:scale-110">{item.emoji}</span>
                ) : (
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold/10 text-xl text-gold transition-transform duration-300 group-hover:scale-110">
                    <Icon />
                  </span>
                )}
                <span className="rounded-full border border-gold/20 bg-gold/5 px-2.5 py-1 text-[9px] font-bold tracking-wider text-gold">{item.tag}</span>
              </div>
              <h3 className="mt-6 font-display text-xl font-bold leading-snug text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{item.desc}</p>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div layout key="achievement-detail" variants={adviceDetailReveal} initial="initial" animate="animate" exit="exit" className="overflow-hidden">
                    <div className="mt-5 border-t border-gold/15 pt-5">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Verification Details</p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-300">
                        {isBirthday
                          ? "Certified by TRADEX Birthday Committee. Issued exclusively to Tharun — non-transferable, fully friend-verified."
                          : "Credential issued and maintained under TRADEX institutional standards. Available for review upon enrollment."}
                      </p>
                      <p className="mt-2 text-xs text-slate-500">Tap to collapse</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
                <span className="text-[10px] uppercase tracking-wider text-slate-600">{isBirthday ? "Friend-verified" : "TRADEX Verified"}</span>
                <FaCheckCircle className="text-lime transition-transform duration-300 group-hover:scale-110" />
              </div>
            </motion.article>
          );
        })}
      </motion.div>
    </section>
  );
}