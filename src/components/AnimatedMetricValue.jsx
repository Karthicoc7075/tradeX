import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useCountUp } from "../hooks/useCountUp";

export default function AnimatedMetricValue({ value, className, staticValue = false }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const match = value.match(/^([+-]?)(\d+)(.*)$/);
  const target = match ? Number(match[2]) : 0;
  const count = useCountUp(target, inView && Boolean(match) && !staticValue);

  if (!match || staticValue) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    );
  }

  const [, prefix, , suffix] = match;

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.25 }}
    >
      {prefix}
      {count}
      {suffix}
    </motion.span>
  );
}