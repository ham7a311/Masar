import clsx from "clsx";
import {
  DASHBOARD_NAV_ITEMS,
  DASHBOARD_PROFILE_NAV,
} from "./dashboardNav";

const BOTTOM_NAV_ITEMS = [...DASHBOARD_NAV_ITEMS, DASHBOARD_PROFILE_NAV];

export default function DashboardBottomNav({ activeView, onNavigate }) {
  return (
    <nav className="dash-bottom-nav" aria-label="Dashboard navigation">
      {BOTTOM_NAV_ITEMS.map(({ id, shortLabel, icon: Icon }) => (
        <button
          key={id}
          type="button"
          className={clsx(
            "dash-bottom-nav-item",
            activeView === id && "dash-bottom-nav-item-active"
          )}
          onClick={() => onNavigate(id)}
          aria-current={activeView === id ? "page" : undefined}
        >
          <Icon size={20} strokeWidth={2} aria-hidden="true" />
          <span>{shortLabel}</span>
        </button>
      ))}
    </nav>
  );
}
