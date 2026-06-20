import ResourceCard from "./ResourceCard";
import EmptyState from "./EmptyState";
import ResourcePagination from "./ResourcePagination";

export default function ResourceGrid({
  resources,
  totalCount,
  startIndex,
  endIndex,
  currentPage,
  totalPages,
  onPageChange,
  isSaved,
  onToggleSave,
  emptyVariant,
  onClearFilters,
}) {
  if (!resources.length) {
    return <EmptyState variant={emptyVariant} onClearFilters={onClearFilters} />;
  }

  return (
    <>
      <p className="resources-count" aria-live="polite">
        Showing {startIndex}–{endIndex} of {totalCount} resources
      </p>

      <div className="resources-grid">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            isSaved={isSaved(resource.id)}
            onToggleSave={onToggleSave}
          />
        ))}
      </div>

      <ResourcePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
}
