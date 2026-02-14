/* ==========================================================================
   mascot.js — PyBuddy mascot system (no dependencies)
   ========================================================================== */

const MASCOT_IMG = "img/mascot.png";

/* ---------------------------------------------------------------------------
   Message pools — random selection gives variety across runs
   --------------------------------------------------------------------------- */
const MASCOT_MESSAGES = {

  // Playground states
  idle: [
    "Write some Python and hit Run — I'll keep an eye on things.",
    "Type some code above and let's see what happens!",
    "Ready when you are — try typing <code>print(\"hello\")</code> to start.",
  ],
  success: [
    "Clean run! Try tweaking a value and running again.",
    "No errors — nice work! What happens if you change something?",
    "Looks good! Experiment by modifying the code.",
    "That ran perfectly. Want to try something different?",
  ],
  noOutput: [
    "The code ran fine, but I didn't see any output… did you forget <code>print()</code>?",
    "Hmm, no output appeared. Remember: Python only shows results if you use <code>print()</code>.",
    "Silent run! Add a <code>print()</code> statement to see results.",
  ],

  // Error-specific messages
  nameError: [
    "Ruff! That name doesn't exist. Check your spelling — Python is case-sensitive!",
    "Can't find that variable. Did you define it first? Capitalization matters!",
    "NameError usually means a typo. Double-check upper vs. lowercase.",
  ],
  typeError: [
    "You're mixing types! Try using <code>str()</code> or <code>int()</code> to convert.",
    "Python won't mix text and numbers on its own — you need to convert first.",
    "Type mismatch! Remember: <code>\"5\" + 3</code> won't work, but <code>int(\"5\") + 3</code> will.",
  ],
  syntaxError: [
    "Something looks off — missing a colon, quote, or parenthesis maybe?",
    "Python can't read that line. Check for missing <code>:</code> or unmatched quotes.",
    "Syntax issue! Look at the line number — usually a small typo.",
  ],
  indentError: [
    "Indentation matters in Python! Lines inside <code>for</code>/<code>if</code> need 4 spaces.",
    "Python uses spaces to know what's inside a block. Indent with 4 spaces.",
    "Check your spacing — everything inside a loop or if-statement needs to be indented.",
  ],
  indexError: [
    "That index is out of range! Remember: lists start counting at 0.",
    "Off by one? The last valid index is <code>len(list) - 1</code>.",
    "IndexError — you're reaching past the end of the list.",
  ],
  keyError: [
    "That key doesn't exist in the dictionary. Check your spelling!",
    "KeyError means the dictionary doesn't have that key. Use <code>.get()</code> to be safe.",
  ],
  timeout: [
    "Whoa, that ran too long! Got an infinite loop? Check your <code>while</code> condition.",
    "I had to stop your code — it ran over 5 seconds. Probably an infinite loop!",
  ],
  genericError: [
    "Something went wrong — read the error message, it usually tells you exactly what.",
    "Error! The message below has clues. Read it carefully.",
  ],

  // Challenge coach
  challengeFirst: [
    "First one down! The hardest part was starting.",
  ],
  challengeMid: [
    "You're building real skills — keep going!",
    "Solid progress! Each one makes the next easier.",
  ],
  challengeHalf: [
    "Halfway there! You're getting the hang of this.",
  ],
  challengeDone: [
    "You crushed it! You're ready for the guided lab.",
  ],
};

/* ---------------------------------------------------------------------------
   Helpers
   --------------------------------------------------------------------------- */

/**
 * Pick a random message from a category pool.
 */
function pickMascot(category) {
  const pool = MASCOT_MESSAGES[category] || MASCOT_MESSAGES.genericError;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Generate HTML for the mascot speech-bubble strip (playground/challenges).
 */
function mascotHtml(message, extraClass) {
  return (
    `<div class="mascot-strip ${extraClass || ""}">` +
    `<img class="mascot-img" src="${MASCOT_IMG}" alt="PyBuddy">` +
    `<div class="mascot-bubble">${message}</div></div>`
  );
}

/**
 * Determine which message category fits a Skulpt error string.
 */
function errorToMascotCategory(errorText) {
  if (errorText.includes("NameError")) return "nameError";
  if (errorText.includes("TypeError")) return "typeError";
  if (errorText.includes("IndentationError")) return "indentError";
  if (errorText.includes("SyntaxError")) return "syntaxError";
  if (errorText.includes("IndexError")) return "indexError";
  if (errorText.includes("KeyError")) return "keyError";
  if (errorText.includes("TimeLimitError") || errorText.includes("ExecLimit")) return "timeout";
  return "genericError";
}
