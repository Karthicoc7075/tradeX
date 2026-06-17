import { useSiteMode } from "./useSiteMode";

/** Builds mode-aware section links that work with React Router paths. */
export function useSectionHref(hash = "") {
  const { isBirthday } = useSiteMode();
  const base = isBirthday ? "/birthday" : "/";
  const fragment = hash.startsWith("#") ? hash : hash ? `#${hash}` : "";
  return `${base}${fragment}`;
}