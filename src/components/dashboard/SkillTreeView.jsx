import clsx from "clsx";
import MasteryBadge from "./MasteryBadge";

export default function SkillTreeView({ tree, onOpenTopic }) {
  if (!tree?.length) return null;

  return (
    <div className="dash-skill-tree">
      {tree.map((group) => (
        <div key={group.name} className="dash-skill-group">
          <h3 className="dash-skill-group-title">{group.name}</h3>
          <ul className="dash-skill-nodes">
            {group.nodes.map((node, i) => (
              <li key={node.id} className="dash-skill-node-wrap">
                {i > 0 && <span className="dash-skill-connector" aria-hidden="true" />}
                <button
                  type="button"
                  className={clsx(
                    "dash-skill-node",
                    node.mastered && "dash-skill-node-mastered",
                    node.active && "dash-skill-node-active",
                    node.locked && "dash-skill-node-locked"
                  )}
                  onClick={() => onOpenTopic(node.id)}
                >
                  <span className="dash-skill-node-title">{node.title}</span>
                  <MasteryBadge level={node.mastery} className="dash-mastery-badge-compact" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
