import { inferTopicCategories } from "../data/careerGoals";
import { getGoalLabel, getTopicGoalRelevance, isGoalRecommendedTopic } from "./careerGoal";
import { getMasteryWeight, isMastered, normalizeMastery } from "./mastery";
import { getIncompletePrerequisites, isPriorityTopic } from "./topicProgress";

export const ACHIEVEMENTS = [
  { id: "first-mastered", title: "First Topic Mastered", desc: "Master your first topic" },
  { id: "priority-first", title: "First Priority Topic Completed", desc: "Master a priority topic" },
  { id: "streak-7", title: "7-Day Streak", desc: "Learn 7 days in a row" },
  { id: "mastered-10", title: "10 Topics Mastered", desc: "Master 10 topics" },
  { id: "semester-complete", title: "Semester Completed", desc: "Master every topic this semester" },
  { id: "readiness-50", title: "Career Goal Progress 50%", desc: "Reach 50% career readiness" },
  { id: "mastered-25", title: "25 Topics Mastered", desc: "Master 25 topics" },
];

export function getReadinessLevel(overall) {
  if (overall >= 72) return "Strong foundation";
  if (overall >= 52) return "Making progress";
  if (overall >= 28) return "Building skills";
  if (overall > 0) return "Getting started";
  return "Not started";
}

function percentAtOrAboveLevel(topics, topicMastery, minLevel) {
  if (!topics.length) return 0;
  const thresholds = {
    learning: ["learning", "familiar", "confident", "mastered"],
    familiar: ["familiar", "confident", "mastered"],
    confident: ["confident", "mastered"],
    mastered: ["mastered"],
  };
  const allowed = thresholds[minLevel] || thresholds.mastered;
  const count = topics.filter((t) =>
    allowed.includes(normalizeMastery(topicMastery[t.id]))
  ).length;
  return Math.round((count / topics.length) * 100);
}

export function computeLearningStats(
  allTopics,
  topicMastery,
  priorityTopics,
  roadmapStats,
  goalProgress
) {
  const counts = {
    not_started: 0,
    learning: 0,
    familiar: 0,
    confident: 0,
    mastered: 0,
  };

  allTopics.forEach((t) => {
    const m = normalizeMastery(topicMastery[t.id]);
    if (counts[m] !== undefined) counts[m] += 1;
  });

  const priorityTotal = allTopics.filter((t) =>
    isPriorityTopic(priorityTopics, t.id)
  ).length;
  const priorityMastered = allTopics.filter(
    (t) =>
      isPriorityTopic(priorityTopics, t.id) &&
      isMastered(normalizeMastery(topicMastery[t.id]))
  ).length;

  return {
    overallMastery: roadmapStats.percent,
    counts,
    totalTopics: allTopics.length,
    topicsMastered: roadmapStats.mastered,
    topicsInProgress: roadmapStats.inProgress,
    topicsRemaining: roadmapStats.remaining,
    priorityMastered,
    priorityTotal,
    yearCompletion: roadmapStats.percent,
    careerGoalProgress: goalProgress?.percent ?? 0,
  };
}

export function getAchievementProgress(achievementId, ctx) {
  const mastered = ctx.allTopics.filter((t) =>
    isMastered(normalizeMastery(ctx.topicMastery[t.id]))
  ).length;
  const priorityDone = ctx.allTopics.filter(
    (t) =>
      isPriorityTopic(ctx.priorityTopics, t.id) &&
      isMastered(normalizeMastery(ctx.topicMastery[t.id]))
  ).length;
  const streak = ctx.engagement?.currentStreak || 0;
  const readiness = ctx.readiness?.overall || 0;

  switch (achievementId) {
    case "first-mastered":
      return { current: mastered, target: 1, label: "topics mastered" };
    case "priority-first":
      return { current: priorityDone, target: 1, label: "priority topics mastered" };
    case "streak-7":
      return { current: streak, target: 7, label: "day streak" };
    case "mastered-10":
      return { current: mastered, target: 10, label: "topics mastered" };
    case "mastered-25":
      return { current: mastered, target: 25, label: "topics mastered" };
    case "semester-complete":
      return {
        current: ctx.semesterComplete ? 1 : 0,
        target: 1,
        label: "semester complete",
      };
    case "readiness-50":
      return { current: readiness, target: 50, label: "% career readiness" };
    default:
      return null;
  }
}

