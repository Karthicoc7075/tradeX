import { motion } from "framer-motion";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import { useSiteMode } from "../hooks/useSiteMode";
import { cardMotion, staggerCard, VIEWPORT } from "../utils/animations";
import { SectionTitle } from "./UI";

const toneMap = {
  lime: { text: "text-lime", border: "border-lime/15 hover:border-lime/30", glow: "bg-lime/8", hover: "card-hover-lime" },
  gold: { text: "text-gold", border: "border-gold/15 hover:border-gold/30", glow: "bg-gold/8", hover: "card-hover-gold" },
  rose: { text: "text-rose-400", border: "border-rose-500/15 hover:border-rose-500/30", glow: "bg-rose-500/8", hover: "card-hover-rose" },
};

export default function PortfolioHoldings() {
  const { data } = useSiteMode();
  const { portfolioHoldings } = data;

  return (
    <section id="holdings" className="border-y border-white/5 bg-[#07101e]/40 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionTitle
          eyebrow="Asset allocation"
          title="Tharun's Portfolio Holdings"
          copy="Live positions across cake, friendship, and birthday sectors. Diversification optional. Happiness mandatory."
          centered
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {portfolioHoldings.map((item, index) => {
            const styles = toneMap[item.tone];
            const up = item.tone !== "rose";

            return (
              <motion.article
                key={item.symbol}
                custom={index}
                variants={staggerCard}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT}
                {...cardMotion}
                className={`glass card-hover ${styles.hover} relative overflow-hidden rounded-2xl p-5 ${styles.border}`}
              >
                <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full blur-2xl ${styles.glow}`} />
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.emoji}</span>
                    <div>
                      <p className="font-display text-sm font-bold text-white">{item.name}</p>
                      <p className="font-mono text-[10px] text-slate-500">{item.symbol}</p>
                    </div>
                  </div>
                  <span className={`grid h-8 w-8 place-items-center rounded-lg bg-white/5 ${styles.text}`}>
                    {up ? <FaArrowTrendUp className="text-xs" /> : <FaArrowTrendDown className="text-xs" />}
                  </span>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">Allocation</p>
                    <p className="font-display text-lg font-bold text-white">{item.allocation}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">24h</p>
                    <p className={`font-display text-lg font-bold ${styles.text}`}>{item.change}</p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}