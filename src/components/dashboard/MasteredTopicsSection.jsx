import { useState } from "react";
import clsx from "clsx";
import { Check, ChevronDown } from "lucide-react";
import MasteryBadge from "./MasteryBadge";

export default function MasteredTopicsSection({ topics, onOpenTopic }) {
  const [open, setOpen] = useState(false);

  if (!topics.length) return null;

  return (
    <section className="dash-mastered-section">
      <button
        type="button"
        className="dash-mastered-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="dash-mastered-toggle-title">
          Mastered Topics ({topics.length})
        </span>
        <ChevronDown
          size={18}
          className={clsx("dash-mastered-chevron", open && "dash-mastered-chevron-open")}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul className="dash-mastered-list">
          {topics.map((topic) => (
            <li key={topic.id}>
              <button
                type="button"
                className="dash-mastered-item"
                onClick={() => onOpenTopic?.(topic.id)}
              >
                <Check size={16} className="dash-mastered-check" aria-hidden="true" />
                <span className="dash-mastered-name">{topic.title}</span>
                <MasteryBadge level="mastered" className="dash-mastery-badge-compact" />
                <span className="dash-mastered-edit-hint">Edit</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
