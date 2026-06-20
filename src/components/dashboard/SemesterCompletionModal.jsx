import { PartyPopper, X } from "lucide-react";

export default function SemesterCompletionModal({
  stats,
  nextPeriodLabel,
  onContinue,
  onDismiss,
  advancing = false,
}) {
  return (
    <div
      className="dash-celebration-overlay dash-semester-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="semester-complete-title"
    >
      <div className="dash-confetti" aria-hidden="true">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="dash-confetti-piece"
            style={{
              left: `${(i * 17) % 100}%`,
              animationDelay: `${(i % 10) * 0.08}s`,
              background: ["#7c3aed", "#10b981", "#f59e0b"][i % 3],
            }}
          />
        ))}
      </div>
      <div className="dash-celebration-card dash-semester-card">
        <button
          type="button"
          className="dash-semester-close"
          aria-label="Close"
          onClick={onDismiss}
          disabled={advancing}
        >
          <X size={18} aria-hidden="true" />
        </button>
        <PartyPopper size={40} className="dash-semester-icon" aria-hidden="true" />
        <h2 id="semester-complete-title">Semester completed!</h2>
        <p className="dash-semester-subtitle">
          Congratulations — you&apos;ve mastered every topic this semester.
        </p>
        <ul className="dash-semester-stats">
          <li>
            <span>Topics mastered</span>
            <strong>{stats.mastered}</strong>
          </li>
          <li>
            <span>Priority topics completed</span>
            <strong>{stats.priorityCompleted}</strong>
          </li>
          <li>
            <span>Topics in this semester</span>
            <strong>{stats.totalTopics}</strong>
          </li>
        </ul>
        {nextPeriodLabel ? (
          <p className="dash-semester-next">
            Up next: <strong>{nextPeriodLabel}</strong>
          </p>
        ) : (
          <p className="dash-semester-next">
            You&apos;ve reached the final semester in your roadmap.
          </p>
        )}
        <div className="dash-semester-actions">
          <button
            type="button"
            className="dash-btn dash-btn-primary"
            onClick={onContinue}
            disabled={advancing}
          >
            {advancing
              ? "Updating..."
              : nextPeriodLabel
                ? `Continue to ${nextPeriodLabel}`
                : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
