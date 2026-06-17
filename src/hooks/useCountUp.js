import { animate } from "framer-motion";
import { useEffect, useState } from "react";

export function useCountUp(target, active, duration = 0.8) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active || target <= 0) {
      setValue(active ? target : 0);
      return;
    }

    const controls = animate(0, target, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setValue(Math.round(v)),
    });

    return () => controls.stop();
  }, [active, target, duration]);

  return value;
}