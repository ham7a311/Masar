import clsx from "clsx";
import { ArrowLeft, Flag, Flame, Sparkles } from "lucide-react";
import MasteryBadge from "./MasteryBadge";
import CareerImpactDisplay from "./CareerImpactDisplay";
import TopicNotesEditor from "./TopicNotesEditor";
import TopicDependencyGraph from "./TopicDependencyGraph";
import { MASTERY_LEVELS, getMasteryLabel, normalizeMastery } from "../../utils/mastery";
import { getGoalLabel } from "../../utils/careerGoal";

export default function TopicFocusView({
  topic,
  careerGoal,
  isPriority,
  isGoalRecommended,
  topicNotes,
  prerequisiteTitles,
  prerequisiteTopics = [],
  unlockTopics = [],
  topicMastery = {},
  onBack,
  onMasteryChange,
  onPriorityToggle,
  onNotesSave,
}) {
  const mastery = normalizeMastery(topic.mastery);
  const careerGoalLabel = getGoalLabel(careerGoal);

  const handleMasterySelect = (level) => {
    onMasteryChange(topic.id, level);
  };

  return (
    <div className="dash-topic-focus dash-fade-up">
      <button type="button" className="dash-topic-focus-back" onClick={onBack}>
        <ArrowLeft size={18} aria-hidden="true" />
        Back to Roadmap
      </button>

      <header className="dash-topic-focus-header dash-card">
        <div className="dash-topic-focus-badges">
          {isGoalRecommended && (
            <span className="dash-goal-topic-badge">
              <Sparkles size={14} aria-hidden="true" />
              Recommended for Your Goal
            </span>
          )}
          <MasteryBadge level={mastery} />
        </div>

        <div className="dash-topic-focus-title-row">
          <h2 className="dash-topic-focus-title">{topic.title}</h2>
          <button
            type="button"
            className={clsx(
              "dash-topic-focus-priority",
              isPriority && "dash-topic-focus-priority-active"
            )}
            onClick={() => onPriorityToggle(topic.id)}
          >
            {isPriority ? (
              <Flame size={16} aria-hidden="true" />
            ) : (
              <Flag size={16} aria-hidden="true" />
            )}
            {isPriority ? "Remove Priority" : "Mark as Priority"}
          </button>
        </div>

        <div className="dash-topic-focus-meta">
          {topic.code && <span>{topic.code}</span>}
          {topic.difficulty && <span>{topic.difficulty}</span>}
          {topic.credits && <span>{topic.credits} ECTS</span>}
          <span>~{topic.weeks} weeks</span>
        </div>
      </header>

      <section className="dash-card dash-topic-focus-section">
        <h3 className="dash-topic-focus-heading">Mastery Level</h3>
        <p className="dash-topic-focus-hint">
          Track how well you understand this topic — not just whether you&apos;ve
          touched it.
        </p>
        <div className="dash-mastery-selector" role="radiogroup" aria-label="Mastery level">
          {MASTERY_LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              role="radio"
              aria-checked={mastery === level}
              className={clsx(
                "dash-mastery-option",
                mastery === level && "dash-mastery-option-active",
                `dash-mastery-option-${level}`
              )}
              onClick={() => handleMasterySelect(level)}
            >
              {getMasteryLabel(level)}
            </button>
          ))}
        </div>
      </section>

      <div className="dash-card">
        <TopicNotesEditor
          topicId={topic.id}
          initialNotes={topicNotes}
          onSave={onNotesSave}
        />
      </div>

      <div className="dash-card">
        <TopicDependencyGraph
          topic={topic}
          prerequisites={prerequisiteTopics}
          unlocks={unlockTopics}
          topicMastery={topicMastery}
        />
      </div>

      <section className="dash-card dash-topic-focus-section">
        <h3 className="dash-topic-focus-heading">Topic Insights</h3>
        <CareerImpactDisplay
          goalRelevance={topic.goalRelevance}
          careerGoalLabel={careerGoalLabel}
        />
        {topic.whyItMatters && (
          <div className="dash-topic-focus-block">
            <p className="dash-topic-focus-label">Why This Matters</p>
            <p className="dash-topic-focus-text">{topic.whyItMatters}</p>
          </div>
        )}
        {topic.careersUsedIn?.length > 0 && (
          <div className="dash-topic-focus-block">
            <p className="dash-topic-focus-label">Careers Using This Topic</p>
            <ul className="dash-topic-focus-list">
              {topic.careersUsedIn.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        )}
        {topic.skillsGained?.length > 0 && (
          <div className="dash-topic-focus-block">
            <p className="dash-topic-focus-label">Skills Gained</p>
            <ul className="dash-topic-focus-list">
              {topic.skillsGained.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
