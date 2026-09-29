import type { LucideIcon } from "lucide-react";

export type LearningStatus = "not-started" | "learning" | "practicing" | "completed" | "revision";

export const statusLabel: Record<LearningStatus, string> = {
  "not-started": "Not Started",
  learning: "Learning",
  practicing: "Practicing",
  completed: "Completed",
  revision: "Revision",
};

export interface Profile {
  brand: string;
  role: string;
  tagline: string;
  philosophy: string;
  email: string;
  github: string;
  linkedin: string;
  education: {
    degree: string;
    university: string;
    years: string;
  };
  location: string;
  availability: string;
  resumePdf: string;
  vcfText: string;
  githubUser?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  status: "learning" | "used" | "exploring";
  blurb: string;
  related: string[];
  usedIn: string[];
  studyPath: string | null;
}

export type SkillCategory = "Programming" | "Data" | "Data Engineering" | "Tools" | "Cloud";

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  problem: string;
  solution: string;
  architecture: string;
  architectureFlow: { label: string; detail: string }[];
  technologies: string[];
  features: string[];
  challenges: string[];
  lessons: string[];
  future: string[];
  github: string | null;
  demo: string | null;
  docs: string | null;
  screenshots: { alt: string; caption: string }[];
  status: "building" | "shipped" | "paused";
  kind: "app" | "portfolio" | "data";
  period: string;
}

export interface RoadmapNode {
  id: string;
  title: string;
  area: "Foundations" | "Data" | "Engineering" | "Systems";
  order: number;
  why: string;
  explanation: string;
  prerequisites: string[];
  status: LearningStatus;
  subjectSlug?: string;
  practiceSubject?: string;
  quizSubject?: string;
  projectSlugs: string[];
  interviewCategory: string;
  estimatedHours: number;
}

export interface Chapter {
  number: number;
  title: string;
  topics: string[];
  status: LearningStatus;
}

export interface Subject {
  slug: string;
  name: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  icon: string;
  chapters: Chapter[];
}

export type MaterialType =
  | "pdf" | "notes" | "cheatsheet" | "code" | "exercise" | "mcq" | "quiz"
  | "assignment" | "video" | "article" | "docs" | "book" | "github";

export interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  type: MaterialType;
  path?: string;
  url?: string;
  pages?: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
  description: string;
}

export interface Note {
  slug: string;
  title: string;
  subject: string;
  chapter?: string;
  tags: string[];
  date: string;
  summary: string;
  markdown: string;
}

export type QuestionType = "mcq" | "true-false" | "multi" | "code-output" | "sql-output";

export interface Question {
  id: string;
  subject: string;
  chapter: string;
  type: QuestionType;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  question: string;
  code?: string;
  options: string[];
  answerIndexes: number[];
  explanation: string;
  topic: string;
}

export interface Flashcard {
  id: string;
  subject: string;
  topic: string;
  front: string;
  back: string;
}

export interface CheatSheet {
  slug: string;
  title: string;
  description: string;
  sections: { title: string; rows: [string, string][] }[];
}

export interface Resource {
  id: string;
  title: string;
  category: "Docs" | "Course" | "Article" | "Video" | "Book" | "GitHub" | "Tool";
  provider: string;
  url: string;
  topics: string[];
  description: string;
}

export interface PracticeProblem {
  id: string;
  subject: string;
  topic: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  input: string;
  output: string;
  example: string;
  hint: string;
  solution: string;
  explanation: string;
}

export interface InterviewQuestion {
  id: string;
  category: string;
  question: string;
  short: string;
  detailed: string;
  example: string;
  followUp: string;
  commonMistake: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  topic: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  readingTime: number;
  markdown: string;
}

export interface NowEntry {
  learning: string[];
  building: string[];
  goals: string[];
  focus: string;
  nextMilestone: string;
  exploring: string[];
  updated: string;
}

export interface GoalItem {
  id: string;
  title: string;
  description: string;
  deadline: string;
  progress: number;
  milestones: string[];
}

export interface SearchDoc {
  id: string;
  title: string;
  category: string;
  path: string;
  keywords: string[];
  excerpt: string;
}

export type IconType = LucideIcon;
