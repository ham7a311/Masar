import clsx from "clsx";
import { ChevronDown } from "lucide-react";

export default function ProfileAccordionSection({
  id,
  title,
  open,
  onToggle,
  children,
}) {
  return (
    <section
      className={clsx(
        "dash-profile-accordion",
        open && "dash-profile-accordion-open"
      )}
    >
      <button
        type="button"
        id={`profile-section-${id}`}
        className="dash-profile-accordion-trigger"
        aria-expanded={open}
        aria-controls={`profile-panel-${id}`}
        onClick={() => onToggle(id)}
      >
        <span className="dash-profile-accordion-title">{title}</span>
        <ChevronDown
          size={20}
          className={clsx(
            "dash-profile-accordion-chevron",
            open && "dash-profile-accordion-chevron-open"
          )}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div
          id={`profile-panel-${id}`}
          className="dash-profile-accordion-panel"
          role="region"
          aria-labelledby={`profile-section-${id}`}
        >
          {children}
        </div>
      )}
    </section>
  );
}
