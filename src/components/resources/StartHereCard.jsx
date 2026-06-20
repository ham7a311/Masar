import { ArrowRight } from "lucide-react";
import { pricingBadgeClass } from "./resourceUtils";

export default function StartHereCard({ resources }) {
  if (!resources?.length) return null;

  return (
    <div className="resources-start-here">
      <div className="resources-start-here-head">
        <h3 className="resources-start-here-title">
          <span className="resources-start-here-dot" aria-hidden="true" />
          Start here
        </h3>
        <p className="resources-start-here-subtitle">
          The most useful resources for where you are right now.
        </p>
      </div>

      <div className="resources-start-here-grid">
        {resources.map((resource) => (
          <a
            key={resource.id}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="resources-start-here-item"
            aria-label={`Visit ${resource.name} — opens in new tab`}
          >
            <div className="resources-start-here-item-top">
              <span className="resources-start-here-name">{resource.name}</span>
              <ArrowRight size={16} className="resources-start-here-arrow" aria-hidden="true" />
            </div>
            <div className="resources-start-here-tags">
              <span className="resources-badge resources-badge-type">{resource.type}</span>
              <span
                className={`resources-badge ${pricingBadgeClass(resource.pricing)}`}
              >
                {resource.pricing}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
