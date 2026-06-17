import { useCallback, useState } from "react";
import EnrollModal from "../components/EnrollModal";
import { EnrollModalContext } from "./EnrollModalContext";

export default function EnrollModalProvider({ children }) {
  const [open, setOpen] = useState(false);

  const openEnrollModal = useCallback(() => setOpen(true), []);
  const closeEnrollModal = useCallback(() => setOpen(false), []);

  return (
    <EnrollModalContext.Provider value={{ openEnrollModal, closeEnrollModal }}>
      {children}
      <EnrollModal open={open} onClose={closeEnrollModal} />
    </EnrollModalContext.Provider>
  );
}