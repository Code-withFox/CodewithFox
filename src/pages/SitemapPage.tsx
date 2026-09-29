import { Link } from "react-router-dom";
import { PageHeader, Card } from "@/components/ui";

const groups: { title: string; links: { to: string; label: string }[] }[] = [
  {
    title: "Portfolio",
    links: [
      { to: "/", label: "Home" },
      { to: "/about", label: "About" },
      { to: "/skills", label: "Skills" },
      { to: "/tech", label: "Technology Explorer" },
      { to: "/roadmap", label: "Data Engineering Roadmap" },
      { to: "/projects", label: "Projects" },
      { to: "/now", label: "Now" },
      { to: "/blog", label: "Blog" },
      { to: "/resume", label: "Resume" },
      { to: "/certifications", label: "Certifications" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Study Hub",
    links: [
      { to: "/study", label: "Study Hub" },
      { to: "/study/notes", label: "Notes" },
      { to: "/study/flashcards", label: "Flashcards" },
      { to: "/study/revision", label: "Revision" },
      { to: "/study/quiz", label: "Quiz & Exam" },
      { to: "/study/questions", label: "Question Bank" },
      { to: "/study/practice", label: "Coding Practice" },
      { to: "/study/playground", label: "SQL Playground" },
      { to: "/study/cheatsheets", label: "Cheat Sheets" },
      { to: "/study/resources", label: "Resource Library" },
      { to: "/study/today", label: "Today's Plan & Timer" },
      { to: "/study/history", label: "Study History" },
      { to: "/study/goals", label: "Goal Tracker" },
      { to: "/study/interview", label: "Interview Preparation" },
    ],
  },
  {
    title: "Tools & Meta",
    links: [
      { to: "/dashboard", label: "Learning Dashboard" },
      { to: "/learning", label: "Start Learning" },
      { to: "/lab", label: "Data Pipeline Lab" },
      { to: "/terminal", label: "Developer Terminal" },
      { to: "/bookmarks", label: "Bookmarks" },
      { to: "/privacy", label: "Privacy" },
      { to: "/sitemap", label: "Sitemap" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div>
      <PageHeader
        eyebrow="/sitemap"
        title="Sitemap"
        subtitle="Every route on the platform, grouped by system."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {groups.map((g) => (
          <Card key={g.title} className="p-6">
            <h2 className="font-semibold">{g.title}</h2>
            <ul className="mt-3 space-y-1.5 text-sm">
              {g.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-ink-500 hover:text-accent-500 dark:text-ink-400">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
