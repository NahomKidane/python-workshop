/* ==========================================================================
   renderers/learn.js — Learn tab renderer
   Depends on: state.js, utils.js, mascot.js, playground.js, data/lessons.js
   ========================================================================== */

import { AppState, saveProgress } from "../state.js";
import { LESSONS } from "../data/lessons.js";
import { highlightPython, escapeHtml } from "../utils.js"; // escapeHtml used in renderLessonBlock
import { MASCOT_IMG } from "../mascot.js";
import { Playground } from "../playground.js";

export function renderLearn() {
  const panel = document.getElementById("contentPanel");

  // Mark current lesson as visited
  AppState.visitedLessons.add(AppState.currentLesson);
  saveProgress();

  const lesson = LESSONS[AppState.currentLesson];
  const totalVisited = AppState.visitedLessons.size;
  const pct = Math.round((totalVisited / LESSONS.length) * 100);

  let html = "";

  /* ── Progress bar ──────────────────────────────────────────────── */
  html += `
    <div class="learn-progress">
      <div class="progress-bar-bg">
        <div class="progress-bar-fill" style="width:${pct}%"></div>
      </div>
      <span class="progress-label">${totalVisited} of ${LESSONS.length} lessons visited</span>
    </div>`;

  /* ── Lesson navigation pills ───────────────────────────────────── */
  html += `<div class="lesson-pills">`;
  LESSONS.forEach((l, i) => {
    const active = i === AppState.currentLesson ? "active" : "";
    const visited = AppState.visitedLessons.has(i) ? "visited" : "";
    const check = AppState.visitedLessons.has(i) ? " ✓" : "";
    html += `<button class="pill ${active} ${visited}" onclick="goToLesson(${i})">${l.number}${check}</button>`;
  });
  html += `</div>`;

  /* ── Lesson card ───────────────────────────────────────────────── */
  html += `
    <div class="lesson-card">
      <div class="lesson-header">
        <span class="lesson-number">Lesson ${lesson.number}</span>
        <h2 class="lesson-title">${lesson.title}</h2>
        <span class="lesson-connection">🔗 ${lesson.nlpConnection}</span>
      </div>
      <div class="lesson-body">`;

  // Render each content block
  for (const block of lesson.body) {
    html += renderLessonBlock(block);
  }

  html += `</div></div>`;

  /* ── Navigation footer ─────────────────────────────────────────── */
  html += `<div class="lesson-nav">`;
  if (AppState.currentLesson > 0) {
    html += `<button class="nav-btn" onclick="goToLesson(${AppState.currentLesson - 1})">← Previous</button>`;
  } else {
    html += `<span></span>`;
  }
  if (AppState.currentLesson < LESSONS.length - 1) {
    html += `<button class="nav-btn" onclick="goToLesson(${AppState.currentLesson + 1})">Next →</button>`;
  } else {
    html += `<span></span>`;
  }
  html += `</div>`;

  panel.innerHTML = html;
}

/* ---------------------------------------------------------------------------
   Lesson content block renderer
   --------------------------------------------------------------------------- */

function renderLessonBlock(block) {
  switch (block.type) {
    case "text":
      return `<p class="lesson-text">${block.content}</p>`;

    case "code":
      const highlighted = highlightPython(block.code);
      // Escape code for HTML attribute:
      // 1. Backticks ` -> \` (for JS template literal)
      // 2. Dollar signs $ -> \$ (to prevent JS interpolation)
      // 3. Double quotes " -> &quot; (to prevent breaking HTML attribute)
      const safeCode = block.code
        .replace(/\\/g, "\\\\") // Escape backslashes first!
        .replace(/`/g, "\\`")
        .replace(/\$/g, "\\$")
        .replace(/"/g, "&quot;");

      let codeHtml = `
        <div class="code-block">
          <div class="code-header">
            <span>Python</span>
            <button class="code-run-btn" onclick="loadAndRun(\`${safeCode}\`)">Run ▶</button>
          </div>
          <pre class="code-content">${highlighted}</pre>`;
      if (block.output) {
        codeHtml += `<div class="code-output"><span class="code-output-label">Expected output:</span><pre>${escapeHtml(block.output)}</pre></div>`;
      }
      codeHtml += `</div>`;
      return codeHtml;

    case "concept":
      return `<div class="callout callout-concept"><span class="callout-label">💡 Concept</span><span class="callout-text">${block.content}</span></div>`;

    case "try":
      return `<div class="callout callout-try"><span class="callout-label">🧪 Try It</span><span class="callout-text">${block.content}</span></div>`;

    case "warning":
      return `<div class="callout callout-warning"><span class="callout-label">⚠️ Watch Out</span><span class="callout-text">${block.content}</span></div>`;

    case "mascot":
      return `<div class="mascot-moment"><img class="mascot-img" src="${MASCOT_IMG}" alt="PyBuddy"><div class="mascot-speech">${block.content}</div></div>`;

    default:
      return "";
  }
}

/* ---------------------------------------------------------------------------
   Navigation helpers (global — called from onclick)
   --------------------------------------------------------------------------- */

function goToLesson(index) {
  AppState.currentLesson = index;
  renderLearn();
  document.getElementById("contentPanel").scrollTop = 0;
}

function loadAndRun(code) {
  Playground.loadCode(code, true);
}

// Expose globals for inline onclick
window.goToLesson = goToLesson;
window.loadAndRun = loadAndRun;
