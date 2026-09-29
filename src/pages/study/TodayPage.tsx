import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader, Card, Button, Badge, Select, inputClass } from "@/components/ui";
import { useTodayPlan, useStudySessions, useFlashcards } from "@/hooks/useStudyData";
import { subjects } from "@/data/subjects";
import { formatMinutes, cx } from "@/lib/utils";
import { CheckSquare, Square, Play, Pause, RotateCcw, Plus, Trash2, Pencil } from "lucide-react";

const MODES = [
  { id: "pomodoro", label: "Pomodoro", minutes: 25 },
  { id: "deep", label: "Deep (50m)", minutes: 50 },
  { id: "custom", label: "Custom", minutes: 15 },
] as const;

export default function TodayPage() {
  const { tasks, toggle, add, remove, edit } = useTodayPlan();
  const { add: logSession, todayMinutes } = useStudySessions();
  const { dueToday } = useFlashcards();

  const [mode, setMode] = useState<(typeof MODES)[number]["id"]>("pomodoro");
  const [customMin, setCustomMin] = useState(15);
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [subject, setSubject] = useState(subjects[0]?.name ?? "Python");
  const [topic, setTopic] = useState("");
  const [sessionNotes, setSessionNotes] = useState("");
  const [justCompleted, setJustCompleted] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const targetMinutes = mode === "custom" ? customMin : MODES.find((m) => m.id === mode)!.minutes;

  useEffect(() => {
    if (!running) setSeconds(targetMinutes * 60);
  }, [targetMinutes, running]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          window.clearInterval(intervalRef.current!);
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running]);

  const complete = () => {
    const spent = targetMinutes * 60 - seconds;
    const minutes = Math.max(1, Math.round(spent / 60));
    logSession({
      date: new Date().toISOString().slice(0, 10),
      subject,
      topic: topic || subject,
      minutes,
      notes: sessionNotes,
    });
    setJustCompleted(`${minutes}m logged: ${subject} — ${topic || subject}`);
    setSeconds(targetMinutes * 60);
    setSessionNotes("");
  };

  const doneCount = tasks.filter((t) => t.done).length;
  const pct = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  const weeklyContext = useMemo(
    () => [
      { label: "Logged today", value: formatMinutes(todayMinutes) },
      { label: "Cards due", value: `${dueToday.length}` },
      { label: "Plan progress", value: `${pct}%` },
    ],
    [todayMinutes, dueToday.length, pct]
  );

  return (
    <div>
      <PageHeader
        eyebrow="/study/today"
        title="Today"
        subtitle="Daily plan + study timer. Completed sessions are logged to history and the heatmap."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Plan */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Today's plan</h2>
            <Badge tone={pct === 100 ? "green" : "accent"}>{doneCount}/{tasks.length}</Badge>
          </div>
          <ul className="mt-4 space-y-2">
            {tasks.map((t) => (
              <li key={t.id} className="group flex items-center gap-3 rounded-lg border border-ink-200 px-3 py-2.5 dark:border-ink-700">
                <button onClick={() => toggle(t.id)} aria-label={t.done ? "Mark incomplete" : "Mark complete"}>
                  {t.done ? (
                    <CheckSquare className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <Square className="h-5 w-5 text-ink-300 dark:text-ink-600" />
                  )}
                </button>
                {editingId === t.id ? (
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        edit(t.id, editText);
                        setEditingId(null);
                      }
                    }}
                    className={cx(inputClass, "py-1")}
                    autoFocus
                  />
                ) : (
                  <span className={cx("flex-1 text-sm", t.done && "text-ink-400 line-through")}>{t.text}</span>
                )}
                <span className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => { setEditingId(t.id); setEditText(t.text); }}
                    className="text-ink-300 hover:text-accent-500"
                    aria-label="Edit task"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => remove(t.id)} className="text-ink-300 hover:text-red-500" aria-label="Delete task">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-2">
            <input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newTask.trim()) {
                  add(newTask.trim());
                  setNewTask("");
                }
              }}
              placeholder="Add a task…"
              className={inputClass}
              aria-label="New task"
            />
            <Button
              onClick={() => {
                if (newTask.trim()) {
                  add(newTask.trim());
                  setNewTask("");
                }
              }}
              aria-label="Add task"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-ink-200 pt-4 text-center dark:border-ink-700">
            {weeklyContext.map((s) => (
              <div key={s.label}>
                <p className="font-mono text-lg text-accent-500">{s.value}</p>
                <p className="text-[11px] text-ink-400">{s.label}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Timer */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold">Study timer</h2>
          <div className="mt-3 flex rounded-lg border border-ink-200 dark:border-ink-700">
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => { setMode(m.id); setRunning(false); }}
                className={cx(
                  "flex-1 py-2 text-xs font-medium",
                  mode === m.id ? "bg-accent-500/10 text-accent-600 dark:text-accent-400" : "text-ink-500 dark:text-ink-400"
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
          {mode === "custom" && (
            <div className="mt-3">
              <label className="text-xs text-ink-400">Minutes: {customMin}</label>
              <input
                type="range"
                min={5}
                max={90}
                step={5}
                value={customMin}
                onChange={(e) => setCustomMin(Number(e.target.value))}
                className="w-full accent-orange-500"
                aria-label="Custom minutes"
              />
            </div>
          )}

          <div className="my-6 text-center">
            <p className="font-mono text-5xl font-light tabular-nums">
              {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}
            </p>
            <p className="mt-1 text-xs text-ink-400">
              {running ? "Focusing…" : seconds === 0 ? "Session complete" : `Target: ${targetMinutes} minutes`}
            </p>
          </div>

          <div className="flex justify-center gap-3">
            {!running && seconds > 0 && (
              <Button onClick={() => setRunning(true)}>
                <Play className="h-4 w-4" /> Start
              </Button>
            )}
            {running && (
              <Button onClick={() => setRunning(false)} variant="secondary">
                <Pause className="h-4 w-4" /> Pause
              </Button>
            )}
            <Button variant="ghost" onClick={() => { setRunning(false); setSeconds(targetMinutes * 60); }}>
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
          </div>

          <div className="mt-6 space-y-3 border-t border-ink-200 pt-4 dark:border-ink-700">
            <div className="grid grid-cols-2 gap-3">
              <Select value={subject} onChange={(e) => setSubject(e.target.value)} aria-label="Session subject">
                {subjects.map((s) => (
                  <option key={s.slug} value={s.name}>{s.name}</option>
                ))}
              </Select>
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Topic (e.g. JOINs)"
                className={inputClass}
                aria-label="Session topic"
              />
            </div>
            <input
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="Session notes (optional)"
              className={inputClass}
              aria-label="Session notes"
            />
            <Button className="w-full" onClick={complete} disabled={seconds === targetMinutes * 60 && !running}>
              Log session ({formatMinutes(Math.max(0, (targetMinutes * 60 - seconds) / 60))})
            </Button>
            {justCompleted && (
              <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-center text-sm text-emerald-600 dark:text-emerald-400">
                ✓ {justCompleted} — see <Link to="/study/history" className="underline">history</Link>
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
