import { useMemo, useState } from "react";
import { PageHeader, Card, Badge, Button, Select, inputClass, EmptyState } from "@/components/ui";
import { useFlashcards } from "@/hooks/useStudyData";
import { shuffle, cx } from "@/lib/utils";
import { AnimatePresence, motion } from "@/lib/motion";
import {
  RotateCw,
  Shuffle,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  EyeOff,
} from "lucide-react";

export default function FlashcardsPage() {
  const { all, deck, grade, toggleMastered, toggleDifficult, addCustom, removeCustom } = useFlashcards();
  const [order, setOrder] = useState(0); // changes to reshuffle
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [mode, setMode] = useState<"all" | "due" | "difficult">("all");
  const [showNew, setShowNew] = useState(false);
  const [draft, setDraft] = useState({ subject: "SQL", topic: "", front: "", back: "" });

  const subjectsOf = useMemo(() => ["all", ...new Set(all.map((c) => c.subject))], [all]);

  const pool = useMemo(() => {
    let list = all;
    if (subjectFilter !== "all") list = list.filter((c) => c.subject === subjectFilter);
    if (mode === "due") {
      const today = new Date().toISOString().slice(0, 10);
      list = list.filter((c) => {
        if (deck.mastered.includes(c.id)) return false;
        const st = deck.state[c.id];
        return !st || st.due <= today;
      });
    }
    if (mode === "difficult") list = list.filter((c) => deck.difficult.includes(c.id));
    return order % 2 === 1 ? shuffle(list) : list;
  }, [all, subjectFilter, mode, deck, order]);

  const card = pool[index % Math.max(pool.length, 1)];

  const next = () => {
    setFlipped(false);
    setIndex((i) => (i + 1) % Math.max(pool.length, 1));
  };
  const prev = () => {
    setFlipped(false);
    setIndex((i) => (i - 1 + Math.max(pool.length, 1)) % Math.max(pool.length, 1));
  };

  const rate = (g: "again" | "hard" | "good" | "easy") => {
    if (!card) return;
    grade(card.id, g);
    next();
  };

  return (
    <div>
      <PageHeader
        eyebrow="/study/flashcards"
        title="Flashcards"
        subtitle="Flip, grade honestly, and the spaced revision schedule does the rest."
        actions={
          <Button variant="secondary" size="sm" onClick={() => setShowNew((s) => !s)}>
            <Plus className="h-3.5 w-3.5" /> New card
          </Button>
        }
      />

      {showNew && (
        <Card className="mb-6 p-5">
          <h2 className="font-semibold">Create a flashcard</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <input
              className={inputClass}
              placeholder="Subject (e.g. SQL)"
              value={draft.subject}
              onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Topic (e.g. JOIN)"
              value={draft.topic}
              onChange={(e) => setDraft({ ...draft, topic: e.target.value })}
            />
            <input
              className={cx(inputClass, "sm:col-span-2")}
              placeholder="Front — the question"
              value={draft.front}
              onChange={(e) => setDraft({ ...draft, front: e.target.value })}
            />
            <input
              className={cx(inputClass, "sm:col-span-2")}
              placeholder="Back — the answer"
              value={draft.back}
              onChange={(e) => setDraft({ ...draft, back: e.target.value })}
            />
          </div>
          <div className="mt-3 flex gap-2">
            <Button
              onClick={() => {
                if (draft.front && draft.back) {
                  addCustom(draft);
                  setDraft({ subject: "SQL", topic: "", front: "", back: "" });
                  setShowNew(false);
                }
              }}
            >
              Save card
            </Button>
            <Button variant="ghost" onClick={() => setShowNew(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Select value={subjectFilter} onChange={(e) => { setSubjectFilter(e.target.value); setIndex(0); setFlipped(false); }} className="w-auto">
          {subjectsOf.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All subjects" : s}
            </option>
          ))}
        </Select>
        <div className="flex rounded-lg border border-ink-200 dark:border-ink-700">
          {(["all", "due", "difficult"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setIndex(0); setFlipped(false); }}
              className={cx(
                "px-3 py-1.5 text-xs capitalize",
                mode === m ? "bg-accent-500/10 text-accent-600 dark:text-accent-400" : "text-ink-500 dark:text-ink-400"
              )}
            >
              {m === "due" ? "Due now" : m}
            </button>
          ))}
        </div>
        <Button variant="ghost" size="sm" onClick={() => { setOrder((o) => o + 1); setIndex(0); }}>
          <Shuffle className="h-3.5 w-3.5" /> Shuffle
        </Button>
        <span className="ml-auto text-xs text-ink-400">
          {pool.length} cards · {deck.mastered.length} mastered
        </span>
      </div>

      {pool.length === 0 ? (
        <EmptyState title="No cards in this view" hint="Switch filters or add a custom card." />
      ) : (
        card && (
          <div className="mx-auto max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${card.id}-${index}`}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.18 }}
              >
                <Card
                  className="flex min-h-[240px] cursor-pointer flex-col p-8"
                  interactive
                >
                  <button onClick={() => setFlipped((f) => !f)} className="flex flex-1 flex-col text-left">
                    <div className="mb-4 flex items-center gap-2">
                      <Badge tone="accent">{card.subject}</Badge>
                      <span className="text-xs text-ink-400">{card.topic}</span>
                      {deck.mastered.includes(card.id) && (
                        <Badge tone="green"><CheckCircle2 className="h-3 w-3" /> mastered</Badge>
                      )}
                      {deck.difficult.includes(card.id) && (
                        <Badge tone="red"><AlertTriangle className="h-3 w-3" /> difficult</Badge>
                      )}
                    </div>
                    <p className="flex-1 text-lg font-medium leading-relaxed">
                      {flipped ? card.back : card.front}
                    </p>
                    <p className="mt-4 inline-flex items-center gap-1 text-xs text-ink-400">
                      <RotateCw className="h-3 w-3" /> {flipped ? "click to see question" : "click to flip"}
                    </p>
                  </button>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Grading */}
            {flipped && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 grid grid-cols-4 gap-2"
              >
                <Button variant="danger" size="sm" onClick={() => rate("again")}>Again</Button>
                <Button variant="secondary" size="sm" onClick={() => rate("hard")}>Hard</Button>
                <Button variant="primary" size="sm" onClick={() => rate("good")}>Good</Button>
                <Button variant="secondary" size="sm" onClick={() => rate("easy")}>Easy</Button>
              </motion.div>
            )}

            <div className="mt-4 flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={prev}>
                <ArrowLeft className="h-4 w-4" /> Prev
              </Button>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => toggleMastered(card.id)}>
                  <CheckCircle2 className="h-4 w-4" /> Mastered
                </Button>
                <Button variant="ghost" size="sm" onClick={() => toggleDifficult(card.id)}>
                  <EyeOff className="h-4 w-4" /> Difficult
                </Button>
              </div>
              <Button variant="ghost" size="sm" onClick={next}>
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-center text-xs text-ink-400">
              Card {(index % pool.length) + 1} of {pool.length}
            </p>
          </div>
        )
      )}

      {/* Custom cards management */}
      {deck.custom.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-3 text-lg font-semibold">Your custom cards</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {deck.custom.map((c) => (
              <Card key={c.id} className="flex items-start gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{c.front}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-ink-400">{c.back}</p>
                  <p className="mt-1 font-mono text-[10px] text-ink-400">
                    {c.subject} · {c.topic}
                  </p>
                </div>
                <button
                  onClick={() => removeCustom(c.id)}
                  aria-label="Delete card"
                  className="text-ink-300 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
