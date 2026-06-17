import { motion } from "framer-motion";
import { FaArrowTrendUp } from "react-icons/fa6";
import { useSiteMode } from "../hooks/useSiteMode";
import { cardMotion, staggerCard, VIEWPORT } from "../utils/animations";
import { SectionTitle } from "./UI";

export default function RoastSection() {
  const { data } = useSiteMode();
  const { roastPredictions } = data;

  return (
    <section id="roast" className="border-y border-white/5 bg-[#07101e]/50 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionTitle
          eyebrow="Comparative analysis"
          title="Things Tharun Predicts Better Than The Market"
          copy="Independent research confirms consistent outperformance. Market still in denial."
          centered
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roastPredictions.map((item, index) => (
            <motion.article
              key={item.topic}
              custom={index}
              variants={staggerCard}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
              {...cardMotion}
              whileHover={{ y: -5 }}
              className="glass card-hover card-hover-lime relative overflow-hidden rounded-2xl border-white/10 p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-lg font-bold text-white">{item.topic}</h3>
                <span className="rounded-lg bg-lime/10 px-2 py-1 font-mono text-[10px] font-bold text-lime">
                  {item.accuracy}
                </span>
              </div>
              <div className="mt-5 space-y-3">
                <div className="rounded-xl border border-lime/15 bg-lime/5 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-lime">Tharun</p>
                  <p className="mt-1 text-sm font-semibold text-white">{item.tharun}</p>
                </div>
                <div className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">The Market</p>
                  <p className="mt-1 text-sm text-slate-400">{item.market}</p>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
                <span className="text-xs font-semibold text-gold">{item.verdict}</span>
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-lime/10 text-lime">
                  <FaArrowTrendUp className="text-sm" />
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}