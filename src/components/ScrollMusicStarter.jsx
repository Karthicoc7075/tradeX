import { useScrollTriggeredMusic } from "../hooks/useScrollTriggeredMusic";

/** Invisible — mounts scroll listener as soon as the main site is visible. */
export default function ScrollMusicStarter() {
  useScrollTriggeredMusic();
  return null;
}