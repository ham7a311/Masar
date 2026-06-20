import { STUDY_YEARS } from "../data/onboardingOptions";
import { getMasteryWeight, isMastered, normalizeMastery } from "./mastery";
import { normalizeYearValue } from "./studyPeriod";

const PRIORITY_KEY = (uid) => `masar-priority-topics-${uid}`;

export function loadPriorityTopics(uid) {
  try {
    const raw = localStorage.getItem(PRIORITY_KEY(uid));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};
    const normalized = normalizePriorityTopics(parsed);
    const hasLegacy = Object.values(parsed).some((value) => value === true);
    if (hasLegacy) savePriorityTopics(uid, normalized);
    return normalized;
  } catch {
    return {};
  }
}

export function savePriorityTopics(uid, priorities) {
  localStorage.setItem(PRIORITY_KEY(uid), JSON.stringify(priorities));
}

/** Migrate legacy `{ id: true }` and coerce stored order values. */
export function normalizePriorityTopics(priorities) {
  const next = { ...priorities };
  let seq = 1;
  let changed = false;

  for (const [id, value] of Object.entries(next)) {
    if (value === true) {
      next[id] = seq++;
      changed = true;
    } else if (typeof value === "number" && Number.isFinite(value)) {
      seq = Math.max(seq, value + 1);
    } else {
      delete next[id];
      changed = true;
    }
  }

  return changed ? next : priorities;
}

export function isPriorityTopic(priorities, topicId) {
  return getPriorityOrder(priorities, topicId) != null;
}

/** Lower number = marked as priority earlier. */
export function getPriorityOrder(priorities, topicId) {
  const value = priorities?.[topicId];
  if (value == null || value === false) return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (value === true) return 0;
  return null;
}

export function togglePriorityTopic(priorities, topicId) {
  const next = { ...priorities };
  if (next[topicId]) {
    delete next[topicId];
    return next;
  }

  let maxOrder = 0;
  for (const value of Object.values(next)) {
    if (typeof value === "number" && Number.isFinite(value)) {
      maxOrder = Math.max(maxOrder, value);
    }
  }
  next[topicId] = maxOrder + 1;
  return next;
}

/** Active topics: priorities first (mark order), then the rest in original order. */
export function sortTopicsByPriorityOrder(topics, priorities) {
  return topics
    .map((topic, index) => ({ topic, index }))
    .sort((a, b) => {
      const aOrder = getPriorityOrder(priorities, a.topic.id);
      const bOrder = getPriorityOrder(priorities, b.topic.id);
      const aPri = aOrder != null ? 0 : 1;
      const bPri = bOrder != null ? 0 : 1;
      if (aPri !== bPri) return aPri - bPri;
      if (aOrder != null && bOrder != null && aOrder !== bOrder) {
        return aOrder - bOrder;
      }
      return a.index - b.index;
    })
    .map(({ topic }) => topic);
}

/** Earlier topics in roadmap order must be completed first. */
export function buildPrerequisiteMap(sections) {
  const map = {};
  const prior = [];

  for (const section of sections) {
    for (const topic of section.topics) {
      map[topic.id] = [...prior];
      prior.push(topic.id);
    }
  }

  return map;
}

export function getIncompletePrerequisites(topicId, prerequisiteMap, topicMastery) {
  const prereqs = prerequisiteMap[topicId] || [];
  return prereqs.filter((id) => !isMastered(normalizeMastery(topicMastery[id])));
}

export function canMarkTopicCompleted(topicId, prerequisiteMap, topicStatuses) {
  return getIncompletePrerequisites(topicId, prerequisiteMap, topicStatuses).length === 0;
}

export function sortTopicsWithPriorityFirst(topics, priorities) {
  return sortTopicsByPriorityOrder(topics, priorities);
}

export function getUnfinishedPriorityTopics(allTopics, priorities, topicMastery) {
  return allTopics.filter(
    (t) =>
      isPriorityTopic(priorities, t.id) &&
      !isMastered(normalizeMastery(topicMastery[t.id]))
  );
}

export function computePriorityStats(allTopics, priorities, topicMastery) {
  const priorityTopics = allTopics.filter((t) => isPriorityTopic(priorities, t.id));
  const total = priorityTopics.length;
  let weightSum = 0;
  let mastered = 0;

  priorityTopics.forEach((t) => {
    const level = normalizeMastery(topicMastery[t.id]);
    weightSum += getMasteryWeight(level);
    if (isMastered(level)) mastered += 1;
  });

  const remaining = total - mastered;
  const percent = total ? Math.round(weightSum / total) : 0;

  return { total, completed: mastered, remaining, percent };
}

export function getNextStudyYear(currentYear) {
  const normalized = normalizeYearValue(currentYear);
  const idx = STUDY_YEARS.findIndex((y) => y.value === normalized);
  if (idx < 0 || idx >= STUDY_YEARS.length - 1) return null;
  return STUDY_YEARS[idx + 1].value;
}

export function getNextStudyYearLabel(currentYear) {
  const next = getNextStudyYear(currentYear);
  if (!next) return null;
  return STUDY_YEARS.find((y) => y.value === next)?.label ?? null;
}

export function isAdvancingStudyPeriod(fromYear, toYear) {
  const fromIdx = STUDY_YEARS.findIndex(
    (y) => y.value === normalizeYearValue(fromYear)
  );
  const toIdx = STUDY_YEARS.findIndex((y) => y.value === normalizeYearValue(toYear));
  if (fromIdx < 0 || toIdx < 0) return false;
  return toIdx > fromIdx;
}

export function evaluateMilestoneAdvance({
  unfinishedPriorityTopics,
  strictPriorityMode,
}) {
  if (unfinishedPriorityTopics.length === 0) {
    return { allowed: true, blocked: false, warning: null };
  }

  const names = unfinishedPriorityTopics.map((t) => t.title).join(", ");

  if (strictPriorityMode) {
    return {
      allowed: false,
      blocked: true,
      warning: `Complete all priority topics before advancing. Still incomplete: ${names}.`,
    };
  }

  return {
    allowed: true,
    blocked: false,
    warning: `You still have ${unfinishedPriorityTopics.length} unfinished priority topic(s): ${names}. You can continue, but we recommend finishing them first.`,
  };
}
