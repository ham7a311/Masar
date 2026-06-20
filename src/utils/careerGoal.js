import {
  DEFAULT_CAREER_GOAL,
  GOAL_CATEGORY_WEIGHTS,
  GOAL_RECOMMENDATION_THRESHOLD,
  PLACEHOLDER_TOPIC_METADATA,
  inferTopicCategories,
  normalizeCareerGoal,
} from "../data/careerGoals";
import { getMasteryWeight, isMastered, normalizeMastery } from "./mastery";
import { getPriorityOrder, isPriorityTopic } from "./topicProgress";

export { normalizeCareerGoal, getGoalLabel } from "../data/careerGoals";
export { getCareerGoalById, CAREER_GOALS } from "../data/careerGoals";

function getCategoryWeights(careerGoal) {
  return GOAL_CATEGORY_WEIGHTS[normalizeCareerGoal(careerGoal)] || GOAL_CATEGORY_WEIGHTS[DEFAULT_CAREER_GOAL];
}

export function getTopicGoalRelevance(topic, careerGoal) {
  const weights = getCategoryWeights(careerGoal);
  const categories = inferTopicCategories(topic);
  if (!categories.length) return 0.3;

  const scores = categories.map((cat) => weights[cat] ?? 0.4);
  return Math.min(1, Math.max(...scores));
}

export function isGoalRecommendedTopic(topic, careerGoal) {
  return getTopicGoalRelevance(topic, careerGoal) >= GOAL_RECOMMENDATION_THRESHOLD;
}

function buildMetadataFromGoal(topic, careerGoal, major) {
  const override = PLACEHOLDER_TOPIC_METADATA[topic.id];
  const goal = normalizeCareerGoal(careerGoal);
  const field = major || "your field";

  if (override) {
    return {
      whyItMatters: override.whyItMatters,
      careersUsedIn: override.careersUsedIn,
      skillsGained: override.skillsGained,
    };
  }

  const categories = inferTopicCategories(topic);
  const relevance = getTopicGoalRelevance(topic, goal);

  const goalPhrases = {
    internship: "internship applications and early project work",
    "first-job": "entry-level roles and graduate hiring pipelines",
    "industry-ready": "professional readiness and workplace performance",
    research: "academic research and scholarly contribution",
    entrepreneurship: "building ventures and leading initiatives",
  };

  const whyItMatters =
    relevance >= GOAL_RECOMMENDATION_THRESHOLD
      ? `Highly relevant for ${goalPhrases[goal] || "your career goal"} in ${field}.`
      : `Supports your broader foundation in ${field} and complements goal-focused topics.`;

  const careersByCategory = {
    technical: ["Software Engineering", "AI Engineering", "Backend Development"],
    quantitative: ["Data Science", "Analytics", "Engineering"],
    professional: ["Consulting", "Management", "Client-Facing Roles"],
    research: ["Research", "Graduate Study", "Policy"],
    business: ["Business Operations", "Product", "Entrepreneurship"],
    leadership: ["Team Lead", "Founder", "Program Management"],
    foundational: [field, "Graduate Study", "Cross-Functional Roles"],
  };

  const primaryCategory = categories[0] || "foundational";
  const careersUsedIn = careersByCategory[primaryCategory] || careersByCategory.foundational;

  const skillsByCategory = {
    technical: ["Problem Solving", "Technical Implementation", "System Thinking"],
    quantitative: ["Analytical Reasoning", "Modeling", "Data Literacy"],
    professional: ["Communication", "Collaboration", "Professional Presence"],
    research: ["Critical Analysis", "Academic Writing", "Methodology"],
    business: ["Strategic Thinking", "Business Acumen", "Decision Making"],
    leadership: ["Leadership", "Initiative", "Stakeholder Management"],
    foundational: ["Domain Knowledge", "Conceptual Understanding", "Adaptability"],
  };

  const skillsGained = skillsByCategory[primaryCategory] || skillsByCategory.foundational;

  return { whyItMatters, careersUsedIn, skillsGained };
}

