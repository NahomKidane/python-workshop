/* ==========================================================================
   state.js — Centralized application state + localStorage (no dependencies)
   ========================================================================== */

const STORAGE_PREFIX = "pyWorkshop_";

/* ---------------------------------------------------------------------------
   State object — single source of truth
   --------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------
   State object — single source of truth
   --------------------------------------------------------------------------- */
export const AppState = {
  // Navigation
  currentTab: "learn",
  currentLesson: 0,
  visitedLessons: new Set(),
  completedChallenges: new Set(),

  // Challenges
  activeTier: "all",
  activeChallenge: null,

  // Engine
  engineMode: "loading",   // "loading" | "skulpt" | "fallback"
  engineReady: false,
  outputBuffer: [],

  // Accessibility
  theme: "dark",       // "dark" | "light"
  fontSize: 15,        // base font size in px
};

/* ---------------------------------------------------------------------------
   Constants
   --------------------------------------------------------------------------- */
export const ENGINE_TIMEOUT = 5000;   // 5 seconds
export const OUTPUT_LINE_CAP = 100;

/* ---------------------------------------------------------------------------
   Persistence
   --------------------------------------------------------------------------- */

export function saveProgress() {
  try {
    localStorage.setItem(
      STORAGE_PREFIX + "visited",
      JSON.stringify([...AppState.visitedLessons])
    );
    localStorage.setItem(
      STORAGE_PREFIX + "completed",
      JSON.stringify([...AppState.completedChallenges])
    );
    localStorage.setItem(
      STORAGE_PREFIX + "lastLesson",
      AppState.currentLesson.toString()
    );
    localStorage.setItem(STORAGE_PREFIX + "theme", AppState.theme);
    localStorage.setItem(STORAGE_PREFIX + "fontSize", AppState.fontSize.toString());
  } catch (e) {
    // localStorage unavailable — fail silently
  }
}

export function loadProgress() {
  try {
    const visited = localStorage.getItem(STORAGE_PREFIX + "visited");
    const completed = localStorage.getItem(STORAGE_PREFIX + "completed");
    const lastLesson = localStorage.getItem(STORAGE_PREFIX + "lastLesson");
    const theme = localStorage.getItem(STORAGE_PREFIX + "theme");
    const fontSize = localStorage.getItem(STORAGE_PREFIX + "fontSize");

    if (visited) AppState.visitedLessons = new Set(JSON.parse(visited));
    if (completed) AppState.completedChallenges = new Set(JSON.parse(completed));
    if (lastLesson) AppState.currentLesson = parseInt(lastLesson) || 0;
    if (theme) AppState.theme = theme;
    if (fontSize) AppState.fontSize = parseInt(fontSize) || 15;
  } catch (e) {
    // Corrupt or unavailable — start fresh
  }
}

export function resetProgress() {
  if (!confirm("Reset all progress? This clears visited lessons and completed challenges.")) {
    return;
  }

  AppState.visitedLessons.clear();
  AppState.completedChallenges.clear();
  AppState.currentLesson = 0;

  try {
    localStorage.removeItem(STORAGE_PREFIX + "visited");
    localStorage.removeItem(STORAGE_PREFIX + "completed");
    localStorage.removeItem(STORAGE_PREFIX + "lastLesson");
  } catch (e) { }

  renderCurrentTab();
}
