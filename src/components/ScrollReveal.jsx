/** Passthrough wrapper — section components handle their own reveal animations. */
export default function ScrollReveal({ children, className = "" }) {
  return className ? <div className={className}>{children}</div> : children;
}