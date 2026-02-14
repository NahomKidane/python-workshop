/* ==========================================================================
   utils.js — Shared helper functions (no dependencies)
   ========================================================================== */

/**
 * Escape HTML entities to prevent XSS in dynamic content.
 */
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Syntax-highlight Python code for lesson code blocks.
 * Applied to rendered HTML only — NOT the playground editor.
 */
function highlightPython(code) {
  let html = escapeHtml(code);

  // Comments (must be first to avoid partial matches)
  html = html.replace(/(#.*)$/gm, '<span style="color:var(--syn-comment)">$1</span>');

  // Strings (triple-quoted, double, single)
  html = html.replace(
    /("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g,
    '<span style="color:var(--syn-string)">$1</span>'
  );

  // Keywords
  const keywords = [
    "def", "return", "if", "elif", "else", "for", "while", "in",
    "import", "from", "class", "try", "except", "finally", "with",
    "as", "and", "or", "not", "is", "lambda", "yield", "break",
    "continue", "pass", "raise", "global", "del"
  ];
  const kwPattern = new RegExp("\\b(" + keywords.join("|") + ")\\b", "g");
  html = html.replace(kwPattern, '<span style="color:var(--syn-keyword)">$1</span>');

  // Booleans & None
  html = html.replace(/\b(True|False|None)\b/g, '<span style="color:var(--syn-number)">$1</span>');

  // Built-in functions (only when followed by open paren)
  const builtins = [
    "print", "len", "range", "type", "int", "str", "float", "bool",
    "list", "dict", "input", "sorted", "enumerate", "zip", "min",
    "max", "sum", "abs"
  ];
  const biPattern = new RegExp("\\b(" + builtins.join("|") + ")(?=\\()", "g");
  html = html.replace(biPattern, '<span style="color:var(--syn-builtin)">$1</span>');

  // Numbers
  html = html.replace(/\b(\d+\.?\d*)\b/g, '<span style="color:var(--syn-number)">$1</span>');

  return html;
}
