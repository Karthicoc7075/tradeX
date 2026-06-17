import { useSiteMode } from "../hooks/useSiteMode";

export default function MarketTicker() {
  const { data } = useSiteMode();
  const items = [...data.tickerItems, ...data.tickerItems];

  return (
    <div className="overflow-hidden border-b border-white/5 bg-[#07101e]/95 backdrop-blur-sm">
      <div className="ticker flex w-max py-2">
        {items.map(([name, value, tone], index) => (
          <div key={`${name}-${index}`} className="mx-6 flex items-center gap-2.5 text-[11px] font-semibold">
            <span className="text-slate-400">{name}</span>
            <span
              className={
                tone === "gold"
                  ? "text-gold"
                  : tone === "cyan"
                    ? "text-cyan"
                    : tone === "rose"
                      ? "text-rose-400"
                      : "text-lime"
              }
            >
              {value}
            </span>
            <span className="text-slate-700">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}