export function getTopicUnlocks(topicId, allTopics, prerequisiteMap) {
  return allTopics.filter((t) => (prerequisiteMap[t.id] || []).includes(topicId));
}

export function getTopicDependencyChain(topicId, topicById, prerequisiteMap) {
  const chain = [];
  const prereqs = prerequisiteMap[topicId] || [];
  prereqs.slice(-4).forEach((id) => {
    if (topicById[id]) chain.push({ topic: topicById[id], relation: "prerequisite" });
  });
  if (topicById[topicId]) chain.push({ topic: topicById[topicId], relation: "current" });
  return chain;
}

export function computeCareerReadiness(allTopics, topicMastery, priorityTopics, careerGoal, goalProgressPercent) {
  const total = allTopics.length;
  const masteredCount = total
    ? allTopics.filter((t) => isMastered(normalizeMastery(topicMastery[t.id]))).length
    : 0;
  const masteredPercent = total ? Math.round((masteredCount / total) * 100) : 0;

  const knowledge = percentAtOrAboveLevel(allTopics, topicMastery, "confident");

  const priorityList = allTopics.filter((t) => isPriorityTopic(priorityTopics, t.id));
  const coreSkills =
    priorityList.length > 0
      ? Math.round(
          (priorityList.filter((t) => isMastered(normalizeMastery(topicMastery[t.id]))).length /
            priorityList.length) *
            100
        )
      : percentAtOrAboveLevel(allTopics, topicMastery, "familiar");

  const relevant = allTopics.filter((t) => isGoalRecommendedTopic(t, careerGoal));
  const specialization =
    relevant.length > 0
      ? percentAtOrAboveLevel(relevant, topicMastery, "familiar")
      : Math.round(knowledge * 0.85);

  const careerPreparation = Math.min(100, Math.max(0, goalProgressPercent ?? 0));

  let overall = Math.round(
    knowledge * 0.3 +
      coreSkills * 0.25 +
      specialization * 0.25 +
      careerPreparation * 0.2
  );

  overall = Math.min(overall, masteredPercent + 12);
  overall = Math.max(0, overall);

  return {
    overall,
    knowledge,
    coreSkills,
    specialization,
    careerPreparation,
    level: getReadinessLevel(overall),
  };
}

export function generateWeeklyPlan(allTopics, topicMastery, priorityTopics, careerGoal) {
  const candidates = allTopics
    .filter((t) => !isMastered(normalizeMastery(topicMastery[t.id])))
    .sort((a, b) => {
      let sa = getTopicGoalRelevance(a, careerGoal) * 10;
      let sb = getTopicGoalRelevance(b, careerGoal) * 10;
      if (isPriorityTopic(priorityTopics, a.id)) sa += 5;
      if (isPriorityTopic(priorityTopics, b.id)) sb += 5;
      const ma = normalizeMastery(topicMastery[a.id]);
      const mb = normalizeMastery(topicMastery[b.id]);
      if (ma === "learning") sa += 3;
      if (mb === "learning") sb += 3;
      return sb - sa;
    })
    .slice(0, 3);

  const items = candidates.map((t) => {
    const m = normalizeMastery(topicMastery[t.id]);
    const done = ["familiar", "confident", "mastered"].includes(m);
    return { ...t, mastery: m, weekComplete: done };
  });

  const completed = items.filter((i) => i.weekComplete).length;
  const estimatedHours = items.reduce((s, t) => s + Math.max(2, Math.round((t.weeks || 2) * 1.5)), 0);

  return { items, completed, total: items.length, estimatedHours };
}

