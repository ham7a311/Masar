import { BarChart3 } from "lucide-react";

export default function QuickStatsPanel({ stats }) {
  if (!stats) return null;

  return (
    <div className="dash-panel-card dash-quick-stats">
      <p className="dash-panel-label">
        <BarChart3 size={14} className="dash-icon-stats" aria-hidden="true" />
        Quick stats
      </p>
      <ul className="dash-stats-list dash-stats-list-compact">
        <li>
          <span>Topics mastered</span>
          <strong>{stats.mastered}</strong>
        </li>
        <li>
          <span>In progress</span>
          <strong>{stats.inProgress}</strong>
        </li>
        <li>
          <span>Remaining</span>
          <strong>{stats.remaining}</strong>
        </li>
        <li>
          <span>Est. time left</span>
          <strong>~{stats.weeksLeft} wks</strong>
        </li>
      </ul>
    </div>
  );
}
