import { useMemo, useState } from "react";
import { PageHeader, Card, Badge, Button, Select, EmptyState } from "@/components/ui";
import { practiceProblems } from "@/data/practice";
import { cx } from "@/lib/utils";
import { Lightbulb, Eye, RotateCcw, Check } from "lucide-react";

export default function PracticePage() {
  const [subject, setSubject] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [solved, setSolved] = useState<Set<string>>(new Set());

  const subjectList = useMemo(() => [...new Set(practiceProblems.map((p) => p.subject))], []);
  const filtered = useMemo(
    () =>
      practiceProblems.filter((p) => {
        if (subject !== "all" && p.subject !== subject) return false;
        if (difficulty !== "all" && p.difficulty !== difficulty) return false;
        return true;
      }),
    [subject, difficulty]
  );

  const toggleSolved = (id: string) =>
    setSolved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div>
      <PageHeader
        eyebrow="/study/practice"
        title="Coding practice"
        subtitle="Problems with hidden hints and solutions — attempt first, then reveal."
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-auto" aria-label="Subject">
          <option value="all">All subjects</option>
          {subjectList.map((s) => <option key={s}>{s}</option>)}
        </Select>
        <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-auto" aria-label="Difficulty">
          <option value="all">All difficulties</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </Select>
        <span className="ml-auto text-xs text-ink-400">
          {solved.size}/{practiceProblems.length} marked solved this visit
        </span>
      </div>

      <div className="space-y-4">
        {filtered.map((p) => (
          <PracticeCard key={p.id} problem={p} solved={solved.has(p.id)} onToggle={() => toggleSolved(p.id)} />
        ))}
        {filtered.length === 0 && <EmptyState title="No problems match" />}
      </div>
    </div>
  );
}

function PracticeCard({
  problem,
  solved,
  onToggle,
}: {
  problem: (typeof practiceProblems)[number];
  solved: boolean;
  onToggle: () => void;
}) {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <Card className={cx("p-5", solved && "border-emerald-500/40")}>
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="accent">{problem.subject}</Badge>
        <Badge>{problem.topic}</Badge>
        <Badge tone={problem.difficulty === "Easy" ? "green" : problem.difficulty === "Medium" ? "amber" : "red"}>
          {problem.difficulty}
        </Badge>
        <button
          onClick={onToggle}
          className={cx(
            "ml-auto inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-colors",
            solved
              ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "border-ink-200 text-ink-400 hover:border-emerald-500/40 dark:border-ink-700"
          )}
        >
          <Check className="h-3 w-3" /> {solved ? "Solved" : "Mark solved"}
        </button>
      </div>
      <h2 className="mt-3 font-semibold">{problem.title}</h2>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{problem.description}</p>

      <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        <div className="rounded-lg bg-ink-100/60 p-3 dark:bg-ink-800/50">
          <p className="font-mono text-[10px] uppercase tracking-wider text-ink-400">Input</p>
          <p className="mt-1 font-mono text-xs">{problem.input}</p>
        </div>
        <div className="rounded-lg bg-ink-100/60 p-3 dark:bg-ink-800/50">
          <p className="font-mono text-[10px] uppercase tracking-wider text-ink-400">Output</p>
          <p className="mt-1 font-mono text-xs">{problem.output}</p>
        </div>
      </div>
      <p className="mt-2 text-xs text-ink-400">Example: {problem.example}</p>

      <div className="mt-4 flex gap-2">
        <Button size="sm" variant="secondary" onClick={() => setShowHint((h) => !h)}>
          <Lightbulb className="h-3.5 w-3.5" /> {showHint ? "Hide hint" : "Hint"}
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setShowSolution((s) => !s)}>
          <Eye className="h-3.5 w-3.5" /> {showSolution ? "Hide solution" : "Solution"}
        </Button>
        {showSolution && (
          <Button size="sm" variant="ghost" onClick={() => { setShowSolution(false); setShowHint(false); }}>
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </Button>
        )}
      </div>
      {showHint && (
        <p className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm text-amber-700 dark:text-amber-400">
          💡 {problem.hint}
        </p>
      )}
      {showSolution && (
        <div className="mt-3">
          <pre className="overflow-x-auto rounded-lg border border-ink-200 bg-ink-50 p-4 font-mono text-xs leading-relaxed dark:border-ink-700 dark:bg-ink-950">
            {problem.solution}
          </pre>
          <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">{problem.explanation}</p>
        </div>
      )}
    </Card>
  );
}
