/**
 * Career Goal Mode — goal definitions and topic relevance rules.
 */

export const CAREER_GOALS = [
  {
    id: "internship",
    label: "Get an Internship",
    description: "Build practical skills employers look for in interns.",
  },
  {
    id: "first-job",
    label: "Get My First Job",
    description: "Prepare for entry-level roles in your field.",
  },
  {
    id: "industry-ready",
    label: "Become Industry Ready",
    description: "Develop job-ready technical and professional skills.",
  },
  {
    id: "research",
    label: "Research & Academia",
    description: "Focus on research methods and academic depth.",
  },
  {
    id: "entrepreneurship",
    label: "Entrepreneurship / Startup Founder",
    description: "Learn to build products, teams, and ventures.",
  },
];

export const DEFAULT_CAREER_GOAL = "first-job";

export const GOAL_RECOMMENDATION_THRESHOLD = 0.45;

/** Topic category weights per career goal (0–1). */
export const GOAL_CATEGORY_WEIGHTS = {
  internship: {
    technical: 1,
    quantitative: 0.65,
    professional: 0.85,
    research: 0.35,
    business: 0.55,
    leadership: 0.5,
    foundational: 0.6,
  },
  "first-job": {
    technical: 0.95,
    quantitative: 0.7,
    professional: 0.9,
    research: 0.4,
    business: 0.65,
    leadership: 0.55,
    foundational: 0.65,
  },
  "industry-ready": {
    technical: 1,
    quantitative: 0.75,
    professional: 0.95,
    research: 0.35,
    business: 0.7,
    leadership: 0.75,
    foundational: 0.55,
  },
  research: {
    technical: 0.65,
    quantitative: 0.95,
    professional: 0.4,
    research: 1,
    business: 0.3,
    leadership: 0.35,
    foundational: 0.7,
  },
  entrepreneurship: {
    technical: 0.75,
    quantitative: 0.55,
    professional: 0.85,
    research: 0.45,
    business: 1,
    leadership: 0.95,
    foundational: 0.5,
  },
};

/** Curated metadata for placeholder roadmap topics. */
export const PLACEHOLDER_TOPIC_METADATA = {
  oop: {
    categories: ["technical"],
    whyItMatters:
      "Object-oriented design is essential for building maintainable software and passing technical interviews.",
    careersUsedIn: ["Software Engineering", "Backend Development", "Mobile Development"],
    skillsGained: ["OOP Design", "Code Organization", "Debugging"],
  },
  calc: {
    categories: ["quantitative"],
    whyItMatters:
      "Mathematical foundations support algorithms, ML, and engineering problem solving.",
    careersUsedIn: ["Data Science", "AI Engineering", "Engineering"],
    skillsGained: ["Analytical Thinking", "Modeling", "Quantitative Reasoning"],
  },
  git: {
    categories: ["technical", "professional"],
    whyItMatters:
      "Version control is required for team projects, internships, and professional development workflows.",
    careersUsedIn: ["Software Engineering", "DevOps", "Open Source"],
    skillsGained: ["Collaboration", "Code Review", "Release Management"],
  },
  ds: {
    categories: ["technical"],
    whyItMatters:
      "A core requirement for technical interviews and software engineering roles.",
    careersUsedIn: ["Software Engineering", "AI Engineering", "Backend Development"],
    skillsGained: ["Problem Solving", "Algorithm Design", "Performance Optimization"],
  },
  net: {
    categories: ["technical"],
    whyItMatters:
      "Understanding networks helps you build distributed systems and debug production issues.",
    careersUsedIn: ["Cybersecurity", "Cloud Engineering", "IT Operations"],
    skillsGained: ["Protocols", "System Design", "Troubleshooting"],
  },
  db: {
    categories: ["technical"],
    whyItMatters:
      "Data storage and querying underpin most applications and analytics roles.",
    careersUsedIn: ["Backend Development", "Data Engineering", "Business Intelligence"],
    skillsGained: ["SQL", "Data Modeling", "Persistence"],
  },
  fund: {
    categories: ["foundational"],
    whyItMatters:
      "Core domain knowledge anchors everything else you learn in your degree.",
    careersUsedIn: ["Your Field", "Consulting", "Graduate Study"],
    skillsGained: ["Domain Literacy", "Critical Reading", "Conceptual Frameworks"],
  },
  comm: {
    categories: ["professional"],
    whyItMatters:
      "Clear communication helps you stand out in interviews, teams, and client-facing roles.",
    careersUsedIn: ["Management", "Consulting", "Customer Success"],
    skillsGained: ["Presentation", "Stakeholder Communication", "Professional Writing"],
  },
  research: {
    categories: ["research", "business"],
    whyItMatters:
      "Industry research skills help you identify opportunities and validate career direction.",
    careersUsedIn: ["Product Management", "Strategy", "Entrepreneurship"],
    skillsGained: ["Market Analysis", "Synthesis", "Evidence-Based Decisions"],
  },
  writing: {
    categories: ["research", "professional"],
    whyItMatters:
      "Strong academic writing supports graduate applications and research publications.",
    careersUsedIn: ["Research", "Policy", "Graduate Study"],
    skillsGained: ["Academic Writing", "Argumentation", "Citation"],
  },
  excel: {
    categories: ["quantitative", "business"],
    whyItMatters:
      "Spreadsheet and analysis skills are valued across business, operations, and data roles.",
    careersUsedIn: ["Finance", "Operations", "Analytics"],
    skillsGained: ["Data Analysis", "Reporting", "Decision Support"],
  },
  capstone: {
    categories: ["professional", "leadership"],
    whyItMatters:
      "Capstone planning connects your coursework to a tangible portfolio or thesis outcome.",
    careersUsedIn: ["All Careers", "Graduate Study", "Entrepreneurship"],
    skillsGained: ["Project Planning", "Milestone Setting", "Execution"],
  },
};

