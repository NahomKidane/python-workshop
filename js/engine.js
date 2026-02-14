/* ==========================================================================
   engine.js — Python execution engine
   Depends on: state.js, mascot.js (for error categories)
   ========================================================================== */

/**
 * Initialize Skulpt if available, otherwise fall back to basic mode.
 * Called once from app.js on DOMContentLoaded.
 */
function initEngine() {
  const badge = document.getElementById("engineBadge");

  if (typeof Sk !== "undefined") {
    try {
      Sk.configure({
        __future__: Sk.python3,
        output: function (text) {
          AppState.outputBuffer.push(text);
        },
        read: function (filename) {
          if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][filename] === undefined) {
            throw "File not found: '" + filename + "'";
          }
          return Sk.builtinFiles["files"][filename];
        },
        inputfun: function (prompt) {
          return window.prompt(prompt || "Input:");
        },
        inputfunTakesPrompt: true,
        execLimit: ENGINE_TIMEOUT,
        killableWhile: true,
        killableFor: true,
      });

      AppState.engineMode = "skulpt";
      AppState.engineReady = true;
      badge.textContent = "⚡ Python Ready";
      badge.className = "engine-badge ready";
    } catch (e) {
      setFallbackMode(badge);
    }
  } else {
    setFallbackMode(badge);
  }
}

function setFallbackMode(badge) {
  AppState.engineMode = "fallback";
  AppState.engineReady = true;
  badge.textContent = "⚠️ Basic Mode";
  badge.className = "engine-badge fallback";
}

/* ---------------------------------------------------------------------------
   Run dispatcher — routes to Skulpt or fallback
   --------------------------------------------------------------------------- */

async function runCode(code) {
  if (!code.trim()) {
    Playground.showIdle();
    return;
  }

  if (AppState.engineMode === "skulpt") {
    await runWithSkulpt(code);
  } else {
    runWithFallback(code);
  }
}

/* ---------------------------------------------------------------------------
   Skulpt execution
   --------------------------------------------------------------------------- */

async function runWithSkulpt(code) {
  AppState.outputBuffer = [];

  try {
    const promise = Sk.misceval.asyncToPromise(function () {
      return Sk.importMainWithBody("<stdin>", false, code, true);
    });
    await promise;

    const output = AppState.outputBuffer.join("");
    if (output.trim().length === 0) {
      Playground.showNoOutput();
    } else {
      Playground.showSuccess(output);
    }
  } catch (err) {
    const errorText = err.toString();
    Playground.showError(errorText);
  }
}

/* ---------------------------------------------------------------------------
   Fallback mini-simulator (handles basic print + assignment)
   --------------------------------------------------------------------------- */

function runWithFallback(code) {
  const lines = code.split("\n");
  const vars = {};
  const output = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    // Handle print()
    const printMatch = trimmed.match(/^print\((.+)\)$/);
    if (printMatch) {
      let arg = printMatch[1].trim();

      // String literal
      if ((arg.startsWith('"') && arg.endsWith('"')) || (arg.startsWith("'") && arg.endsWith("'"))) {
        output.push(arg.slice(1, -1));
      }
      // Variable reference
      else if (vars.hasOwnProperty(arg)) {
        output.push(String(vars[arg]));
      }
      // Expression (try eval)
      else {
        try {
          output.push(String(eval(arg)));
        } catch (e) {
          output.push(`[Cannot evaluate: ${arg}]`);
        }
      }
      continue;
    }

    // Handle assignment: x = value
    const assignMatch = trimmed.match(/^(\w+)\s*=\s*(.+)$/);
    if (assignMatch) {
      const name = assignMatch[1];
      let val = assignMatch[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        vars[name] = val.slice(1, -1);
      } else if (!isNaN(val)) {
        vars[name] = Number(val);
      } else {
        vars[name] = val;
      }
      continue;
    }
  }

  if (output.length === 0) {
    Playground.showNoOutput();
  } else {
    Playground.showSuccess(output.join("\n"));
  }
}
