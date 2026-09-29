import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader, Card, Badge } from "@/components/ui";
import { skills } from "@/data/skills";
import { getProject } from "@/data/projects";
import { AnimatePresence, motion } from "@/lib/motion";
import { ArrowLeft, BookOpen, FolderGit2, Network } from "lucide-react";

export default function TechExplorer() {
  const [selected, setSelected] = useState<string | null>(null);
  const navigate = useNavigate();
  const skill = skills.find((s) => s.id === selected) ?? null;

  return (
    <div>
      <PageHeader
        eyebrow="/tech"
        title="Technology explorer"
        subtitle="Every technology, its status, what it connects to, and where you can learn more."
      />

      <AnimatePresence mode="wait">
        {!skill ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {skills.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelected(s.id)}
                  className="group rounded-xl border border-ink-200 bg-white/60 p-4 text-left transition-all hover:border-accent-500/50 hover:shadow-glow-sm dark:border-ink-700/80 dark:bg-ink-900/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{s.name}</span>
                    <span
                      className={cxDot(s.status)}
                      title={s.status}
                      aria-label={s.status}
                    />
                  </div>
                  <p className="mt-1 text-xs text-ink-400">{s.category}</p>
                </button>
              ))}
            </div>
            <p className="mt-6 flex items-center gap-2 text-xs text-ink-400">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" /> used
              <span className="ml-3 inline-block h-2 w-2 rounded-full bg-accent-500" /> learning
              <span className="ml-3 inline-block h-2 w-2 rounded-full bg-sky-500" /> exploring
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={() => setSelected(null)}
              className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-400 hover:text-accent-500"
            >
              <ArrowLeft className="h-4 w-4" /> All technologies
            </button>

            <Card className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-semibold">{skill.name}</h2>
                <Badge tone={skill.status === "used" ? "green" : skill.status === "learning" ? "accent" : "blue"}>
                  {skill.status}
                </Badge>
                <Badge>{skill.category}</Badge>
              </div>
              <p className="mt-3 max-w-2xl text-ink-600 dark:text-ink-300">{skill.blurb}</p>

              <div className="mt-8 grid gap-6 sm:grid-cols-3">
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <Network className="h-4 w-4 text-accent-500" /> Related
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm text-ink-500 dark:text-ink-400">
                    {skill.related.map((r) => {
                      const rel = skills.find((s) => s.name === r);
                      return (
                        <li key={r}>
                          {rel ? (
                            <button onClick={() => setSelected(rel.id)} className="hover:text-accent-500">
                              {r}
                            </button>
                          ) : (
                            r
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <FolderGit2 className="h-4 w-4 text-accent-500" /> Used in
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm">
                    {skill.usedIn.length === 0 && (
                      <li className="text-ink-400">Not used in a project yet</li>
                    )}
                    {skill.usedIn.map((slug) => {
                      const p = getProject(slug);
                      return (
                        <li key={slug}>
                          {p ? (
                            <button
                              onClick={() => navigate(`/projects/${p.slug}`)}
                              className="text-ink-600 hover:text-accent-500 dark:text-ink-300"
                            >
                              {p.name}
                            </button>
                          ) : (
                            <span className="text-ink-500 dark:text-ink-400">{slug.replace(/-/g, " ")}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <BookOpen className="h-4 w-4 text-accent-500" /> Study material
                  </h3>
                  <div className="mt-2">
                    {skill.studyPath ? (
                      <Link
                        to={skill.studyPath}
                        className="inline-flex items-center gap-1 text-sm text-accent-500 hover:underline"
                      >
                        View in Study Hub →
                      </Link>
                    ) : (
                      <p className="text-sm text-ink-400">No study material linked yet</p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function cxDot(status: string) {
  return (
    "h-2 w-2 rounded-full " +
    (status === "used" ? "bg-emerald-500" : status === "learning" ? "bg-accent-500" : "bg-sky-500")
  );
}