const KEYWORD_CATEGORIES = [
  { pattern: /program|object|software|data structure|database|git|network|cyber|logic|discrete|architecture|algorithm|it |computer|coding|python|java/i, categories: ["technical"] },
  { pattern: /math|calculus|algebra|statistic|probability|modelling|modeling/i, categories: ["quantitative"] },
  { pattern: /research|thesis|method|scientific|report writing|presentation/i, categories: ["research"] },
  { pattern: /marketing|business|accounting|finance|economics|management|entrepreneur|innovation|leadership|human resource|strategy|revenue|internship/i, categories: ["business", "leadership"] },
  { pattern: /english|communication|german|life skill|employment|presentation/i, categories: ["professional"] },
  { pattern: /law|ethics|sustainability|planning|geography|tourism|logistics|supply|procurement/i, categories: ["business", "foundational"] },
  { pattern: /engineering|material|factory|warehouse|environment|mining|geology|urban/i, categories: ["foundational", "technical"] },
];

export function getCareerGoalById(goalId) {
  return CAREER_GOALS.find((g) => g.id === goalId) || CAREER_GOALS.find((g) => g.id === DEFAULT_CAREER_GOAL);
}

export function normalizeCareerGoal(goalId) {
  if (!goalId) return DEFAULT_CAREER_GOAL;
  return CAREER_GOALS.some((g) => g.id === goalId) ? goalId : DEFAULT_CAREER_GOAL;
}

export function inferTopicCategories(topic) {
  const override = PLACEHOLDER_TOPIC_METADATA[topic.id];
  if (override?.categories) return override.categories;

  const text = `${topic.title} ${topic.code || ""}`;
  const categories = new Set();

  for (const { pattern, categories: cats } of KEYWORD_CATEGORIES) {
    if (pattern.test(text)) cats.forEach((c) => categories.add(c));
  }

  if (categories.size === 0) {
    if (topic.difficulty === "Advanced") categories.add("technical");
    else categories.add("foundational");
  }

  return [...categories];
}

export function getGoalLabel(goalId) {
  return getCareerGoalById(goalId)?.label ?? "Career goal";
}
