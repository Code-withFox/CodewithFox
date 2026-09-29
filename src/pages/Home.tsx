import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, reducedMotion } from "@/lib/motion";
import { LinkButton, Card, Badge } from "@/components/ui";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { liveStatus, systemStatus } from "@/data/now";
import { roadmap } from "@/data/roadmap";
import { useRoadmapProgress } from "@/hooks/useStudyData";
import { useNow } from "@/hooks/useNow";
import { ArrowRight, GraduationCap, BookOpen, Download, Map } from "lucide-react";

/* ------------------------------ Terminal visual ----------------------------- */

const terminalLines = [
  { prompt: "$", cmd: "whoami", out: "Code With Fox" },
  { prompt: "$", cmd: "role", out: "Aspiring Data Engineer" },
  { prompt: "$", cmd: "focus", out: "Python • SQL • Data Engineering" },
  { prompt: "$", cmd: "status", out: "Building..." },
];

function HeroTerminal() {
  const [step, setStep] = useState(0);
  const reduce = reducedMotion();

  useEffect(() => {
    if (reduce) {
      setStep(terminalLines.length);
      return;
    }
    if (step >= terminalLines.length * 2) {
      const t = setTimeout(() => setStep(0), 6000);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), step % 2 === 0 ? 700 : 500);
    return () => clearTimeout(t);
  }, [step, reduce]);

  return (
    <div className="overflow-hidden rounded-xl border border-ink-200 bg-white/80 shadow-xl dark:border-ink-700/80 dark:bg-ink-900/90">
      <div className="flex items-center gap-1.5 border-b border-ink-200 px-4 py-2.5 dark:border-ink-700/80">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        <span className="ml-3 font-mono text-xs text-ink-400">fox@data ~ portfolio</span>
      </div>
      <div className="space-y-2 p-5 font-mono text-[13px] leading-relaxed">
        {terminalLines.map((line, i) => {
          const cmdShown = step > i * 2;
          const outShown = step > i * 2 + 1;
          if (!cmdShown && !outShown) return <div key={i} className="h-5" />;
          return (
            <div key={i}>
              <div className="flex gap-2">
                <span className="text-accent-500">{line.prompt}</span>
                <span className="text-ink-800 dark:text-ink-100">{cmdShown ? line.cmd : ""}</span>
              </div>
              {outShown && <div className="pl-4 text-emerald-600 dark:text-emerald-400">{line.out}</div>}
            </div>
          );
        })}
        <div className="flex gap-2 pt-1">
          <span className="text-accent-500">$</span>
          <span className="inline-block h-4 w-2 animate-pulse-dot bg-accent-400" aria-hidden />
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- Live clock ------------------------------- */

function LiveClock() {
  const now = useNow(1000);
  const time = now.toLocaleTimeString(undefined, { hour12: false });
  const date = now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  return (
    <div className="font-mono text-xs text-ink-400 dark:text-ink-500" aria-label="Local time">
      <span suppressHydrationWarning>{time}</span>
      <span className="mx-1.5 text-accent-500">·</span>
      {date}
    </div>
  );
}

/* -------------------------------- Status widget ----------------------------- */

function StatusWidget() {
  return (
    <Card className="p-4">
      <p className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-400">
        <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-emerald-400" />
        System Status
      </p>
      <ul className="space-y-1.5 text-sm">
        {systemStatus.map((s) => (
          <li key={s.label} className="flex items-center justify-between">
            <span className="text-ink-500 dark:text-ink-400">{s.label}</span>
            <span className={s.ok ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}>
              {s.state}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* --------------------------------- Now widget ------------------------------- */

function LiveStatus() {
  const rows = [
    { label: "Currently learning", value: liveStatus.learning },
    { label: "Currently building", value: liveStatus.building },
    { label: "Exploring", value: liveStatus.exploring },
    { label: "Goal", value: liveStatus.goal },
  ];
  return (
    <Card className="p-4">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-accent-500 dark:text-accent-400">
        ● Live Status
      </p>
      <dl className="space-y-2.5 text-sm">
        {rows.map((r) => (
          <div key={r.label}>
            <dt className="text-xs text-ink-400">{r.label}</dt>
            <dd className="font-medium text-ink-800 dark:text-ink-100">{r.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-3 border-t border-ink-200 pt-3 dark:border-ink-700">
        <LiveClock />
      </div>
    </Card>
  );
}

/* ------------------------------------ Page ---------------------------------- */

export default function Home() {
  const { statusOf, completed } = useRoadmapProgress();
  const roadmapPct = Math.round((completed / roadmap.length) * 100);
  const featured = projects.slice(0, 3);

  return (
    <div className="space-y-24 pb-10">
      {/* HERO */}
      <section className="grid items-center gap-10 pt-6 lg:grid-cols-[1.2fr_1fr]">
        <motion.div
          initial={reducedMotion() ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge tone="accent" className="mb-5">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent-500" />
            ASPIRING DATA ENGINEER
          </Badge>
          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            I build with code.
            <br />
            <span className="bg-gradient-to-r from-accent-500 to-amber-400 bg-clip-text text-transparent">
              I solve with data.
            </span>
          </h1>
          <p className="mt-4 font-mono text-sm text-ink-500 dark:text-ink-400">
            BCA Student • Developer • Data Engineering Learner
          </p>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-600 dark:text-ink-300">
            I'm a BCA student at Amity University Online learning in public. I don't just learn
            technology — I build with it: real projects, real notes, real practice, all tracked on
            this site.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <LinkButton to="/projects" size="lg">
              Explore My Work <ArrowRight className="h-4 w-4" />
            </LinkButton>
            <LinkButton to="/study" size="lg" variant="secondary">
              <BookOpen className="h-4 w-4" /> Open Study Hub
            </LinkButton>
            <LinkButton to="/resume" size="lg" variant="ghost">
              <Download className="h-4 w-4" /> Download Resume
            </LinkButton>
          </div>
          <p className="mt-6 font-mono text-xs text-ink-400 dark:text-ink-500">
            {profile.philosophy}
          </p>
        </motion.div>
        <motion.div
          initial={reducedMotion() ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <HeroTerminal />
        </motion.div>
      </section>

      {/* STATUS STRIP */}
      <section aria-label="Live status" className="grid gap-4 md:grid-cols-2">
        <LiveStatus />
        <StatusWidget />
      </section>

      {/* ROADMAP PREVIEW */}
      <section aria-labelledby="roadmap-preview">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 id="roadmap-preview" className="text-2xl font-semibold tracking-tight">
              The Data Engineering Roadmap
            </h2>
            <p className="mt-1 text-ink-500 dark:text-ink-400">
              From programming fundamentals to distributed systems — tracked for real.
            </p>
          </div>
          <LinkButton to="/roadmap" variant="secondary" size="sm">
            <Map className="h-3.5 w-3.5" /> Full roadmap
          </LinkButton>
        </div>
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="text-ink-500 dark:text-ink-400">
              {completed} of {roadmap.length} stages completed
            </span>
            <span className="font-mono text-accent-500">{roadmapPct}%</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {roadmap.map((n) => {
              const st = statusOf(n.id);
              const cls =
                st === "completed"
                  ? "bg-emerald-500/80 text-white border-emerald-500"
                  : st === "learning" || st === "practicing"
                    ? "bg-accent-500/20 text-accent-600 border-accent-500/50 dark:text-accent-400"
                    : st === "revision"
                      ? "bg-sky-500/15 text-sky-600 border-sky-500/40 dark:text-sky-400"
                      : "bg-ink-100 text-ink-400 border-ink-200 dark:bg-ink-800/60 dark:border-ink-700 dark:text-ink-500";
              return (
                <Link
                  key={n.id}
                  to={`/roadmap/${n.id}`}
                  className={cls}
                  style={{ borderRadius: 6, padding: "3px 8px", fontSize: 11 }}
                  title={`${n.title} — ${st}`}
                >
                  {n.title}
                </Link>
              );
            })}
          </div>
        </Card>
      </section>

      {/* PROJECTS PREVIEW */}
      <section aria-labelledby="featured-projects">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 id="featured-projects" className="text-2xl font-semibold tracking-tight">
              Featured Projects
            </h2>
            <p className="mt-1 text-ink-500 dark:text-ink-400">
              Things I'm building — with real architecture, not screenshots.
            </p>
          </div>
          <LinkButton to="/projects" variant="secondary" size="sm">
            All projects <ArrowRight className="h-3.5 w-3.5" />
          </LinkButton>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {featured.map((p) => (
            <Link key={p.slug} to={`/projects/${p.slug}`}>
              <Card interactive className="h-full p-5">
                <div className="mb-3 flex items-center justify-between">
                  <Badge tone={p.status === "building" ? "amber" : "green"}>
                    {p.status === "building" ? "● Building" : "● Shipped"}
                  </Badge>
                  <span className="font-mono text-xs text-ink-400">{p.period}</span>
                </div>
                <h3 className="font-semibold">{p.name}</h3>
                <p className="mt-1.5 line-clamp-2 text-sm text-ink-500 dark:text-ink-400">{p.tagline}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.technologies.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="rounded-md bg-ink-100 px-1.5 py-0.5 font-mono text-[10px] text-ink-500 dark:bg-ink-800 dark:text-ink-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* STUDY HUB CTA */}
      <section aria-labelledby="study-cta">
        <Card className="relative overflow-hidden p-8 sm:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent-500/10 blur-3xl"
          />
          <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-500">Study Hub</p>
              <h2 id="study-cta" className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                Learn. Practice. Build. Repeat.
              </h2>
              <p className="mt-3 max-w-lg text-ink-600 dark:text-ink-300">
                My personal learning platform: notes, flashcards with spaced revision, quizzes, a
                question bank, a SQL playground, study timer and heatmap analytics. Everything
                interconnected, everything tracked.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <LinkButton to="/study" size="lg">
                  <GraduationCap className="h-4 w-4" /> Open Study Hub
                </LinkButton>
                <LinkButton to="/dashboard" size="lg" variant="secondary">
                  Learning Dashboard
                </LinkButton>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: "Subjects", value: "16" },
                { label: "Notes", value: "9" },
                { label: "Flashcards", value: "30" },
                { label: "Questions", value: "45+" },
              ].map((s) => (
                <div key={s.label} className="rounded-lg border border-ink-200 p-3 dark:border-ink-700">
                  <p className="font-mono text-xl text-accent-500">{s.value}</p>
                  <p className="text-xs text-ink-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
