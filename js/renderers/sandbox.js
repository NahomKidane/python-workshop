/* ==========================================================================
   renderers/sandbox.js — Full-screen sandbox mode
   Depends on: state.js, mascot.js, playground.js
   ========================================================================== */

function renderSandbox() {
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

function enterSandboxMode() {
  document.getElementById("mainLayout").classList.add("sandbox-mode");
  Playground.refresh();
}

function exitSandboxMode() {
  document.getElementById("mainLayout").classList.remove("sandbox-mode");
  Playground.refresh();
}
