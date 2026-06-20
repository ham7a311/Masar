import { getRoadmapForProfile, getAllTopics } from "../data/roadmapTopics";
import { STUDY_YEARS } from "../data/onboardingOptions";
import { isSemesterComplete } from "./dashboardAnalytics";
import { normalizeMastery } from "./mastery";
import {
  getStudyPeriodIndex,
  normalizeYearValue,
} from "./studyPeriod";

/** All study periods strictly before the given period (onboarding backfill). */
export function getPeriodsBeforeStudyPeriod(periodValue) {
  const normalized = normalizeYearValue(periodValue);
  const idx = getStudyPeriodIndex(normalized);
  if (idx <= 0) return [];
  return STUDY_YEARS.slice(0, idx).map((p) => p.value);
}

export function getTopicsForStudyPeriod(profile, periodValue) {
  if (!profile) return [];
  const roadmap = getRoadmapForProfile({
    ...profile,
    year: normalizeYearValue(periodValue),
    currentStudyPeriod: normalizeYearValue(periodValue),
  });
  return getAllTopics(roadmap);
}

/** True when every topic in that semester roadmap is mastered. */
export function isStudyPeriodTopicsMastered(profile, periodValue, topicMastery = {}) {
  const topics = getTopicsForStudyPeriod(profile, periodValue);
  if (!topics.length) return false;
  return isSemesterComplete(topics, topicMastery);
}

/**
 * Completed semesters = all topics mastered for that period (current or past).
 * No automatic completion from calendar position alone.
 */
export function computeCompletedStudyPeriods(profile, topicMastery = {}) {
  if (!profile) return [];

  return STUDY_YEARS.map((p) => p.value).filter((period) =>
    isStudyPeriodTopicsMastered(profile, period, topicMastery)
  );
}

/** Onboarding: periods before selection + mastery seeds for those periods. */
export function buildOnboardingStudyProgress(profile, selectedPeriod) {
  const current = normalizeYearValue(selectedPeriod);
  const completedStudyPeriods = getPeriodsBeforeStudyPeriod(current);
  const topicMastery = {};

  for (const period of completedStudyPeriods) {
    for (const topic of getTopicsForStudyPeriod(profile, period)) {
      topicMastery[topic.id] = "mastered";
    }
  }

  return { completedStudyPeriods, topicMastery };
}
