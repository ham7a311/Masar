import { Bookmark, Filter } from "lucide-react";

export default function EmptyState({
  variant = "filters",
  onClearFilters,
}) {
  if (variant === "saved") {
    return (
      <div className="resources-empty" role="status">
        <Bookmark className="resources-empty-icon-svg" size={32} aria-hidden="true" />
        <h3 className="resources-empty-title">No saved resources yet</h3>
        <p className="resources-empty-text">
          Tap the bookmark icon on any resource to save it for later
        </p>
      </div>
    );
  }

  return (
    <div className="resources-empty" role="status">
      <Filter className="resources-empty-icon-svg" size={32} aria-hidden="true" />
      <h3 className="resources-empty-title">No resources match these filters</h3>
      <p className="resources-empty-text">
        Try removing a filter or clearing all of them
      </p>
      <button type="button" className="resources-clear-btn" onClick={onClearFilters}>
        Clear filters
      </button>
    </div>
  );
}
