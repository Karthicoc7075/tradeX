import { QRCodeSVG } from "qrcode.react";

const themes = {
  letter: { bg: "#f8f1df", fg: "#2f2820", border: "border-[#c9b896]/60" },
  dark: { bg: "#0a1628", fg: "#eef8ff", border: "border-slate-700/70" },
};

export default function SecretQr({ value, size = 80, theme = "letter", className = "", label, title }) {
  const colors = themes[theme] ?? themes.letter;

  return (
    <div className={`inline-flex flex-col items-center gap-2 ${className}`}>
      {title && (
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-current opacity-80">{title}</span>
      )}
      <div
        className={`rounded-lg border-2 ${colors.border} bg-white/50 p-2 shadow-sm`}
        title="Phone camera la scan pannu da"
      >
        <QRCodeSVG
          value={value}
          size={size}
          level="H"
          bgColor={colors.bg}
          fgColor={colors.fg}
          includeMargin
        />
      </div>
      {label && <span className="max-w-[120px] text-center text-[10px] leading-snug text-current opacity-75">{label}</span>}
    </div>
  );
}