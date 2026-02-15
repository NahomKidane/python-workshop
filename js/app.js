/* ==========================================================================
   app.js — Entry point (loads last, wires everything together)
   Depends on: All other modules
   ========================================================================== */

import { AppState, loadProgress, saveProgress, resetProgress } from "./state.js";
import { initEngine } from "./engine.js";
import { Playground } from "./playground.js";
import { renderLearn } from "./renderers/learn.js";
import { renderChallenges } from "./renderers/challenges.js";
import { renderReference } from "./renderers/reference.js";
import { renderCheatSheet } from "./renderers/cheatsheet.js";
import { renderSandbox, enterSandboxMode, exitSandboxMode } from "./renderers/sandbox.js";

document.addEventListener("DOMContentLoaded", function () {
  // 1. Restore saved progress
  loadProgress();

  // 2. Initialize Python engine
  initEngine();

  // 3. Initialize playground (CodeMirror)
  Playground.init();

  // 4. Bind tab buttons
  document.querySelectorAll(".tab-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      switchTab(this.dataset.tab);
    });
  });

  // 5. Bind reset button
  var resetBtn = document.getElementById("btnReset");
  if (resetBtn) resetBtn.addEventListener("click", resetProgress); // resetProgress needs import? yes from state.js

  // 6. Theme toggle
  document.getElementById("themeToggle").addEventListener("click", toggleTheme);

  // 7. Font size slider
  var slider = document.getElementById("fontSlider");
  slider.value = AppState.fontSize;
  slider.addEventListener("input", function () {
    setFontSize(parseInt(this.value));
  });

  // 8. Resize handle
  initResizeHandle();

  // 9. Apply saved preferences
  applyTheme(AppState.theme);
  setFontSize(AppState.fontSize);

  // 10. Render initial tab
  renderCurrentTab();
});

/* ---------------------------------------------------------------------------
   Tab switching
   --------------------------------------------------------------------------- */

function switchTab(tabName) {
  // Exit sandbox mode when leaving it
  if (AppState.currentTab === "sandbox" && tabName !== "sandbox") {
    exitSandboxMode();
  }

  AppState.currentTab = tabName;

  // Update active button styling
  document.querySelectorAll(".tab-btn").forEach(function (btn) {
    btn.classList.toggle("active", btn.dataset.tab === tabName);
  });

  // Clear active challenge when leaving challenges tab
  if (tabName !== "challenges") {
    AppState.activeChallenge = null;
  }

  // Adjust Grid Layout based on tab
  const main = document.getElementById("mainLayout");
  if (tabName === "sandbox") {
    // Sandbox: Content 20%, Playground 80% (rest)
    main.style.gridTemplateColumns = "20% 6px 1fr";
  } else {
    // Others: Content 50%, Playground 50%
    main.style.gridTemplateColumns = "50% 6px 1fr";
  }

  renderCurrentTab();

  // Enter sandbox mode
  if (tabName === "sandbox") enterSandboxMode();

  // Scroll content panel to top
  document.getElementById("contentPanel").scrollTop = 0;
  Playground.refresh();
}

/* ---------------------------------------------------------------------------
   Render dispatcher
   --------------------------------------------------------------------------- */

function renderCurrentTab() {
  switch (AppState.currentTab) {
    case "learn": renderLearn(); break;
    case "challenges": renderChallenges(); break;
    case "reference": renderReference(); break;
    case "cheatsheet": renderCheatSheet(); break;
    case "sandbox": renderSandbox(); break;
  }
}

/* ---------------------------------------------------------------------------
   Theme toggle
   --------------------------------------------------------------------------- */

function toggleTheme() {
  var next = AppState.theme === "dark" ? "light" : "dark";
  AppState.theme = next;
  applyTheme(next);
  saveProgress();
}

function applyTheme(theme) {
  document.body.classList.toggle("light-theme", theme === "light");
  document.getElementById("themeIcon").textContent = theme === "dark" ? "☀️" : "🌙";
}

/* ---------------------------------------------------------------------------
   Font size
   --------------------------------------------------------------------------- */

function setFontSize(px) {
  AppState.fontSize = px;
  document.documentElement.style.setProperty("--font-size-base", px + "px");
  var pct = Math.round((px / 15) * 100);
  document.getElementById("fontValue").textContent = pct + "%";
  document.getElementById("fontSlider").value = px;
  if (Playground.editor) Playground.editor.refresh();
  saveProgress();
}

/* ---------------------------------------------------------------------------
   Resize handle — drag to resize content/playground panels
   --------------------------------------------------------------------------- */

function initResizeHandle() {
  var handle = document.getElementById("resizeHandle");
  var main = document.getElementById("mainLayout");
  var isDragging = false;

  handle.addEventListener("mousedown", startDrag);
  handle.addEventListener("touchstart", startDrag, { passive: false });

  function startDrag(e) {
    e.preventDefault();
    isDragging = true;
    document.body.classList.add("resizing");

    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
    document.addEventListener("touchmove", onDrag, { passive: false });
    document.addEventListener("touchend", stopDrag);
  }

  function onDrag(e) {
    if (!isDragging) return;
    e.preventDefault();
    var clientX = e.touches ? e.touches[0].clientX : e.clientX;
    var mainRect = main.getBoundingClientRect();
    var pct = ((clientX - mainRect.left) / mainRect.width) * 100;

    // Clamp between 20% and 80%
    pct = Math.max(20, Math.min(80, pct));
    main.style.gridTemplateColumns = pct + "% 6px 1fr";
    Playground.refresh();
  }

  function stopDrag() {
    isDragging = false;
    document.body.classList.remove("resizing");
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
    document.removeEventListener("touchmove", onDrag);
    document.removeEventListener("touchend", stopDrag);
    Playground.refresh();
  }
}
