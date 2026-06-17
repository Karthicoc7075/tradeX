export default function SoundBars({ className = "bg-lime" }) {
  return (
    <span className="flex h-4 items-end gap-[3px]" aria-hidden="true">
      {[0, 1, 2, 3].map((bar) => (
        <span
          key={bar}
          className={`sound-bar w-[3px] origin-bottom rounded-full ${className}`}
          style={{ animationDelay: `${bar * 0.12}s` }}
        />
      ))}
    </span>
  );
}