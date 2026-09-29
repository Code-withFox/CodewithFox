import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHeader, Card, Badge, Button, Select, StatusBadge } from "@/components/ui";
import { interviewQuestions } from "@/data/interview";
import { useInterviewTracker } from "@/hooks/useStudyData";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cx } from "@/lib/utils";

type ViewStatus = "not-attempted" | "attempted" | "correct" | "needs-revision" | "mastered";

export default function InterviewPage() {
  const [params] = useSearchParams();
  const [category, setCategory] = useState(params.get("category") ?? "all");
  const [open, setOpen] = useState<string | null>(null);
  const { map: statuses, set, counts } = useInterviewTracker();

  const categories = useMemo(() => [...new Set(interviewQuestions.map((q) => q.category))], []);
  const filtered = useMemo(
    () => interviewQuestions.filter((q) => category === "all" || q.category === category),
    [category]
  );

  return (
    <div>
      <PageHeader
        eyebrow="/study/interview"
        title="Interview preparation"
        subtitle="Short answer, deep answer, example, follow-up and the common mistake — for each question."
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="w-auto" aria-label="Category">
          <option value="all">All categories</option>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </Select>
        <div className="ml-auto flex flex-wrap gap-2 text-xs text-ink-400">
          <span>{counts.mastered} mastered</span>
          <span>·</span>
          <span>{counts["needs-revision"]} need revision</span>
          <span>·</span>
          <span>{filtered.length - counts.mastered - counts["needs-revision"] - counts.attempted - counts.correct} untouched here</span>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((q) => {
          const isOpen = open === q.id;
          const st = (statuses[q.id] ?? "not-attempted") as ViewStatus;
          return (
            <Card key={q.id} className="p-5">
              <button
                className="flex w-full items-start gap-3 text-left"
                onClick={() => setOpen(isOpen ? null : q.id)}
                aria-expanded={isOpen}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge tone="accent">{q.category}</Badge>
                    <Badge>{q.difficulty}</Badge>
                    <StatusBadge status={st === "not-attempted" ? "not-started" : st === "correct" ? "completed" : st === "mastered" ? "revision" : "learning"} />
                  </div>
                  <p className="mt-2 font-medium">{q.question}</p>
                </div>
                {isOpen ? <ChevronUp className="h-4 w-4 shrink-0 text-ink-400" /> : <ChevronDown className="h-4 w-4 shrink-0 text-ink-400" />}
              </button>

              {isOpen && (
                <div className="mt-4 space-y-3 border-t border-ink-200 pt-4 text-sm dark:border-ink-700">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Short answer</p>
                    <p className="mt-1 text-ink-700 dark:text-ink-200">{q.short}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Deep answer</p>
                    <p className="mt-1 text-ink-600 dark:text-ink-300">{q.detailed}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Example</p>
                    <pre className="mt-1 overflow-x-auto rounded-lg border border-ink-200 bg-ink-50 p-3 font-mono text-xs dark:border-ink-700 dark:bg-ink-950">
                      {q.example}
                    </pre>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Follow-up</p>
                    <p className="mt-1 text-ink-600 dark:text-ink-300">{q.followUp}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Common mistake</p>
                    <p className="mt-1 text-ink-600 dark:text-ink-300">{q.commonMistake}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {(
                      [
                        ["correct", "Correct"],
                        ["attempted", "Attempted"],
                        ["needs-revision", "Needs revision"],
                        ["mastered", "Mastered"],
                      ] as [Exclude<ViewStatus, "not-attempted">, string][]
                    ).map(([v, label]) => (
                      <button
                        key={v}
                        onClick={() => set(q.id, v)}
                        className={cx(
                          "rounded-full border px-3 py-1 text-xs transition-colors",
                          st === v
                            ? "border-accent-500/60 bg-accent-500/10 text-accent-600 dark:text-accent-400"
                            : "border-ink-200 text-ink-400 hover:border-ink-300 dark:border-ink-700"
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
