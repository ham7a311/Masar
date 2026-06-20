import { useState } from "react";
import clsx from "clsx";
import { ArrowRight, Bookmark, BookmarkCheck, Quote } from "lucide-react";
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  pricingBadgeClass,
  priorityBadgeClass,
} from "./resourceUtils";

export default function ResourceCard({ resource, isSaved, onToggleSave }) {
  const [justSaved, setJustSaved] = useState(false);
  const CategoryIcon = CATEGORY_ICONS[resource.category] || CATEGORY_ICONS.Tools;
  const categoryColor = CATEGORY_COLORS[resource.category] || CATEGORY_COLORS.Tools;

  const handleSave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onToggleSave(resource.id);
    setJustSaved(true);
    window.setTimeout(() => setJustSaved(false), 150);
  };

  return (
    <article className="resources-card">
      <button
        type="button"
        className={clsx(
          "resources-save-btn",
          isSaved && "resources-save-btn-active",
          justSaved && "resources-save-btn-pop"
        )}
        onClick={handleSave}
        aria-label={
          isSaved
            ? `Remove ${resource.name} from saved`
            : `Save ${resource.name}`
        }
      >
        {isSaved ? (
          <BookmarkCheck size={18} aria-hidden="true" />
        ) : (
          <Bookmark size={18} aria-hidden="true" />
        )}
      </button>

      <div className="resources-card-category">
        <CategoryIcon size={16} style={{ color: categoryColor }} aria-hidden="true" />
        <span>{resource.category}</span>
      </div>

      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="resources-card-name"
      >
        {resource.name}
      </a>

      <div className="resources-card-badges">
        <span className={`resources-badge ${pricingBadgeClass(resource.pricing)}`}>
          {resource.pricing}
        </span>
        <span className={`resources-badge ${priorityBadgeClass(resource.priority)}`}>
          {resource.priority}
        </span>
        <span className="resources-badge resources-badge-type">{resource.type}</span>
      </div>

      <p className="resources-card-level">{resource.level}</p>

      <p className="resources-card-description">{resource.description}</p>

      <div className="resources-card-note">
        <Quote size={14} className="resources-card-note-icon" aria-hidden="true" />
        <p>{resource.personalNote}</p>
      </div>

      <div className="resources-card-footer">
        <span className="resources-card-footer-level">{resource.level}</span>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="resources-card-visit"
          aria-label={`Visit ${resource.name} — opens in new tab`}
        >
          Visit resource
          <ArrowRight size={14} className="resources-card-visit-arrow" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
