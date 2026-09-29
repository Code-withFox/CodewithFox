import type { Note } from "@/types";

export const notes: Note[] = [
  {
    slug: "sql-joins",
    title: "SQL JOINs, Demystified",
    subject: "SQL",
    chapter: "JOINs",
    tags: ["sql", "joins", "queries"],
    date: "2026-09-20",
    summary: "INNER, LEFT, RIGHT, FULL and the NULL traps that come with them.",
    markdown: `# SQL JOINs, Demystified

A JOIN combines rows from two tables using a condition. The JOIN type decides **which rows survive**.

## INNER JOIN
Only rows with a match in **both** tables.

\`\`\`sql
SELECT o.id, c.name
FROM orders o
INNER JOIN customers c ON c.id = o.customer_id;
\`\`\`

## LEFT JOIN
All rows from the left table. Unmatched right-side columns become **NULL**.

\`\`\`sql
SELECT c.name, o.id
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id;
\`\`\`

> LEFT JOIN keeps all rows from the left table.

## The classic trap: LEFT JOIN + WHERE
Filtering the right table in \`WHERE\` turns a LEFT JOIN into an INNER JOIN, because NULL right rows get filtered away.

\`\`\`sql
-- equivalent to INNER JOIN
SELECT ...
FROM a LEFT JOIN b ON ...
WHERE b.col IS NOT NULL;
\`\`\`

## Cheat table

| JOIN | Left unmatched | Right unmatched |
|---|---|---|
| INNER | dropped | dropped |
| LEFT | kept (NULLs right) | dropped |
| RIGHT | dropped | kept (NULLs left) |
| FULL | kept | kept |

## Practice ideas
- Write a LEFT JOIN that finds customers with **no** orders (\`WHERE o.id IS NULL\`).
- Rewrite it with NOT EXISTS and compare the plans.`,
  },
  {
    slug: "python-functions",
    title: "Python Functions: Scope, Defaults, *args/**kwargs",
    subject: "Python",
    chapter: "Functions",
    tags: ["python", "functions"],
    date: "2026-09-18",
    summary: "Function fundamentals with the mutable-default gotcha.",
    markdown: `# Python Functions

## Definition and return

\`\`\`python
def area(w: float, h: float) -> float:
    return w * h
\`\`\`

## Default arguments — the famous gotcha

Defaults are evaluated **once**, at function definition. A mutable default is shared across calls:

\`\`\`python
def add_item(item, items=[]):   # shared list!
    items.append(item)
    return items

add_item("a")   # ["a"]
add_item("b")   # ["a", "b"]  ← surprise
\`\`\`

The fix:

\`\`\`python
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items
\`\`\`

## *args and **kwargs

\`\`\`python
def summary(*args, **kwargs):
    print(args)     # positional tuple
    print(kwargs)   # keyword dict
\`\`\`

## Scope rule: LEGB
Local → Enclosing → Global → Builtins. Assigning inside a function creates a **local** name unless you declare \`global\`/\`nonlocal\`.`,
  },
  {
    slug: "etl-vs-elt",
    title: "ETL vs ELT — When Each Fits",
    subject: "Data Engineering",
    chapter: "ETL vs ELT",
    tags: ["etl", "elt", "pipelines"],
    date: "2026-09-22",
    summary: "The load-order decision and its trade-offs.",
    markdown: `# ETL vs ELT

## ETL — Extract, Transform, Load
Transform **before** loading. Traditional for on-prem warehouses with expensive compute.

## ELT — Extract, Load, Transform
Load raw first, transform **inside** the warehouse. Modern cloud warehouses made raw storage cheap and compute elastic, so ELT dominates now.

## Trade-offs

| | ETL | ELT |
|---|---|---|
| Where transforms run | Pipeline compute | Warehouse compute |
| Data available raw? | No | Yes — reprocess anytime |
| Latency to raw data | Later | Immediate |
| Tooling | Custom code | dbt-style SQL models |

## My pipeline uses staged ETL…
…and that is the point: build the smallest pipeline that is **correct and idempotent**, then evolve. The [de-pipeline](/projects/de-pipeline) project logs every stage so quality is measurable.

## Interview one-liner
> ETL shapes data before the warehouse; ELT lets the warehouse do the shaping.`,
  },
  {
    slug: "star-schema",
    title: "Star Schema in 5 Minutes",
    subject: "Data Engineering",
    chapter: "Data Modeling",
    tags: ["warehousing", "modeling"],
    date: "2026-09-24",
    summary: "Facts, dimensions and why analytics loves stars.",
    markdown: `# Star Schema in 5 Minutes

A **fact table** holds events/measures (sales, orders, clicks). **Dimension tables** hold descriptive context (customer, product, date).

## Example

\`\`\`sql
CREATE TABLE fact_orders (
  order_id     BIGINT,
  customer_key INT REFERENCES dim_customer(customer_key),
  date_key     INT REFERENCES dim_date(date_key),
  amount       NUMERIC(12,2),
  quantity     INT
);
\`\`\`

\`\`\`sql
-- Analytics query over the star
SELECT d.year, c.city, SUM(f.amount) AS revenue
FROM fact_orders f
JOIN dim_customer c USING (customer_key)
JOIN dim_date d USING (date_key)
GROUP BY d.year, c.city;
\`\`\`

## Why "star"?
The fact table sits at the center; dimensions radiate out — a star on the ER diagram.

## Rules of thumb
- Grain first: decide **one row = what?**
- Denormalize dimensions deliberately.
- Keys are surrogate integers; business keys stay attributes.`,
  },
  {
    slug: "linux-permissions",
    title: "Linux Permissions: rwx and chmod 755",
    subject: "Linux",
    chapter: "File Operations",
    tags: ["linux", "permissions"],
    date: "2026-09-15",
    summary: "Reading and setting file permissions without guessing.",
    markdown: `# Linux Permissions

\`ls -l\` shows \`-rwxr-xr--\`. Three triples: **owner / group / others**, each with read (4), write (2), execute (1).

## chmod by number

| Number | Meaning |
|---|---|
| 7 | rwx |
| 6 | rw- |
| 5 | r-x |
| 4 | r-- |

\`\`\`bash
chmod 755 deploy.sh   # owner: all; others: read+execute
chmod 644 data.csv    # owner: rw; others: read
\`\`\`

## Changing ownership

\`\`\`bash
sudo chown fox:fox run.sh
\`\`\`

## Why a data engineer cares
Scripts that won't execute, logs you can't read, cron jobs that fail silently — nine times out of ten it's permissions.`,
  },
  {
    slug: "git-rebase",
    title: "Git: Merge vs Rebase",
    subject: "Git & GitHub",
    chapter: "Rebase & History",
    tags: ["git", "workflow"],
    date: "2026-09-12",
    summary: "Two ways to integrate changes and when to use each.",
    markdown: `# Git: Merge vs Rebase

## Merge
Creates a merge commit joining two histories. Safe, explicit, preserves reality.

\`\`\`bash
git checkout feature
git merge main
\`\`\`

## Rebase
Moves your commits on top of the target branch — linear history, but **rewrites commits**.

\`\`\`bash
git checkout feature
git rebase main
\`\`\`

## The rule
> Never rebase commits others may already have.

Rebase your **local, unpushed** work; merge anything shared.

## Fixing the last commit

\`\`\`bash
git commit --amend            # edit last commit
git reset --soft HEAD~1       # undo, keep changes staged
\`\`\``,
  },
  {
    slug: "big-o",
    title: "Big-O Without the Math Degree",
    subject: "Data Structures",
    chapter: "Big-O Notation",
    tags: ["dsa", "complexity"],
    date: "2026-09-10",
    summary: "Intuition for time complexity with everyday examples.",
    markdown: `# Big-O Without the Math Degree

Big-O answers one question: **how does work grow as input grows?**

## The everyday ladder

| Complexity | Example | n = 1,000,000 |
|---|---|---|
| O(1) | dict lookup | instant |
| O(log n) | binary search | ~20 steps |
| O(n) | scan a file | a million steps |
| O(n log n) | good sorts | ~20M steps |
| O(n²) | nested loops | a trillion — no |

## Spotting patterns
- Loop over n → O(n)
- Loop inside a loop → O(n²)
- Halving each step → O(log n)
- Divide & conquer with merge → O(n log n)

## Why a data engineer cares
O(n²) pandas merges and unindexed O(n) scans are the same mistake in different clothes.`,
  },
  {
    slug: "docker-basics",
    title: "Docker for Data Pipelines",
    subject: "System Design",
    chapter: "Scaling Basics",
    tags: ["docker", "devops"],
    date: "2026-09-08",
    summary: "Why containers and a minimal Dockerfile for a Python ETL job.",
    markdown: `# Docker for Data Pipelines

A container bundles your code + runtime + dependencies so "works on my machine" stops being an excuse.

## Minimal Dockerfile for an ETL job

\`\`\`dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY etl/ ./etl/
CMD ["python", "etl/run.py"]
\`\`\`

## Why pipelines love containers
- Airflow workers run your code in identical environments
- Upgrades are rollbacks: tag images
- Postgres + pipeline = \`docker compose\`

## Layer caching
Order Dockerfile steps least → most volatile. Dependencies before code.`,
  },
  {
    slug: "os-processes",
    title: "Processes vs Threads",
    subject: "Operating Systems",
    chapter: "Processes",
    tags: ["os", "processes"],
    date: "2026-09-05",
    summary: "Isolation vs sharing, and why it matters for parallel data jobs.",
    markdown: `# Processes vs Threads

**Process**: own memory space. **Thread**: shares its process's heap; owns stack + registers.

## Comparison

| | Process | Thread |
|---|---|---|
| Memory | Isolated | Shared heap |
| Crash blast radius | Contained | Can take down the process |
| Communication | Pipes/sockets | Shared variables (needs locks) |
| Creation cost | Higher | Lower |

## Data engineering relevance
- Spark executors are processes; tasks run as threads inside them
- Python's GIL means CPU-bound work uses **processes**, I/O-bound uses threads/async`,
  },
  {
    slug: "http-basics",
    title: "HTTP for Data People",
    subject: "Computer Networks",
    chapter: "HTTP/HTTPS",
    tags: ["http", "api"],
    date: "2026-09-03",
    summary: "Methods, status codes and pagination patterns for API ingestion.",
    markdown: `# HTTP for Data People

## Methods you'll actually use
- \`GET\` — read data
- \`POST\` — send data / trigger jobs
- \`PUT/PATCH\` — update
- \`DELETE\` — remove

## Status codes that matter

| Code | Meaning | Pipeline action |
|---|---|---|
| 200 | OK | proceed |
| 429 | Too Many Requests | back off, retry |
| 404 | Not Found | skip/mark missing |
| 5xx | Server error | retry with backoff |

## Pagination
Most APIs paginate. Common schemes: \`page/per_page\`, \`cursor\`, \`Link\` headers. Always stop when the API says so — don't guess.

## Ingestion etiquette
Set a User-Agent, honor rate limits, cache responses, and log everything for reprocessing.`,
  },
];
