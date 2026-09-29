import { LinkButton, Card, PageHeader, Reveal } from "@/components/ui";
import { profile } from "@/data/profile";
import { Code2, Database, Server, Puzzle } from "lucide-react";

const identities = [
  {
    icon: Code2,
    title: "Programming",
    text: "C taught me how machines think; Python lets me tell them what to do. Fundamentals first, frameworks later.",
  },
  {
    icon: Database,
    title: "Data",
    text: "SQL is a daily habit. Schemas, joins and window functions are where I feel at home — and where I keep leveling up.",
  },
  {
    icon: Server,
    title: "Systems",
    text: "Linux, Git, and how things run in production. A pipeline is only as good as the system it runs on.",
  },
  {
    icon: Puzzle,
    title: "Problem Solving",
    text: "Learn → Build → Break → Fix → Improve. Every bug is a lesson with a story attached.",
  },
];

export default function About() {
  return (
    <div>
      <PageHeader
        eyebrow="About"
        title="A little about me"
        subtitle="BCA student, developer, and aspiring data engineer — building the skills in public, one project at a time."
      />

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <Reveal>
          <div className="space-y-5 text-[15px] leading-relaxed text-ink-600 dark:text-ink-300">
            <p>
              I'm a BCA student at <strong className="text-ink-900 dark:text-ink-100">{profile.education.university}</strong>{" "}
              ({profile.education.years}), and somewhere along the first year I fell for the part of
              computing where everything connects: <strong className="text-ink-900 dark:text-ink-100">data</strong>.
            </p>
            <p>
              While the degree covers the fundamentals — programming, data structures, DBMS,
              operating systems, networks — I've been building real things alongside it. A shop
              management app taught me schema design. This website taught me to ship. A data
              pipeline taught me that moving data is the easy part.
            </p>
            <p>
              Right now I'm deep in <strong className="text-ink-900 dark:text-ink-100">Python and SQL</strong>,
              building my way through a{" "}
              <a href="#/roadmap" className="text-accent-500 underline underline-offset-4">
                self-directed Data Engineering roadmap
              </a>{" "}
              that runs from C fundamentals to distributed systems. The Study Hub on this site is
              where every note, flashcard, quiz and study session lives — tracked, not imagined.
            </p>
            <p>
              The plan after graduation: data engineering, for real. The method until then:{" "}
              <span className="font-mono text-sm text-accent-500">{profile.philosophy}</span>
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <Card className="p-6">
            <h2 className="font-semibold">Quick facts</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-400">Degree</dt>
                <dd className="text-right font-medium">BCA (2024–2027)</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-400">University</dt>
                <dd className="text-right font-medium">Amity University Online</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-400">Focus</dt>
                <dd className="text-right font-medium">Data Engineering</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-400">Location</dt>
                <dd className="text-right font-medium">{profile.location}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-400">Status</dt>
                <dd className="text-right font-medium text-emerald-600 dark:text-emerald-400">
                  {profile.availability}
                </dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-2">
              <LinkButton to="/resume" size="sm" variant="secondary">
                View Resume
              </LinkButton>
              <LinkButton to="/contact" size="sm" variant="secondary">
                Contact
              </LinkButton>
            </div>
          </Card>
        </Reveal>
      </div>

      <div className="mt-12">
        <h2 className="mb-5 text-xl font-semibold tracking-tight">What I care about</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {identities.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.06}>
              <Card className="h-full p-5" interactive>
                <card.icon className="h-5 w-5 text-accent-500" />
                <h3 className="mt-3 font-semibold">{card.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500 dark:text-ink-400">{card.text}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
