import { projects } from "./projects";
import { skills } from "./skills";
import { roadmap } from "./roadmap";
import { subjects } from "./subjects";
import { notes } from "./notes";
import { cheatsheets } from "./cheatsheets";
import { resources } from "./resources";
import { practiceProblems } from "./practice";
import { interviewQuestions } from "./interview";
import { blogPosts } from "./blog";
import { flashcards } from "./flashcards";
import type { SearchDoc } from "@/types";

function doc(id: string, title: string, category: string, path: string, keywords: string[], excerpt: string): SearchDoc {
  return { id, title, category, path, keywords, excerpt };
}

/** Global search corpus covering portfolio + Study Hub content. */
export function buildSearchIndex(): SearchDoc[] {
  const docs: SearchDoc[] = [];

  for (const p of projects) {
    docs.push(doc(`project-${p.slug}`, p.name, "Projects", `/projects/${p.slug}`, [p.tagline, ...p.technologies], p.description));
  }
  for (const s of skills) {
    docs.push(doc(`skill-${s.id}`, s.name, "Skills", s.studyPath ?? "/skills", [s.category, s.status], s.blurb));
  }
  for (const n of roadmap) {
    docs.push(doc(`roadmap-${n.id}`, n.title, "Roadmap", `/roadmap/${n.id}`, [n.area, `step ${n.order}`], n.why));
  }
  for (const s of subjects) {
    docs.push(doc(`subject-${s.slug}`, s.name, "Study Hub", `/study/${s.slug}`, ["subject", s.difficulty], s.description));
  }
  for (const n of notes) {
    docs.push(doc(`note-${n.slug}`, n.title, "Notes", `/study/notes/${n.slug}`, n.tags, n.summary));
  }
  for (const c of cheatsheets) {
    docs.push(doc(`cheat-${c.slug}`, `${c.title} Cheat Sheet`, "Cheat Sheets", `/study/cheatsheets/${c.slug}`, ["reference", "revision"], c.description));
  }
  for (const r of resources) {
    docs.push(doc(`res-${r.id}`, r.title, "Resources", "/study/resources", [r.provider, r.category, ...r.topics], r.description));
  }
  for (const p of practiceProblems) {
    docs.push(doc(`pp-${p.id}`, p.title, "Practice", "/study/practice", [p.subject, p.topic, p.difficulty], p.description));
  }
  for (const q of interviewQuestions) {
    docs.push(doc(`iq-${q.id}`, q.question, "Interview", "/study/interview", [q.category, q.topic], q.short));
  }
  for (const b of blogPosts) {
    docs.push(doc(`blog-${b.slug}`, b.title, "Blog", `/blog/${b.slug}`, b.tags, b.summary));
  }
  for (const f of flashcards) {
    docs.push(doc(`fc-${f.id}`, f.front, "Flashcards", "/study/flashcards", [f.subject, f.topic], f.back));
  }

  // Static pages
  docs.push(
    doc("page-home", "Home", "Pages", "/", ["portfolio", "hero"], "Portfolio homepage with live status and terminal."),
    doc("page-about", "About", "Pages", "/about", ["bio", "BCA", "Amity"], "Who I am, what I'm building toward."),
    doc("page-roadmap", "Data Engineering Roadmap", "Pages", "/roadmap", ["roadmap", "learning path"], "The full learning path from programming to system design."),
    doc("page-study", "Study Hub", "Pages", "/study", ["study", "learn", "practice"], "Learn. Practice. Build. Repeat."),
    doc("page-dashboard", "Learning Dashboard", "Pages", "/dashboard", ["dashboard", "progress", "stats"], "Progress, streaks, weak topics and study time."),
    doc("page-terminal", "Developer Terminal", "Pages", "/terminal", ["terminal", "cli", "easter eggs"], "An interactive terminal with easter eggs."),
    doc("page-lab", "Data Pipeline Lab", "Pages", "/lab", ["lab", "etl", "streaming", "data quality"], "Interactive data engineering demos."),
    doc("page-resume", "Resume", "Pages", "/resume", ["resume", "cv"], "Interactive resume viewer."),
    doc("page-contact", "Contact", "Pages", "/contact", ["email", "reach out"], "Get in touch."),
    doc("page-now", "Now", "Pages", "/now", ["current", "focus"], "What I'm learning and building right now."),
    doc("page-questions", "Question Bank", "Pages", "/study/questions", ["questions", "bank"], "All practice questions, filterable."),
    doc("page-quiz", "Quiz", "Pages", "/study/quiz", ["quiz", "test"], "Subject quizzes with scoring."),
    doc("page-exam", "Exam Mode", "Pages", "/study/quiz", ["exam"], "Timed multi-question exam simulation."),
    doc("page-flashcards", "Flashcards", "Pages", "/study/flashcards", ["revision", "spaced repetition"], "Flip, grade, and schedule reviews."),
    doc("page-today", "Today's Plan", "Pages", "/study/today", ["plan", "tasks"], "Daily study checklist."),
    doc("page-timer", "Study Timer", "Pages", "/study/today", ["pomodoro", "timer"], "Pomodoro timer that logs sessions."),
    doc("page-goals", "Goal Tracker", "Pages", "/study/goals", ["goals", "deadlines"], "Learning goals with progress."),
    doc("page-history", "Study History", "Pages", "/study/history", ["log", "sessions"], "Every logged study session."),
    doc("page-playground", "SQL Playground", "Pages", "/study/playground", ["sql", "sqlite", "playground"], "Run SQL in the browser against sample tables.")
  );

  return docs;
}

export interface SearchHit {
  doc: SearchDoc;
  score: number;
}

/** Lightweight scoring search across titles, keywords and excerpts. */
export function searchDocs(docs: SearchDoc[], query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  const hits: SearchHit[] = [];

  for (const d of docs) {
    const title = d.title.toLowerCase();
    const kw = d.keywords.join(" ").toLowerCase();
    const ex = d.excerpt.toLowerCase();
    let score = 0;
    for (const t of terms) {
      if (title.includes(t)) score += 6;
      if (kw.includes(t)) score += 3;
      if (ex.includes(t)) score += 1;
      if (title.startsWith(t)) score += 4;
    }
    // whole-phrase bonus
    if (title.includes(q)) score += 8;
    if (kw.includes(q)) score += 3;
    if (score > 0) hits.push({ doc: d, score });
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, 40);
}
