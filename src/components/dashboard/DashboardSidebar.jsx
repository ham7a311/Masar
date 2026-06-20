import clsx from "clsx";
import { X } from "lucide-react";
import logo from "../../assets/logo.png";
import {
  DASHBOARD_NAV_ITEMS,
  DASHBOARD_PROFILE_NAV,
} from "./dashboardNav";

export default function DashboardSidebar({
  activeView,
  onNavigate,
  mobileOpen,
  onMobileClose,
  variant = "sidebar",
}) {
  return (
    <>
      <div
        className={clsx("dash-sidebar-backdrop", mobileOpen && "dash-sidebar-backdrop-open")}
        onClick={onMobileClose}
        aria-hidden="true"
      />

      <aside
        className={clsx(
          "dash-sidebar",
          variant === "drawer" && "dash-sidebar-drawer",
          mobileOpen && "dash-sidebar-open"
        )}
        aria-label="Dashboard navigation"
      >
        <div className="dash-sidebar-brand">
          <span className="dash-sidebar-logo-wrap">
            <img src={logo} alt="" className="dash-sidebar-logo" />
          </span>
          <span className="dash-sidebar-brand-name">Masar</span>
          <button
            type="button"
            className="dash-sidebar-close"
            aria-label="Close menu"
            onClick={onMobileClose}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="dash-sidebar-nav">
          {DASHBOARD_NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className={clsx(
                "dash-nav-item",
                activeView === id && "dash-nav-item-active"
              )}
              onClick={() => onNavigate(id)}
            >
              <Icon size={18} strokeWidth={2} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="dash-sidebar-footer">
          <button
            type="button"
            className={clsx(
              "dash-nav-item",
              activeView === "profile" && "dash-nav-item-active"
            )}
            onClick={() => onNavigate("profile")}
          >
            <DASHBOARD_PROFILE_NAV.icon size={18} strokeWidth={2} />
            <span>{DASHBOARD_PROFILE_NAV.label}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
