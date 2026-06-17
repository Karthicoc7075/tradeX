import * as birthdayData from "./birthday";
import * as tradeData from "./trade";

export function getSiteData(mode) {
  return mode === "birthday" ? birthdayData : tradeData;
}

export * from "./trade";