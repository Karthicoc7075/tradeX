import { motion } from "framer-motion";
import { FaArrowTrendUp } from "react-icons/fa6";
import { portfolioReview } from "../data";
import { cardMotion, staggerCard, VIEWPORT } from "../utils/animations";
import { SectionTitle } from "./UI";

const toneStyles = {
  green: {
    value: "text-lime",
    border: "border-lime/15 hover:border-lime/30",
    glow: "bg-lime/8",
    badge: "bg-lime/10 text-lime",
    hover: "card-hover-lime",
  },
  gold: {
    value: "text-gold",
    border: "border-gold/15 hover:border-gold/30",
    glow: "bg-gold/8",
    badge: "bg-gold/10 text-gold",
    hover: "card-hover-gold",
  },
  blue: {
    value: "text-cyan",
    border: "border-cyan/15 hover:border-cyan/30",
    glow: "bg-cyan/8",
    badge: "bg-cyan/10 text-cyan",
    hover: "card-hover-lime",
  },
  highlight: {
    value: "lime-gradient text-2xl md:text-3xl",
    border: "border-gold/30 hover:border-gold/50",
    glow: "bg-gold/12",
    badge: "bg-gold/15 text-gold",
    hover: "card-hover-gold",
  },
};

export default function PortfolioReview() {
  return (
    <section id="review" className="border-y border-white/5 bg-[#07101e]/55 py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <SectionTitle
          eyebrow="Tharun's annual review"
          title="Tharun's Portfolio Review 2026 💼"
          copy="Analysis complete da. Result: Strong Buy — no questions asked."
          centered
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {portfolioReview.map((item, index) => {
            const styles = toneStyles[item.tone];
            const isHighlight = item.tone === "highlight";

            return (
              <motion.article
                key={item.label}
                custom={index}
                variants={staggerCard}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT}
                {...cardMotion}
                className={`glass card-hover ${styles.hover} relative overflow-hidden rounded-2xl p-5 md:p-6 ${styles.border} ${
                  isHighlight ? "sm:col-span-2 shadow-gold" : ""
                }`}
              >
                <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl ${styles.glow}`} />
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl md:text-3xl">{item.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-400">{item.label}</p>
                      <p className={`mt-2 font-display font-bold leading-snug ${styles.value}`}>
                        {item.value}
                      </p>
                      {item.note && (
                        <p className="mt-2 text-xs italic leading-relaxed text-slate-500">{item.note}</p>
                      )}
                    </div>
                  </div>
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${styles.badge}`}>
                    <FaArrowTrendUp />
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}