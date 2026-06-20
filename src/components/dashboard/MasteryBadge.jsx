import clsx from "clsx";
import { getMasteryLabel, normalizeMastery } from "../../utils/mastery";

export default function MasteryBadge({ level, className }) {
  const normalized = normalizeMastery(level);

  return (
    <span
      className={clsx("dash-mastery-badge", `dash-mastery-${normalized}`, className)}
    >
      {getMasteryLabel(normalized)}
    </span>
  );
}
