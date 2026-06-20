import clsx from "clsx";

export function AccentUnderline({
  children,
  className = "",
  tone = "light",
}) {
  const isDark = tone === "dark";
  return (
    <span
      className={clsx(
        "relative inline-block",
        isDark ? "text-[#C4B5FD]" : "text-[#7C3AED]",
        className
      )}
    >
      {children}
      <svg
        className="absolute -bottom-1.5 left-0 h-1.5 w-full overflow-visible"
        viewBox="0 0 120 6"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 5 Q30 1 60 4 Q90 7 120 3"
          stroke={isDark ? "#C4B5FD" : "#7C3AED"}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity={isDark ? 0.55 : 0.5}
        />
      </svg>
    </span>
  );
}

export default function SectionCta({
  text,
  primaryLabel,
  primaryHref,
  primaryClassName = "cta-primary",
  secondaryLabel,
  secondaryHref,
}) {
  return (
    <section
      className="relative bg-[#FAFAF9] py-[clamp(36px,5vw,52px)]"
      aria-label={primaryLabel}
    >
      <div className="mx-auto w-full max-w-[1200px] px-[clamp(16px,4vw,32px)]">
        <div className="flex flex-col items-center gap-5 text-center">
          {text && (
            <p className="max-w-[420px] text-[15px] leading-relaxed text-[rgba(15,23,42,0.52)]">
              {text}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href={primaryHref} className={primaryClassName}>
              {primaryLabel}
            </a>
            {secondaryLabel && secondaryHref && (
              <a href={secondaryHref} className="cta-secondary">
                {secondaryLabel}
                <span className="arrow text-base">→</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
