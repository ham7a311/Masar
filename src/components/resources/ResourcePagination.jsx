import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPageNumbers } from "./resourceUtils";

export default function ResourcePagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(totalPages, currentPage);

  return (
    <nav className="resources-pagination" aria-label="Resources pagination">
      <button
        type="button"
        className="resources-page-btn resources-page-arrow"
        disabled={currentPage === 1}
        aria-label="Previous page"
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft size={18} aria-hidden="true" />
      </button>

      {pages.map((page, index) =>
        page === "ellipsis" ? (
          <span key={`ellipsis-${index}`} className="resources-page-ellipsis" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            className={clsx(
              "resources-page-btn",
              currentPage === page && "resources-page-btn-active"
            )}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        className="resources-page-btn resources-page-arrow"
        disabled={currentPage === totalPages}
        aria-label="Next page"
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight size={18} aria-hidden="true" />
      </button>
    </nav>
  );
}
