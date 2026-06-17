import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { useSiteMode } from "../hooks/useSiteMode";
import { cardMotion, staggerCard, VIEWPORT } from "../utils/animations";
import { SectionTitle } from "./UI";

export default function Testimonials() {
  const { data, isBirthday } = useSiteMode();
  const { testimonials, copy } = data;

  return (
    <section id="testimonials" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionTitle eyebrow={copy.testimonials.eyebrow} title={copy.testimonials.title} copy={copy.testimonials.subtitle} centered />
        <div className={`grid gap-4 ${isBirthday ? "md:grid-cols-2 lg:grid-cols-2" : "md:grid-cols-2"}`}>
          {testimonials.map((item, index) => (
            <motion.article
              key={item.name}
              custom={index}
              variants={staggerCard}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
              {...cardMotion}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="glass card-hover card-hover-gold group relative overflow-hidden rounded-2xl border-white/10 p-6"
            >
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gold/10 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/5 text-xl transition-transform duration-300 group-hover:scale-110">
                    {isBirthday ? item.avatar : <span className="font-display text-xs font-bold text-gold">{item.initials}</span>}
                  </span>
                  <div>
                    <p className="font-display text-sm font-bold text-white">{item.name}</p>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">{item.role}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 text-gold">
                  {Array.from({ length: item.rating }, (_, i) => (
                    <FaStar key={i} className="text-[10px]" />
                  ))}
                </div>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-slate-300">&ldquo;{item.quote}&rdquo;</p>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-lime/70">{copy.testimonials.badge}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}