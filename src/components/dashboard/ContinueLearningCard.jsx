import { ArrowRight, Play } from "lucide-react";
import { getMasteryLabel } from "../../utils/mastery";

export default function ContinueLearningCard({ topic, onResume }) {
  if (!topic) return null;

  return (
    <section className="dash-continue-card dash-fade-up">
      <div className="dash-continue-glow" aria-hidden="true" />
      <p className="dash-continue-label">
        <Play size={16} className="dash-icon-recommended" aria-hidden="true" />
        Continue Learning
      </p>
      <h2 className="dash-continue-title">{topic.title}</h2>
      <p className="dash-continue-meta">
        {getMasteryLabel(topic.mastery)}
        {topic.weeksRemaining != null && (
          <> · ~{Math.round(topic.weeksRemaining)} weeks remaining</>
        )}
      </p>
      <button type="button" className="dash-continue-btn" onClick={() => onResume(topic.id)}>
        Resume
        <ArrowRight size={18} aria-hidden="true" />
      </button>
    </section>
  );
}
