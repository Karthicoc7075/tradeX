import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BIRTHDAY_SESSION_VOLUME,
  DEFAULT_MUSIC_PREFS,
  MUSIC_STORAGE_KEY,
  MUSIC_TRACKS,
} from "../data/musicTracks";
import { MusicContext } from "./MusicContext";

function loadPrefs() {
  try {
    const raw = localStorage.getItem(MUSIC_STORAGE_KEY);
    if (!raw) return DEFAULT_MUSIC_PREFS;
    return { ...DEFAULT_MUSIC_PREFS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_MUSIC_PREFS;
  }
}

export default function MusicProvider({ children }) {
  const audioRef = useRef(null);
  const pausedByTabRef = useRef(false);
  const userPausedRef = useRef(false);
  const prevTrackIdRef = useRef(null);
  const scrollMusicQueuedRef = useRef(false);
  const birthdayPlaybackStartedRef = useRef(false);

  const [prefs, setPrefs] = useState(() => ({ ...loadPrefs(), isPlaying: false }));

  const trackIndex = Math.max(
    0,
    MUSIC_TRACKS.findIndex((track) => track.id === prefs.trackId),
  );
  const track = MUSIC_TRACKS[trackIndex] ?? MUSIC_TRACKS[0];

  const persist = useCallback((next) => {
    setPrefs((prev) => {
      const merged = { ...prev, ...next };
      localStorage.setItem(MUSIC_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    });
  }, []);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return false;
    try {
      await audio.play();
      userPausedRef.current = false;
      persist({ isPlaying: true });
      return true;
    } catch {
      persist({ isPlaying: false });
      return false;
    }
  }, [persist]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    userPausedRef.current = true;
    persist({ isPlaying: false });
  }, [persist]);

  const togglePlay = useCallback(async () => {
    if (prefs.isPlaying) {
      pause();
      return false;
    }
    return play();
  }, [pause, play, prefs.isPlaying]);

  const autoPlayOnScroll = useCallback(async () => {
    if (userPausedRef.current) return false;

    const audio = audioRef.current;
    if (!audio) return false;

    const tryPlay = () => play();

    if (audio.readyState >= 2) {
      return tryPlay();
    }

    scrollMusicQueuedRef.current = true;
    return new Promise((resolve) => {
      const onReady = () => {
        audio.removeEventListener("canplaythrough", onReady);
        audio.removeEventListener("canplay", onReady);
        if (!scrollMusicQueuedRef.current || userPausedRef.current) {
          resolve(false);
          return;
        }
        scrollMusicQueuedRef.current = false;
        tryPlay().then(resolve);
      };
      audio.addEventListener("canplaythrough", onReady);
      audio.addEventListener("canplay", onReady);
      audio.load();
    });
  }, [play]);

  const setVolume = useCallback(
    (volume) => persist({ volume }),
    [persist],
  );

  const setTrackId = useCallback(
    (trackId) => persist({ trackId }),
    [persist],
  );

  const startBirthdayPlayback = useCallback(async () => {
    userPausedRef.current = false;
    scrollMusicQueuedRef.current = false;
    persist({ volume: BIRTHDAY_SESSION_VOLUME });

    const audio = audioRef.current;
    if (audio && birthdayPlaybackStartedRef.current && !audio.paused) {
      return true;
    }

    birthdayPlaybackStartedRef.current = true;
    return play();
  }, [persist, play]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = prefs.volume;
  }, [prefs.volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (prevTrackIdRef.current === null) {
      prevTrackIdRef.current = track.id;
      return;
    }

    if (prevTrackIdRef.current === track.id) return;

    const shouldResume = prefs.isPlaying && !userPausedRef.current;
    prevTrackIdRef.current = track.id;
    audio.src = track.src;
    audio.load();
    if (shouldResume) play();
  }, [play, prefs.isPlaying, track.id, track.src]);

  useEffect(() => {
    const onVisibility = () => {
      const audio = audioRef.current;
      if (!audio) return;

      if (document.hidden) {
        if (!audio.paused) {
          pausedByTabRef.current = true;
          audio.pause();
        }
        return;
      }

      if (pausedByTabRef.current && prefs.isPlaying && !userPausedRef.current) {
        pausedByTabRef.current = false;
        play();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [play, prefs.isPlaying]);

  const value = useMemo(
    () => ({
      audioRef,
      isPlaying: prefs.isPlaying,
      volume: prefs.volume,
      track,
      trackId: prefs.trackId,
      play,
      pause,
      togglePlay,
      autoPlayOnScroll,
      setVolume,
      setTrackId,
      startBirthdayPlayback,
      pausedByTabRef,
    }),
    [
      autoPlayOnScroll,
      pause,
      play,
      prefs.isPlaying,
      prefs.trackId,
      prefs.volume,
      setTrackId,
      setVolume,
      startBirthdayPlayback,
      togglePlay,
      track,
    ],
  );

  return (
    <MusicContext.Provider value={value}>
      <audio
        ref={audioRef}
        loop
        preload="auto"
        src={track.src}
        onPlay={() => persist({ isPlaying: true })}
        onPause={() => {
          if (!pausedByTabRef.current) persist({ isPlaying: false });
        }}
      />
      {children}
    </MusicContext.Provider>
  );
}