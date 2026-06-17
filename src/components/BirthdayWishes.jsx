import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { birthdayWishes } from "../data";
import { SectionTitle } from "./UI";

export default function BirthdayWishes() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % birthdayWishes.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const wish = birthdayWishes[index];

  return (
    <section id="wishes" className="relative py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <SectionTitle
          eyebrow="Friend feed"
          title="Birthday Wishes Incoming 💌"
          copy="Live messages from the TRADEX friendship desk — auto-refreshing da."
          centered
        />
        <div className="glass relative min-h-[140px] overflow-hidden rounded-2xl border-gold/15 p-6 md:p-8">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-center"
            >
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-lime">
                {wish.from}
              </p>
              <p className="mt-4 font-display text-lg font-semibold leading-relaxed text-white md:text-xl">
                &ldquo;{wish.text}&rdquo;
              </p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-6 flex justify-center gap-1.5">
            {birthdayWishes.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-5 bg-lime" : "w-1.5 bg-white/15"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}