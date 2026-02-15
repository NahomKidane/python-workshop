/* ==========================================================================
   renderers/sandbox.js — Full-screen sandbox mode
   Depends on: state.js, mascot.js, playground.js
   ========================================================================== */

import { MASCOT_IMG } from "../mascot.js";
import { Playground } from "../playground.js";

export function renderSandbox() {
  var panel = document.getElementById("contentPanel");
  panel.innerHTML =
    '<div class="sandbox-info">' +
    '<img class="mascot-img" src="' + MASCOT_IMG + '" alt="PyBuddy" style="width:60px">' +
    '<div>' +
    '<h2 class="sandbox-title">Python Sandbox</h2>' +
    '<p class="sandbox-desc">Full-screen playground — write, run, and experiment freely.</p>' +
    '</div>' +
    '</div>' +
    '<div class="sandbox-tips">' +
    '<strong>Quick tips:</strong> ' +
    'Ctrl+Enter runs code. ' +
    'Drag the divider left to make the editor wider. ' +
    'Try loops, functions, dictionaries — everything from the lessons works here!' +
    '</div>';
}

export function enterSandboxMode() {
  document.getElementById("mainLayout").classList.add("sandbox-mode");
  Playground.refresh();
}

export function exitSandboxMode() {
  document.getElementById("mainLayout").classList.remove("sandbox-mode");
  Playground.refresh();
}

// Expose globals for onclick in HTML (or used by app.js logic)
// These rely on CSS classes, so app.js might control them, but if they are called otherwise:
// Actually app.js calls them directly. We don't have inline onclicks for these.
// BUT `app.js` needs to import them.

