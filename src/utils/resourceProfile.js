import { RESOURCES } from "../data/resources";
import { parseStudyPeriod } from "./studyPeriod";

/** Majors that share the same curated resource catalog. */
export const TECH_MAJOR_CODES = ["CS", "CYS", "AI"];

const MAJOR_TO_CODE = {
  "Computer Science": "CS",
  "Cyber Security": "CYS",
  Cybersecurity: "CYS",
  "Artificial Intelligence": "AI",
};

export function mapMajorToResourceCode(major) {
  if (!major) return null;
  if (MAJOR_TO_CODE[major]) return MAJOR_TO_CODE[major];

  const normalized = major.toLowerCase();
  if (normalized.includes("computer science")) return "CS";
  if (normalized.includes("cyber")) return "CYS";
  if (normalized.includes("artificial intelligence")) return "AI";
  if (normalized.includes("software engineering")) return "CS";
  if (normalized.includes("information technology")) return "CS";
  if (normalized.includes("data science")) return "CS";

  return null;
}

/** Catalog group id — only tech (CS/CYS/AI) has resources today. */
export function getResourceCatalogGroup(major) {
  const code = mapMajorToResourceCode(major);
  if (code && TECH_MAJOR_CODES.includes(code)) return "tech";
  return null;
}

export function resourceBelongsToCatalog(resource, catalogGroup) {
  if (!catalogGroup || !resource?.majors) return false;

  if (catalogGroup === "tech") {
    return resource.majors.some(
      (tag) => TECH_MAJOR_CODES.includes(tag) || tag === "All"
    );
  }

  return resource.majors.includes(catalogGroup);
}

export function getResourcesForCatalog(catalogGroup) {
  if (!catalogGroup) return [];
  return RESOURCES.filter((resource) => resourceBelongsToCatalog(resource, catalogGroup));
}

export function majorHasResourceCatalog(major) {
  const group = getResourceCatalogGroup(major);
  return Boolean(group && getResourcesForCatalog(group).length > 0);
}

export function buildResourceUserProfile(profile) {
  if (!profile?.major || !profile?.year) return null;

  const majorCode = mapMajorToResourceCode(profile.major);
  const resourceGroup = getResourceCatalogGroup(profile.major);
  const { yearNum } = parseStudyPeriod(profile.year);

  if (!majorCode || !resourceGroup || !yearNum) return null;

  return {
    major: majorCode,
    majorCode,
    resourceGroup,
    yearLevel: yearNum,
    majorLabel: profile.major,
  };
}

export function resourceMatchesUserMajor(resource, userProfile) {
  if (!userProfile?.resourceGroup) return false;

  if (userProfile.resourceGroup === "tech") {
    return resource.majors.some(
      (tag) => TECH_MAJOR_CODES.includes(tag) || tag === "All"
    );
  }

  return resource.majors.includes(userProfile.majorCode);
}
