import clsx from "clsx";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ isDark, onChange, disabled = false }) {
  return (
    <div className="dash-preference-item">
      <div className="dash-preference-info">
        <span
          className={clsx(
            "dash-preference-icon-wrap",
            isDark && "dash-preference-icon-wrap-dark"
          )}
          aria-hidden="true"
        >
          {isDark ? <Moon size={18} /> : <Sun size={18} />}
        </span>
        <div>
          <p className="dash-preference-name">Dark mode</p>
          <p className="dash-preference-desc">
            Comfortable viewing in low light with Masar&apos;s dark palette
          </p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={isDark ? "Turn off dark mode" : "Turn on dark mode"}
        className={clsx("dash-theme-switch", isDark && "dash-theme-switch-on")}
        onClick={() => onChange(!isDark)}
        disabled={disabled}
      >
        <span className="dash-theme-switch-track" aria-hidden="true">
          <span className="dash-theme-switch-thumb">
            {isDark ? <Moon size={14} strokeWidth={2.5} /> : <Sun size={14} strokeWidth={2.5} />}
          </span>
        </span>
      </button>
    </div>
  );
}
