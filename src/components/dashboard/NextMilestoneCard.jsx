import { ArrowRight } from "lucide-react";
import { formatStudyYear } from "../../utils/profileFormat";

export default function NextMilestoneCard({
  currentPeriod,
  nextPeriodLabel,
  onAdvance,
  advancing = false,
}) {
  if (!nextPeriodLabel) return null;

  return (
    <section className="dash-card dash-milestone-card dash-fade-up" role="status">
      <div className="dash-milestone-card-inner">
        <div className="dash-milestone-card-copy">
          <p className="dash-milestone-eyebrow">Next milestone</p>
          <h2 className="dash-milestone-card-title">Move to the next semester</h2>
          <p className="dash-milestone-card-desc">
            You&apos;ve completed{" "}
            <strong>{formatStudyYear(currentPeriod)}</strong>. Continue to{" "}
            <strong>{nextPeriodLabel}</strong> when you&apos;re ready — we&apos;ll
            check your priority topics before advancing.
          </p>
        </div>
        <button
          type="button"
          className="dash-btn dash-btn-primary dash-milestone-card-btn"
          onClick={onAdvance}
          disabled={advancing}
        >
          {advancing ? "Updating..." : `Continue to ${nextPeriodLabel}`}
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
