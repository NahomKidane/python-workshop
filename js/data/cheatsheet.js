/* ==========================================================================
   data/cheatsheet.js — Cheat Sheet tab content (pure data, no logic)
   ========================================================================== */

const CHEATSHEET = [
  {
    icon: "📦",
    title: "Variables & Types",
    rows: [
      { code: `name = "Enron"`, desc: "Assign a string" },
      { code: `count = 42`, desc: "Assign an integer" },
      { code: `rate = 3.14`, desc: "Assign a float" },
      { code: `flag = True`, desc: "Assign a boolean" },
      { code: `type(name)`, desc: "Check type → <class 'str'>" },
      { code: `int("5")`, desc: "Convert string to integer" },
      { code: `str(42)`, desc: "Convert integer to string" },
    ]
  },
  {
    icon: "✂️",
    title: "Strings",
    rows: [
      { code: `text.strip()`, desc: "Remove whitespace edges" },
      { code: `text.lower()`, desc: "All lowercase" },
      { code: `text.split()`, desc: "Split into word list" },
      { code: `text.replace("a","b")`, desc: "Swap a for b" },
      { code: `text[0]`, desc: "First character" },
      { code: `len(text)`, desc: "Number of characters" },
      { code: `"x" in text`, desc: "Check if x is in text" },
    ]
  },
  {
    icon: "📋",
    title: "Lists",
    rows: [
      { code: `lst = [1, 2, 3]`, desc: "Create a list" },
      { code: `lst[0]`, desc: "First item" },
      { code: `lst[-1]`, desc: "Last item" },
      { code: `lst.append(4)`, desc: "Add to end" },
      { code: `len(lst)`, desc: "Count items" },
      { code: `x in lst`, desc: "Check membership" },
    ]
  },
  {
    icon: "🔄",
    title: "Control Flow",
    rows: [
      { code: `if x > 0:`, desc: "If condition" },
      { code: `elif x < 0:`, desc: "Else-if" },
      { code: `else:`, desc: "Otherwise" },
      { code: `for x in list:`, desc: "Loop through items" },
      { code: `for i in range(n):`, desc: "Loop n times" },
      { code: `while x > 0:`, desc: "Loop while true" },
    ]
  },
  {
    icon: "⚙️",
    title: "Functions",
    rows: [
      { code: `def greet(name):`, desc: "Define a function" },
      { code: `return value`, desc: "Send back a result" },
      { code: `greet("AI 102")`, desc: "Call the function" },
      { code: `def f(x, n=10):`, desc: "Default parameter" },
    ]
  },
  {
    icon: "📖",
    title: "Dictionaries & F-Strings",
    rows: [
      { code: `d = {"key": "val"}`, desc: "Create a dict" },
      { code: `d["key"]`, desc: "Get value" },
      { code: `d["new"] = 1`, desc: "Add/update key" },
      { code: `for k, v in d.items():`, desc: "Loop key-value" },
      { code: `f"Hello {name}"`, desc: "F-string" },
      { code: `f"{score:.2f}"`, desc: "Format 2 decimals" },
      { code: `f"{score:.1%}"`, desc: "Format as percent" },
    ]
  },
];
