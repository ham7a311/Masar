import { Fragment, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { DiscordIcon, WhatsAppIcon } from "../components/BrandIcons";
import { AccentUnderline } from "../components/SectionAccent";

function StepConnector({ className = "" }) {
  return (
    <div
      className={clsx(
        "hiw-connector flex shrink-0 items-center justify-center",
        className
      )}
      aria-hidden="true"
    >
      {/* Desktop: horizontal */}
      <div className="hiw-connector-h hidden min-[920px]:flex items-center gap-0 px-1">
        <div className="hiw-flow-line h-px w-8 bg-gradient-to-r from-[rgba(124,58,237,0.08)] to-[rgba(124,58,237,0.35)]" />
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="hiw-flow-arrow text-[#7C3AED]">
          <path
            d="M4 10h11M11 6l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.55"
          />
        </svg>
        <div className="hiw-flow-line h-px w-8 bg-gradient-to-r from-[rgba(124,58,237,0.35)] to-[rgba(124,58,237,0.08)]" />
      </div>
      {/* Mobile: vertical */}
      <div className="hiw-connector-v flex min-[920px]:hidden flex-col items-center py-2">
        <div className="hiw-flow-line w-px h-6 bg-gradient-to-b from-[rgba(124,58,237,0.08)] to-[rgba(124,58,237,0.35)]" />
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="hiw-flow-arrow text-[#7C3AED]">
          <path
            d="M10 4v11M6 11l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.55"
          />
        </svg>
        <div className="hiw-flow-line w-px h-6 bg-gradient-to-b from-[rgba(124,58,237,0.35)] to-[rgba(124,58,237,0.08)]" />
      </div>
    </div>
  );
}

function SignInVisual() {
  return (
    <div className="flex h-full min-h-[120px] items-center justify-center">
      <div className="relative flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-[rgba(124,58,237,0.12)] bg-[rgba(124,58,237,0.04)]">
        <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_50%_30%,rgba(124,58,237,0.10)_0%,transparent_70%)]" />
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <circle cx="16" cy="11" r="5" stroke="#7C3AED" strokeWidth="1.5" opacity="0.7" />
          <path
            d="M8 26c0-4.418 3.582-8 8-8s8 3.582 8 8"
            stroke="#0F172A"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.55"
          />
          <circle cx="24" cy="10" r="3" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="1" opacity="0.8" />
          <path d="M24 13v2" stroke="#7C3AED" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
        </svg>
      </div>
    </div>
  );
}

function ProfileVisual() {
  const fields = ["University", "Major", "Academic year"];
  return (
    <div className="flex min-h-[120px] flex-col justify-center gap-2.5 px-1">
      {fields.map((label) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-xl border border-[rgba(15,23,42,0.08)] bg-white/80 px-3 py-2.5 shadow-[0_4px_14px_rgba(2,6,23,0.04)]"
        >
          <div className="h-2 w-2 shrink-0 rounded-full bg-[#7C3AED]/30" />
          <span className="text-[12px] font-medium text-[rgba(15,23,42,0.45)]">{label}</span>
          <div className="ml-auto h-1.5 w-12 rounded-full bg-[rgba(15,23,42,0.06)]" />
        </div>
      ))}
    </div>
  );
}

function DiscoverVisual() {
  const items = [
    "Personalized career roadmaps",
    "Skill requirements per path",
    "Student communities",
  ];
  return (
    <div className="flex min-h-[120px] flex-col justify-center gap-3">
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-[12px] leading-snug text-[rgba(15,23,42,0.55)]">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#7C3AED]" />
            {item}
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-2 pt-1">
        <span className="text-[11px] font-medium text-[rgba(15,23,42,0.4)]">Join via</span>
        <div className="flex items-center gap-1.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(15,23,42,0.08)] bg-white shadow-[0_4px_12px_rgba(2,6,23,0.04)]">
            <WhatsAppIcon size={16} />
          </span>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(15,23,42,0.08)] bg-white shadow-[0_4px_12px_rgba(2,6,23,0.04)]">
            <DiscordIcon size={16} />
          </span>
        </div>
      </div>
    </div>
  );
}

const STEPS = [
  {
    number: "01",
    title: "Sign in",
    description: "Simple access to the platform — your starting point.",
    Visual: SignInVisual,
  },
  {
    number: "02",
    title: "Tell us about you",
    description: "Share your background so Masar can personalize your journey.",
    Visual: ProfileVisual,
  },
  {
    number: "03",
    title: "Explore your path",
    description: "Discover roadmaps, skills, and communities built for students like you.",
    Visual: DiscoverVisual,
  },
];

function StepCard({ step, index, visible }) {
  const { number, title, description, Visual } = step;
  return (
    <article
      className={clsx(
        "hiw-step hiw-card group relative flex min-[920px]:min-w-0 min-[920px]:flex-1 flex-col rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white/90 p-6 shadow-[0_8px_32px_rgba(2,6,23,0.06)] backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-300",
        visible && "hiw-step-visible"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.04)_0%,transparent_55%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative mb-5 flex items-center justify-between">
        <span className="inline-flex items-center rounded-lg border border-[rgba(124,58,237,0.15)] bg-[#EDE9FE] px-2.5 py-1 text-[11px] font-semibold tracking-[0.06em] text-[#6D28D9]">
          Step {number}
        </span>
      </div>

      <h3 className="relative mb-2 font-heading text-[22px] font-bold tracking-[-0.02em] text-[#0F172A]">
        {title}
      </h3>
      <p className="relative mb-6 text-[14px] leading-relaxed text-[rgba(15,23,42,0.55)]">
        {description}
      </p>

      <div className="relative mt-auto">
        <Visual />
      </div>
    </article>
  );
}

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#FAFAF9] py-[clamp(64px,10vw,112px)]"
      aria-labelledby="hiw-heading"
    >
      {/* Subtle ambient glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.04)_0%,transparent_65%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1200px] px-[clamp(16px,4vw,32px)]">
        {/* Header */}
        <div
          className={clsx(
            "hiw-header mx-auto mb-[clamp(40px,6vw,64px)] max-w-[560px] text-center",
            visible && "hiw-header-visible"
          )}
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-[20px] border border-[rgba(124,58,237,0.2)] bg-[#EDE9FE] px-3.5 py-1.5 text-[13px] font-semibold tracking-[0.01em] text-[#6D28D9]">
            <span className="inline-block h-[7px] w-[7px] rounded-full bg-[#7C3AED] shadow-[0_0_0_2px_rgba(124,58,237,0.25)]" />
            How it works
          </span>
          <h2
            id="hiw-heading"
            className="font-heading text-[clamp(32px,4vw,44px)] font-bold tracking-[-0.03em] text-[#0F172A]"
          >
            Three steps to <AccentUnderline>clarity</AccentUnderline>
          </h2>
          <p className="mt-3 text-[16px] leading-relaxed text-[rgba(15,23,42,0.55)]">
            Masar guides you from sign-in to personalized career discovery — structured, simple, and built for students.
          </p>
        </div>

        {/* Steps flow */}
        <div className="flex flex-col min-[920px]:flex-row min-[920px]:items-stretch">
          {STEPS.map((step, i) => (
            <Fragment key={step.number}>
              <StepCard step={step} index={i} visible={visible} />
              {i < STEPS.length - 1 && (
                <StepConnector className="min-[920px]:self-center" />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
