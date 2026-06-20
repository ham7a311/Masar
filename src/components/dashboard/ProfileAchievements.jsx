import clsx from "clsx";
import { Award } from "lucide-react";
import { getAchievementProgress } from "../../utils/dashboardAnalytics";

export default function ProfileAchievements({ achievements, analyticsCtx }) {
  if (!achievements?.length) return null;

  return (
    <section className="dash-card dash-profile-section">
      <h2 className="dash-profile-section-title">
        <Award size={18} className="dash-icon-achievement" aria-hidden="true" />
        Achievements
      </h2>
      <ul className="dash-profile-achievements-list">
        {achievements.map((a) => {
          const progress = analyticsCtx
            ? getAchievementProgress(a.id, analyticsCtx)
            : null;
          const pct =
            progress && progress.target > 0
              ? Math.min(100, Math.round((progress.current / progress.target) * 100))
              : 0;

          return (
            <li
              key={a.id}
              className={clsx(
                "dash-profile-achievement",
                a.earned && "dash-profile-achievement-earned"
              )}
            >
              <span className="dash-profile-achievement-icon">
                {a.earned ? "🏆" : "🔒"}
              </span>
              <div className="dash-profile-achievement-body">
                <p className="dash-profile-achievement-title">{a.title}</p>
                <p className="dash-profile-achievement-desc">{a.desc}</p>
                {a.earned ? (
                  <p className="dash-profile-achievement-status">Unlocked</p>
                ) : progress ? (
                  <>
                    <div className="dash-profile-achievement-track">
                      <span style={{ width: `${pct}%` }} />
                    </div>
                    <p className="dash-profile-achievement-progress">
                      {progress.current} / {progress.target} {progress.label}
                    </p>
                  </>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
