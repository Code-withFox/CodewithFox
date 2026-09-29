import { useMemo, useState } from "react";
import { PageHeader, Card, Badge, Select, Button, EmptyState } from "@/components/ui";
import { questions } from "@/data/questions";
import { useQuestionStatus } from "@/hooks/useStudyData";
import { CheckCircle2, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { cx } from "@/lib/utils";

export default function QuestionsPage() {
  const [subject, setSubject] = useState("all");
  const [chapter, setChapter] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const { map: statuses, set } = useQuestionStatus();
  const [open, setOpen] = useState<string | null>(null);

  const subjectList = useMemo(() => [...new Set(questions.map((q) => q.subject))].sort(), []);
  const chapterList = useMemo(
    () => [...new Set(questions.filter((q) => subject === "all" || q.subject === subject).map((q) => q.chapter))],
    [subject]
  );

  const filtered = useMemo(
    () =>
      questions.filter((q) => {
        if (subject !== "all" && q.subject !== subject) return false;
        if (chapter !== "all" && q.chapter !== chapter) return false;
        if (difficulty !== "all" && q.difficulty !== difficulty) return false;
        if (type !== "all" && q.type !== type) return false;
        if (status !== "all" && (statuses[q.id] ?? "attempted") !== status && !(status === "unattempted" && statuses[q.id])) return false;
        return true;
      }),
    [subject, chapter, difficulty, type, status, statuses]
  );

  return (
    <div>
      <PageHeader
        eyebrow="/study/questions"
        title="Question bank"
        subtitle="Every question in the system, filterable and trackable. Your statuses persist."
      />

      <div className="mb-6 grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
        <Select value={subject} onChange={(e) => { setSubject(e.target.value); setChapter("all"); }} aria-label="Filter subject">
          <option value="all">All subjects</option>
          {subjectList.map((s) => <option key={s}>{s}</option>)}
        </Select>
        <Select value={chapter} onChange={(e) => setChapter(e.target.value)} aria-label="Filter chapter">
          <option value="all">All chapters</option>
          {chapterList.map((c) => <option key={c}>{c}</option>)}
        </Select>
        <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} aria-label="Filter difficulty">
          <option value="all">All difficulties</option>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </Select>
        <Select value={type} onChange={(e) => setType(e.target.value)} aria-label="Filter type">
          <option value="all">All types</option>
          <option value="mcq">MCQ</option>
          <option value="true-false">True/False</option>
          <option value="multi">Multiple answers</option>
          <option value="code-output">Code output</option>
          <option value="sql-output">SQL output</option>
        </Select>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter status">
          <option value="all">Any status</option>
          <option value="unattempted">Unattempted</option>
          <option value="correct">Correct</option>
          <option value="needs-revision">Needs revision</option>
          <option value="mastered">Mastered</option>
        </Select>
      </div>

      <p className="mb-4 text-xs text-ink-400">{filtered.length} questions</p>

      <div className="space-y-3">
        {filtered.map((q) => {
          const st = statuses[q.id];
          const isOpen = open === q.id;
          const pickedCode = q.code;
          return (
            <Card key={q.id} className="p-4">
              <button
                className="flex w-full items-start gap-3 text-left"
                onClick={() => setOpen(isOpen ? null : q.id)}
                aria-expanded={isOpen}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge tone="accent">{q.subject}</Badge>
                    <Badge>{q.difficulty}</Badge>
                    {st && (
                      <Badge tone={st === "correct" || st === "mastered" ? "green" : st === "needs-revision" ? "red" : "neutral"}>
                        {st}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-2 text-sm font-medium">{q.question}</p>
                </div>
                {isOpen ? <ChevronUp className="h-4 w-4 shrink-0 text-ink-400" /> : <ChevronDown className="h-4 w-4 shrink-0 text-ink-400" />}
              </button>

              {isOpen && (
                <div className="mt-4 border-t border-ink-200 pt-4 dark:border-ink-700">
                  {pickedCode && (
                    <pre className="mb-3 overflow-x-auto rounded-lg border border-ink-200 bg-ink-50 p-3 font-mono text-xs dark:border-ink-700 dark:bg-ink-950">
                      {pickedCode}
                    </pre>
                  )}
                  <ul className="space-y-1.5">
                    {q.options.map((opt, i) => (
                      <li
                        key={i}
                        className={cx(
                          "rounded-lg border px-3 py-2 text-sm",
                          q.answerIndexes.includes(i)
                            ? "border-emerald-500/50 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400"
                            : "border-ink-200 text-ink-500 dark:border-ink-700 dark:text-ink-400"
                        )}
                      >
                        {opt}
                        {q.answerIndexes.includes(i) && (
                          <CheckCircle2 className="ml-2 inline h-3.5 w-3.5" />
                        )}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-sm text-ink-500 dark:text-ink-400">
                    <span className="font-medium text-ink-700 dark:text-ink-200">Why:</span> {q.explanation}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary" onClick={() => set(q.id, "correct")}>
                      <CheckCircle2 className="h-3.5 w-3.5" /> Mark correct
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => set(q.id, "needs-revision")}>
                      <XCircle className="h-3.5 w-3.5" /> Needs revision
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => set(q.id, "mastered")}>
                      Mastered
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <EmptyState title="No questions match those filters" hint="Widen the filters to see more." />
        )}
      </div>
    </div>
  );
}
