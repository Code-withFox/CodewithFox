import type { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [
  {
    slug: "how-i-learned-sql",
    title: "How I Learned SQL (and What I'd Tell Past Me)",
    summary: "From SELECT * confusion to window functions — the path that actually worked.",
    date: "2026-09-21",
    tags: ["SQL", "Learning"],
    readingTime: 6,
    markdown: `# How I Learned SQL

Everyone says "learn SQL" like it's one skill. It's not. It's four skills wearing a trench coat:

1. **Reading queries** — understanding what a query returns before running it
2. **Writing queries** — translating a question into joins, filters, aggregates
3. **Designing schemas** — tables that don't fight future questions
4. **Debugging data** — why does this number look wrong?

## What actually worked

**Writing queries by hand, daily.** Tutorials feel productive; they aren't. The breakthrough came from answering real questions: "how many orders per customer per month?" — first with nested subqueries, then joins, then a window function that made it obvious.

**The Playground.** I built a SQL playground into this site ([/study/playground](/study/playground)) because I wanted a zero-setup place to test intuitions. Running \`LEFT JOIN\` against sample data and seeing the NULLs teaches more than any diagram.

**Learning the traps explicitly.** \`WHERE status = NULL\` silently matching nothing. \`COUNT(col)\` skipping NULLs. A \`LEFT JOIN\` collapsing into an \`INNER JOIN\` because of one WHERE clause. Every one of these bit me; now they're [flashcards](/study/flashcards).

## What I'd tell past me

> Stop collecting tutorials. Pick one sample database and interrogate it until you can predict the output of any query.

## Where I am now
Comfortable with joins and aggregations, currently living in window functions. Next: query plans — \`EXPLAIN\` feels like getting X-ray vision.`,
  },
  {
    slug: "my-first-etl-pipeline",
    title: "My First ETL Pipeline (and Everything It Broke)",
    summary: "Building a data pipeline teaches you that moving data is the easy part.",
    date: "2026-09-25",
    tags: ["Data Engineering", "Python", "ETL"],
    readingTime: 8,
    markdown: `# My First ETL Pipeline

I thought a pipeline was: read CSV → do stuff → write to database. Technically true. Practically, that sentence hides 90% of the work.

## The naive version
\`\`\`python
df = pd.read_csv("events.csv")
df["amount"] = df["amount"] * 1.18
df.to_sql("clean_events", engine)
\`\`\`

It ran. Then I re-ran it and everything doubled. My first lesson in **idempotency**, learned the expensive way.

## What the real version needed

**Validation before loading.** Nulls in required columns. Duplicates on the primary key. Amounts that were strings ("\$1,200.50" — thanks, exports). Every rule became an explicit check with a counter: rows in, rows rejected, rows loaded. When something breaks, the log tells me *where*, not just *that*.

**Upserts, not appends.**
\`\`\`sql
INSERT INTO clean_events (event_id, ts, amount)
VALUES (%s, %s, %s)
ON CONFLICT (event_id) DO UPDATE SET amount = EXCLUDED.amount;
\`\`\`
Same input twice → same state once. Re-runs became safe retries.

**Staging.** Raw lands untouched. Clean tables are derived. If my transform has a bug, I don't re-download anything — I fix the transform and re-run from raw.

## The honest scorecard
- Rows silently lost to bad type coercion: caught it two days late
- TIMESTAMP vs timezone confusion: lost an evening
- The satisfaction of a backfill completing correctly: immeasurable

## Next
The pipeline is a script I run by hand. The next milestone is orchestration — [Airflow](/study/airflow) — so it runs itself and tells me when it doesn't.`,
  },
  {
    slug: "what-i-learned-building-muneem-ji",
    title: "What I Learned Building Muneem Ji",
    summary: "A shop-management app taught me schema design the hard way.",
    date: "2026-09-14",
    tags: ["Projects", "SQL", "Python"],
    readingTime: 7,
    markdown: `# What I Learned Building Muneem Ji

Muneem Ji is an inventory and shop management app I built for real shopkeeping workflows: products, stock movements, invoices, customers.

## Decision 1: stock is derived, never stored
My first design had a \`products.quantity\` column updated on every sale. Then a bug double-decremented stock and there was no way to reconstruct truth.

The fix: **stock = sum of movements**. Every sale, purchase or adjustment is a row in \`stock_movements\`; quantity is computed. Now the data can explain itself — audit is just a query.

\`\`\`sql
SELECT p.name,
       COALESCE(SUM(CASE WHEN m.kind = 'in' THEN m.qty ELSE -m.qty END), 0) AS stock
FROM products p
LEFT JOIN stock_movements m ON m.product_id = p.id
GROUP BY p.name;
\`\`\`

## Decision 2: invoices without partial-payment chaos
Payments became their own table referencing the invoice, so an invoice is paid when \`SUM(payments) >= total\`. Obvious in hindsight; invisible before I'd designed a schema before.

## Decision 3: fewer features, actually working
The wishlist had 20 features. The working version has 5 — catalog, movements, invoices, customers, daily summary. A shop owner needs billing that works more than analytics they'll never open.

## The meta-lesson
Building an *application* taught me more about *data* than any course: constraints, keys, and the discipline of never letting the database hold contradictions. That's why the [roadmap](/roadmap) puts database design before ETL.`,
  },
];
