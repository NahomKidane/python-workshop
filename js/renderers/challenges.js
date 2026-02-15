/* ==========================================================================
   renderers/challenges.js — Challenges tab renderer
   Depends on: state.js, utils.js, mascot.js, playground.js, data/challenges.js
   ========================================================================== */

import { AppState, saveProgress } from "../state.js";
import { CHALLENGES } from "../data/challenges.js";
import { highlightPython, escapeHtml } from "../utils.js";
import { MASCOT_IMG, pickMascot } from "../mascot.js";
import { Playground } from "../playground.js";

/* ---------------------------------------------------------------------------
   Tier config
   --------------------------------------------------------------------------- */
const TIER_META = {
  predict: { icon: "🎯", label: "Predict", color: "var(--accent)" },
  fix: { icon: "🔧", label: "Fix", color: "var(--teal)" },
  write: { icon: "✍️", label: "Write", color: "var(--green)" },
  bridge: { icon: "🧬", label: "NLP Bridge", color: "var(--berry)" },
};

/* ---------------------------------------------------------------------------
   Main render — list view or active challenge
   --------------------------------------------------------------------------- */

export function renderChallenges() {
  const panel = document.getElementById("contentPanel");

  if (AppState.activeChallenge !== null) {
    renderActiveChallenge(panel);
    return;
  }

  const totalCompleted = CHALLENGES.filter(c => AppState.completedChallenges.has(c.id)).length;
  const pct = Math.round((totalCompleted / CHALLENGES.length) * 100);

  // Coach message based on progress
  let coachMsg = "Ready to test your Python skills? Pick a challenge and let's go!";
  if (totalCompleted === CHALLENGES.length) coachMsg = pickMascot("challengeDone");
  else if (totalCompleted >= Math.ceil(CHALLENGES.length / 2)) coachMsg = pickMascot("challengeHalf");
  else if (totalCompleted > 1) coachMsg = pickMascot("challengeMid");
  else if (totalCompleted === 1) coachMsg = pickMascot("challengeFirst");

  // Filter by tier
  const filtered = AppState.activeTier === "all"
    ? CHALLENGES
    : CHALLENGES.filter(c => c.tier === AppState.activeTier);

  let html = "";

  /* ── Coach strip ───────────────────────────────────────────────── */
  html += `
    <div class="coach-strip">
      <img class="mascot-img" src="${MASCOT_IMG}" alt="PyBuddy">
      <div class="coach-msg">${coachMsg}</div>
    </div>`;

  /* ── Progress bar ──────────────────────────────────────────────── */
  html += `
    <div class="challenge-progress">
      <div class="progress-bar-bg">
        <div class="progress-bar-fill" style="width:${pct}%"></div>
      </div>
      <span class="progress-label">${totalCompleted} of ${CHALLENGES.length} completed</span>
    </div>`;

  /* ── Tier filter ───────────────────────────────────────────────── */
  html += `<div class="tier-filter">`;
  const tiers = [
    { key: "all", label: "All" },
    { key: "predict", label: "🎯 Predict" },
    { key: "fix", label: "🔧 Fix" },
    { key: "write", label: "✍️ Write" },
    { key: "bridge", label: "🧬 NLP Bridge" },
  ];
  for (const t of tiers) {
    const active = AppState.activeTier === t.key ? "active" : "";
    html += `<button class="tier-btn ${active}" onclick="setTier('${t.key}')">${t.label}</button>`;
  }
  html += `</div>`;

  /* ── Challenge cards ───────────────────────────────────────────── */
  html += `<div class="challenge-list">`;
  for (const ch of filtered) {
    const meta = TIER_META[ch.tier];
    const done = AppState.completedChallenges.has(ch.id);
    html += `
      <button class="challenge-card ${done ? "completed" : ""}" onclick="openChallenge('${ch.id}')">
        <span class="challenge-tier-icon" style="color:${meta.color}">${meta.icon}</span>
        <div class="challenge-info">
          <span class="challenge-title">${ch.title}</span>
          <span class="challenge-topic">${ch.topic}</span>
        </div>
        ${done ? '<span class="challenge-check">✓</span>' : ""}
      </button>`;
  }
  html += `</div>`;

  panel.innerHTML = html;
}

/* ---------------------------------------------------------------------------
   Active challenge view
   --------------------------------------------------------------------------- */

