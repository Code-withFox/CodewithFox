import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PageHeader, Card, Badge, Button, Progress } from "@/components/ui";
import { AnimatePresence, motion, reducedMotion } from "@/lib/motion";
import { Play, RotateCcw, Database, Zap, Boxes, BarChart3, ShieldCheck } from "lucide-react";
import { cx } from "@/lib/utils";

/* -------------------------------- Demo types ------------------------------- */

interface DemoDef {
  id: string;
  title: string;
  blurb: string;
  icon: typeof Database;
  stages: { label: string; detail: string }[];
}

const demos: DemoDef[] = [
  {
    id: "etl",
    title: "ETL",
    blurb: "Extract → Transform → Load. Watch rows move, transform and land.",
    icon: Database,
    stages: [
      { label: "Extract", detail: "Reading 1,000 raw events from source CSV" },
      { label: "Transform", detail: "Cleaning types, trimming strings, deduplicating" },
      { label: "Validate", detail: "980 pass · 20 rejected to quarantine" },
      { label: "Load", detail: "Upserted 980 rows into PostgreSQL (idempotent)" },
    ],
  },
  {
    id: "batch",
    title: "Batch Processing",
    blurb: "Input → Processing → Output in scheduled chunks.",
    icon: Boxes,
    stages: [
      { label: "Input", detail: "Nightly file drop: 250MB partition" },
      { label: "Processing", detail: "Aggregating per-day metrics in memory" },
      { label: "Output", detail: "Wrote daily_summary table · 31 rows" },
    ],
  },
  {
    id: "streaming",
    title: "Streaming",
    blurb: "Producer → Kafka → Consumer, continuously.",
    icon: Zap,
    stages: [
      { label: "Producer", detail: "Emitting clickstream events" },
      { label: "Kafka topic", detail: "Partitioned by user_id · ordered per key" },
      { label: "Consumer", detail: "Consuming at 12k events/s · offsets committed" },
    ],
  },
  {
    id: "warehouse",
    title: "Data Warehouse",
    blurb: "Sources → ETL → Warehouse → BI modeling.",
    icon: BarChart3,
    stages: [
      { label: "Sources", detail: "3 operational databases + 1 API" },
      { label: "ETL", detail: "Conformed into raw → clean layers" },
      { label: "Warehouse", detail: "Star schema: fact_orders + 4 dimensions" },
      { label: "BI", detail: "Dashboards query marts, never raw sources" },
    ],
  },
];

