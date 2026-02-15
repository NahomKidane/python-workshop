/* ==========================================================================
   playground.js — CodeMirror editor + output rendering
   Depends on: engine.js, mascot.js, utils.js, state.js
   ========================================================================== */

const Playground = {

  editor: null,        // CodeMirror instance
  outputArea: null,

  /* ───────────────────────────────────────────────────────────────── */
  init() {
    this.outputArea = document.getElementById("outputArea");
    var wrapper = document.getElementById("editorWrapper");

    // Create CodeMirror editor
    this.editor = CodeMirror(wrapper, {
      value: "",
      mode: "python",
      theme: "pyworkshop",
      lineNumbers: true,
      indentUnit: 4,
      tabSize: 4,
      indentWithTabs: false,
      lineWrapping: true,
      matchBrackets: true,
      placeholder: "Type Python code here…",
      extraKeys: {
        "Tab": function(cm) {
          cm.replaceSelection("    ", "end");
        },
        "Ctrl-Enter": function() { Playground.run(); },
        "Cmd-Enter": function() { Playground.run(); },
      }
    });

    // Buttons
    document.getElementById("btnRun").addEventListener("click", function() { Playground.run(); });
    document.getElementById("btnClear").addEventListener("click", function() { Playground.clear(); });

    this.showIdle();
  },

  /* ── Actions ──────────────────────────────────────────────────── */
  run() {
    runCode(this.editor.getValue());
  },

  clear() {
    this.editor.setValue("");
    this.showIdle();
  },

  loadCode(code, autoRun) {
    this.editor.setValue(code);
    this.editor.setCursor(this.editor.lineCount(), 0);
    if (autoRun) this.run();
  },

  /* ── Output states ────────────────────────────────────────────── */
  showIdle() {
    this.outputArea.className = "output-area";
    this.outputArea.innerHTML =
      '<div class="playground-idle">' +
      '<img class="mascot-img" src="' + MASCOT_IMG + '" alt="PyBuddy">' +
      '<div class="idle-text">' + pickMascot("idle") + '</div></div>';
  },

  showSuccess(text) {
    var lines = text.split("\n");
    var display = text;
    var truncated = false;
    if (lines.length > OUTPUT_LINE_CAP) {
      display = lines.slice(0, OUTPUT_LINE_CAP).join("\n");
      truncated = true;
    }
    this.outputArea.className = "output-area output-success";
    this.outputArea.textContent = display;
    if (truncated) {
      var notice = document.createElement("div");
      notice.className = "output-truncated";
      notice.textContent = "… output truncated (" + lines.length + " lines, showing first " + OUTPUT_LINE_CAP + ")";
      this.outputArea.appendChild(notice);
    }
    var strip = document.createElement("div");
    strip.innerHTML = mascotHtml(pickMascot("success"));
    this.outputArea.appendChild(strip.firstElementChild);
    var img = this.outputArea.querySelector(".mascot-img");
    if (img) { img.classList.add("wiggle"); setTimeout(function(){ img.classList.remove("wiggle"); }, 600); }
  },

  showNoOutput() {
    this.outputArea.className = "output-area";
    this.outputArea.innerHTML = mascotHtml(pickMascot("noOutput"));
  },

  showError(errorText) {
    var category = errorToMascotCategory(errorText);
    this.outputArea.className = "output-area";
    this.outputArea.innerHTML =
      '<span class="output-error">' + escapeHtml(errorText) + '</span>' +
      mascotHtml(pickMascot(category));
  },

  showPlaceholder(message) {
    this.outputArea.className = "output-area";
    this.outputArea.innerHTML = mascotHtml(message);
  },

  /** Refresh CodeMirror after layout changes */
  refresh() {
    if (this.editor) {
      setTimeout(function() { Playground.editor.refresh(); }, 10);
    }
  }
};
