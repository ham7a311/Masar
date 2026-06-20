import { BarChart3 } from "lucide-react";
import { getMasteryLabel } from "../../utils/mastery";

const MASTERY_ORDER = [
  "not_started",
  "learning",
  "familiar",
  "confident",
  "mastered",
];

export default function ProfileLearningStats({ stats }) {
  if (!stats) return null;

  return (
    <section className="dash-card dash-profile-section">
      <h2 className="dash-profile-section-title">
        <BarChart3 size={18} className="dash-icon-stats" aria-hidden="true" />
        Learning statistics
      </h2>

      <div className="dash-profile-mastery-hero">
        <span className="dash-profile-mastery-label">Overall mastery</span>
        <span className="dash-profile-mastery-value">{stats.overallMastery}%</span>
      </div>

      <div className="dash-profile-mastery-grid">
        {MASTERY_ORDER.map((level) => (
          <div key={level} className={`dash-profile-mastery-cell dash-mastery-${level}`}>
            <span className="dash-profile-mastery-count">{stats.counts[level] ?? 0}</span>
            <span className="dash-profile-mastery-name">{getMasteryLabel(level)}</span>
          </div>
        ))}
      </div>

      <ul className="dash-stats-list dash-profile-stats-list">
        <li>
          <span>Total topics</span>
          <strong>{stats.totalTopics}</strong>
        </li>
        <li>
          <span>Topics mastered</span>
          <strong>{stats.topicsMastered}</strong>
        </li>
        <li>
          <span>Priority topics mastered</span>
          <strong>
            {stats.priorityMastered}/{stats.priorityTotal || 0}
          </strong>
        </li>
        <li>
          <span>Current year completion</span>
          <strong>{stats.yearCompletion}%</strong>
        </li>
        <li>
          <span>Career goal progress</span>
          <strong>{stats.careerGoalProgress}%</strong>
        </li>
      </ul>
    </section>
  );
}