function renderActiveChallenge(panel) {
  const ch = CHALLENGES.find(c => c.id === AppState.activeChallenge);
  if (!ch) { AppState.activeChallenge = null; renderChallenges(); return; }

  const meta = TIER_META[ch.tier];

  let html = `
    <button class="back-btn" onclick="closeChallenge()">← Back to challenges</button>
    <div class="active-challenge">
      <span class="active-tier" style="background:${meta.color}">${meta.icon} ${meta.label}</span>
      <h3 class="active-title">${ch.title}</h3>`;

  // Question text (for fix/write/bridge)
  if (ch.question) {
    html += `<p class="active-question">${ch.question}</p>`;
  }

  // Code block (for predict/fix)
  if (ch.code) {
    html += `
      <div class="code-block">
        <div class="code-header">
          <span>Python</span>
          <button class="code-run-btn" onclick="loadAndRun(\`${ch.code.replace(/`/g, "\\`")}\`)">Run ▶</button>
        </div>
        <pre class="code-content">${highlightPython(ch.code)}</pre>
      </div>`;
  }

  // Answer input (predict/fix tiers)
  if (ch.tier === "predict" || ch.tier === "fix") {
    html += `
      <div class="answer-section">
        <label class="answer-label">Your answer:</label>
        <input type="text" class="answer-input" id="challengeAnswer" placeholder="Type your answer…"
          onkeydown="if(event.key==='Enter')checkAnswer()">
        <button class="check-btn" onclick="checkAnswer()">Check</button>
        <div id="answerResult"></div>
      </div>`;
  }

  // Starter code + expected output (write/bridge tiers)
  if (ch.starterCode) {
    html += `
      <button class="starter-btn" onclick="loadChallengeCode()">Load starter code in Playground →</button>`;
  }
  if (ch.expectedOutput) {
    html += `
      <div class="expected-output">
        <span class="expected-label">Expected output:</span>
        <pre>${escapeHtml(ch.expectedOutput)}</pre>
      </div>`;
  }

  // Hint
  if (ch.hint) {
    html += `
      <button class="hint-btn" onclick="showChallengeHint()">Show Hint</button>
      <div id="challengeHint" class="callout callout-try" style="display:none">
        <span class="callout-label">💡 Hint</span>
        <span class="callout-text">${ch.hint}</span>
      </div>`;
  }

  html += `</div>`;
  panel.innerHTML = html;
}

/* ---------------------------------------------------------------------------
   Challenge actions (global — called from onclick)
   --------------------------------------------------------------------------- */

function setTier(tier) {
  AppState.activeTier = tier;
  renderChallenges();
}

function openChallenge(id) {
  AppState.activeChallenge = id;
  renderChallenges();
  document.getElementById("contentPanel").scrollTop = 0;
}

function closeChallenge() {
  AppState.activeChallenge = null;
  renderChallenges();
}

function checkAnswer() {
  const ch = CHALLENGES.find(c => c.id === AppState.activeChallenge);
  if (!ch) return;

  const input = document.getElementById("challengeAnswer");
  const result = document.getElementById("answerResult");
  const answer = input.value.trim();

  if (!answer) return;

  const correct = ch.answers.some(
    a => a.trim().toLowerCase() === answer.toLowerCase()
  );

  if (correct) {
    result.innerHTML = `<span class="result-correct">✓ Correct!</span>`;
    AppState.completedChallenges.add(ch.id);
    saveProgress();
  } else {
    result.innerHTML = `<span class="result-wrong">✗ Not quite — try again or use the hint.</span>`;
  }
}

function loadChallengeCode() {
  const ch = CHALLENGES.find(c => c.id === AppState.activeChallenge);
  if (ch && ch.starterCode) {
    Playground.loadCode(ch.starterCode, false);
  }
}

function showChallengeHint() {
  const el = document.getElementById("challengeHint");
  if (el) el.style.display = "block";
}

// Expose globals for inline onclick
window.setTier = setTier;
window.openChallenge = openChallenge;
window.closeChallenge = closeChallenge;
window.checkAnswer = checkAnswer;
window.loadChallengeCode = loadChallengeCode;
window.showChallengeHint = showChallengeHint;
// loadAndRun is also needed for the code blocks in challenges
window.loadAndRun = (code) => Playground.loadCode(code, true);
