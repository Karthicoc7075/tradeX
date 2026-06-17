import { motion } from "framer-motion";

export default function Tooltip({ children, text, className = "" }) {
  return (
    <span className={`group/tooltip relative ${className || "inline-flex"}`}>
      {children}
      <motion.span
        role="tooltip"
        initial={{ opacity: 0, y: 4 }}
        whileHover={{ opacity: 1, y: 0 }}
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden w-max max-w-[200px] -translate-x-1/2 rounded-lg border border-white/10 bg-[#0a1628]/95 px-3 py-2 text-center text-[10px] leading-relaxed text-slate-300 shadow-lg backdrop-blur-md group-hover/tooltip:block"
      >
        {text}
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#0a1628]/95" />
      </motion.span>
    </span>
  );
}