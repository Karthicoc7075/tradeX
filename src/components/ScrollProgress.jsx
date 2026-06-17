export default function ScrollProgress({ progress }) {
  const hue = progress < 0.35 ? "lime" : progress < 0.65 ? "gold" : "rose";
  const colorClass =
    hue === "lime" ? "bg-lime" : hue === "gold" ? "bg-gold" : "bg-gradient-to-r from-gold via-rose-400 to-lime";

  return (
    <div className="fixed left-0 right-0 top-0 z-[60] h-[2px] bg-white/5">
      <div
        className={`h-full origin-left transition-[width] duration-150 ease-out will-change-[width] ${colorClass}`}
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}