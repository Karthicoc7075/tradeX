import { useContext } from "react";
import { SiteModeContext } from "../context/SiteModeContext";

export function useSiteMode() {
  const ctx = useContext(SiteModeContext);
  if (!ctx) {
    throw new Error("useSiteMode must be used within SiteModeProvider");
  }
  return ctx;
}