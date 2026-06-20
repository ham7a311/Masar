import { Flame } from "lucide-react";

export default function PriorityTopicsPanel({ stats }) {
  const { total, completed, remaining, percent } = stats;

  return (
    <div className="dash-panel-card dash-priority-panel">
      <p className="dash-panel-label">
        <Flame size={14} className="dash-icon-priority" aria-hidden="true" />
        Priority topics
      </p>

      {total === 0 ? (
        <p className="dash-priority-empty">
          Mark topics as priority to track them here.
        </p>
      ) : (
        <>
          <div className="dash-priority-progress-head">
            <span className="dash-priority-percent">{percent}%</span>
            <span className="dash-priority-progress-caption">complete</span>
          </div>
          <div
            className="dash-priority-progress-track"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${percent}% of priority topics completed`}
          >
            <span
              className="dash-priority-progress-fill"
              style={{ width: `${percent}%` }}
            />
          </div>
          <ul className="dash-stats-list dash-priority-stats">
            <li>
              <span>Total priority</span>
              <strong>{total}</strong>
            </li>
            <li>
              <span>Completed</span>
              <strong>{completed}</strong>
            </li>
            <li>
              <span>Remaining</span>
              <strong>{remaining}</strong>
            </li>
          </ul>
        </>
      )}
    </div>
  );
}
