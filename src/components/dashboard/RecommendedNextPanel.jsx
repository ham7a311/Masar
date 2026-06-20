import { useState } from "react";
import { Sparkles } from "lucide-react";
import ProfileAccordionSection from "./ProfileAccordionSection";
import { getMasteryLabel, normalizeMastery } from "../../utils/mastery";

export default function RecommendedNextPanel({ recommendations, onOpenTopic }) {
  const [openSections, setOpenSections] = useState(() => new Set());

  if (!recommendations?.length) return null;

  const toggleSection = (id) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="dash-panel-card dash-recommended-next">
      <p className="dash-panel-label">
        <Sparkles size={14} className="dash-icon-recommended" aria-hidden="true" />
        Recommended Next
      </p>
      <ul className="dash-recommended-list">
        {recommendations.map(({ topic, reasons }) => (
          <li key={topic.id}>
            <ProfileAccordionSection
              id={topic.id}
              title={topic.title}
              open={openSections.has(topic.id)}
              onToggle={toggleSection}
            >
              <p className="dash-recommended-meta">
                {topic.difficulty} · ~{topic.weeks} weeks ·{" "}
                {getMasteryLabel(normalizeMastery(topic.mastery))}
              </p>
              {reasons?.length > 0 && (
                <div className="dash-recommended-reasons">
                  <p className="dash-recommended-reasons-label">Recommended because:</p>
                  <ul>
                    {reasons.map((r) => (
                      <li key={r}>✓ {r}</li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                type="button"
                className="dash-recommended-open"
                onClick={() => onOpenTopic?.(topic.id)}
              >
                Open topic
              </button>
            </ProfileAccordionSection>
          </li>
        ))}
      </ul>
    </div>
  );
}
