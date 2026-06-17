export const SITE_MODES = {
  TRADE: "trade",
  BIRTHDAY: "birthday",
};

/** Default is always professional until the global unlock key is used. */
export function getDefaultSiteMode() {
  return SITE_MODES.TRADE;
}