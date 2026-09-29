import type { NowEntry, GoalItem } from "@/types";

/** The /now page content — update this file to reflect current state. */
export const nowEntry: NowEntry = {
  learning: ["Python (functions, OOP)", "SQL (joins, aggregations, windows)", "Data Structures (Big-O, arrays)"],
  building: ["Data Engineering Pipeline (staged ETL with validation)", "Code With Fox (this platform)"],
  goals: [
    "Finish SQL window functions",
    "Complete the ETL pipeline validation layer",
    "Solve 50 DSA problems",
  ],
  focus: "SQL mastery + pipeline fundamentals",
  nextMilestone: "First orchestrated pipeline run with Airflow",
  exploring: ["Apache Spark", "Kafka", "Docker"],
  updated: "2026-09-29",
};

/** Seed goals for /study/goals — user-editable, persisted locally. */
export const seedGoals: GoalItem[] = [
  {
    id: "goal-sql",
    title: "Master SQL",
    description: "Joins, aggregations, window functions, query plans.",
    deadline: "2026-12-31",
    progress: 70,
    milestones: ["SELECT & filtering", "JOINs", "GROUP BY & HAVING", "Window functions", "EXPLAIN plans"],
  },
  {
    id: "goal-etl",
    title: "Build ETL Pipeline",
    description: "End-to-end: extract, validate, load, analytics views.",
    deadline: "2026-11-30",
    progress: 40,
    milestones: ["Extract", "Transform", "Validation", "Load", "Warehouse views"],
  },
  {
    id: "goal-dsa",
    title: "50 DSA Problems",
    description: "Arrays, hash maps, trees — Python solutions.",
    deadline: "2027-01-31",
    progress: 24,
    milestones: ["10 problems", "25 problems", "50 problems"],
  },
];

/** Live status widget on the homepage. */
export const liveStatus = {
  learning: "Python + SQL",
  building: "Data Engineering Projects",
  exploring: "Apache Spark",
  goal: "Data Engineer",
};

/** Playful system status — clearly not real infrastructure. */
export const systemStatus: { label: string; state: string; ok: boolean }[] = [
  { label: "Portfolio", state: "Operational", ok: true },
  { label: "Projects", state: "Active", ok: true },
  { label: "Study Hub", state: "Online", ok: true },
  { label: "Learning", state: "In Progress", ok: true },
  { label: "Coffee", state: "Required", ok: false },
];

/** Study plan template for /study/today — user can edit locally. */
export const seedTodayPlan: string[] = [
  "Python Functions",
  "SQL JOIN practice",
  "10 SQL questions",
  "Data Structures: Big-O",
  "Flashcard revision",
];

/** Dashboard card config. */
export const dashboardConfig = {
  weeklyTargetMinutes: 600,
};
