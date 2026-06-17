import { motion } from "framer-motion";
import { useSiteMode } from "../hooks/useSiteMode";

const toneClass = {
  gold: "text-gold border-gold/20 bg-gold/10",
  lime: "text-lime border-lime/20 bg-lime/10",
  cyan: "text-cyan border-cyan/20 bg-cyan/10",
  rose: "text-rose-400 border-rose-500/20 bg-rose-500/10",
};

export default function MarketNews() {
  const { data } = useSiteMode();
  const items = [...data.marketNews, ...data.marketNews];

  return (
    <section id="news" className="border-b border-white/5 bg-[#07101e]/35 py-8">
      <div className="mb-4 flex items-center justify-between px-5 md:px-8">
        <div className="flex items-center gap-2">
          <motion.span
            className="h-2 w-2 rounded-full bg-gold"
            animate={{ opacity: [1, 0.35, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Live Market News</p>
        </div>
        <span className="rounded-full border border-white/10 px-2.5 py-1 text-[9px] font-bold text-slate-500">TRADEX Wire</span>
      </div>

      <div className="overflow-hidden">
        <motion.div
          className="news-ticker flex w-max gap-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          {items.map((item, index) => (
            <div
              key={`${item.headline}-${index}`}
              className="glass flex w-[300px] shrink-0 items-start gap-3 rounded-2xl border-white/10 p-4 md:w-[340px]"
            >
              <span className={`shrink-0 rounded-md border px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${toneClass[item.tone]}`}>
                {item.tag}
              </span>
              <p className="text-sm font-semibold leading-snug text-slate-200">{item.headline}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}