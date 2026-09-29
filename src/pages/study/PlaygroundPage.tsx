import { useMemo, useState } from "react";
import { PageHeader, Card, Button, Badge } from "@/components/ui";
import { runSql, sampleTables } from "@/lib/sqlEngine";
import { Play, RotateCcw, Table2, Trophy } from "lucide-react";
import { cx } from "@/lib/utils";

const challenges = [
  {
    id: "ch-1",
    title: "Find customers from Mumbai",
    hint: "WHERE city = 'Mumbai'",
    solution: "SELECT * FROM customers WHERE city = 'Mumbai';",
    check: (r: { rows: unknown[] }) => r.rows.length === 2,
  },
  {
    id: "ch-2",
    title: "Total revenue of completed orders",
    hint: "SUM with a WHERE filter",
    solution: "SELECT SUM(amount) AS revenue FROM orders WHERE status = 'completed';",
    check: (r: { rows: Record<string, unknown>[] }) =>
      r.rows.length === 1 && Math.round(Number(Object.values(r.rows[0])[0])) === 5971,
  },
  {
    id: "ch-3",
    title: "Orders per customer (include customers with no orders)",
    hint: "LEFT JOIN + GROUP BY + COUNT",
    solution:
      "SELECT c.name, COUNT(o.id) AS order_count FROM customers c LEFT JOIN orders o ON o.customer_id = c.id GROUP BY c.name;",
    check: (r: { rows: unknown[] }) => r.rows.length === 6,
  },
  {
    id: "ch-4",
    title: "Customers with a NULL email",
    hint: "IS NULL",
    solution: "SELECT name FROM customers WHERE email IS NULL;",
    check: (r: { rows: unknown[] }) => r.rows.length === 1,
  },
  {
    id: "ch-5",
    title: "Top 2 priciest products",
    hint: "ORDER BY price DESC LIMIT 2",
    solution: "SELECT name, price FROM products ORDER BY price DESC LIMIT 2;",
    check: (r: { rows: unknown[] }) => r.rows.length === 2,
  },
];

