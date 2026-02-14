/* ==========================================================================
   app.js — Entry point (loads last, wires everything together)
   Depends on: All other modules
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  // 1. Restore saved progress
  loadProgress();

  // 2. Initialize Python engine
  initEngine();

  // 3. Initialize playground
  Playground.init();

  // 4. Bind tab buttons
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      switchTab(this.dataset.tab);
    });
  });

  // 5. Bind reset button
  const resetBtn = document.getElementById("btnReset");
  if (resetBtn) {
    resetBtn.addEventListener("click", resetProgress);
  }

  // 6. Render initial tab
  renderCurrentTab();
});

/* ---------------------------------------------------------------------------
   Tab switching
   --------------------------------------------------------------------------- */

function switchTab(tabName) {
  AppState.currentTab = tabName;

  // Update active button styling
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tabName);
  });

  // Clear active challenge when leaving challenges tab
  if (tabName !== "challenges") {
    AppState.activeChallenge = null;
  }

  renderCurrentTab();

  // Scroll content panel to top
  document.getElementById("contentPanel").scrollTop = 0;
}

/* ---------------------------------------------------------------------------
   Render dispatcher
   --------------------------------------------------------------------------- */

function renderCurrentTab() {
  switch (AppState.currentTab) {
    case "learn":       renderLearn(); break;
    case "challenges":  renderChallenges(); break;
    case "reference":   renderReference(); break;
    case "cheatsheet":  renderCheatSheet(); break;
  }
}
