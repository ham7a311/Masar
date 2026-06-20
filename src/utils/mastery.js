/** Five-level topic mastery system */

export const MASTERY_LEVELS = [
  "not_started",
  "learning",
  "familiar",
  "confident",
  "mastered",
];

export const MASTERY_LABELS = {
  not_started: "Not Started",
  learning: "Learning",
  familiar: "Familiar",
  confident: "Confident",
  mastered: "Mastered",
};

export const MASTERY_WEIGHTS = {
  not_started: 0,
  learning: 25,
  familiar: 50,
  confident: 75,
  mastered: 100,
};

const LEGACY_MAP = {
  not_started: "not_started",
  in_progress: "learning",
  completed: "mastered",
};

export function normalizeMastery(value) {
  if (!value) return "not_started";
  if (MASTERY_LEVELS.includes(value)) return value;
  return LEGACY_MAP[value] || "not_started";
}

export function getMasteryLabel(level) {
  return MASTERY_LABELS[normalizeMastery(level)] || "Not Started";
}

export function getMasteryWeight(level) {
  return MASTERY_WEIGHTS[normalizeMastery(level)] ?? 0;
}

export function isMastered(level) {
  return normalizeMastery(level) === "mastered";
}

export function isActiveMastery(level) {
  return !isMastered(level);
}

export function migrateMasteryMap(statusMap) {
  const next = {};
  for (const [id, value] of Object.entries(statusMap || {})) {
    next[id] = normalizeMastery(value);
  }
  return next;
}

/** Prerequisite satisfied when prior topics are mastered. */
export function isPrerequisiteSatisfied(mastery) {
  return isMastered(mastery);
}

export function getCareerImpactStars(goalRelevance) {
  const score = Math.round((goalRelevance ?? 0.3) * 5);
  return Math.min(5, Math.max(1, score));
}

export function getCareerImpactExplanation(stars, careerGoalLabel) {
  const tiers = {
    5: `Highly valuable for ${careerGoalLabel} — internships, graduate roles, and technical interviews.`,
    4: `Important for ${careerGoalLabel} and building industry-ready skills.`,
    3: `Moderately important — strengthens your foundation for ${careerGoalLabel}.`,
    2: `Useful supporting knowledge alongside core career topics.`,
    1: `Minimal direct industry relevance, but supports well-rounded learning.`,
  };
  return tiers[stars] || tiers[3];
}

export function getCareerImpactContexts(stars) {
  if (stars >= 5) {
    return ["Internships", "Graduate Jobs", "Technical Interviews", "Software Engineering Roles"];
  }
  if (stars >= 4) {
    return ["Entry-Level Roles", "Industry Projects", "Team Collaboration"];
  }
  if (stars >= 3) {
    return ["Academic Success", "Skill Building", "Career Exploration"];
  }
  return ["General Education", "Supporting Skills"];
}
