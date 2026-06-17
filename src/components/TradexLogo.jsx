import tradexLogo from "../../assets/tradeX.png";

const sizes = {
  sm: "h-9",
  md: "h-10",
  lg: "h-12",
  xl: "h-14",
};

export default function TradexLogo({
  size = "md",
  showTagline = false,
  className = "",
  imgClassName = "",
}) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <img
        src={tradexLogo}
        alt="TRADEX Trading Academy"
        className={`${sizes[size]} w-auto object-contain drop-shadow-[0_0_12px_rgba(92,255,141,0.2)] ${imgClassName}`}
      />
      {showTagline && (
        <span className="hidden sm:block">
          <span className="block text-[9px] font-bold uppercase tracking-[0.22em] text-gold/90">
            Trading Academy
          </span>
        </span>
      )}
    </span>
  );
}