import {
  getGutechRoadmapForProfile,
  isGutechUniversity,
} from "./gutechCatalogue";
import { parseStudyPeriod } from "../utils/studyPeriod";
import {
  getMasteryWeight,
  isActiveMastery,
  isMastered,
  normalizeMastery,
} from "../utils/mastery";

/**
 * Roadmap data — GUtech uses Academic Catalogue 2025–2026 (bachelor programmes only);
 * other universities use placeholder pools until backend is connected.
 */

const CS_TOPICS = {
  sem1: [
    { id: "oop", title: "Object-Oriented Programming", difficulty: "Beginner", weeks: 3 },
    { id: "calc", title: "Calculus I", difficulty: "Beginner", weeks: 5 },
    { id: "git", title: "Git & Version Control", difficulty: "Beginner", weeks: 2 },
  ],
  sem2: [
    { id: "ds", title: "Data Structures", difficulty: "Intermediate", weeks: 4 },
    { id: "net", title: "Networking Basics", difficulty: "Beginner", weeks: 3 },
    { id: "db", title: "Database Fundamentals", difficulty: "Intermediate", weeks: 4 },
  ],
};

const DEFAULT_TOPICS = {
  sem1: [
    { id: "fund", title: "Field Fundamentals", difficulty: "Beginner", weeks: 4 },
    { id: "comm", title: "Professional Communication", difficulty: "Beginner", weeks: 2 },
    { id: "research", title: "Industry Research", difficulty: "Beginner", weeks: 2 },
  ],
  sem2: [
    { id: "writing", title: "Academic Writing", difficulty: "Intermediate", weeks: 3 },
    { id: "excel", title: "Spreadsheets & Analysis", difficulty: "Beginner", weeks: 3 },
    { id: "capstone", title: "Capstone Planning", difficulty: "Intermediate", weeks: 4 },
  ],
};

const MAJOR_MAP = {
  "Computer Science": CS_TOPICS,
  "Software Engineering": CS_TOPICS,
  "Information Technology": CS_TOPICS,
  "Data Science": CS_TOPICS,
  "Artificial Intelligence": CS_TOPICS,
  "Cybersecurity": CS_TOPICS,
  "Cyber Security": CS_TOPICS,
};

export const MOTIVATIONAL_QUOTES = [
  "Small steps today build the career you want tomorrow.",
  "Clarity beats speed — focus on what matters this semester.",
  "Your roadmap adapts as you grow. Keep moving forward.",
  "Every skill you build opens a new door.",
];

function buildPlaceholderSections(pools, term) {
  const semKeys = term === 1 ? ["sem1"] : term === 2 ? ["sem2"] : ["sem1", "sem2"];

  return semKeys.map((key, index) => ({
    id: key,
    title: `Semester ${index + 1}`,
    description: term ? `Current term` : `Year semester ${index + 1}`,
    topics: (pools[key] || []).map((topic) => ({
      ...topic,
      mastery: "not_started",
    })),
  }));
}

export function getRoadmapForProfile(profile) {
  if (isGutechUniversity(profile?.university)) {
    const gutechRoadmap = getGutechRoadmapForProfile(profile);
    if (gutechRoadmap) return gutechRoadmap;
  }

  const major = profile?.major || "your major";
  const pools = MAJOR_MAP[major] || DEFAULT_TOPICS;
  const { yearNum, term } = parseStudyPeriod(profile?.year);

  return {
    meta: {
      major,
      university: profile?.university || "",
      year: String(yearNum),
      term: term ? String(term) : null,
    },
    sections: buildPlaceholderSections(pools, term),
  };
}

export function getAllTopics(roadmap) {
  return roadmap.sections.flatMap((s) => s.topics);
}

export function computeRoadmapStats(topics, masteryMap = {}) {
  const total = topics.length;
  let mastered = 0;
  let inProgress = 0;
  let weightSum = 0;

  topics.forEach((t) => {
    const level = normalizeMastery(masteryMap[t.id] ?? t.mastery ?? t.status);
    weightSum += getMasteryWeight(level);
    if (isMastered(level)) mastered += 1;
    else if (isActiveMastery(level) && level !== "not_started") inProgress += 1;
  });

  const remaining = total - mastered;
  const percent = total ? Math.round(weightSum / total) : 0;
  const weeksLeft = topics
    .filter((t) => !isMastered(normalizeMastery(masteryMap[t.id] ?? t.mastery ?? t.status)))
    .reduce((sum, t) => sum + (t.weeks || 0), 0);

  return {
    total,
    completed: mastered,
    mastered,
    inProgress,
    remaining,
    percent,
    weeksLeft,
  };
}

