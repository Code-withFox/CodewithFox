import { PageHeader, Card, Badge, LinkButton } from "@/components/ui";
import { profile } from "@/data/profile";
import { skills, skillCategories } from "@/data/skills";
import { projects } from "@/data/projects";
import { roadmap } from "@/data/roadmap";
import { useRoadmapProgress } from "@/hooks/useStudyData";
import { Download, Printer, IdCard } from "lucide-react";

function downloadVcf() {
  const blob = new Blob([profile.vcfText], { type: "text/vcard" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "code-with-fox.vcf";
  a.click();
  URL.revokeObjectURL(url);
}

export default function Resume() {
  const { completed } = useRoadmapProgress();
  const learningRows = roadmap
    .filter((n) => n.status === "learning" || n.status === "practicing")
    .map((n) => n.title);

  return (
    <div>
      <PageHeader
        eyebrow="Resume"
        title="Resume"
        subtitle="Interactive summary — everything here is verifiable on this site. No invented experience."
        actions={
          <>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-lg border border-ink-300 px-4 py-2 text-sm hover:bg-ink-100 dark:border-ink-700 dark:hover:bg-ink-800"
            >
              <Printer className="h-4 w-4" /> Print / Save PDF
            </button>
            <button
              onClick={downloadVcf}
              className="inline-flex items-center gap-2 rounded-lg border border-ink-300 px-4 py-2 text-sm hover:bg-ink-100 dark:border-ink-700 dark:hover:bg-ink-800"
            >
              <IdCard className="h-4 w-4" /> Contact Card (.vcf)
            </button>
            <LinkButton to="/contact" size="md">
              <Download className="h-4 w-4" /> Contact Me
            </LinkButton>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold">Summary</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-600 dark:text-ink-300">
              BCA student ({profile.education.years}) at {profile.education.university}, building
              toward data engineering. Strongest today in Python and SQL, with real project work in
              inventory management and ETL pipelines. Learning in public at {profile.brand.toLowerCase()}{""}
              — every claim on this resume links to work you can inspect.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold">Education</h2>
            <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-medium">{profile.education.degree}</p>
              <span className="font-mono text-sm text-ink-400">{profile.education.years}</span>
            </div>
            <p className="text-sm text-ink-500 dark:text-ink-400">{profile.education.university}</p>
            <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
              Relevant coursework: DBMS, Operating Systems, Computer Networks, Data Structures.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold">Projects</h2>
            <div className="mt-3 space-y-4">
              {projects.map((p) => (
                <div key={p.slug} className="border-l-2 border-accent-500/40 pl-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-medium">{p.name}</p>
                    <span className="font-mono text-xs text-ink-400">{p.period}</span>
                  </div>
                  <p className="text-sm text-ink-500 dark:text-ink-400">{p.tagline}</p>
                  <p className="mt-1 font-mono text-xs text-ink-400">{p.technologies.join(" · ")}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold">Currently learning</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {learningRows.map((r) => (
                <Badge key={r} tone="accent">{r}</Badge>
              ))}
              <Badge tone="neutral">{completed} roadmap stages completed</Badge>
            </div>
            <p className="mt-3 text-xs text-ink-400">
              Live status from this site's roadmap tracker — not a static claim.
            </p>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold">Skills</h2>
            {skillCategories.map((cat) => (
              <div key={cat} className="mt-4 first:mt-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-400">{cat}</h3>
                <p className="mt-1 text-sm text-ink-600 dark:text-ink-300">
                  {skills
                    .filter((s) => s.category === cat)
                    .map((s) => s.name)
                    .join(" · ")}
                </p>
              </div>
            ))}
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold">Certifications</h2>
            <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
              None yet — in progress. This section will only ever list real, verifiable credentials.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold">Contact</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a className="text-accent-500 hover:underline" href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>
              </li>
              <li>
                <a className="text-accent-500 hover:underline" href={profile.github} target="_blank" rel="noreferrer">
                  GitHub — @code-with-fox
                </a>
              </li>
              <li>
                <a className="text-accent-500 hover:underline" href={profile.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
