/* ==========================================================================
   playground.js — Editor UI + output rendering
   Depends on: engine.js, mascot.js, utils.js, state.js
   ========================================================================== */

const Playground = {

  /* -----------------------------------------------------------------------
     DOM refs (set once in init)
     ----------------------------------------------------------------------- */
  editor: null,
  outputArea: null,
  btnRun: null,
  btnClear: null,

  /* -----------------------------------------------------------------------
     Initialize — bind events
     ----------------------------------------------------------------------- */
  init() {
    this.editor = document.getElementById("codeEditor");
    this.outputArea = document.getElementById("outputArea");
    this.btnRun = document.getElementById("btnRun");
    this.btnClear = document.getElementById("btnClear");

    // Run button
    this.btnRun.addEventListener("click", () => this.run());

    // Clear button
    this.btnClear.addEventListener("click", () => this.clear());

    // Tab key inserts 4 spaces instead of moving focus
    this.editor.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const start = this.editor.selectionStart;
        const end = this.editor.selectionEnd;
        this.editor.value =
          this.editor.value.substring(0, start) +
          "    " +
          this.editor.value.substring(end);
        this.editor.selectionStart = this.editor.selectionEnd = start + 4;
      }
      // Ctrl+Enter runs code
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        this.run();
      }
    });

    // Show idle state
    this.showIdle();
  },

  /* -----------------------------------------------------------------------
     Actions
     ----------------------------------------------------------------------- */
  run() {
    const code = this.editor.value;
    runCode(code);
  },

  clear() {
    this.editor.value = "";
    this.showIdle();
  },

  /**
   * Load code into editor and optionally run it.
   */
  loadCode(code, autoRun = false) {
    this.editor.value = code;
    this.editor.scrollTop = 0;
    if (autoRun) this.run();
  },

  /* -----------------------------------------------------------------------
     Output states
     ----------------------------------------------------------------------- */

  showIdle() {
    this.outputArea.className = "output-area";
    this.outputArea.innerHTML =
      `<div class="playground-idle">` +
      `<img class="mascot-img" src="${MASCOT_IMG}" alt="PyBuddy">` +
      `<div class="idle-text">${pickMascot("idle")}</div>` +
      `</div>`;
  },

  showSuccess(text) {
    const lines = text.split("\n");
    let display = text;
    let truncated = false;

    if (lines.length > OUTPUT_LINE_CAP) {
      display = lines.slice(0, OUTPUT_LINE_CAP).join("\n");
      truncated = true;
    }

    this.outputArea.className = "output-area output-success";
    this.outputArea.textContent = display;

    if (truncated) {
      const notice = document.createElement("div");
      notice.className = "output-truncated";
      notice.textContent = `… output truncated (${lines.length} lines, showing first ${OUTPUT_LINE_CAP})`;
      this.outputArea.appendChild(notice);
    }

    // Mascot celebration
    const strip = document.createElement("div");
    strip.innerHTML = mascotHtml(pickMascot("success"));
    this.outputArea.appendChild(strip.firstElementChild);

    // Wiggle animation
    const img = this.outputArea.querySelector(".mascot-img");
    if (img) {
      img.classList.add("wiggle");
      setTimeout(() => img.classList.remove("wiggle"), 600);
    }
  },

  showNoOutput() {
    this.outputArea.className = "output-area";
    this.outputArea.innerHTML = mascotHtml(pickMascot("noOutput"));
  },

  showError(errorText) {
    const category = errorToMascotCategory(errorText);
    this.outputArea.className = "output-area";
    this.outputArea.innerHTML =
      `<span class="output-error">${escapeHtml(errorText)}</span>` +
      mascotHtml(pickMascot(category));
  },

  showPlaceholder(message) {
    this.outputArea.className = "output-area";
    this.outputArea.innerHTML = mascotHtml(message);
  },
};
