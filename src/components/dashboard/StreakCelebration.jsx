import { useEffect } from "react";

export default function StreakCelebration({ milestone, onDone }) {
  useEffect(() => {
    const id = window.setTimeout(onDone, 4500);
    return () => window.clearTimeout(id);
  }, [onDone]);

  return (
    <div className="dash-celebration-overlay" role="dialog" aria-live="polite">
      <div className="dash-confetti" aria-hidden="true">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="dash-confetti-piece"
            style={{
              left: `${(i * 17) % 100}%`,
              animationDelay: `${(i % 10) * 0.08}s`,
              background: ["#7c3aed", "#ea580c", "#10b981", "#f59e0b"][i % 4],
            }}
          />
        ))}
      </div>
      <div className="dash-celebration-card">
        <p className="dash-celebration-emoji">🎉</p>
        <h2>{milestone} Day Streak!</h2>
        <p>Keep showing up — consistency builds career-ready skills.</p>
      </div>
    </div>
  );
}
