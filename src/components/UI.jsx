import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { buttonMotion, LAYOUT_SPRING, sectionReveal, VIEWPORT } from "../utils/animations";

export function SectionTitle({ eyebrow, title, copy, centered = false, reveal = true, theme = "default" }) {
  const isBirthday = theme === "birthday";
  const wrapperClass = `mb-10 max-w-3xl ${centered ? "mx-auto text-center" : ""}`;
  const inner = (
    <>
      {isBirthday ? (
        <div className={`mb-3 flex flex-wrap items-center gap-2.5 ${centered ? "justify-center" : ""}`}>
          <span className="rounded-full border border-lime/20 bg-lime/10 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-lime">
            🎂 Birthday
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-lime">// {eyebrow}</span>
        </div>
      ) : (
        <div className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.24em] text-lime">// {eyebrow}</div>
      )}
      <h2 className="font-display text-3xl font-bold leading-tight text-white md:text-5xl">{title}</h2>
      {copy && <p className="mt-4 text-base leading-7 text-slate-400 md:text-lg">{copy}</p>}
    </>
  );

  if (!reveal) {
    return <div className={wrapperClass}>{inner}</div>;
  }

  return (
    <motion.div
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className={wrapperClass}
    >
      {inner}
    </motion.div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  href,
  className = "",
  type = "button",
  arrow = true,
  layoutId,
}) {
  const classes = `btn-glow group inline-flex items-center justify-center gap-3 rounded-xl bg-lime px-6 py-3.5 text-sm font-extrabold text-[#04130a] shadow-glow hover:bg-[#80ffa5] ${className}`;
  const icon = arrow ? <FaArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-1" /> : null;
  const layoutProps = layoutId
    ? { layoutId, layout: true, transition: LAYOUT_SPRING }
    : {};

  if (href) {
    return (
      <motion.a href={href} className={classes} {...buttonMotion} {...layoutProps}>
        {children}
        {icon}
      </motion.a>
    );
  }

  return (
    <motion.button type={type} onClick={onClick} className={classes} {...buttonMotion} {...layoutProps}>
      {children}
      {icon}
    </motion.button>
  );
}