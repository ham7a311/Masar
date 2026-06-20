import { getMajorsForUniversity as getGutechMajorsList } from "./gutechCatalogue";

export { GUtech_MAJOR_NAMES, GUtech_BACHELOR_PROGRAMMES } from "./gutechCatalogue";

export const UNIVERSITIES = [
  "SQU (Sultan Qaboos University)",
  "GUtech (German University of Technology)",
  "UTAS",
];

/** Shown in pickers but not selectable yet */
export const LOCKED_UNIVERSITIES = [
  "SQU (Sultan Qaboos University)",
  "UTAS",
];

const LOCKED_UNIVERSITY_SET = new Set(LOCKED_UNIVERSITIES);

export function isUniversityLocked(university) {
  const trimmed = (university || "").trim();
  return LOCKED_UNIVERSITY_SET.has(trimmed);
}

export function getUniversitySelectionError(university, { existingUniversity } = {}) {
  const trimmed = (university || "").trim();
  if (!trimmed) return "Please select or enter your Omani university.";
  if (!isUniversityLocked(trimmed)) return null;
  const existing = (existingUniversity || "").trim();
  if (existing && existing === trimmed) return null;
  return "This university is coming soon. Please choose another option.";
}

/** Legacy value — no longer offered in pickers */
export const DEPRECATED_MAJOR = "Not sure yet";

/** Generic majors for non-GUtech universities */
export const MAJORS = [
  "Computer Science",
  "Software Engineering",
  "Information Technology",
  "Data Science",
  "Artificial Intelligence",
  "Cybersecurity",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Business Administration",
  "Finance",
  "Economics",
  "Architecture",
];

export function isValidMajor(major) {
  const trimmed = (major || "").trim();
  return trimmed.length > 0 && trimmed !== DEPRECATED_MAJOR;
}

export function getMajorsForUniversity(university) {
  const list = getGutechMajorsList(university) ?? MAJORS;
  return list.filter((m) => m !== DEPRECATED_MAJOR);
}

export const STUDY_YEAR_LEVELS = [
  { value: 1, label: "Year 1" },
  { value: 2, label: "Year 2" },
  { value: 3, label: "Year 3" },
  { value: 4, label: "Year 4" },
];

export const STUDY_SEMESTERS = [
  { value: 1, label: "Semester 1" },
  { value: 2, label: "Semester 2" },
];

/** Ordered study periods for milestone advance (stored as year-N-sem-M). */
export const STUDY_YEARS = STUDY_YEAR_LEVELS.flatMap(({ value: year, label: yearLabel }) =>
  STUDY_SEMESTERS.map(({ value: sem, label: semLabel }) => ({
    value: `year-${year}-sem-${sem}`,
    label: `${yearLabel} · ${semLabel}`,
  }))
);