export function enrichTopicWithCareerContext(topic, profile) {
  const careerGoal = normalizeCareerGoal(profile?.careerGoal);
  const relevance = getTopicGoalRelevance(topic, careerGoal);
  const metadata = buildMetadataFromGoal(topic, careerGoal, profile?.major);

  return {
    ...topic,
    careerGoal,
    goalRelevance: relevance,
    goalRecommended: relevance >= GOAL_RECOMMENDATION_THRESHOLD,
    whyItMatters: metadata.whyItMatters,
    careersUsedIn: metadata.careersUsedIn,
    skillsGained: metadata.skillsGained,
  };
}

export function enrichRoadmapWithCareerContext(roadmap, profile) {
  if (!roadmap) return roadmap;

  return {
    ...roadmap,
    sections: roadmap.sections.map((section) => ({
      ...section,
      topics: section.topics.map((topic) =>
        enrichTopicWithCareerContext(topic, profile)
      ),
    })),
  };
}

export function sortTopicsForRoadmap(topics, priorities, careerGoal) {
  const goal = normalizeCareerGoal(careerGoal);

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

      const aGoal = isGoalRecommendedTopic(a.topic, goal) ? 0 : 1;
      const bGoal = isGoalRecommendedTopic(b.topic, goal) ? 0 : 1;
      if (aGoal !== bGoal) return aGoal - bGoal;

      const aRel = getTopicGoalRelevance(a.topic, goal);
      const bRel = getTopicGoalRelevance(b.topic, goal);
      if (bRel !== aRel) return bRel - aRel;

      return a.index - b.index;
    })
    .map(({ topic }) => topic);
}

export function computeCareerGoalProgress(allTopics, careerGoal, topicMastery) {
  const goal = normalizeCareerGoal(careerGoal);
  const relevant = allTopics.filter((t) => isGoalRecommendedTopic(t, goal));
  const total = relevant.length;
  let weightSum = 0;
  relevant.forEach((t) => {
    weightSum += getMasteryWeight(normalizeMastery(topicMastery[t.id]));
  });
  const completed = relevant.filter((t) =>
    isMastered(normalizeMastery(topicMastery[t.id]))
  ).length;
  const remaining = total - completed;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  const depthPercent = total ? Math.round(weightSum / total) : 0;

  let stageLabel = "Not started";
  if (total === 0) stageLabel = "Set your goal";
  else if (percent >= 70) stageLabel = "On track";
  else if (percent >= 45) stageLabel = "Making progress";
  else if (percent >= 20) stageLabel = "Building foundation";
  else if (percent > 0 || depthPercent > 0) stageLabel = "Just beginning";

  return {
    goalId: goal,
    total,
    completed,
    remaining,
    percent,
    depthPercent,
    stageLabel,
    readinessLevel: stageLabel,
  };
}

export function scoreTopicForRecommendation(
  topic,
  careerGoal,
  priorityTopics,
  topicMastery
) {
  const level = normalizeMastery(topicMastery[topic.id]);
  let score = getTopicGoalRelevance(topic, careerGoal) * 10;

  if (isGoalRecommendedTopic(topic, careerGoal)) score += 4;
  if (isPriorityTopic(priorityTopics, topic.id)) score += 5;
  if (level === "learning") score += 3;
  if (level === "familiar") score += 2;
  if (level === "confident") score += 1;
  if (level === "not_started") score += 1;

  return score;
}

export function getRecommendedNextTopics(
  allTopics,
  careerGoal,
  priorityTopics,
  topicMastery,
  prerequisiteMap,
  limit = 3
) {
  const candidates = allTopics.filter(
    (topic) => !isMastered(normalizeMastery(topicMastery[topic.id]))
  );

  return candidates
    .sort(
      (a, b) =>
        scoreTopicForRecommendation(b, careerGoal, priorityTopics, topicMastery) -
        scoreTopicForRecommendation(a, careerGoal, priorityTopics, topicMastery)
    )
    .slice(0, limit);
}
