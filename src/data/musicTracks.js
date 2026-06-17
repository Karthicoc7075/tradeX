import happyBirthdayTrack from "../../assets/nastelbom-happy-birthday-471481.mp3";

export const MUSIC_TRACKS = [
  {
    id: "birthday",
    name: "Birthday Celebration",
    mood: "Upbeat · loops smoothly",
    src: happyBirthdayTrack,
  },
];

export const MUSIC_STORAGE_KEY = "tradex-music-prefs";

export const DEFAULT_MUSIC_PREFS = {
  volume: 0.35,
  trackId: "birthday",
  isPlaying: false,
};