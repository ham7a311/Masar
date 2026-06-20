import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AccentUnderline } from "../SectionAccent";
import { useResourceFilters } from "../../hooks/useResourceFilters";
import { useSavedResources } from "../../hooks/useSavedResources";
import { usePageSize } from "../../hooks/usePageSize";
import ResourceFilters from "./ResourceFilters";
import ResourceGrid from "./ResourceGrid";
import StartHereCard from "./StartHereCard";
import ResourcesComingSoon from "./ResourcesComingSoon";
import "./resources.css";

const TECH_CATALOG_LABEL = "Computer Science, Cyber Security & AI";

export default function ResourcesSection({
  resources = [],
  userProfile = null,
  majorLabel = null,
  variant = "homepage",
  profileLinkTo = "/dashboard",
}) {
  const pageSize = usePageSize();
  const [currentPage, setCurrentPage] = useState(1);
  const { savedIds, toggleSave, isSaved, savedCount } = useSavedResources();

  const {
    filtered,
    filters,
    setFilters,
    clearFilters,
    hasActiveFilters,
    startHereResources,
  } = useResourceFilters(resources, userProfile, savedIds);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, pageSize, resources, userProfile?.major, userProfile?.yearLevel]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const startIndex = filtered.length ? (currentPage - 1) * pageSize + 1 : 0;
  const endIndex = filtered.length
    ? Math.min(currentPage * pageSize, filtered.length)
    : 0;

  const showStartHere =
    !hasActiveFilters &&
    userProfile?.major &&
    userProfile?.yearLevel &&
    startHereResources.length > 0;

  const showPersonalizePrompt =
    variant === "homepage" && (!userProfile?.major || !userProfile?.yearLevel);

  const catalogLabel =
    userProfile?.resourceGroup === "tech"
      ? TECH_CATALOG_LABEL
      : majorLabel;

  const handlePageChange = (page) => {
    setCurrentPage(page);
    document.getElementById("resources")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const emptyVariant =
    filters.showSavedOnly && savedCount === 0 ? "saved" : "filters";

  if (!resources.length) {
    return (
      <ResourcesComingSoon variant={variant} majorLabel={majorLabel} />
    );
  }

  return (
    <section
      id="resources"
      className={`resources-section resources-section-${variant}`}
      aria-labelledby="resources-heading"
    >
      <div className="resources-inner">
        <header className="resources-header">
          <span className="resources-eyebrow">Curated picks</span>
          <h2 id="resources-heading" className="resources-title">
            Resources that <AccentUnderline>actually help</AccentUnderline>
          </h2>
          <p className="resources-subtitle">
            {catalogLabel
              ? `Hand-picked for ${catalogLabel}. Browse everything below, or use Start here for picks matched to your year.`
              : "Honest tools, references, and communities — browse everything below."}
          </p>
        </header>

        {showPersonalizePrompt && (
          <p className="resources-personalize-prompt">
            Sign in and set your major to see resources for your field.{" "}
            <Link
              to={profileLinkTo}
              state={profileLinkTo === "/dashboard" ? { activeView: "profile" } : undefined}
            >
              Open profile settings
            </Link>
          </p>
        )}

        {showStartHere && <StartHereCard resources={startHereResources} />}

        <ResourceFilters
          filters={filters}
          setFilters={setFilters}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
          savedCount={savedCount}
        />

        <ResourceGrid
          resources={paginated}
          totalCount={filtered.length}
          startIndex={startIndex}
          endIndex={endIndex}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isSaved={isSaved}
          onToggleSave={toggleSave}
          emptyVariant={emptyVariant}
          onClearFilters={clearFilters}
        />
      </div>
    </section>
  );
}
