import { useCallback, useMemo } from "react";
import { usePersistentState } from "./usePersistentState";
import { roadmap } from "@/data/roadmap";
import { subjects } from "@/data/subjects";
import { flashcards as seedFlashcards } from "@/data/flashcards";
import { seedGoals, seedTodayPlan } from "@/data/now";
import type { LearningStatus } from "@/types";
import { dayKey, uid } from "@/lib/utils";

/* ------------------------------ Roadmap status ----------------------------- */

export interface RoadmapProgress {
  [nodeId: string]: LearningStatus;
}

export function useRoadmapProgress() {
  const [statuses, setStatuses] = usePersistentState<RoadmapProgress>("roadmap-status", {});
  const set = useCallback(
    (nodeId: string, status: LearningStatus) => {
      setStatuses((prev) => ({ ...prev, [nodeId]: status }));
    },
    [setStatuses]
  );
  const statusOf = useCallback(
    (nodeId: string): LearningStatus => statuses[nodeId] ?? roadmap.find((n) => n.id === nodeId)?.status ?? "not-started",
    [statuses]
  );
  const completed = useMemo(
    () => roadmap.filter((n) => statusOf(n.id) === "completed").length,
    [statusOf]
  );
  const started = useMemo(
    () => roadmap.filter((n) => statusOf(n.id) !== "not-started").length,
    [statusOf]
  );
  return { statuses, set, statusOf, completed, started, total: roadmap.length };
}

/* ------------------------------ Chapter status ----------------------------- */

export interface ChapterProgress {
  [subjectChapter: string]: LearningStatus; // "python:6"
}

export function useChapterProgress() {
  const [statuses, setStatuses] = usePersistentState<ChapterProgress>("chapter-status", {});
  const key = (subject: string, num: number) => `${subject}:${num}`;
  const set = useCallback(
    (subject: string, num: number, status: LearningStatus) => {
      setStatuses((prev) => ({ ...prev, [key(subject, num)]: status }));
    },
    [setStatuses]
  );
  const statusOf = useCallback(
    (subject: string, num: number, fallback: LearningStatus): LearningStatus =>
      statuses[key(subject, num)] ?? fallback,
    [statuses]
  );
  const subjectProgress = useCallback(
    (slug: string) => {
      const subj = subjects.find((s) => s.slug === slug);
      if (!subj || subj.chapters.length === 0) return 0;
      const done = subj.chapters.filter(
        (c) => statusOf(slug, c.number, c.status) === "completed"
      ).length;
      const learning = subj.chapters.filter(
        (c) => ["learning", "practicing", "revision"].includes(statusOf(slug, c.number, c.status))
      ).length;
      return Math.round(((done + learning * 0.5) / subj.chapters.length) * 100);
    },
    [statusOf]
  );
  return { statuses, set, statusOf, subjectProgress };
}

/* ------------------------------ Quiz attempts ------------------------------ */

export interface QuizAttempt {
  id: string;
  subject: string;
  date: string;
  total: number;
  correct: number;
  timeMs: number;
  weakTopics: string[];
  mode: "quiz" | "exam";
}

export function useQuizAttempts() {
  const [attempts, setAttempts] = usePersistentState<QuizAttempt[]>("quiz-attempts", []);
  const add = useCallback(
    (a: Omit<QuizAttempt, "id">) => setAttempts((prev) => [{ ...a, id: uid() }, ...prev].slice(0, 200)),
    [setAttempts]
  );
  const accuracy = useCallback(() => {
    if (attempts.length === 0) return null;
    const total = attempts.reduce((s, a) => s + a.total, 0);
    const correct = attempts.reduce((s, a) => s + a.correct, 0);
    return total === 0 ? null : Math.round((correct / total) * 100);
  }, [attempts]);
  const weakTopics = useCallback(() => {
    const map = new Map<string, { correct: number; total: number }>();
    for (const a of attempts) {
      const share = a.total > 0 ? a.correct / a.total : 0;
      for (const t of a.weakTopics) {
        const cur = map.get(t) ?? { correct: 0, total: 0 };
        cur.total += 1;
        cur.correct += share;
        map.set(t, cur);
      }
    }
    return [...map.entries()]
      .map(([topic, v]) => ({ topic, score: Math.round((v.correct / v.total) * 100) }))
      .filter((t) => t.score < 75)
      .sort((a, b) => a.score - b.score)
      .slice(0, 6);
  }, [attempts]);
  return { attempts, add, accuracy, weakTopics };
}

/* ------------------------------ Study sessions ----------------------------- */

export interface StudySession {
  id: string;
  date: string; // YYYY-MM-DD
  subject: string;
  topic: string;
  minutes: number;
  notes: string;
}