export function getContinueLearning(allTopics, topicMastery, engagement) {
  const lastId = engagement?.lastActiveTopicId;
  if (lastId) {
    const t = allTopics.find((x) => x.id === lastId);
    if (t && !isMastered(normalizeMastery(topicMastery[t.id]))) {
      return {
        ...t,
        mastery: normalizeMastery(topicMastery[t.id]),
        weeksRemaining: Math.max(1, (t.weeks || 2) - (getMasteryWeight(topicMastery[t.id]) / 25)),
      };
    }
  }

  const active = allTopics.find(
    (t) => normalizeMastery(topicMastery[t.id]) === "learning"
  );
  if (active) {
    return {
      ...active,
      mastery: "learning",
      weeksRemaining: active.weeks || 2,
    };
  }

  const next = allTopics.find(
    (t) => !isMastered(normalizeMastery(topicMastery[t.id]))
  );
  if (next) {
    return {
      ...next,
      mastery: normalizeMastery(topicMastery[next.id]),
      weeksRemaining: next.weeks || 2,
    };
  }
  return null;
}

export function generateInsights({
  allTopics,
  topicMastery,
  priorityTopics,
  topicNotes,
  careerGoal,
  engagement,
  readiness,
}) {
  const insights = [];
  const goalLabel = getGoalLabel(careerGoal);

  const priorityTotal = allTopics.filter((t) => isPriorityTopic(priorityTopics, t.id)).length;
  const priorityDone = allTopics.filter(
    (t) =>
      isPriorityTopic(priorityTopics, t.id) &&
      isMastered(normalizeMastery(topicMastery[t.id]))
  ).length;
  if (priorityTotal > 0) {
    const pct = Math.round((priorityDone / priorityTotal) * 100);
    insights.push(`You have completed ${pct}% of your priority topics.`);
  }

  const technical = allTopics.filter((t) => inferTopicCategories(t).includes("technical"));
  const business = allTopics.filter((t) => inferTopicCategories(t).includes("business"));
  const techAvg =
    technical.length > 0
      ? technical.reduce((s, t) => s + getMasteryWeight(topicMastery[t.id]), 0) / technical.length
      : 0;
  const bizAvg =
    business.length > 0
      ? business.reduce((s, t) => s + getMasteryWeight(topicMastery[t.id]), 0) / business.length
      : 0;
  if (technical.length && business.length) {
    if (techAvg > bizAvg + 15) {
      insights.push("You are progressing faster on technical topics than business topics.");
    } else if (bizAvg > techAvg + 15) {
      insights.push("You are progressing faster on business topics than technical topics.");
    }
  }

  const goalTopics = allTopics.filter((t) => isGoalRecommendedTopic(t, careerGoal));
  const goalMastered = goalTopics.filter((t) =>
    isMastered(normalizeMastery(topicMastery[t.id]))
  ).length;
  if (goalTopics.length > 0 && goalMastered > 0) {
    insights.push(
      `Most of your progress aligns with your ${goalLabel} goal (${goalMastered} goal-relevant topics advanced).`
    );
  }

  const noteDates = Object.values(topicNotes || {})
    .flat()
    .map((n) => n.updatedAt)
    .filter(Boolean);
  if (noteDates.length) {
    const latest = Math.max(...noteDates);
    const daysSince = Math.floor((Date.now() - latest) / 86400000);
    if (daysSince >= 7) {
      insights.push(`You haven't updated notes in ${daysSince} days — jot down what you learned recently.`);
    }
  } else if (allTopics.length > 3) {
    insights.push("Add notes to topics you study — it boosts retention and career readiness.");
  }

  if (readiness?.overall >= 50) {
    insights.push(`Your career readiness is ${readiness.overall}% — keep building momentum.`);
  }

  return insights.slice(0, 4);
}

export function evaluateAchievements(ctx) {
  const unlocked = new Set(ctx.engagement?.unlockedAchievements || []);
  const newly = [];

  const masteredCount = ctx.allTopics.filter((t) =>
    isMastered(normalizeMastery(ctx.topicMastery[t.id]))
  ).length;

  const checks = [
    { id: "first-mastered", ok: masteredCount >= 1 },
    { id: "mastered-10", ok: masteredCount >= 10 },
    { id: "mastered-25", ok: masteredCount >= 25 },
    { id: "streak-7", ok: (ctx.engagement?.currentStreak || 0) >= 7 },
    {
      id: "priority-first",
      ok: ctx.allTopics.some(
        (t) =>
          isPriorityTopic(ctx.priorityTopics, t.id) &&
          isMastered(normalizeMastery(ctx.topicMastery[t.id]))
      ),
    },
    { id: "semester-complete", ok: ctx.semesterComplete },
    { id: "readiness-50", ok: (ctx.readiness?.overall || 0) >= 50 },
  ];

  checks.forEach(({ id, ok }) => {
    if (ok && !unlocked.has(id)) {
      unlocked.add(id);
      newly.push(ACHIEVEMENTS.find((a) => a.id === id));
    }
  });

  return {
    unlocked: [...unlocked],
    newly: newly.filter(Boolean),
    list: ACHIEVEMENTS.map((a) => ({ ...a, earned: unlocked.has(a.id) })),
  };
}

