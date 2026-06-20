import { STUDY_YEARS } from "../data/onboardingOptions";

/**
 * Study period helpers — each academic year = Semester 1 + Semester 2.
 * GUtech: Year 1 → sem 1–2, Year 2 → sem 3–4, … Year 4 → sem 7–8.
 */

export function parseStudyPeriod(year) {
  if (!year) return { yearNum: 1, term: null, raw: year };

  const raw = String(year);
  const semMatch = raw.match(/year-(\d+)-sem-([12])/);
  if (semMatch) {
    return {
      yearNum: Number(semMatch[1]),
      term: Number(semMatch[2]),
      raw,
    };
  }

  if (raw === "year-4-plus" || raw === "4+") {
    return { yearNum: 4, term: null, raw };
  }

  if (raw.startsWith("year-")) {
    const n = Number(raw.replace("year-", "").replace("-plus", ""));
    return { yearNum: n >= 1 && n <= 4 ? n : 1, term: null, raw };
  }

  const n = Number(raw);
  return {
    yearNum: n >= 1 && n <= 4 ? n : 1,
    term: null,
    raw,
  };
}

/** GUtech catalogue semester numbers (1–8) for a year / optional term. */
export function getGutechSemesterNumbers(yearNum, term) {
  const first = (yearNum - 1) * 2 + 1;
  if (term === 1) return [first];
  if (term === 2) return [first + 1];
  return [first, first + 1];
}

export function formatStudyYear(year) {
  if (!year) return "";

  const raw = String(year);
  const semMatch = raw.match(/year-(\d+)-sem-([12])/);
  if (semMatch) return `Year ${semMatch[1]} · Semester ${semMatch[2]}`;

  if (raw === "year-4-plus") return "Year 4+";
  if (raw.startsWith("year-")) {
    return `Year ${raw.replace("year-", "").replace("-plus", "+")}`;
  }
  return `Year ${raw}`;
}

/** Build stored profile value from separate year level + semester. */
export function buildStudyPeriodValue(yearLevel, semester) {
  const y = Number(yearLevel);
  const s = Number(semester);
  if (!Number.isFinite(y) || y < 1 || y > 4) return "";
  if (s !== 1 && s !== 2) return "";
  return `year-${y}-sem-${s}`;
}

/** Split stored / legacy year value for form controls. */
export function getStudyPeriodFormFields(year) {
  const normalized = normalizeYearValue(year);
  if (!normalized) return { yearLevel: null, semester: null };
  const { yearNum, term } = parseStudyPeriod(normalized);
  return {
    yearLevel: yearNum >= 1 && yearNum <= 4 ? yearNum : null,
    semester: term === 1 || term === 2 ? term : null,
  };
}

/** Map legacy Firestore values to a selectable option where possible. */
export function normalizeYearValue(year) {
  if (!year) return "";
  const raw = String(year);
  if (raw.includes("-sem-")) return raw;
  if (raw === "year-4-plus" || raw === "4+" || raw === "4") return "year-4-sem-1";
  if (raw.startsWith("year-")) return `${raw}-sem-1`;
  const n = Number(raw);
  if (n >= 1 && n <= 4) return `year-${n}-sem-1`;
  return raw;
}

export function getStudyPeriodIndex(periodValue) {
  const normalized = normalizeYearValue(periodValue);
  if (!normalized) return -1;
  return STUDY_YEARS.findIndex((y) => y.value === normalized);
}

/** True when this period is in the completed list (all topics mastered for that semester). */
export function isStudyPeriodCompleted(
  periodValue,
  _currentPeriodValue,
  completedPeriods = []
) {
  const normalized = normalizeYearValue(periodValue);
  if (!normalized) return false;
  return completedPeriods.includes(normalized);
}

export function isStudyYearCompleted(
  yearLevel,
  currentPeriodValue,
  completedPeriods = []
) {
  return (
    isStudyPeriodCompleted(
      buildStudyPeriodValue(yearLevel, 1),
      currentPeriodValue,
      completedPeriods
    ) &&
    isStudyPeriodCompleted(
      buildStudyPeriodValue(yearLevel, 2),
      currentPeriodValue,
      completedPeriods
    )
  );
}

/** Most recent completed semester within a year (for profile review). */
export function getReviewPeriodForYear(
  yearLevel,
  currentPeriodValue,
  completedPeriods = []
) {
  for (const sem of [2, 1]) {
    const period = buildStudyPeriodValue(yearLevel, sem);
    if (isStudyPeriodCompleted(period, currentPeriodValue, completedPeriods)) {
      return period;
    }
  }
  return null;
}