export function useStudySessions() {
  const [sessions, setSessions] = usePersistentState<StudySession[]>("study-sessions", []);
  const add = useCallback(
    (s: Omit<StudySession, "id">) => setSessions((prev) => [{ ...s, id: uid() }, ...prev].slice(0, 500)),
    [setSessions]
  );
  const remove = useCallback(
    (id: string) => setSessions((prev) => prev.filter((s) => s.id !== id)),
    [setSessions]
  );
  const totalMinutes = useMemo(() => sessions.reduce((s, x) => s + x.minutes, 0), [sessions]);
  const todayMinutes = useMemo(() => {
    const t = dayKey(new Date());
    return sessions.filter((s) => s.date === t).reduce((s, x) => s + x.minutes, 0);
  }, [sessions]);
  const weekMinutes = useMemo(() => {
    const now = new Date();
    let sum = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const k = dayKey(d);
      sum += sessions.filter((s) => s.date === k).reduce((s, x) => s + x.minutes, 0);
    }
    return sum;
  }, [sessions]);
  const monthMinutes = useMemo(() => {
    const now = new Date();
    const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    return sessions.filter((s) => s.date.startsWith(prefix)).reduce((s, x) => s + x.minutes, 0);
  }, [sessions]);
  const streak = useMemo(() => {
    const days = new Set(sessions.filter((s) => s.minutes > 0).map((s) => s.date));
    let count = 0;
    const d = new Date();
    // allow today to be empty without breaking yesterday's streak
    if (!days.has(dayKey(d))) d.setDate(d.getDate() - 1);
    while (days.has(dayKey(d))) {
      count += 1;
      d.setDate(d.getDate() - 1);
    }
    return count;
  }, [sessions]);
  const heatmap = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of sessions) map.set(s.date, (map.get(s.date) ?? 0) + s.minutes);
    return map;
  }, [sessions]);
  const mostStudied = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of sessions) map.set(s.subject, (map.get(s.subject) ?? 0) + s.minutes);
    const sorted = [...map.entries()].sort((a, b) => b[1] - a[1]);
    return sorted[0] ? { subject: sorted[0][0], minutes: sorted[0][1] } : null;
  }, [sessions]);
  return { sessions, add, remove, totalMinutes, todayMinutes, weekMinutes, monthMinutes, streak, heatmap, mostStudied };
}

/* --------------------------- Flashcards + revision ------------------------- */

export interface CardState {
  ease: number; // 1.3–2.5
  interval: number; // days
  due: string; // ISO date
  reps: number;
  lapses: number;
}

export interface FlashcardDeck {
  custom: import("@/types").Flashcard[];
  state: Record<string, CardState>;
  mastered: string[];
  difficult: string[];
}

const DAY = 86_400_000;

function schedule(state: CardState | undefined, grade: "again" | "hard" | "good" | "easy"): CardState {
  const base: CardState = state ?? { ease: 2.5, interval: 0, due: dayKey(new Date()), reps: 0, lapses: 0 };
  let { ease, interval, reps, lapses } = base;
  if (grade === "again") {
    lapses += 1;
    ease = Math.max(1.3, ease - 0.2);
    interval = 0;
  } else {
    reps += 1;
    if (grade === "hard") ease = Math.max(1.3, ease - 0.05);
    if (grade === "easy") ease = Math.min(2.8, ease + 0.15);
    interval = reps === 1 ? (grade === "hard" ? 1 : grade === "good" ? 1 : 3) : Math.max(1, Math.round(interval * ease));
    if (grade === "hard") interval = Math.max(1, Math.round(interval * 0.8));
  }
  const due = dayKey(new Date(Date.now() + Math.max(grade === "again" ? 0 : interval, grade === "again" ? 0 : 1) * DAY));
  return { ease, interval: grade === "again" ? 0 : interval, due, reps, lapses };
}

export function useFlashcards() {
  const [deck, setDeck] = usePersistentState<FlashcardDeck>("flashcards", {
    custom: [],
    state: {},
    mastered: [],
    difficult: [],
  });
  const all = useMemo(() => [...seedFlashcards, ...deck.custom], [deck.custom]);
  const dueToday = useMemo(() => {
    const today = dayKey(new Date());
    return all.filter((c) => {
      if (deck.mastered.includes(c.id)) return false;
      const st = deck.state[c.id];
      return !st || st.due <= today;
    });
  }, [all, deck]);

  const grade = useCallback(
    (id: string, g: "again" | "hard" | "good" | "easy") => {
      setDeck((prev) => {
        const next = { ...prev, state: { ...prev.state } };
        next.state[id] = schedule(prev.state[id], g);
        if (g === "easy" && next.state[id].reps >= 3 && next.state[id].interval >= 14) {
          next.mastered = [...new Set([...prev.mastered, id])];
        }
        if (g === "again") next.difficult = [...new Set([...prev.difficult, id])];
        return next;
      });
    },
    [setDeck]
  );
  const toggleMastered = useCallback(
    (id: string) =>
      setDeck((prev) => ({
        ...prev,
        mastered: prev.mastered.includes(id)
          ? prev.mastered.filter((x) => x !== id)
          : [...prev.mastered, id],
      })),
    [setDeck]
  );
  const toggleDifficult = useCallback(
    (id: string) =>
      setDeck((prev) => ({
        ...prev,
        difficult: prev.difficult.includes(id)
          ? prev.difficult.filter((x) => x !== id)
          : [...prev.difficult, id],
      })),
    [setDeck]
  );
  const addCustom = useCallback(
    (c: { subject: string; topic: string; front: string; back: string }) =>
      setDeck((prev) => ({
        ...prev,
        custom: [{ id: `custom-${uid()}`, ...c }, ...prev.custom],
      })),
    [setDeck]
  );
  const removeCustom = useCallback(
    (id: string) => setDeck((prev) => ({ ...prev, custom: prev.custom.filter((c) => c.id !== id) })),
    [setDeck]
  );
  return { all, dueToday, deck, grade, toggleMastered, toggleDifficult, addCustom, removeCustom };
}

