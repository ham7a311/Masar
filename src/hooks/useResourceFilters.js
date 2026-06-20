import { useMemo, useState } from "react";
import { resourceMatchesUserMajor } from "../utils/resourceProfile";

const EMPTY_FILTERS = {
  pricing: null,
  priority: null,
  type: null,
  showSavedOnly: false,
};

const PRIORITY_ORDER = {
  Essential: 0,
  Recommended: 1,
  Optional: 2,
};

function compareResources(a, b) {
  const priorityDiff =
    (PRIORITY_ORDER[a.priority] ?? 99) - (PRIORITY_ORDER[b.priority] ?? 99);
  if (priorityDiff !== 0) return priorityDiff;
  return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
}

export function useResourceFilters(resources, userProfile, savedIds = []) {
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const filtered = useMemo(() => {
    return resources
      .filter((resource) => {
      if (filters.pricing && resource.pricing !== filters.pricing) return false;
      if (filters.priority && resource.priority !== filters.priority) return false;
      if (filters.type && resource.type !== filters.type) return false;

      if (filters.showSavedOnly && !savedIds.includes(resource.id)) return false;

      return true;
    })
      .sort(compareResources);
  }, [resources, filters, savedIds]);

  const startHereResources = useMemo(() => {
    if (!userProfile?.major || !userProfile?.yearLevel) return [];

    return resources
      .filter((resource) => {
        if (!resource.featured) return false;
        if (!resourceMatchesUserMajor(resource, userProfile)) return false;
        if (!resource.yearLevel.includes(userProfile.yearLevel)) return false;

        return true;
      })
      .slice(0, 5);
  }, [resources, userProfile]);

  const clearFilters = () => setFilters(EMPTY_FILTERS);

  const hasActiveFilters =
    filters.pricing !== null ||
    filters.priority !== null ||
    filters.type !== null ||
    filters.showSavedOnly;

  return {
    filtered,
    filters,
    setFilters,
    clearFilters,
    hasActiveFilters,
    startHereResources,
  };
}
