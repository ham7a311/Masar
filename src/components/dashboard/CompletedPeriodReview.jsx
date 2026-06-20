import { getAllTopics, getRoadmapForProfile } from "../../data/roadmapTopics";
import { formatStudyYear } from "../../utils/profileFormat";
import { normalizeMastery } from "../../utils/mastery";
import MasteryBadge from "./MasteryBadge";

export default function CompletedPeriodReview({
  profile,
  periodValue,
  activePeriodValue,
  topicMastery = {},
}) {
  const roadmap = getRoadmapForProfile({ ...profile, year: periodValue });
  const topics = getAllTopics(roadmap).map((t) => ({
    ...t,
    mastery: normalizeMastery(topicMastery[t.id] ?? t.mastery),
  }));

  return (
    <section className="dash-card dash-period-review">
      <h3 className="dash-period-review-title">
        {formatStudyYear(periodValue)} — completed
      </h3>
      <p className="dash-period-review-desc">
        You&apos;re viewing a completed semester. Click <strong>Save Changes</strong>{" "}
        to switch your active semester from{" "}
        <strong>{formatStudyYear(activePeriodValue)}</strong> to{" "}
        <strong>{formatStudyYear(periodValue)}</strong> — you&apos;ll be asked to
        confirm first.
      </p>
      {topics.length === 0 ? (
        <p className="dash-period-review-empty">No topics listed for this period.</p>
      ) : (
        <ul className="dash-period-review-list">
          {topics.map((topic) => (
            <li key={topic.id} className="dash-period-review-item">
              <span className="dash-period-review-name">{topic.title}</span>
              <MasteryBadge level={topic.mastery} className="dash-mastery-badge-compact" />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
