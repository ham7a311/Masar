import clsx from "clsx";
import { isMastered, normalizeMastery } from "../../utils/mastery";

export default function TopicDependencyGraph({
  topic,
  prerequisites,
  unlocks,
  topicMastery,
}) {
  return (
    <section className="dash-topic-focus-section dash-deps-section">
      <h3 className="dash-topic-focus-heading">Learning Path</h3>

      {prerequisites.length > 0 && (
        <div className="dash-deps-block">
          <p className="dash-topic-focus-label">Prerequisites</p>
          <ul className="dash-deps-list">
            {prerequisites.map((t) => {
              const done = isMastered(normalizeMastery(topicMastery[t.id]));
              return (
                <li key={t.id} className={clsx(done && "dash-deps-done")}>
                  {done ? "✓" : "○"} {t.title}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="dash-deps-chain">
        {prerequisites.slice(-2).map((t) => (
          <div key={t.id} className="dash-deps-node">
            <span>{t.title}</span>
            <span className="dash-deps-arrow">↓</span>
          </div>
        ))}
        <div className="dash-deps-node dash-deps-node-current">
          <span>{topic.title}</span>
        </div>
        {unlocks.length > 0 && (
          <>
            <span className="dash-deps-arrow">↓</span>
            {unlocks.slice(0, 3).map((t) => (
              <div key={t.id} className="dash-deps-node dash-deps-node-future">
                <span>→ {t.title}</span>
              </div>
            ))}
          </>
        )}
      </div>

      {unlocks.length > 0 && (
        <div className="dash-deps-block">
          <p className="dash-topic-focus-label">Unlocks</p>
          <ul className="dash-deps-list">
            {unlocks.map((t) => (
              <li key={t.id}>→ {t.title}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
