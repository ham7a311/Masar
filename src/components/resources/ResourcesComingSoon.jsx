import { BookOpen } from "lucide-react";
import DashboardPlaceholder from "../dashboard/DashboardPlaceholder";

export default function ResourcesComingSoon({ variant = "dashboard", majorLabel }) {
  if (variant === "dashboard") {
    return <DashboardPlaceholder view="resources" />;
  }

  return (
    <section
      id="resources"
      className="resources-section resources-section-homepage"
      aria-labelledby="resources-heading"
    >
      <div className="resources-inner">
        <header className="resources-header">
          <span className="resources-eyebrow">Curated picks</span>
          <h2 id="resources-heading" className="resources-title">
            Resources
          </h2>
          <p className="resources-subtitle">
            {majorLabel
              ? `Curated resources for ${majorLabel} are coming soon.`
              : "Sign in and set your major to see resources picked for your field."}
          </p>
        </header>

        <div className="resources-coming-soon">
          <div className="resources-coming-soon-icon" aria-hidden="true">
            <BookOpen size={28} strokeWidth={1.75} />
          </div>
          <span className="resources-coming-soon-badge">Coming soon</span>
          <p className="resources-coming-soon-text">
            We&apos;re building major-specific resource lists so you only see what
            matters for your degree — not another field&apos;s toolkit.
          </p>
        </div>
      </div>
    </section>
  );
}
