import { TrendingUp } from "lucide-react";

export default function CompletionForecastPanel({ forecast }) {
  if (!forecast) return null;

  return (
    <div className="dash-panel-card dash-forecast-panel">
      <p className="dash-panel-label">
        <TrendingUp size={14} aria-hidden="true" />
        At your current pace
      </p>
      <ul className="dash-stats-list">
        <li>
          <span>Year completion</span>
          <strong>{forecast.yearCompletion}</strong>
        </li>
        <li>
          <span>Career goal readiness</span>
          <strong>{forecast.careerReadiness}</strong>
        </li>
      </ul>
    </div>
  );
}