export default function PlaygroundPage() {
  const [sql, setSql] = useState(
    "SELECT c.name, o.amount, o.status\nFROM customers c\nJOIN orders o ON o.customer_id = c.id\nORDER BY o.amount DESC\nLIMIT 5;"
  );
  const [result, setResult] = useState<ReturnType<typeof runSql> | null>(null);
  const [solved, setSolved] = useState<Set<string>>(new Set());
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);

  const exec = () => setResult(runSql(sql));

  const solvedCount = useMemo(() => challenges.filter((ch) => solved.has(ch.id)).length, [solved]);

  return (
    <div>
      <PageHeader
        eyebrow="/study/playground"
        title="SQL Playground"
        subtitle="A real in-browser SQL engine over sample tables — write, run, learn. Nothing leaves your browser."
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
        <div>
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-ink-200 px-4 py-2.5 dark:border-ink-700">
              <span className="font-mono text-xs text-ink-400">editor</span>
              <div className="flex gap-2">
                <Button size="sm" onClick={exec}>
                  <Play className="h-3.5 w-3.5" /> Run
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { setSql(""); setResult(null); }}>
                  <RotateCcw className="h-3.5 w-3.5" /> Clear
                </Button>
              </div>
            </div>
            <textarea
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") exec();
              }}
              spellCheck={false}
              rows={8}
              className="w-full resize-y bg-transparent p-4 font-mono text-[13px] leading-relaxed text-ink-800 focus:outline-none dark:text-ink-100"
              aria-label="SQL editor"
            />
          </Card>

          {result && "error" in result && (
            <div className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
              <p className="font-medium">SQL error</p>
              <p className="mt-1 font-mono text-xs">{result.error}</p>
              <p className="mt-1 text-xs opacity-70">
                Tip: this engine supports SELECT with JOIN, GROUP BY, HAVING, ORDER BY, LIMIT, WHERE (=, !=, &lt;&gt;, &lt;, &gt;, IN, LIKE, IS NULL, AND/OR).
              </p>
            </div>
          )}

          {result && !("error" in result) && (
            <Card className="mt-4 overflow-hidden">
              <div className="flex items-center justify-between border-b border-ink-200 px-4 py-2.5 dark:border-ink-700">
                <span className="font-mono text-xs text-ink-400">
                  {result.rows.length} rows
                </span>
                <span className="font-mono text-xs text-emerald-500">{result.ms} ms</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-ink-200 dark:border-ink-700">
                      {result.columns.map((c) => (
                        <th key={c} className="px-4 py-2.5 font-mono text-xs font-medium text-ink-500 dark:text-ink-400">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((row, i) => (
                      <tr key={i} className="border-b border-ink-100 last:border-0 dark:border-ink-800/60">
                        {result.columns.map((c) => (
                          <td
                            key={c}
                            className={cx(
                              "whitespace-nowrap px-4 py-2.5 font-mono text-xs",
                              row[c] === null ? "italic text-ink-300 dark:text-ink-600" : "text-ink-700 dark:text-ink-200"
                            )}
                          >
                            {row[c] === null ? "NULL" : String(row[c])}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {result.rows.length === 0 && (
                      <tr>
                        <td colSpan={result.columns.length} className="px-4 py-8 text-center text-sm text-ink-400">
                          0 rows — the query ran fine but matched nothing.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Challenges */}
          <div className="mt-8">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
              <Trophy className="h-4 w-4 text-accent-500" /> Challenges
              <span className="ml-auto text-xs text-ink-400">
                {solvedCount}/{challenges.length} passing
              </span>
            </h2>
            <div className="space-y-2">
              {challenges.map((ch) => {
                const pass = solved.has(ch.id);
                const expanded = activeChallenge === ch.id;
                return (
                  <Card key={ch.id} className={cx("p-4", pass && "border-emerald-500/40")}>
                    <button
                      className="flex w-full items-center gap-3 text-left"
                      onClick={() => setActiveChallenge(expanded ? null : ch.id)}
                    >
                      <span
                        className={cx(
                          "h-2 w-2 shrink-0 rounded-full",
                          pass ? "bg-emerald-500" : "bg-ink-300 dark:bg-ink-600"
                        )}
                      />
                      <span className="flex-1 text-sm font-medium">{ch.title}</span>
                      {pass && <Badge tone="green">Passing</Badge>}
                    </button>
                    {expanded && (
                      <div className="mt-3 space-y-2 border-t border-ink-200 pt-3 dark:border-ink-700">
                        <p className="text-xs text-ink-400">Hint: {ch.hint}</p>
                        <p className="font-mono text-xs text-ink-500 dark:text-ink-400">{ch.solution}</p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setSql(ch.solution)}
                          >
                            Load query
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              const r = runSql(sql);
                              const ok = !("error" in r) && ch.check(r);
                              if (ok) setSolved((s) => new Set([...s, ch.id]));
                              exec();
                            }}
                          >
                            Check my query
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Schema sidebar */}
        <div>
          <Card className="p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Table2 className="h-4 w-4 text-accent-500" /> Schema
            </h2>
            <div className="mt-3 space-y-3">
              {sampleTables.map((t) => (
                <div key={t.name}>
                  <p className="font-mono text-xs font-medium text-accent-500">{t.name}</p>
                  <ul className="mt-1 space-y-0.5">
                    {t.columns.map((c) => (
                      <li key={c} className="font-mono text-[11px] text-ink-400">
                        {c}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-0.5 text-[10px] text-ink-300 dark:text-ink-600">{t.rows.length} rows</p>
                </div>
              ))}
            </div>
          </Card>
          <p className="mt-3 px-1 text-[11px] leading-relaxed text-ink-400">
            Sample data only (clearly fictional). Queries run in a sandboxed in-memory engine —
            Ctrl/Cmd+Enter runs, results show row counts and execution time.
          </p>
        </div>
      </div>
    </div>
  );
}
