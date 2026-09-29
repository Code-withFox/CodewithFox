import { Routes, Route } from "react-router-dom";
import { SiteLayout } from "@/layouts/SiteLayout";
import { lazy, Suspense } from "react";

const About = lazy(() => import("@/pages/About"));
const Skills = lazy(() => import("@/pages/Skills"));
const TechExplorer = lazy(() => import("@/pages/TechExplorer"));
const Roadmap = lazy(() => import("@/pages/Roadmap"));
const RoadmapNodePage = lazy(() => import("@/pages/RoadmapNodePage"));
const Projects = lazy(() => import("@/pages/Projects"));
const ProjectDetail = lazy(() => import("@/pages/ProjectDetail"));
const Now = lazy(() => import("@/pages/Now"));
const Resume = lazy(() => import("@/pages/Resume"));
const Certifications = lazy(() => import("@/pages/Certifications"));
const Contact = lazy(() => import("@/pages/Contact"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPostPage = lazy(() => import("@/pages/BlogPostPage"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Learning = lazy(() => import("@/pages/Learning"));
const Lab = lazy(() => import("@/pages/Lab"));
const Terminal = lazy(() => import("@/pages/Terminal"));
const Bookmarks = lazy(() => import("@/pages/Bookmarks"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const SitemapPage = lazy(() => import("@/pages/SitemapPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const Study = lazy(() => import("@/pages/study/StudyHome"));
const SubjectPage = lazy(() => import("@/pages/study/SubjectPage"));
const NotesPage = lazy(() => import("@/pages/study/NotesPage"));
const NoteDetail = lazy(() => import("@/pages/study/NoteDetail"));
const FlashcardsPage = lazy(() => import("@/pages/study/FlashcardsPage"));
const RevisionPage = lazy(() => import("@/pages/study/RevisionPage"));
const QuizPage = lazy(() => import("@/pages/study/QuizPage"));
const QuestionsPage = lazy(() => import("@/pages/study/QuestionsPage"));
const PracticePage = lazy(() => import("@/pages/study/PracticePage"));
const PlaygroundPage = lazy(() => import("@/pages/study/PlaygroundPage"));
const CheatsheetsPage = lazy(() =>
  import("@/pages/study/CheatsheetsPage").then((m) => ({ default: m.CheatsheetsPage }))
);
const CheatsheetDetail = lazy(() =>
  import("@/pages/study/CheatsheetsPage").then((m) => ({ default: m.CheatsheetDetail }))
);
const ResourcesPage = lazy(() => import("@/pages/study/ResourcesPage"));
const TodayPage = lazy(() => import("@/pages/study/TodayPage"));
const HistoryPage = lazy(() => import("@/pages/study/HistoryPage"));
const GoalsPage = lazy(() => import("@/pages/study/GoalsPage"));
const InterviewPage = lazy(() => import("@/pages/study/InterviewPage"));
const HomeLazy = lazy(() => import("@/pages/Home"));
const StudyGoalsPage = GoalsPage;

function LazyFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex items-center gap-3 text-sm text-ink-400">
        <span className="h-2 w-2 animate-pulse-dot rounded-full bg-accent-500" />
        Loading…
      </div>
      <span className="sr-only">Loading page</span>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomeLazy />} />
        <Route path="*" element={<SiteRoutes />} />
      </Route>
    </Routes>
  );
}

function SiteRoutes() {
  return (
    <Suspense fallback={<LazyFallback />}>
      <Routes>
        <Route path="/" element={<HomeLazy />} />
        <Route path="/about" element={<About />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/tech" element={<TechExplorer />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/roadmap/:nodeId" element={<RoadmapNodePage />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/now" element={<Now />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/certifications" element={<Certifications />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/lab" element={<Lab />} />
        <Route path="/terminal" element={<Terminal />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/sitemap" element={<SitemapPage />} />

        {/* Study Hub */}
        <Route path="/study" element={<Study />} />
        <Route path="/study/:subject" element={<SubjectPage />} />
        <Route path="/study/notes" element={<NotesPage />} />
        <Route path="/study/notes/:slug" element={<NoteDetail />} />
        <Route path="/study/flashcards" element={<FlashcardsPage />} />
        <Route path="/study/revision" element={<RevisionPage />} />
        <Route path="/study/quiz" element={<QuizPage />} />
        <Route path="/study/questions" element={<QuestionsPage />} />
        <Route path="/study/practice" element={<PracticePage />} />
        <Route path="/study/playground" element={<PlaygroundPage />} />
        <Route path="/study/cheatsheets" element={<CheatsheetsPage />} />
        <Route path="/study/cheatsheets/:slug" element={<CheatsheetDetail />} />
        <Route path="/study/resources" element={<ResourcesPage />} />
        <Route path="/study/today" element={<TodayPage />} />
        <Route path="/study/history" element={<HistoryPage />} />
        <Route path="/study/goals" element={<StudyGoalsPage />} />
        <Route path="/study/interview" element={<InterviewPage />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
