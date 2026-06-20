import clsx from "clsx";
import { CalendarCheck } from "lucide-react";
import { getMasteryLabel } from "../../utils/mastery";

export default function WeeklyPlanPanel({ plan }) {
  if (!plan?.items?.length) return null;

  return (
    <div className="dash-panel-card dash-weekly-plan">
      <p className="dash-panel-label">
        <CalendarCheck size={14} aria-hidden="true" />
        This Week&apos;s Plan
      </p>
      <ul className="dash-weekly-list">
        {plan.items.map((item) => (
          <li
            key={item.id}
            className={clsx("dash-weekly-item", item.weekComplete && "dash-weekly-item-done")}
          >
            <span className="dash-weekly-check">{item.weekComplete ? "✓" : "○"}</span>
            <span className="dash-weekly-name">{item.title}</span>
            <span className="dash-weekly-mastery">{getMasteryLabel(item.mastery)}</span>
          </li>
        ))}
      </ul>
      <p className="dash-weekly-progress">
        {plan.completed} / {plan.total} completed · ~{plan.estimatedHours} hours estimated
      </p>
    </div>
  );
}
