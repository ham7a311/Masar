import { Target } from "lucide-react";
import { getGoalLabel } from "../../utils/careerGoal";

export default function CareerGoalProgressPanel({ stats, careerGoal }) {
  const { percent, remaining, stageLabel, total } = stats;
  const stage = stageLabel ?? stats.readinessLevel;
  const goalLabel = getGoalLabel(careerGoal);

  return (
    <div className="dash-panel-card dash-goal-progress-panel">
      <p className="dash-panel-label">
        <Target size={14} className="dash-icon-goal" aria-hidden="true" />
        Career Goal Progress
      </p>

      <p className="dash-goal-progress-name">{goalLabel}</p>

      {total === 0 ? (
        <p className="dash-goal-progress-empty">
          No goal-relevant topics in your current roadmap view yet.
        </p>
      ) : (
        <>
          <div className="dash-goal-progress-head">
            <span className="dash-goal-progress-percent">{percent}%</span>
            <span className="dash-goal-progress-caption">
              of goal topics mastered
            </span>
          </div>
          <div
            className="dash-goal-progress-track"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${percent}% of goal-relevant topics completed`}
          >
            <span
              className="dash-goal-progress-fill"
              style={{ width: `${percent}%` }}
            />
          </div>
          <ul className="dash-stats-list dash-goal-progress-stats">
            <li>
              <span>Recommended remaining</span>
              <strong>{remaining}</strong>
            </li>
            <li>
              <span>Stage</span>
              <strong>{stage}</strong>
            </li>
          </ul>
        </>
      )}
    </div>
  );
}
