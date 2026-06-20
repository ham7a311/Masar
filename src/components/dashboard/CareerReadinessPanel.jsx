import { TrendingUp } from "lucide-react";

export default function CareerReadinessPanel({ readiness }) {
  if (!readiness) return null;

  const rows = [
    { label: "Knowledge", value: readiness.knowledge },
    { label: "Core Skills", value: readiness.coreSkills },
    { label: "Specialization", value: readiness.specialization },
    { label: "Career Preparation", value: readiness.careerPreparation },
  ];

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (readiness.overall / 100) * circumference;

  return (
    <div className="dash-panel-card dash-readiness-panel">
      <p className="dash-panel-label">
        <TrendingUp size={14} className="dash-icon-readiness" aria-hidden="true" />
        Career Readiness
      </p>

      <div className="dash-readiness-hero">
        <div className="dash-readiness-ring-wrap">
          <svg width="96" height="96" viewBox="0 0 96 96" aria-hidden="true">
            <circle
              cx="48"
              cy="48"
              r={radius}
              fill="none"
              stroke="rgba(16,185,129,0.15)"
              strokeWidth="8"
            />
            <circle
              cx="48"
              cy="48"
              r={radius}
              fill="none"
              stroke="#10b981"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 48 48)"
            />
          </svg>
          <span className="dash-readiness-ring-value">{readiness.overall}%</span>
        </div>
        <div className="dash-readiness-level-wrap">
          <span className="dash-readiness-level">{readiness.level}</span>
          <span className="dash-readiness-level-caption">based on your roadmap progress</span>
        </div>
      </div>

      <ul className="dash-readiness-bars">
        {rows.map(({ label, value }) => (
          <li key={label}>
            <div className="dash-readiness-row-head">
              <span>{label}</span>
              <strong>{value}%</strong>
            </div>
            <div className="dash-readiness-track">
              <span className="dash-readiness-fill" style={{ width: `${value}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
