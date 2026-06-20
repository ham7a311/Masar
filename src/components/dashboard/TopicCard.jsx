import clsx from "clsx";
import { Flame, Sparkles } from "lucide-react";
import MasteryBadge from "./MasteryBadge";
import { getMasteryWeight, normalizeMastery } from "../../utils/mastery";

const DIFFICULTY_CLASS = {
  Beginner: "dash-tag-beginner",
  Intermediate: "dash-tag-intermediate",
  Advanced: "dash-tag-advanced",
};

export default function TopicCard({
  topic,
  isPriority,
  isGoalRecommended,
  onOpen,
}) {
  const mastery = normalizeMastery(topic.mastery);

  return (
    <button
      type="button"
      className={clsx(
        "dash-topic-card dash-topic-card-clickable",
        mastery === "learning" && "dash-topic-card-active",
        mastery === "confident" && "dash-topic-card-confident",
        isPriority && "dash-topic-card-priority",
        isGoalRecommended && "dash-topic-card-goal"
      )}
      onClick={() => onOpen(topic.id)}
    >
      <div className="dash-topic-card-top">
        <div className="dash-topic-title-row">
          {isPriority && (
            <span className="dash-priority-badge" title="Priority topic">
              <Flame size={14} aria-hidden="true" />
              Priority
            </span>
          )}
          {isGoalRecommended && (
            <span className="dash-goal-topic-badge" title="Recommended for your goal">
              <Sparkles size={14} aria-hidden="true" />
              For your goal
            </span>
          )}
          <h4 className="dash-topic-title">{topic.title}</h4>
        </div>
        <MasteryBadge level={mastery} />
      </div>

      <div className="dash-topic-card-bottom">
        <span className="dash-topic-time">
          {topic.code ? `${topic.code} · ` : ""}~{topic.weeks} weeks
          {topic.credits ? ` · ${topic.credits} ECTS` : ""}
        </span>
        <span
          className={clsx("dash-tag", DIFFICULTY_CLASS[topic.difficulty])}
        >
          {topic.difficulty}
        </span>
      </div>

      {getMasteryWeight(mastery) > 0 && (
        <span
          className="dash-topic-progress-bar"
          style={{ width: `${getMasteryWeight(mastery)}%` }}
          aria-hidden="true"
        />
      )}
    </button>
  );
}