/* --------------------------------- Bookmarks ------------------------------- */

export interface Bookmark {
  path: string;
  title: string;
  category: string;
  date: string;
}

export function useBookmarks() {
  const [items, setItems] = usePersistentState<Bookmark[]>("bookmarks", []);
  const has = useCallback((path: string) => items.some((b) => b.path === path), [items]);
  const toggle = useCallback(
    (b: Omit<Bookmark, "date">) =>
      setItems((prev) =>
        prev.some((x) => x.path === b.path)
          ? prev.filter((x) => x.path !== b.path)
          : [{ ...b, date: new Date().toISOString() }, ...prev]
      ),
    [setItems]
  );
  const remove = useCallback(
    (path: string) => setItems((prev) => prev.filter((b) => b.path !== path)),
    [setItems]
  );
  return { items, has, toggle, remove };
}

/* ----------------------------------- Goals --------------------------------- */

export function useGoals() {
  const [goals, setGoals] = usePersistentState<import("@/types").GoalItem[]>("goals", seedGoals);
  const update = useCallback(
    (id: string, patch: Partial<import("@/types").GoalItem>) =>
      setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g))),
    [setGoals]
  );
  const add = useCallback(
    (g: Omit<import("@/types").GoalItem, "id">) => setGoals((prev) => [...prev, { ...g, id: uid() }]),
    [setGoals]
  );
  const remove = useCallback((id: string) => setGoals((prev) => prev.filter((g) => g.id !== id)), [setGoals]);
  return { goals, update, add, remove };
}

/* --------------------------------- Today plan ------------------------------ */

export interface PlanTask {
  id: string;
  text: string;
  done: boolean;
}

export function useTodayPlan() {
  const [tasks, setTasks] = usePersistentState<PlanTask[]>(
    "today-plan",
    seedTodayPlan.map((text) => ({ id: uid(), text, done: false }))
  );
  const toggle = useCallback(
    (id: string) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))),
    [setTasks]
  );
  const add = useCallback(
    (text: string) => setTasks((prev) => [...prev, { id: uid(), text, done: false }]),
    [setTasks]
  );
  const remove = useCallback((id: string) => setTasks((prev) => prev.filter((t) => t.id !== id)), [setTasks]);
  const edit = useCallback(
    (id: string, text: string) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t))),
    [setTasks]
  );
  return { tasks, toggle, add, remove, edit };
}

/* ------------------------------ Question status ---------------------------- */

export interface QuestionStatusMap {
  [id: string]: "attempted" | "correct" | "needs-revision" | "mastered";
}

export function useQuestionStatus() {
  const [map, setMap] = usePersistentState<QuestionStatusMap>("question-status", {});
  const set = useCallback(
    (id: string, status: QuestionStatusMap[string]) => setMap((prev) => ({ ...prev, [id]: status })),
    [setMap]
  );
  return { map, set };
}

/* --------------------------- Interview tracker ----------------------------- */

export function useInterviewTracker() {
  const [map, setMap] = usePersistentState<QuestionStatusMap>("interview-status", {});
  const set = useCallback(
    (id: string, status: QuestionStatusMap[string]) => setMap((prev) => ({ ...prev, [id]: status })),
    [setMap]
  );
  const counts = useMemo(() => {
    const c = { "not-attempted": 0, attempted: 0, correct: 0, "needs-revision": 0, mastered: 0 };
    for (const v of Object.values(map)) {
      if (v in c) c[v as keyof typeof c] += 1;
    }
    return c;
  }, [map]);
  return { map, set, counts };
}

/* -------------------------------- Quick notes ------------------------------ */

export interface QuickNote {
  id: string;
  text: string;
  link?: string;
  date: string;
}

export function useQuickNotes() {
  const [items, setItems] = usePersistentState<QuickNote[]>("quick-notes", []);
  const add = useCallback(
    (text: string, link?: string) =>
      setItems((prev) => [{ id: uid(), text, link, date: new Date().toISOString() }, ...prev]),
    [setItems]
  );
  const remove = useCallback((id: string) => setItems((prev) => prev.filter((n) => n.id !== id)), [setItems]);
  return { items, add, remove };
}
