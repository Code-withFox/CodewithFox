import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Card } from "@/components/ui";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { roadmap } from "@/data/roadmap";
import { notes } from "@/data/notes";
import { useTheme } from "@/hooks/useTheme";
import { useRoadmapProgress, useStudySessions } from "@/hooks/useStudyData";
import { formatMinutes } from "@/lib/utils";

interface Line {
  kind: "input" | "output" | "error" | "success" | "accent";
  text: string;
}

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([
    { kind: "accent", text: "Code With Fox terminal — type `help` to begin." },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const navigate = useNavigate();
  const { setMode, isDark } = useTheme();
  const { completed } = useRoadmapProgress();
  const { totalMinutes, streak } = useStudySessions();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  const out = (text: string, kind: Line["kind"] = "output") =>
    setLines((prev) => [...prev, { kind, text }]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    setLines((prev) => [...prev, { kind: "input", text: cmd }]);
    setHistory((h) => [cmd, ...h].slice(0, 50));
    setHistIdx(-1);

    const [head, ...rest] = cmd.toLowerCase().split(/\s+/);
    const arg = rest.join(" ");

    switch (head) {
      case "help":
        out("Available commands:", "accent");
        out("  whoami · about · skills · projects · roadmap · learning · study");
        out("  notes · github · resume · contact · status · theme · clear");
        out("  open project <n> · open notes · open roadmap");
        out("");
        out("psst: try `coffee`, `sudo hire fox`, `matrix`, `secret`");
        break;
      case "whoami":
        out(`${profile.brand} — ${profile.role}`);
        out(`BCA @ ${profile.education.university} (${profile.education.years})`);
        break;
      case "about":
        out(profile.brand + ": " + profile.tagline);
        out("Learn → Build → Break → Fix → Improve");
        out("Currently: Python, SQL, Data Engineering fundamentals.");
        break;
      case "skills":
        out("Programming  C · Python · JavaScript · TypeScript");
        out("Data         SQL · PostgreSQL · MySQL · Pandas");
        out("Data Eng     ETL · ELT · Pipelines · Warehousing · Spark* · Kafka* · Airflow*");
        out("Tools        Git · GitHub · Linux · Docker* · VS Code   (* exploring)");
        break;
      case "projects":
        out("Projects:");
        projects.forEach((p, i) => out(`  ${i + 1}. ${p.name} — ${p.tagline}`));
        out("tip: `open project 1`");
        break;
      case "roadmap":
        out(`Data Engineering Roadmap — ${completed}/${roadmap.length} completed`);
        out(roadmap.map((n) => {
          const st = n.status;
          return st === "completed" ? `[x] ${n.title}` : st === "not-started" ? `[ ] ${n.title}` : `[~] ${n.title}`;
        }).join("\n"));
        break;
      case "learning":
        out("Learning next: the first incomplete roadmap stage.");
        out("Run `roadmap` to see full status, or visit /learning");
        break;
      case "study":
        out("Study Hub: subjects, notes, flashcards, quizzes, practice.");
        out(`Study time logged: ${formatMinutes(totalMinutes)} · streak: ${streak}d`);
        break;
      case "notes":
        out(`${notes.length} notes available:`);
        notes.slice(0, 6).forEach((n) => out(`  · ${n.title} (${n.subject})`));
        out("tip: `open notes`");
        break;
      case "github":
        out(`Opening ${profile.github}`, "accent");
        window.open(profile.github, "_blank");
        break;
      case "resume":
        out("Opening resume page…", "accent");
        navigate("/resume");
        break;
      case "contact":
        out(`Email: ${profile.email}`);
        out("Type `open contact` or visit /contact");
        break;
      case "status":
        out("● SYSTEM ONLINE", "success");
        out(`  learning : Python + SQL`);
        out(`  building : Data Engineering Projects`);
        out(`  exploring: Apache Spark`);
        out(`  goal     : Data Engineer`);
        break;
      case "theme":
        setMode(isDark ? "light" : "dark");
        out(`Theme switched to ${isDark ? "light" : "dark"}.`, "success");
        break;
      case "clear":
        setLines([]);
        break;
      case "open":
        if (rest[0] === "project" && rest[1]) {
          const idx = parseInt(rest[1], 10) - 1;
          const p = projects[idx];
          if (p) {
            out(`Opening ${p.name}…`, "accent");
            navigate(`/projects/${p.slug}`);
          } else {
            out(`No project #${rest[1]}. Try \`projects\` first.`, "error");
          }
        } else if (rest[0] === "notes") {
          navigate("/study/notes");
          out("Opening notes…", "accent");
        } else if (rest[0] === "roadmap") {
          navigate("/roadmap");
          out("Opening roadmap…", "accent");
        } else if (rest[0] === "study") {
          navigate("/study");
          out("Opening Study Hub…", "accent");
        } else if (rest[0] === "contact") {
          navigate("/contact");
          out("Opening contact…", "accent");
        } else {
          out("Usage: open project <n> | open notes | open roadmap | open study", "error");
        }
        break;
      /* easter eggs */
      case "coffee":
        out("     ( (");
        out("      ) )");
        out("   ........");
        out("   |      |]");
        out("   \\      /");
        out("    `----'");
        out("Brewing… ☕ errors per 100 lines dropping.", "success");
        break;
      case "sudo":
        if (arg === "hire fox") {
          out("Permission granted.", "success");
          out("Let's build something.");
          out("→ hello@codewithfox.dev", "accent");
        } else {
          out(`sudo: fox is not in the sudoers file. This incident will be reported.`, "error");
        }
        break;
      case "matrix":
        out("01001000 01101001 00100000 01100110 01101111 01111000");
        out("Follow the white rabbit… 🐇 the roadmap is the construct.");
        break;
      case "secret":
        out("🗝️  The real secret: consistency beats intensity.");
        out("   30 focused minutes a day compounds faster than weekend marathons.");
        break;
      case "rm":
        out("rm: permission denied — this filesystem is read-only, thankfully.", "error");
        break;
      case "exit":
        out("There is no exit — only the next stage of the roadmap.", "accent");
        break;
      default:
        out(`command not found: ${head} — try \`help\``, "error");
    }
  };

  const kindClass = (k: Line["kind"]) =>
    k === "input"
      ? "text-accent-500"
      : k === "error"
        ? "text-red-400"
        : k === "success"
          ? "text-emerald-400"
          : k === "accent"
            ? "text-ink-400"
            : "text-ink-200";

  return (
    <div>
      <PageHeader
        eyebrow="/terminal"
        title="Developer terminal"
        subtitle="A tiny shell with portfolio commands and a few harmless easter eggs."
      />
      <Card className="overflow-hidden bg-ink-950 dark:bg-black">
        <div className="flex items-center gap-1.5 border-b border-ink-800 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-3 font-mono text-xs text-ink-500">fox@codewithfox ~ zsh</span>
        </div>
        <div className="h-[420px] overflow-y-auto p-4 font-mono text-[13px] leading-relaxed">
          {lines.map((l, i) => (
            <div key={i} className={kindClass(l.kind)}>
              {l.kind === "input" ? <span className="mr-2 text-accent-500">$</span> : null}
              <span className="whitespace-pre-wrap">{l.text}</span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="flex items-center gap-2 border-t border-ink-800 px-4 py-3 font-mono text-[13px]">
          <span className="text-accent-500">$</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                run(input);
                setInput("");
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                const next = Math.min(histIdx + 1, history.length - 1);
                if (next >= 0) {
                  setHistIdx(next);
                  setInput(history[next]);
                }
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                const next = histIdx - 1;
                setHistIdx(next);
                setInput(next >= 0 ? history[next] : "");
              }
            }}
            className="flex-1 bg-transparent text-ink-100 placeholder:text-ink-600 focus:outline-none"
            placeholder="type a command…"
            aria-label="Terminal input"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </Card>
    </div>
  );
}
