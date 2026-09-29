import type { PracticeProblem } from "@/types";

export const practiceProblems: PracticeProblem[] = [
  {
    id: "pp-001",
    subject: "Python",
    topic: "Loops",
    title: "Sum of Even Numbers",
    difficulty: "Easy",
    description: "Sum all even numbers from 1 to n (inclusive).",
    input: "n = 10",
    output: "30",
    example: "1..10 → 2+4+6+8+10 = 30",
    hint: "range(2, n+1, 2) walks only evens.",
    solution: `def sum_evens(n: int) -> int:
    return sum(range(2, n + 1, 2))`,
    explanation: "range's step skips odd numbers, so no if-check is needed.",
  },
  {
    id: "pp-002",
    subject: "Python",
    topic: "Strings",
    title: "Reverse Words",
    difficulty: "Easy",
    description: "Reverse word order in a sentence.",
    input: '"data engineering is fun"',
    output: '"fun is engineering data"',
    example: "split → reverse → join",
    hint: "str.split() with no args splits on any whitespace.",
    solution: `def reverse_words(s: str) -> str:
    return " ".join(reversed(s.split()))`,
    explanation: "split() handles multiple spaces, reversed() flips order, join() rebuilds.",
  },
  {
    id: "pp-003",
    subject: "Python",
    topic: "Dictionaries",
    title: "Word Frequency",
    difficulty: "Easy",
    description: "Count occurrences of each word; return a dict.",
    input: '"sql and python and more sql"',
    output: "{'sql': 2, 'and': 2, 'python': 1, 'more': 1}",
    example: "Use a dict keyed by word.",
    hint: "d.get(word, 0) + 1 pattern.",
    solution: `def word_freq(s: str) -> dict[str, int]:
    freq: dict[str, int] = {}
    for w in s.split():
        freq[w] = freq.get(w, 0) + 1
    return freq`,
    explanation: "get() with default 0 handles first sightings cleanly.",
  },
  {
    id: "pp-004",
    subject: "SQL",
    topic: "JOIN",
    title: "Customers Without Orders",
    difficulty: "Medium",
    description: "Find customers who have never placed an order.",
    input: "customers(id, name), orders(id, customer_id)",
    output: "names of customers with zero orders",
    example: "LEFT JOIN + IS NULL, or NOT EXISTS",
    hint: "LEFT JOIN keeps unmatched customers with NULL order columns.",
    solution: `SELECT c.name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;

-- or
SELECT name FROM customers c
WHERE NOT EXISTS (
  SELECT 1 FROM orders o WHERE o.customer_id = c.id
);`,
    explanation: "The LEFT JOIN anti-join pattern; NOT EXISTS expresses the same intent and often reads better.",
  },
  {
    id: "pp-005",
    subject: "SQL",
    topic: "Aggregation",
    title: "Top Customer per City",
    difficulty: "Hard",
    description: "For each city, find the customer with the highest total order amount.",
    input: "customers(id, name, city), orders(id, customer_id, amount)",
    output: "city, customer, total",
    example: "Window function or correlated subquery",
    hint: "ROW_NUMBER() OVER (PARTITION BY city ORDER BY total DESC)",
    solution: `WITH totals AS (
  SELECT c.city, c.name,
         SUM(o.amount) AS total,
         ROW_NUMBER() OVER (
           PARTITION BY c.city ORDER BY SUM(o.amount) DESC
         ) AS rn
  FROM customers c
  JOIN orders o ON o.customer_id = c.id
  GROUP BY c.city, c.name
)
SELECT city, name, total FROM totals WHERE rn = 1;`,
    explanation: "Aggregate in a CTE, rank per partition, then filter rn = 1. Ties go to one arbitrary winner — use RANK() to keep ties.",
  },
  {
    id: "pp-006",
    subject: "SQL",
    topic: "Aggregation",
    title: "Monthly Revenue",
    difficulty: "Medium",
    description: "Monthly total revenue for 2026, ordered by month.",
    input: "orders(id, amount, created_at)",
    output: "month, revenue",
    example: "date_trunc('month', ...)",
    hint: "GROUP BY the truncated month.",
    solution: `SELECT date_trunc('month', created_at) AS month,
       SUM(amount) AS revenue
FROM orders
WHERE created_at >= '2026-01-01'
GROUP BY 1
ORDER BY 1;`,
    explanation: "GROUP BY 1 references the first output column — handy but name columns explicitly in real code.",
  },
  {
    id: "pp-007",
    subject: "Data Structures",
    topic: "Hash Maps",
    title: "First Unique Character",
    difficulty: "Easy",
    description: "Return the index of the first non-repeating character, or -1.",
    input: '"foxfoxz"',
    output: "6 (the z)",
    example: "Two passes: count, then scan.",
    hint: "Counter dict in pass one.",
    solution: `def first_unique(s: str) -> int:
    counts = {}
    for ch in s:
        counts[ch] = counts.get(ch, 0) + 1
    for i, ch in enumerate(s):
        if counts[ch] == 1:
            return i
    return -1`,
    explanation: "O(n) time, O(k) space for the alphabet size.",
  },
  {
    id: "pp-008",
    subject: "Data Structures",
    topic: "Arrays",
    title: "Rotate Array",
    difficulty: "Medium",
    description: "Rotate an array right by k steps.",
    input: "[1,2,3,4,5], k=2",
    output: "[4,5,1,2,3]",
    example: "The reversal trick or slicing.",
    hint: "k = k % len(a) first.",
    solution: `def rotate(a: list[int], k: int) -> list[int]:
    if not a:
        return a
    k = k % len(a)
    return a[-k:] + a[:-k] if k else a[:]`,
    explanation: "Slicing handles it in O(n); watch the k=0 edge case.",
  },
  {
    id: "pp-009",
    subject: "C",
    topic: "Pointers",
    title: "Swap With Pointers",
    difficulty: "Easy",
    description: "Swap two ints using a function with pointer parameters.",
    input: "a=3, b=7",
    output: "a=7, b=3",
    example: "Pass addresses; dereference to swap.",
    hint: "Temp holds *x while overwriting.",
    solution: `void swap(int *x, int *y) {
    int tmp = *x;
    *x = *y;
    *y = tmp;
}

/* swap(&a, &b); */`,
    explanation: "C passes by value — you must pass addresses to affect the caller's variables.",
  },
  {
    id: "pp-010",
    subject: "JavaScript",
    topic: "Arrays",
    title: "Chunk Array",
    difficulty: "Medium",
    description: "Split an array into chunks of size n.",
    input: "[1,2,3,4,5], 2",
    output: "[[1,2],[3,4],[5]]",
    example: "slice in a loop.",
    hint: "i += n each iteration.",
    solution: `function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) {
    out.push(arr.slice(i, i + n));
  }
  return out;
}`,
    explanation: "slice clamps out-of-range ends, so the last chunk can be short.",
  },
  {
    id: "pp-011",
    subject: "Algorithms",
    topic: "Searching",
    title: "Binary Search",
    difficulty: "Easy",
    description: "Find target in a sorted array; return index or -1.",
    input: "[1,3,5,7,9], 7",
    output: "3",
    example: "Halve the window each step.",
    hint: "lo + (hi - lo) // 2 avoids overflow in C/Java.",
    solution: `def binary_search(a: list[int], t: int) -> int:
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if a[mid] == t:
            return mid
        if a[mid] < t:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
    explanation: "O(log n). The classic off-by-one trap: use lo <= hi and mid ± 1 correctly.",
  },
  {
    id: "pp-012",
    subject: "Algorithms",
    topic: "Sorting",
    title: "Sort by Multiple Keys",
    difficulty: "Medium",
    description: "Sort records by age asc, then name asc.",
    input: "[{age: 30, name: 'B'}, {age: 25, name: 'A'}, {age: 30, name: 'A'}]",
    output: "25 A, 30 A, 30 B",
    example: "Tuple keys give multi-key sorts.",
    hint: "key=lambda r: (r['age'], r['name'])",
    solution: `records.sort(key=lambda r: (r["age"], r["name"]))`,
    explanation: "Tuples compare element-wise — the standard multi-key trick.",
  },
];
