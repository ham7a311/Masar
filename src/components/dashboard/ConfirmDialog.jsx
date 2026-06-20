export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!open) return null;

  return (
    <div
      className="dash-confirm-overlay"
      role="presentation"
      onClick={loading ? undefined : onCancel}
    >
      <div
        className="dash-confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dash-confirm-title"
        aria-describedby="dash-confirm-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="dash-confirm-title" className="dash-confirm-title">
          {title}
        </h2>
        <p id="dash-confirm-desc" className="dash-confirm-message">
          {message}
        </p>
        <div className="dash-confirm-actions">
          <button
            type="button"
            className="dash-btn dash-confirm-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="dash-btn dash-btn-primary dash-confirm-confirm"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Signing out..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
