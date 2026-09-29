import type { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "muneem-ji",
    name: "Muneem Ji",
    tagline: "Inventory and shop management for small shops",
    description:
      "A shop management application covering inventory, billing, customers and daily sales reporting. Built as a practical tool for real shopkeeping workflows rather than a toy CRUD app.",
    problem:
      "Small shops often track stock in notebooks or scattered spreadsheets. Stock counts drift from reality, billing is manual, and there is no simple way to answer “what sold this week?”.",
    solution:
      "A single application with products, stock movements, customer records, invoices and daily summaries. The data model separates products from transactions so stock is always derived from movement history.",
    architecture:
      "Client app with a relational database. Product and transaction tables are normalized; reporting views aggregate sales. Designed so the same schema can later move to a client-server setup.",
    architectureFlow: [
      { label: "UI", detail: "Product catalog, billing screen, stock view" },
      { label: "Application logic", detail: "Validation, invoice totals, stock deduction rules" },
      { label: "SQL schema", detail: "products, customers, invoices, invoice_items, stock_movements" },
      { label: "Reports", detail: "Daily/weekly sales aggregates from transaction history" },
    ],
    technologies: ["Python", "SQL", "Git", "GitHub"],
    features: [
      "Product catalog with categories and pricing",
      "Stock in/out movement history",
      "Customer records linked to invoices",
      "Invoice generation with line items",
      "Daily and weekly sales summary",
    ],
    challenges: [
      "Designing the stock schema so quantity is derived, never manually edited",
      "Handling partial payments on invoices without ambiguity",
      "Keeping the UI simple enough for non-technical shop owners",
    ],
    lessons: [
      "Schema design decisions haunt you — get keys and constraints right early",
      "Derived data beats stored duplicates every time",
      "Real users need fewer features that work, not more features that might",
    ],
    future: [
      "Barcode scanning for faster billing",
      "Low-stock alerts",
      "Export to CSV for accountants",
    ],
    github: "https://github.com/code-with-fox/muneem-ji",
    demo: null,
    docs: null,
    screenshots: [],
    status: "building",
    kind: "app",
    period: "2025",
  },
  {
    slug: "code-with-fox",
    name: "Code With Fox",
    tagline: "This website — portfolio + learning platform",
    description:
      "A personal developer platform combining a portfolio, a Data Engineering roadmap, and a fully functional Study Hub with quizzes, flashcards, spaced revision, a study timer, analytics and a heatmap — all persisted locally.",
    problem:
      "Learning material scattered across PDFs, browser tabs and notebooks is impossible to revise from. Progress was invisible: no way to know what was studied, what was weak, what was due.",
    solution:
      "One interconnected system: topics link to notes, practice, quizzes and projects. Real tracking — every quiz attempt, timer session, flashcard review and bookmark is stored and computed from, never hard-coded.",
    architecture:
      "React + TypeScript on Vite, Tailwind for design tokens, React Router for the app shell, Framer Motion for transitions. All state persists in localStorage via a typed storage layer, architected so a Supabase adapter can replace it without touching UI code.",
    architectureFlow: [
      { label: "Data layer", detail: "Typed data files: profile, skills, projects, roadmap, subjects, questions" },
      { label: "State", detail: "Persistent hooks over localStorage with cross-tab sync" },
      { label: "UI shell", detail: "Router layout, command palette, global search, theme system" },
      { label: "Study engine", detail: "Quiz scoring, spaced repetition scheduling, session logging" },
    ],
    technologies: ["React", "TypeScript", "Vite", "Tailwind CSS", "Framer Motion", "React Router"],
    features: [
      "Interactive roadmap with real progress tracking",
      "Quiz engine with scoring, weak-topic detection and exam mode",
      "Flashcards with SM-2-style spaced revision scheduling",
      "Study timer that logs real sessions to history and heatmap",
      "Command palette (Ctrl/Cmd+K) searching the whole platform",
    ],
    challenges: [
      "Modeling the roadmap → notes → practice → quiz → project graph without a backend",
      "Designing localStorage keys so features stay in sync without a state library",
      "Keeping the bundle lean while adding interactive systems",
    ],
    lessons: [
      "Content modeling first — good data shapes make every feature easier",
      "Local-first is a feature: the site works offline and needs no login",
      "Interconnection is the product; isolated pages are just a website",
    ],
    future: [
      "Optional Supabase sync behind the existing storage interface",
      "PDF viewer for the study library",
      "Admin panel for content editing",
    ],
    github: "https://github.com/code-with-fox/portfolio",
    demo: null,
    docs: null,
    screenshots: [],
    status: "building",
    kind: "portfolio",
    period: "2026",
  },
  {
    slug: "de-pipeline",
    name: "Data Engineering Pipeline",
    tagline: "End-to-end extract → validate → load → analytics pipeline",
    description:
      "An end-to-end batch pipeline that ingests raw event data, validates and transforms it with Python, loads it into PostgreSQL, and serves analytics-ready tables — designed with the same concepts used by production ETL tools.",
    problem:
      "Raw data is messy: missing fields, duplicates, wrong types, outliers. Before analytics can be trusted, ingestion needs explicit validation and idempotent loading, or dashboards lie.",
    solution:
      "A staged pipeline: extract from source (CSV/API), transform with Pandas (cleaning, type coercion, deduplication), validate against explicit rules, load into PostgreSQL with upsert semantics, then model analytics views on top. Every stage logs row counts and rejects, so data quality is measurable.",
    architecture:
      "Batch pipeline in Python. Each stage is a pure-ish function reading and writing local artifacts, making re-runs safe. Postgres stores raw + clean layers; SQL views implement the warehouse-style modeling. Docker planned to package the runner.",
    architectureFlow: [
      { label: "Data source", detail: "CSV extracts / public API responses (raw layer)" },
      { label: "Extract", detail: "Python ingestion scripts with schema checks" },
      { label: "Transform", detail: "Pandas: cleaning, normalization, deduplication" },
      { label: "Validation", detail: "Rule engine: nulls, types, ranges, uniqueness" },
      { label: "PostgreSQL", detail: "Clean layer tables + upsert-on-key loading" },
      { label: "Warehouse views", detail: "Analytics marts (facts + dimensions)" },
      { label: "Analytics", detail: "SQL queries / BI-ready tables" },
    ],
    technologies: ["Python", "Pandas", "PostgreSQL", "SQL", "ETL", "Git"],
    features: [
      "Staged raw → clean → analytics data layers",
      "Validation rules with reject logging and row counts",
      "Idempotent upsert loads keyed on natural keys",
      "Analytics views modeled like a star schema",
      "Run reports: rows in, rows rejected, rows loaded",
    ],
    challenges: [
      "Defining validation strict enough to catch bad data without rejecting everything",
      "Making loads re-runnable without duplicating rows",
      "Deciding what belongs in transform (code) vs the warehouse (SQL)",
    ],
    lessons: [
      "Data quality is a pipeline feature, not a downstream cleanup job",
      "Idempotency turns failures from disasters into retries",
      "Logging row counts at every stage is the cheapest observability there is",
    ],
    future: [
      "Orchestrate with Airflow DAGs",
      "Containerize with Docker",
      "Add a Kafka-style streaming variant",
    ],
    github: "https://github.com/code-with-fox/data-pipeline",
    demo: null,
    docs: null,
    screenshots: [],
    status: "building",
    kind: "data",
    period: "2026",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
