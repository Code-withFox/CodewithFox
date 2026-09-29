import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Home,
  User,
  Wrench,
  Map,
  FolderGit2,
  GraduationCap,
  FileText,
  Mail,
  TerminalSquare,
  MoonStar,
  BookOpen,
  Brain,
  ListChecks,
  Timer,
  LayoutDashboard,
  Sparkles,
  CornerDownLeft,
  Route,
  FlaskConical,
  Boxes,
  Dumbbell,
  Target,
  Briefcase,
  Library,
  ScrollText,
  Database,
} from "lucide-react";
import { AnimatePresence, motion } from "@/lib/motion";
import { buildSearchIndex, searchDocs, type SearchHit } from "@/data/searchIndex";
import { useTheme } from "@/hooks/useTheme";
import { cx } from "@/lib/utils";

interface Command {
  id: string;
  label: string;
  path?: string;
  action?: () => void;
  icon: React.ComponentType<{ className?: string }>;
  section: string;
  keywords?: string[];
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { mode, setMode } = useTheme();
  const index = useMemo(() => buildSearchIndex(), []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const commands: Command[] = useMemo(
    () => [
      { id: "home", label: "Go Home", path: "/", icon: Home, section: "Navigate" },
      { id: "about", label: "About", path: "/about", icon: User, section: "Navigate" },
      { id: "skills", label: "Skills", path: "/skills", icon: Wrench, section: "Navigate" },
      { id: "roadmap", label: "Roadmap", path: "/roadmap", icon: Map, section: "Navigate" },
      { id: "projects", label: "Projects", path: "/projects", icon: FolderGit2, section: "Navigate" },
      { id: "study", label: "Study Hub", path: "/study", icon: GraduationCap, section: "Navigate" },
      { id: "learning", label: "Learning Path", path: "/learning", icon: Route, section: "Navigate" },
      { id: "blog", label: "Blog", path: "/blog", icon: FileText, section: "Navigate" },
      { id: "resume", label: "Resume", path: "/resume", icon: FileText, section: "Navigate" },
      { id: "contact", label: "Contact", path: "/contact", icon: Mail, section: "Navigate" },
      { id: "dashboard", label: "Learning Dashboard", path: "/dashboard", icon: LayoutDashboard, section: "Navigate" },
      { id: "now", label: "Now", path: "/now", icon: Sparkles, section: "Navigate" },
      { id: "terminal", label: "Open Terminal", path: "/terminal", icon: TerminalSquare, section: "Navigate" },
      { id: "lab", label: "Data Pipeline Lab", path: "/lab", icon: FlaskConical, section: "Navigate" },
      { id: "tech", label: "Technology Explorer", path: "/tech", icon: Boxes, section: "Navigate" },
      { id: "notes", label: "Notes", path: "/study/notes", icon: BookOpen, section: "Study Hub" },
      { id: "flashcards", label: "Flashcards", path: "/study/flashcards", icon: Brain, section: "Study Hub" },
      { id: "practice", label: "Practice", path: "/study/practice", icon: Dumbbell, section: "Study Hub" },
      { id: "quiz", label: "Quiz", path: "/study/quiz", icon: ListChecks, section: "Study Hub" },
      { id: "questions", label: "Question Bank", path: "/study/questions", icon: ListChecks, section: "Study Hub" },
      { id: "today", label: "Today's Plan", path: "/study/today", icon: Timer, section: "Study Hub" },
      { id: "goals", label: "Goals", path: "/study/goals", icon: Target, section: "Study Hub" },
      { id: "interview", label: "Interview Prep", path: "/study/interview", icon: Briefcase, section: "Study Hub" },
      { id: "resources", label: "Resources", path: "/study/resources", icon: Library, section: "Study Hub" },
      { id: "cheatsheets", label: "Cheat Sheets", path: "/study/cheatsheets", icon: ScrollText, section: "Study Hub" },
      { id: "playground", label: "SQL Playground", path: "/study/playground", icon: Database, section: "Study Hub" },
      {
        id: "toggle-theme",
        label: "Toggle Theme",
        icon: MoonStar,
        section: "Actions",
        action: () => setMode(mode === "dark" ? "light" : "dark"),
      },
    ],
    [mode, setMode]
  );

  const filteredCommands = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands.slice(0, 9);
    return commands
      .filter((c) => c.label.toLowerCase().includes(q) || c.section.toLowerCase().includes(q))
      .slice(0, 8);
  }, [commands, query]);

  const results: SearchHit[] = useMemo(() => searchDocs(index, query), [index, query]);

  const visibleResults = useMemo(
    () => results.slice(0, Math.max(0, 12 - filteredCommands.length)),
    [results, filteredCommands.length]
  );

  const totalItems = filteredCommands.length + visibleResults.length;

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => (a + 1) % Math.max(totalItems, 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => (a - 1 + Math.max(totalItems, 1)) % Math.max(totalItems, 1));
      }
      if (e.key === "Enter") {
        e.preventDefault();
        if (active < filteredCommands.length) {
          const cmd = filteredCommands[active];
          if (cmd) {
            if (cmd.action) cmd.action();
            if (cmd.path) navigate(cmd.path);
            onClose();
          }
        } else {
          const hit = visibleResults[active - filteredCommands.length];
          if (hit) {
            navigate(hit.doc.path);
            onClose();
          }
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, totalItems, filteredCommands, results, active, navigate, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-ink-950/60 px-4 pt-[12vh] backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-2xl dark:border-ink-700 dark:bg-ink-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-ink-200 px-4 dark:border-ink-700">
              <Search className="h-4 w-4 shrink-0 text-ink-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands and content…"
                className="w-full bg-transparent py-4 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none dark:text-ink-100"
                aria-label="Search"
              />
              <kbd className="rounded border border-ink-300 px-1.5 py-0.5 font-mono text-[10px] text-ink-400 dark:border-ink-700">
                ESC
              </kbd>
            </div>

            <div className="max-h-[50vh] overflow-y-auto p-2">
              {filteredCommands.length > 0 && (
                <div className="mb-1">
                  <p className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-400">
                    Commands
                  </p>
                  {filteredCommands.map((cmd, i) => (
                    <button
                      key={cmd.id}
                      className={cx(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm",
                        i === active ? "bg-accent-500/10 text-accent-600 dark:text-accent-400" : "text-ink-700 dark:text-ink-200"
                      )}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => {
                        if (cmd.action) cmd.action();
                        if (cmd.path) navigate(cmd.path);
                        onClose();
                      }}
                    >
                      <cmd.icon className="h-4 w-4 shrink-0 opacity-70" />
                      {cmd.label}
                      <span className="ml-auto text-[10px] uppercase tracking-wide text-ink-400">{cmd.section}</span>
                    </button>
                  ))}
                </div>
              )}

              {results.length > 0 && (
                <div>
                  <p className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-400">
                    Results
                  </p>
                  {visibleResults.map((hit, ri) => {
                    const i = filteredCommands.length + ri;
                    return (
                      <button
                        key={hit.doc.id}
                        className={cx(
                          "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm",
                          i === active ? "bg-accent-500/10 text-accent-600 dark:text-accent-400" : "text-ink-700 dark:text-ink-200"
                        )}
                        onMouseEnter={() => setActive(i)}
                        onClick={() => {
                          navigate(hit.doc.path);
                          onClose();
                        }}
                      >
                        <CornerDownLeft className="h-3.5 w-3.5 shrink-0 opacity-40" />
                        <span className="truncate">{hit.doc.title}</span>
                        <span className="ml-auto shrink-0 text-[10px] uppercase tracking-wide text-ink-400">
                          {hit.doc.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {filteredCommands.length === 0 && results.length === 0 && (
                <p className="px-3 py-8 text-center text-sm text-ink-400">
                  No results for “{query}”
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
