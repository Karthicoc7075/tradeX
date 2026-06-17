import { useEffect, useRef } from "react";
import { useMusic } from "./useMusic";

const HERO_PASSED_RATIO = 0.25;

function hasPassedHero() {
  const hero = document.getElementById("top");
  if (!hero) return false;
  const { bottom } = hero.getBoundingClientRect();
  return bottom <= window.innerHeight * HERO_PASSED_RATIO;
}

/** Starts background music once the user scrolls past the hero section. */
export function useScrollTriggeredMusic() {
  const { autoPlayOnScroll } = useMusic();
  const startedRef = useRef(false);

  useEffect(() => {
    const trigger = () => {
      if (startedRef.current || !hasPassedHero()) return;
      startedRef.current = true;
      autoPlayOnScroll();
    };

    const onScroll = () => trigger();
    window.addEventListener("scroll", onScroll, { passive: true });

    const hero = document.getElementById("top");
    let observer;
    if (hero) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.2) {
            trigger();
          }
        },
        { threshold: [0, 0.2, 0.5] },
      );
      observer.observe(hero);
    }

    trigger();

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, [autoPlayOnScroll]);
}