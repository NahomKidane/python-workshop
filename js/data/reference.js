/* ==========================================================================
   data/reference.js — Reference tab content (pure data, no logic)
   ========================================================================== */

export const REFERENCE = [
  {
    icon: "📦",
    title: "Data Types",
    items: [
      { code: `"hello"`, desc: "String (text)" },
      { code: `42`, desc: "Integer (whole number)" },
      { code: `3.14`, desc: "Float (decimal)" },
      { code: `True / False`, desc: "Boolean" },
      { code: `[1, 2, 3]`, desc: "List (ordered collection)" },
      { code: `{"k": "v"}`, desc: "Dictionary (key-value pairs)" },
      { code: `type(x)`, desc: "Check the type of x" },
    ]
  },
  {
    icon: "✂️",
    title: "String Methods",
    items: [
      { code: `.strip()`, desc: "Remove leading/trailing whitespace" },
      { code: `.lower()`, desc: "Convert to lowercase" },
      { code: `.upper()`, desc: "Convert to uppercase" },
      { code: `.split()`, desc: "Split into list of words" },
      { code: `.replace(a, b)`, desc: "Replace a with b" },
      { code: `.startswith(s)`, desc: "True if starts with s" },
      { code: `.endswith(s)`, desc: "True if ends with s" },
      { code: `.count(s)`, desc: "Count occurrences of s" },
      { code: `len(s)`, desc: "Length of string" },
    ]
  },
  {
    icon: "📋",
    title: "List Operations",
    items: [
      { code: `lst[0]`, desc: "First item (index 0)" },
      { code: `lst[-1]`, desc: "Last item" },
      { code: `lst.append(x)`, desc: "Add x to end" },
      { code: `lst.remove(x)`, desc: "Remove first x" },
      { code: `len(lst)`, desc: "Number of items" },
      { code: `x in lst`, desc: "True if x is in list" },
      { code: `sorted(lst)`, desc: "Return sorted copy" },
      { code: `lst[1:3]`, desc: "Slice: items at index 1, 2" },
    ]
  },
  {
    icon: "📖",
    title: "Dictionary Operations",
    items: [
      { code: `d["key"]`, desc: "Get value by key" },
      { code: `d["key"] = val`, desc: "Set/update a key" },
      { code: `d.get("key", default)`, desc: "Get with fallback" },
      { code: `d.keys()`, desc: "All keys" },
      { code: `d.values()`, desc: "All values" },
      { code: `d.items()`, desc: "All key-value pairs" },
      { code: `"key" in d`, desc: "True if key exists" },
    ]
  },
  {
    icon: "⚖️",
    title: "Comparison Operators",
    items: [
      { code: `==`, desc: "Equal to" },
      { code: `!=`, desc: "Not equal to" },
      { code: `>  <`, desc: "Greater / less than" },
      { code: `>=  <=`, desc: "Greater/less or equal" },
      { code: `and`, desc: "Both conditions true" },
      { code: `or`, desc: "Either condition true" },
      { code: `not`, desc: "Invert a boolean" },
    ]
  },
  {
    icon: "🧰",
    title: "Useful Built-ins",
    items: [
      { code: `print(x)`, desc: "Display output" },
      { code: `len(x)`, desc: "Length of collection" },
      { code: `range(n)`, desc: "Numbers 0 to n-1" },
      { code: `int(x)`, desc: "Convert to integer" },
      { code: `str(x)`, desc: "Convert to string" },
      { code: `float(x)`, desc: "Convert to float" },
      { code: `input(prompt)`, desc: "Read user input" },
    ]
  },
];
