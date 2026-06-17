/** Subtle section separators — dark premium trading theme */

export default function SectionDivider({ variant = "line", label, className = "" }) {
  const spacing = "my-10 md:my-12";

  if (variant === "gradient") {
    return (
      <div className={`mx-auto max-w-7xl px-5 md:px-8 ${spacing} ${className}`} aria-hidden="true">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      </div>
    );
  }

  if (variant === "dotted") {
    return (
      <div
        className={`mx-auto max-w-7xl border-t border-dotted border-white/20 px-5 md:px-8 ${spacing} ${className}`}
        aria-hidden="true"
      />
    );
  }

  if (variant === "labeled" && label) {
    return (
      <div className={`relative mx-auto max-w-7xl px-5 md:px-8 ${spacing} ${className}`}>
        <div className="border-t border-white/10" aria-hidden="true" />
        <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-ink px-4 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-slate-600">
          {label}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`mx-auto max-w-7xl border-t border-white/10 px-5 md:px-8 ${spacing} ${className}`}
      aria-hidden="true"
    />
  );
}