export function computeCompletionForecast(allTopics, topicMastery, readiness, profile) {
  const remaining = allTopics.filter(
    (t) => !isMastered(normalizeMastery(topicMastery[t.id]))
  );
  const weeksLeft = remaining.reduce((s, t) => s + (t.weeks || 2), 0);
  const pace = Math.max(0.5, (readiness?.overall || 10) / 50);
  const weeksToFinish = Math.ceil(weeksLeft / pace);

  const yearDate = new Date();
  yearDate.setDate(yearDate.getDate() + weeksToFinish * 7);

  const careerDate = new Date();
  const careerWeeks = Math.ceil(weeksToFinish * 1.2);
  careerDate.setDate(careerDate.getDate() + careerWeeks * 7);

  const fmt = (d) =>
    d.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return {
    yearCompletion: fmt(yearDate),
    careerReadiness: fmt(careerDate),
    weeksRemaining: weeksLeft,
  };
}

export function isSemesterComplete(allTopics, topicMastery) {
  if (!allTopics.length) return false;
  return allTopics.every((t) => isMastered(normalizeMastery(topicMastery[t.id])));
}

export function buildSkillTree(allTopics, topicMastery, prerequisiteMap) {
  const groups = {};

  allTopics.forEach((topic) => {
    const cats = inferTopicCategories(topic);
    const group = cats.includes("technical")
      ? "Programming & Technical"
      : cats.includes("business")
        ? "Business & Industry"
        : cats.includes("quantitative")
          ? "Quantitative Skills"
          : cats.includes("research")
            ? "Research & Academia"
            : "Core Foundations";

    if (!groups[group]) groups[group] = [];
    const prereqs = prerequisiteMap[topic.id] || [];
    const locked = false;
    const mastered = isMastered(normalizeMastery(topicMastery[topic.id]));
    const active = !mastered;

    groups[group].push({
      ...topic,
      mastery: normalizeMastery(topicMastery[topic.id]),
      locked,
      mastered,
      active,
    });
  });

  return Object.entries(groups).map(([name, nodes]) => ({ name, nodes }));
}

export function getRecommendedWithReasons(
  allTopics,
  careerGoal,
  priorityTopics,
  topicMastery,
  prerequisiteMap,
  limit = 3
) {
  const goalLabel = getGoalLabel(careerGoal);

  const candidates = allTopics.filter(
    (topic) => !isMastered(normalizeMastery(topicMastery[topic.id]))
  );

  const scored = candidates
    .map((topic) => {
      let score = getTopicGoalRelevance(topic, careerGoal) * 10;
      const reasons = [];

      if (isGoalRecommendedTopic(topic, careerGoal)) {
        score += 4;
        reasons.push(`Matches your ${goalLabel} goal`);
      }
      if (isPriorityTopic(priorityTopics, topic.id)) {
        score += 5;
        reasons.push("Marked as priority");
      }
      const unlocks = getTopicUnlocks(topic.id, allTopics, prerequisiteMap);
      if (unlocks.length > 0) {
        score += Math.min(4, unlocks.length);
        reasons.push(`Unlocks ${unlocks.length} future topic${unlocks.length > 1 ? "s" : ""}`);
      }
      if (getTopicGoalRelevance(topic, careerGoal) >= 0.7) {
        reasons.push("High industry relevance");
      }
      const level = normalizeMastery(topicMastery[topic.id]);
      if (level === "learning") {
        score += 3;
        reasons.push("You're already learning this");
      }
      if (level === "not_started") reasons.push("Strong next step in your path");

      return {
        topic: { ...topic, mastery: level },
        score,
        reasons: reasons.slice(0, 3),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored;
}
