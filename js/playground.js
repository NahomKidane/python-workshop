/* ==========================================================================
   playground.js — CodeMirror editor + output rendering
   Depends on: engine.js, mascot.js, utils.js, state.js
   ========================================================================== */

import { runCode } from "./engine.js";
import { MASCOT_IMG, pickMascot, mascotHtml, errorToMascotCategory } from "./mascot.js";
import { escapeHtml } from "./utils.js";
import { OUTPUT_LINE_CAP } from "./state.js";

export const Playground = {

  editor: null,        // CodeMirror instance
  outputConsole: null,
  mascotArea: null,

  /* ───────────────────────────────────────────────────────────────── */
  init() {
    this.outputConsole = document.getElementById("outputConsole");
    this.mascotArea = document.getElementById("mascotArea");
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
        "Tab": function (cm) {
          cm.replaceSelection("    ", "end");
        },
        "Ctrl-Enter": function () { Playground.run(); },
        "Cmd-Enter": function () { Playground.run(); },
      }
    });

    // Buttons
    document.getElementById("btnRun").addEventListener("click", function () { Playground.run(); });
    document.getElementById("btnClear").addEventListener("click", function () { Playground.clear(); });

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
    this.outputConsole.className = "output-console";
    this.outputConsole.textContent = ""; // Clear text
    this.outputConsole.innerHTML = '<div style="color:var(--text-muted); font-style:italic; padding:20px; text-align:center;">Ready to run...</div>';

    this.mascotArea.innerHTML = mascotHtml(pickMascot("idle"));
    this._wiggleMascot();
  },

  showSuccess(text) {
    var lines = text.split("\n");
    var display = text;
    var truncated = false;
    if (lines.length > OUTPUT_LINE_CAP) {
      display = lines.slice(0, OUTPUT_LINE_CAP).join("\n");
      truncated = true;
    }
    this.outputConsole.className = "output-console output-success";
    this.outputConsole.textContent = display;
    if (truncated) {
      var notice = document.createElement("div");
      notice.className = "output-truncated";
      notice.textContent = "… output truncated (" + lines.length + " lines, showing first " + OUTPUT_LINE_CAP + ")";
      this.outputConsole.appendChild(notice);
    }

    this.mascotArea.innerHTML = mascotHtml(pickMascot("success"));
    this._wiggleMascot();
  },

  showNoOutput() {
    this.outputConsole.textContent = "";
    this.outputConsole.innerHTML = '<div style="color:var(--text-muted); font-style:italic;">(No output)</div>';
    this.mascotArea.innerHTML = mascotHtml(pickMascot("noOutput"));
    this._wiggleMascot();
  },

  showError(errorText) {
    var category = errorToMascotCategory(errorText);
    this.outputConsole.className = "output-console";
    // Show error in console too? Or just in mascot? Usually error text goes in console.
    this.outputConsole.innerHTML = '<span class="output-error">' + escapeHtml(errorText) + '</span>';

    this.mascotArea.innerHTML = mascotHtml(pickMascot(category));
    this._wiggleMascot();
  },

  showPlaceholder(message) {
    this.outputConsole.textContent = "";
    this.mascotArea.innerHTML = mascotHtml(message);
    this._wiggleMascot();
  },

  _wiggleMascot() {
    var img = this.mascotArea.querySelector(".mascot-img");
    if (img) {
      img.classList.remove("wiggle");
      void img.offsetWidth; // trigger reflow
      img.classList.add("wiggle");
    }
  },

  /** Refresh CodeMirror after layout changes */
  refresh() {
    if (this.editor) {
      setTimeout(function () { Playground.editor.refresh(); }, 10);
    }
  }
};
