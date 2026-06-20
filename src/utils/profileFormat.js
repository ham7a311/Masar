import { isValidMajor } from "../data/onboardingOptions";
import { normalizeYearValue } from "./studyPeriod";

export function isOnboardingComplete(profile) {
  if (!profile) return false;
  const flagged =
    profile.onBoardingComplete === true || profile.onboardingComplete === true;
  return flagged && hasRequiredProfileFields(profile);
}

/** Required profile fields for dashboard access */
export function hasRequiredProfileFields(profile) {
  if (!profile) return false;
  const year = normalizeYearValue(
    profile.currentStudyPeriod || profile.year
  );
  return Boolean(
    profile.university?.trim() &&
      isValidMajor(profile.major) &&
      year &&
      profile.name?.trim()
  );
}

export function getPostAuthPath(profile) {
  if (isOnboardingComplete(profile)) return "/dashboard";
  return "/onboarding";
}

export {
  formatStudyYear,
  parseStudyPeriod,
  getGutechSemesterNumbers,
  normalizeYearValue,
  buildStudyPeriodValue,
  getStudyPeriodFormFields,
} from "./studyPeriod";

export function formatUniversityShort(university) {
  if (!university) return "";
  if (university.startsWith("SQU")) return "SQU";
  if (university.startsWith("GUtech")) return "GUtech";
  if (university.startsWith("UTAS")) return "UTAS";
  return university;
}

export function getTimeGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function buildProfileSubtitle(profile) {
  const parts = [
    profile?.major,
    formatUniversityShort(profile?.university),
    formatStudyYear(profile?.year),
  ].filter(Boolean);
  return parts.join(" • ");
}

export function getStudentInsights(profile) {
  const uni = formatUniversityShort(profile?.university) || "your university";
  const major = profile?.major || "your field";

  return [
    `12 students from ${uni} are exploring AI paths`,
    `Most popular path in ${major}: Cybersecurity`,
    `68% of ${uni} students start with the Explore stage`,
  ];
}

export function getRecommendations(major) {
  const field = major || "your major";
  return [
    {
      title: "Skills to focus on",
      description: `Core skills trending for ${field} students this semester.`,
    },
    {
      title: "Common career paths",
      description: `Where ${field} graduates typically land in their first role.`,
    },
    {
      title: "Beginner roadmap",
      description: `A starter path tailored to ${field} — no experience needed.`,
    },
  ];
}
