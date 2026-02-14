/* ==========================================================================
   data/challenges.js — Challenge content array (pure data, no logic)
   ========================================================================== */

const CHALLENGES = [
  // ── Tier 1: Predict ─────────────────────────────────────────────────────
  {
    id: "p1", tier: "predict", topic: "Variables",
    title: "What gets printed?",
    code: `x = 10\nx = x + 5\nprint(x)`,
    answers: ["15"],
    hint: "Python runs line by line. After line 2, x has a new value."
  },
  {
    id: "p2", tier: "predict", topic: "Strings",
    title: "String indexing",
    code: `word = "Python"\nprint(word[0])`,
    answers: ["P"],
    hint: "Indexing starts at 0, so [0] is the first character."
  },
  {
    id: "p3", tier: "predict", topic: "Lists",
    title: "How long is it?",
    code: `items = ["a", "b", "c", "d"]\nprint(len(items))`,
    answers: ["4"],
    hint: "len() counts the number of items in the list."
  },
  {
    id: "p4", tier: "predict", topic: "Loops",
    title: "Loop accumulator",
    code: `total = 0\nfor n in [1, 2, 3]:\n    total = total + n\nprint(total)`,
    answers: ["6"],
    hint: "Trace it: 0+1=1, 1+2=3, 3+3=6."
  },
  {
    id: "p5", tier: "predict", topic: "Conditionals",
    title: "Which branch runs?",
    code: `score = 0.3\nif score > 0.5:\n    print("Positive")\nelif score < -0.5:\n    print("Negative")\nelse:\n    print("Neutral")`,
    answers: ["Neutral"],
    hint: "0.3 is not > 0.5, and not < -0.5, so the else branch runs."
  },

  // ── Tier 2: Fix ─────────────────────────────────────────────────────────
  {
    id: "f1", tier: "fix", topic: "Variables",
    title: "Case sensitivity",
    question: "This code throws a NameError. Fix it so it prints the name.",
    code: `Name = "Alice"\nprint(name)`,
    answers: ["Alice"],
    hint: "Python is case-sensitive. The variable is 'Name' with a capital N."
  },
  {
    id: "f2", tier: "fix", topic: "Types",
    title: "Type mismatch",
    question: "This code throws a TypeError. Fix it.",
    code: `age = "25"\nprint(age + 10)`,
    answers: ["35"],
    hint: "age is a string. Convert it to int first."
  },
  {
    id: "f3", tier: "fix", topic: "Loops",
    title: "Missing colon",
    question: "This code throws a SyntaxError. Find and fix the bug.",
    code: `for i in range(3)\n    print(i)`,
    answers: ["0\n1\n2"],
    hint: "The for line is missing something at the end..."
  },
  {
    id: "f4", tier: "fix", topic: "Lists",
    title: "Index out of range",
    question: "This code crashes. Fix it to print the last item.",
    code: `colors = ["red", "green", "blue"]\nprint(colors[3])`,
    answers: ["blue"],
    hint: "List of 3 items has indices 0, 1, 2. Use index 2, or -1 for the last."
  },

  // ── Tier 3: Write ───────────────────────────────────────────────────────
  {
    id: "w1", tier: "write", topic: "Strings + Loops",
    title: "Lowercase loop",
    question: "Write code that lowercases every word in the list and prints the result.",
    starterCode: `words = ["The", "QUICK", "Brown", "FOX"]\n\n# Your code here\n`,
    expectedOutput: `['the', 'quick', 'brown', 'fox']`,
    hint: "Create an empty list, loop through words, append word.lower(), then print."
  },
  {
    id: "w2", tier: "write", topic: "Functions",
    title: "Double function",
    question: "Write a function called <code>double</code> that returns a number multiplied by 2. Then print <code>double(7)</code>.",
    starterCode: `# Write your function here\n\n\nprint(double(7))`,
    expectedOutput: `14`,
    hint: "def double(n): return n * 2"
  },
  {
    id: "w3", tier: "write", topic: "Dictionaries",
    title: "Loop through a dict",
    question: "Loop through the dictionary and print each key-value pair in the format <code>key: value</code>.",
    starterCode: `scores = {"pos": 0.6, "neg": 0.1, "neu": 0.3}\n\n# Your code here\n`,
    expectedOutput: `pos: 0.6\nneg: 0.1\nneu: 0.3`,
    hint: "Use scores.items() to get both key and value in the loop."
  },

  // ── Tier 4: NLP Bridge ──────────────────────────────────────────────────
  {
    id: "b1", tier: "bridge", topic: "Text → Tokens",
    title: "Manual tokenizer",
    question: "Take the sentence, preprocess it (strip, lowercase), then split into words. Print the word list.",
    starterCode: `sentence = "  The Company FILED for Bankruptcy  "\n\n# Step 1: Strip whitespace\n# Step 2: Lowercase\n# Step 3: Split into words\n# Step 4: Print the result\n`,
    expectedOutput: `['the', 'company', 'filed', 'for', 'bankruptcy']`,
    hint: "Chain the methods: sentence.strip().lower().split()"
  },
  {
    id: "b2", tier: "bridge", topic: "Word Frequency",
    title: "Word counter",
    question: "Count how many times each word appears and print the dictionary.",
    starterCode: `words = ["fraud", "alert", "fraud", "review", "alert", "fraud"]\n\ncounts = {}\n# Your code here: loop through words and count each one\n\nprint(counts)`,
    expectedOutput: `{'fraud': 3, 'alert': 2, 'review': 1}`,
    hint: "In the loop: if the word is in counts, add 1. Otherwise, set it to 1."
  },
];
