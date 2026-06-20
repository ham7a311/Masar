import clsx from "clsx";

function Spinner() {
  return (
    <svg
      className="oauth-btn-spinner"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.25"
      />
      <path
        d="M21 12a9 9 0 00-9-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function OAuthButton({
  icon: Icon,
  label,
  loadingLabel = "Signing in...",
  onClick,
  loading = false,
  disabled = false,
}) {
  return (
    <button
      type="button"
      className={clsx("oauth-btn", loading && "oauth-btn-loading")}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      <span className="oauth-btn-icon">
        {loading ? <Spinner /> : <Icon size={20} />}
      </span>
      <span className="oauth-btn-label">{loading ? loadingLabel : label}</span>
    </button>
  );
}
