import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaMusic, FaPause, FaPlay, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { useMusic } from "../hooks/useMusic";
import { LAYOUT_SPRING } from "../utils/animations";
import SoundBars from "./SoundBars";

export default function BackgroundMusic({ visible = true }) {
  const { isPlaying, volume, togglePlay, setVolume } = useMusic();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  if (!visible) return null;

  return (
    <motion.div
      ref={panelRef}
      data-screenshot-safe="true"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.4 }}
      className="fixed bottom-5 right-5 z-[80] flex flex-col items-center sm:bottom-6 sm:right-6"
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="glass mb-2 w-52 rounded-2xl border border-lime/15 p-4 shadow-glow"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-lime">Background Music</p>

            <motion.button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause music" : "Play music"}
              className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-colors ${
                isPlaying
                  ? "bg-lime/15 text-lime"
                  : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
              whileTap={{ scale: 0.97 }}
            >
              {isPlaying ? (
                <>
                  <FaPause className="text-xs" />
                  Stop
                </>
              ) : (
                <>
                  <FaPlay className="text-xs" />
                  Play
                </>
              )}
            </motion.button>

            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  {volume === 0 ? (
                    <FaVolumeMute className="text-slate-500" />
                  ) : (
                    <FaVolumeUp className="text-lime" />
                  )}
                  Volume
                </span>
                <span className="font-mono text-slate-500">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="music-volume-slider w-full"
                aria-label="Music volume"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close music controls" : "Open music controls"}
        aria-expanded={open}
        className={`glass flex h-12 w-12 shrink-0 items-center justify-center rounded-full border shadow-lg transition-colors ${
          isPlaying
            ? "border-lime/30 bg-lime/10 text-lime"
            : "border-white/10 text-slate-400 hover:border-lime/25 hover:text-lime"
        }`}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={LAYOUT_SPRING}
      >
        {isPlaying ? (
          <span className="flex items-center justify-center gap-1">
            <SoundBars className="bg-lime" />
            <FaMusic className="text-sm leading-none" />
          </span>
        ) : (
          <FaMusic className="text-base leading-none" />
        )}
      </motion.button>
    </motion.div>
  );
}