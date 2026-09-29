import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { PageHeader, Card, Badge, Button, Select, Progress } from "@/components/ui";
import { questions } from "@/data/questions";
import { useQuizAttempts } from "@/hooks/useStudyData";
import { shuffle, cx, formatMinutes } from "@/lib/utils";
import { CheckCircle2, XCircle, Clock, Trophy } from "lucide-react";

type Phase = "setup" | "running" | "done";
type Mode = "quiz" | "exam";

interface Answer {
  qIndex: number;
  picked: number[];
  correct: boolean;
}

export default function QuizPage() {
  const [params] = useSearchParams();
  const { add } = useQuizAttempts();

  const [phase, setPhase] = useState<Phase>("setup");
  const [mode, setMode] = useState<Mode>("quiz");
  const [subject, setSubject] = useState(params.get("subject") ?? "SQL");
  const [count, setCount] = useState(10);
  const [difficulty, setDifficulty] = useState("all");
  const [limitMin, setLimitMin] = useState(30);

  const [quiz, setQuiz] = useState<typeof questions>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [picked, setPicked] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [startedAt, setStartedAt] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const available = useMemo(
    () => [...new Set(questions.map((q) => q.subject))].sort(),
    []
  );

  const pool = useMemo(() => {
    let list = questions.filter((q) => q.subject === subject);
    if (difficulty !== "all") list = list.filter((q) => q.difficulty === difficulty);
    return list;
  }, [subject, difficulty]);

  // timer
  useEffect(() => {
    if (phase !== "running") return;
    const id = window.setInterval(() => setElapsed(Date.now() - startedAt), 500);
    return () => window.clearInterval(id);
  }, [phase, startedAt]);

  const finish = useCallback(
    (finalAnswers: Answer[], quizList: typeof questions) => {
      const correct = finalAnswers.filter((a) => a.correct).length;
      const weak = [...new Set(
        finalAnswers
          .map((a, i) => ({ a, q: quizList[i] }))
          .filter(({ a }) => !a.correct)
          .map(({ q }) => q.topic)
      )];
      add({
        subject,
        date: new Date().toISOString(),
        total: quizList.length,
        correct,
        timeMs: Date.now() - startedAt,
        weakTopics: weak,
        mode,
      });
      setPhase("done");
    },
    [add, mode, startedAt, subject]
  );

  const start = () => {
    const chosen = shuffle(pool).slice(0, Math.min(count, pool.length));
    setQuiz(chosen);
    setAnswers([]);
    setCurrent(0);
    setPicked([]);
    setChecked(false);
    setStartedAt(Date.now());
    setElapsed(0);
    setPhase("running");
  };

  const check = () => {
    if (!quiz[current]) return;
    const q = quiz[current];
    const sortedPick = [...picked].sort().join(",");
    const sortedAns = [...q.answerIndexes].sort().join(",");
    const correct = sortedPick === sortedAns;
    const answer: Answer = { qIndex: current, picked, correct };
    const nextAnswers = [...answers.filter((a) => a.qIndex !== current), answer];
    setAnswers(nextAnswers);
    setChecked(true);
    // in exam mode auto-advance
    if (mode === "exam") {
      window.setTimeout(() => advance(nextAnswers), 900);
    }
  };

  const advance = (currentAnswers: Answer[]) => {
    if (current + 1 >= quiz.length) {
      finish(currentAnswers, quiz);
    } else {
      setCurrent((c) => c + 1);
      setPicked(quiz[current + 1] ? [] : []);
      setChecked(false);
    }
  };

  const next = () => advance(answers);

  // exam timeout
  useEffect(() => {
    if (phase !== "running" || mode !== "exam") return;
    const remaining = limitMin * 60_000 - elapsed;
    if (remaining <= 0 && startedAt > 0) {
      finish(answers, quiz);
    }
  }, [phase, mode, elapsed, limitMin, startedAt, answers, quiz, finish]);

  /* ------------------------------- SETUP VIEW ------------------------------- */
  if (phase === "setup") {
    return (
      <div>
        <PageHeader
          eyebrow="/study/quiz"
          title={mode === "exam" ? "Exam mode" : "Quiz"}
          subtitle="Scored questions with explanations. Every attempt feeds weak-topic detection."
        />
        <div className="mx-auto max-w-lg">
          <div className="mb-5 flex rounded-lg border border-ink-200 dark:border-ink-700">
            {(["quiz", "exam"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cx(
                  "flex-1 py-2 text-sm font-medium",
                  mode === m ? "bg-accent-500/10 text-accent-600 dark:text-accent-400" : "text-ink-500 dark:text-ink-400"
                )}
              >
                {m === "quiz" ? "Practice quiz" : "Exam mode (timed)"}
              </button>
            ))}
          </div>

          <Card className="space-y-4 p-6">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Subject</label>
              <Select value={subject} onChange={(e) => setSubject(e.target.value)}>
                {available.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
              <p className="mt-1 text-xs text-ink-400">{pool.length} questions available</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Questions</label>
                <Select value={count} onChange={(e) => setCount(Number(e.target.value))}>
                  {[5, 10, 15, 20, 30].map((n) => (
                    <option key={n} value={n}>{n} questions</option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Difficulty</label>
                <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option value="all">All levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </Select>
              </div>
            </div>
            {mode === "exam" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium">Time limit</label>
                <Select value={limitMin} onChange={(e) => setLimitMin(Number(e.target.value))}>
                  {[10, 15, 30, 45, 60].map((n) => (
                    <option key={n} value={n}>{n} minutes</option>
                  ))}
                </Select>
              </div>
            )}
            <Button className="w-full" onClick={start} disabled={pool.length === 0}>
              Start {mode === "exam" ? "Exam" : "Quiz"}
            </Button>
            {pool.length === 0 && (
              <p className="text-center text-xs text-ink-400">
                No questions for this filter — try another subject or difficulty.
              </p>
            )}
          </Card>

          <div className="mt-6">
            <h2 className="mb-2 text-sm font-semibold text-ink-400">Recent attempts</h2>
            <RecentAttempts />
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------------ RUNNING VIEW ------------------------------ */
  if (phase === "running" && quiz[current]) {
    const q = quiz[current];
    const isMulti = q.type === "multi";
    const remainingMs = mode === "exam" ? Math.max(0, limitMin * 60_000 - elapsed) : null;
    return (
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 flex items-center justify-between text-sm">
          <span className="text-ink-400">
            Question {current + 1} of {quiz.length}
          </span>
          {remainingMs !== null && (
            <span className={cx("inline-flex items-center gap-1 font-mono", remainingMs < 60_000 ? "text-red-500" : "text-ink-400")}>
              <Clock className="h-3.5 w-3.5" />
              {formatMinutes(remainingMs / 60_000)} left
            </span>
          )}
        </div>
        <Progress value={((current + (checked ? 1 : 0)) / quiz.length) * 100} className="mb-6" />

        <Card className="p-6 sm:p-8">
          <div className="mb-3 flex flex-wrap gap-1.5">
            <Badge tone="accent">{q.subject}</Badge>
            <Badge>{q.difficulty}</Badge>
            <Badge>{q.type}</Badge>
          </div>
          <h2 className="text-lg font-medium leading-relaxed">{q.question}</h2>
          {q.code && (
            <pre className="mt-4 overflow-x-auto rounded-lg border border-ink-200 bg-ink-50 p-4 font-mono text-[13px] dark:border-ink-700 dark:bg-ink-950">
              {q.code}
            </pre>
          )}

          <div className="mt-5 space-y-2">
            {q.options.map((opt, i) => {
              const isPicked = picked.includes(i);
              const isAnswer = q.answerIndexes.includes(i);
              return (
                <button
                  key={i}
                  disabled={checked}
                  onClick={() => {
                    if (isMulti) {
                      setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));
                    } else {
                      setPicked([i]);
                    }
                  }}
                  className={cx(
                    "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                    checked
                      ? isAnswer
                        ? "border-emerald-500/60 bg-emerald-500/10"
                        : isPicked
                          ? "border-red-500/60 bg-red-500/10"
                          : "border-ink-200 opacity-60 dark:border-ink-700"
                      : isPicked
                        ? "border-accent-500/60 bg-accent-500/10"
                        : "border-ink-200 hover:border-accent-500/40 dark:border-ink-700"
                  )}
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current font-mono text-[10px]">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1">{opt}</span>
                  {checked && isAnswer && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                  {checked && !isAnswer && isPicked && <XCircle className="h-4 w-4 text-red-500" />}
                </button>
              );
            })}
          </div>

          {checked && (
            <div className="mt-4 rounded-lg border border-ink-200 bg-ink-50 p-4 text-sm dark:border-ink-700 dark:bg-ink-900">
              <p className="font-medium">{answers.find((a) => a.qIndex === current)?.correct ? "Correct" : "Not quite"}</p>
              <p className="mt-1 text-ink-500 dark:text-ink-400">{q.explanation}</p>
            </div>
          )}

          <div className="mt-6 flex justify-end gap-2">
            {!checked ? (
              <Button onClick={check} disabled={picked.length === 0}>
                Check answer
              </Button>
            ) : (
              <Button onClick={next}>
                {current + 1 >= quiz.length ? "Finish" : "Next question"}
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  /* ------------------------------- DONE VIEW -------------------------------- */
  if (phase === "done") {
    const total = quiz.length || 1;
    const correct = answers.filter((a) => a.correct).length;
    const scorePct = Math.round((correct / total) * 100);
    const wrong = quiz.filter((q, i) => {
      const a = answers.find((x) => x.qIndex === i);
      return !a || !a.correct;
    });
    const weakTopics = [...new Set(wrong.map((q) => q.topic))];
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="p-8 text-center">
          <Trophy className={cx("mx-auto h-10 w-10", scorePct >= 70 ? "text-emerald-500" : "text-amber-500")} />
          <h1 className="mt-3 text-2xl font-semibold">
            {scorePct >= 90 ? "Outstanding" : scorePct >= 70 ? "Solid work" : "Needs revision"}
          </h1>
          <p className="mt-1 font-mono text-4xl text-accent-500">{scorePct}%</p>
          <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
            {correct} of {total} correct · {formatMinutes(elapsed / 60_000)} used · {quiz[0]?.subject}
          </p>

          {weakTopics.length > 0 ? (
            <div className="mt-6 text-left">
              <h2 className="text-sm font-semibold">Weak topics to revise</h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {weakTopics.map((t) => (
                  <Badge key={t} tone="amber">{t}</Badge>
                ))}
              </div>
              <Link to="/study/revision" className="mt-3 inline-block text-sm text-accent-500 hover:underline">
                Start a revision session →
              </Link>
            </div>
          ) : (
            <p className="mt-6 text-sm text-emerald-600 dark:text-emerald-400">
              Nothing weak detected. Keep going.
            </p>
          )}

          <div className="mt-8 flex justify-center gap-3">
            <Button onClick={() => setPhase("setup")}>New quiz</Button>
            <Link to="/dashboard">
              <Button variant="secondary">Dashboard</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return null;
}

function RecentAttempts() {
  const { attempts } = useQuizAttempts();
  if (attempts.length === 0) return <p className="text-xs text-ink-400">No attempts yet.</p>;
  return (
    <ul className="space-y-1.5">
      {attempts.slice(0, 5).map((a) => (
        <li key={a.id} className="flex items-center justify-between rounded-lg border border-ink-200 px-3 py-2 text-sm dark:border-ink-700">
          <span>{a.subject} <span className="text-xs text-ink-400">({a.mode})</span></span>
          <span className="font-mono text-xs">
            {a.correct}/{a.total} · {Math.round((a.correct / a.total) * 100)}%
          </span>
        </li>
      ))}
    </ul>
  );
}
