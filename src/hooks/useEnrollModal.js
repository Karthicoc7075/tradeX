import { useContext } from "react";
import { EnrollModalContext } from "../context/EnrollModalContext";

export function useEnrollModal() {
  const context = useContext(EnrollModalContext);
  if (!context) {
    throw new Error("useEnrollModal must be used within EnrollModalProvider");
  }
  return context;
}