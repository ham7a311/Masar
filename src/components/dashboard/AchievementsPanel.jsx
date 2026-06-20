import clsx from "clsx";
import { Award } from "lucide-react";

export default function AchievementsPanel({ achievements }) {
  if (!achievements?.length) return null;

  const earned = achievements.filter((a) => a.earned);

  return (
    <div className="dash-panel-card dash-achievements-panel">
      <p className="dash-panel-label">
        <Award size={14} aria-hidden="true" />
        Achievements ({earned.length}/{achievements.length})
      </p>
      <ul className="dash-achievements-list">
        {achievements.map((a) => (
          <li
            key={a.id}
            className={clsx("dash-achievement-item", a.earned && "dash-achievement-earned")}
          >
            <span className="dash-achievement-icon">{a.earned ? "🏆" : "🔒"}</span>
            <div>
              <p className="dash-achievement-title">{a.title}</p>
              <p className="dash-achievement-desc">{a.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
