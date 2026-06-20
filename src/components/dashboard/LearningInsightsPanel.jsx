import { Lightbulb } from "lucide-react";

export default function LearningInsightsPanel({ insights }) {
  if (!insights?.length) return null;

  return (
    <div className="dash-panel-card dash-insights-panel">
      <p className="dash-panel-label">
        <Lightbulb size={14} aria-hidden="true" />
        Learning Insights
      </p>
      <ul className="dash-insights-list">
        {insights.map((text) => (
          <li key={text}>{text}</li>
        ))}
      </ul>
    </div>
  );
}