function PipelineDemo({ demo }: { demo: DemoDef }) {
  const [step, setStep] = useState(-1);
  const reduce = reducedMotion();
  const timer = useRef<number | null>(null);

  const run = useCallback(() => {
    if (timer.current) window.clearInterval(timer.current);
    setStep(0);
    let i = 0;
    timer.current = window.setInterval(() => {
      i += 1;
      if (i >= demo.stages.length) {
        window.clearInterval(timer.current!);
        timer.current = null;
        return;
      }
      setStep(i);
    }, 1100);
  }, [demo.stages.length]);

  useEffect(() => () => { if (timer.current) window.clearInterval(timer.current); }, []);

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold">
          <demo.icon className="h-4 w-4 text-accent-500" /> {demo.title}
        </h3>
        <div className="flex gap-2">
          <Button size="sm" onClick={run}>
            <Play className="h-3 w-3" /> Run
          </Button>
          <Button size="sm" variant="ghost" onClick={() => { if (timer.current) window.clearInterval(timer.current); setStep(-1); }}>
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <p className="mt-1 text-xs text-ink-400">{demo.blurb}</p>
      <div className="mt-4 space-y-1.5">
        {demo.stages.map((s, i) => {
          const active = i <= step;
          return (
            <div key={s.label}>
              <div
                className={cx(
                  "flex items-center gap-3 rounded-lg border px-3 py-2 transition-colors",
                  active
                    ? "border-accent-500/50 bg-accent-500/5"
                    : "border-ink-200 opacity-50 dark:border-ink-700"
                )}
              >
                <span className={cx("h-2 w-2 rounded-full", active ? "animate-pulse-dot bg-accent-500" : "bg-ink-300 dark:bg-ink-600")} />
                <span className="text-sm font-medium">{s.label}</span>
                <AnimatePresence>
                  {active && (
                    <motion.span
                      initial={reduce ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="ml-auto text-right text-[11px] text-ink-500 dark:text-ink-400"
                    >
                      {s.detail}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/* --------------------------- Data quality checker -------------------------- */

interface DemoRow {
  id: number | null;
  name: string | null;
  email: string | null;
  age: number | null;
  city: string | null;
}

const DEMO_DATA: DemoRow[] = [
  { id: 1, name: "Aarav", email: "aarav@example.com", age: 24, city: "Mumbai" },
  { id: 2, name: "Diya", email: "diya@example.com", age: 29, city: "Delhi" },
  { id: 3, name: "Kabir", email: "not-an-email", age: 31, city: "Mumbai" },
  { id: 4, name: "Diya", email: "diya@example.com", age: 29, city: "Delhi" },
  { id: null, name: "Meera", email: "meera@example.com", age: 27, city: "Pune" },
  { id: 6, name: null, email: "rohan@example.com", age: null, city: "Delhi" },
  { id: 7, name: "Sara", email: "sara@example.com", age: 230, city: null },
  { id: 8, name: "Vikram", email: "vikram@example.com", age: 26, city: "Noida" },
  { id: 9, name: "Anaya", email: "anaya@example.com", age: 23, city: "Noida" },
  { id: 10, name: "Ishaan", email: "ishaan@example.com", age: 28, city: "Noida" },
];

interface CheckResult {
  check: string;
  detail: string;
  rows: (number | string)[];
  severity: "high" | "medium";
}

function runQualityChecks(rows: DemoRow[]): CheckResult[] {
  const results: CheckResult[] = [];

  // Missing values
  const missing: string[] = [];
  rows.forEach((r, i) => {
    for (const [k, v] of Object.entries(r)) {
      if (v === null) missing.push(`row ${i + 1}.${k}`);
    }
  });
  results.push({
    check: "Missing values",
    detail: `${missing.length} null cell${missing.length === 1 ? "" : "s"}`,
    rows: missing,
    severity: "high",
  });

  // Duplicates (on name+email+age+city signature)
  const seen = new Map<string, number>();
  const dupes: string[] = [];
  rows.forEach((r, i) => {
    const sig = `${r.name}|${r.email}|${r.age}|${r.city}`;
    if (seen.has(sig)) dupes.push(`row ${i + 1} duplicates row ${seen.get(sig)! + 1}`);
    else seen.set(sig, i);
  });
  results.push({
    check: "Duplicate detection",
    detail: `${dupes.length} duplicate row${dupes.length === 1 ? "" : "s"}`,
    rows: dupes,
    severity: "medium",
  });

  // Invalid emails
  const emailRe = /^[\w.+-]+@[\w-]+\.[\w.]+$/;
  const badEmails = rows
    .map((r, i) => ({ r, i }))
    .filter(({ r }) => r.email !== null && !emailRe.test(r.email))
    .map(({ r, i }) => `row ${i + 1}: "${r.email}"`);
  results.push({
    check: "Invalid email format",
    detail: `${badEmails.length} invalid email${badEmails.length === 1 ? "" : "s"}`,
    rows: badEmails,
    severity: "high",
  });

  // Invalid types (age must be a positive integer)
  const badAges = rows
    .map((r, i) => ({ r, i }))
    .filter(({ r }) => r.age !== null && (!Number.isInteger(r.age) || r.age <= 0 || r.age > 120))
    .map(({ r, i }) => `row ${i + 1}: age=${r.age}`);
  results.push({
    check: "Invalid data types / ranges",
    detail: `${badAges.length} out-of-range value${badAges.length === 1 ? "" : "s"}`,
    rows: badAges,
    severity: "high",
  });

  // Outliers via IQR
  const ages = rows.map((r) => r.age).filter((a): a is number => a !== null && a <= 120);
  ages.sort((a, b) => a - b);
  const q1 = ages[Math.floor(ages.length * 0.25)];
  const q3 = ages[Math.floor(ages.length * 0.75)];
  const iqr = q3 - q1;
  const lo = q1 - 1.5 * iqr;
  const hi = q3 + 1.5 * iqr;
  const outliers = rows
    .map((r, i) => ({ r, i }))
    .filter(({ r }) => r.age !== null && (r.age < lo || r.age > hi))
    .map(({ r, i }) => `row ${i + 1}: age=${r.age} outside [${lo}, ${hi}]`);
  results.push({
    check: "Outlier detection (IQR)",
    detail: `${outliers.length} outlier${outliers.length === 1 ? "" : "s"} · bounds [${lo}, ${hi}]`,
    rows: outliers,
    severity: "medium",
  });

  return results;
}

function DataQualityDemo() {
  const [ran, setRan] = useState(false);
  const results = useMemo(() => (ran ? runQualityChecks(DEMO_DATA) : []), [ran]);
  const totalIssues = results.reduce((s, r) => s + r.rows.length, 0);
  const qualityScore = Math.max(0, 100 - totalIssues * 8);

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="h-4 w-4 text-accent-500" /> Data quality demo
          </h2>
          <p className="mt-0.5 text-xs text-ink-400">
            Ten rows of clearly fictional sample data — five real validation checks.
          </p>
        </div>
        <Button onClick={() => setRan(true)} disabled={ran}>
          Run checks
        </Button>
      </div>

      {ran && (
        <>
          <div className="mt-5">
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-ink-400">Quality score</span>
              <span className="font-mono text-accent-500">{qualityScore}/100</span>
            </div>
            <Progress value={qualityScore} />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {results.map((r) => (
              <div key={r.check} className="rounded-lg border border-ink-200 p-4 dark:border-ink-700">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{r.check}</p>
                  <Badge tone={r.rows.length === 0 ? "green" : r.severity === "high" ? "red" : "amber"}>
                    {r.rows.length === 0 ? "clean" : `${r.rows.length} issue${r.rows.length === 1 ? "" : "s"}`}
                  </Badge>
                </div>
                <p className="mt-0.5 text-xs text-ink-400">{r.detail}</p>
                {r.rows.length > 0 && (
                  <ul className="mt-2 space-y-0.5 font-mono text-[11px] text-ink-500 dark:text-ink-400">
                    {r.rows.slice(0, 4).map((x) => (
                      <li key={String(x)}>{x}</li>
                    ))}
                    {r.rows.length > 4 && <li>…and {r.rows.length - 4} more</li>}
                  </ul>
                )}
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-ink-400">
            These are the same checks the de-pipeline project applies before loading — nulls,
            duplicates, formats, ranges and outliers, logged with reject counts.
          </p>
        </>
      )}
    </Card>
  );
}

/* ----------------------------------- Page ---------------------------------- */

export default function Lab() {
  return (
    <div>
      <PageHeader
        eyebrow="/lab"
        title="Data pipeline lab"
        subtitle="Interactive educational demos of core data engineering patterns. All numbers are simulated for learning."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {demos.map((d) => (
          <PipelineDemo key={d.id} demo={d} />
        ))}
      </div>

      <div className="mt-8">
        <DataQualityDemo />
      </div>
    </div>
  );
}
