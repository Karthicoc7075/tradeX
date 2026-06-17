import { motion } from "framer-motion";
import { FaChartLine, FaGraduationCap, FaUserTie } from "react-icons/fa";
import trainerImage from "../../assets/test.png";
import { useEnrollModal } from "../hooks/useEnrollModal";
import { cardMotion, sectionReveal, VIEWPORT } from "../utils/animations";
import { PrimaryButton, SectionTitle } from "./UI";

const highlights = [
  {
    icon: FaUserTie,
    title: "Learn Directly from Tharun",
    desc: "One-on-one mentorship approach with real market insights from an active trader.",
  },
  {
    icon: FaChartLine,
    title: "1 Year of Real Market Experience",
    desc: "Battle-tested strategies built from live charts, not textbook theory.",
  },
  {
    icon: FaGraduationCap,
    title: "Practical Strategies That Work",
    desc: "Step-by-step frameworks you can apply from day one of the 7-day program.",
  },
];

export default function MeetTrainer() {
  const { openEnrollModal } = useEnrollModal();

  return (
    <section id="trainer" className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-lime/[0.04] blur-[100px]" />
      <div className="pointer-events-none absolute -right-16 bottom-1/4 h-72 w-72 rounded-full bg-gold/[0.05] blur-[90px]" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionTitle
          eyebrow="Your mentor"
          title="Meet Your Trainer – Tharun"
          copy="The face behind TRADEX. Real experience, real strategies, zero fluff."
          centered
        />

        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16"
        >
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative mx-auto w-full lg:max-w-none"
          >
            <div className="absolute -inset-3 rounded-[1.5rem] bg-gradient-to-br from-lime/12 via-transparent to-gold/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#0a1424] shadow-[0_28px_90px_rgba(0,0,0,0.4)]">
              <img
                src={trainerImage}
                alt="Tharun — TradeX Trading Academy trainer"
                className="block h-auto w-full object-contain"
              />
            </div>
          </motion.div>

          <div className="flex flex-col gap-6">
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  custom={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.45, delay: index * 0.1, ease: "easeOut" }}
                  {...cardMotion}
                  className="glass flex gap-4 rounded-2xl border border-white/10 p-5 transition-colors hover:border-lime/20"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-lime/10 text-lime">
                    <Icon className="text-base" />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold text-white md:text-lg">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="text-sm leading-7 text-slate-500 md:text-base"
            >
              The TRADEX 7-day program is designed for beginners and intermediate traders who want
              structured, practical training. Tharun breaks down market structure, entries, risk
              management, and live execution — so you leave with skills you can actually use.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.5, delay: 0.45 }}
            >
              <PrimaryButton onClick={openEnrollModal} arrow={false} className="w-full sm:w-auto">
                Enroll Now
              </PrimaryButton>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}