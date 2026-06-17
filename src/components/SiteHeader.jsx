import MarketTicker from "./MarketTicker";
import Navbar from "./Navbar";

/** Fixed navbar + live ticker stack */
export default function SiteHeader() {
  return (
    <div data-screenshot-safe="true" className="fixed inset-x-0 top-0 z-40">
      <Navbar />
      <MarketTicker />
    </div>
  );
}