import { Flame, Trophy } from "lucide-react";

export default function LearningStreakPanel({ current, longest }) {
  return (
    <div className="dash-panel-card dash-streak-panel">
      <p className="dash-panel-label">
        <Flame size={14} className="dash-streak-flame" aria-hidden="true" />
        Learning Streak
      </p>
      <p className="dash-streak-current">
        <Flame size={22} aria-hidden="true" />
        {current} Day{current === 1 ? "" : "s"} Streak
      </p>
      <p className="dash-streak-best">
        <Trophy size={14} aria-hidden="true" />
        Best: {longest} Day{longest === 1 ? "" : "s"}
      </p>
    </div>
  );
}
