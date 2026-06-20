import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { AccentUnderline } from "../components/SectionAccent";

function RoadmapIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 18V6M4 18h16M4 18l3-4 4 2 5-6 4 4"
        stroke="#7C3AED"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
      <circle cx="7" cy="14" r="1.5" fill="#7C3AED" opacity="0.6" />
      <circle cx="11" cy="16" r="1.5" fill="#7C3AED" opacity="0.6" />
      <circle cx="16" cy="10" r="1.5" fill="#7C3AED" opacity="0.6" />
      <circle cx="20" cy="14" r="1.5" fill="#7C3AED" opacity="0.6" />
    </svg>
  );
}

function SkillsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="5" width="16" height="4" rx="1.5" stroke="#0F172A" strokeWidth="1.5" opacity="0.45" />
      <rect x="4" y="10" width="12" height="4" rx="1.5" stroke="#7C3AED" strokeWidth="1.5" opacity="0.75" />
      <rect x="4" y="15" width="8" height="4" rx="1.5" stroke="#7C3AED" strokeWidth="1.5" opacity="0.55" />
      <path d="M18 12l2 2-4 4-2-2" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PeersIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="3" stroke="#7C3AED" strokeWidth="1.5" opacity="0.75" />
      <circle cx="16" cy="10" r="2.5" stroke="#0F172A" strokeWidth="1.5" opacity="0.4" />
      <path
        d="M4 19c0-2.76 2.24-5 5-5s5 2.24 5 5M14 19c0-1.66 1.12-3.08 2.67-3.67"
        stroke="#0F172A"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.45"
      />
      <rect x="3" y="3" width="6" height="5" rx="1" stroke="#7C3AED" strokeWidth="1.2" opacity="0.35" />
    </svg>
  );
}

function CommunitiesIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 9a3 3 0 016 0v1H5V9zM13 8a2.5 2.5 0 015 0v2h-5V8z"
        stroke="#7C3AED"
        strokeWidth="1.5"
        strokeLinejoin="round"
        opacity="0.7"
      />
      <path
        d="M4 14h8v5H6a2 2 0 01-2-2v-3zM12 13h8v6h-6a2 2 0 01-2-2v-4z"
        stroke="#0F172A"
        strokeWidth="1.5"
        strokeLinejoin="round"
        opacity="0.45"
      />
      <circle cx="18" cy="6" r="2" fill="#5865F2" opacity="0.5" />
      <circle cx="20" cy="6" r="1.5" fill="#25D366" opacity="0.5" />
    </svg>
  );
}

const FEATURES = [
  {
    Icon: RoadmapIcon,
    title: "Personalized career roadmaps",
    description:
      "Structured step-by-step paths based on your major and goals — what to study, learn, and focus on next.",
  },
  {
    Icon: SkillsIcon,
    title: "Skill-based guidance",
    description:
      "Careers broken into real skills, not vague advice. See exactly what each path requires and where your gaps are.",
  },
  {
    Icon: PeersIcon,
    title: "University & peer discovery",
    description:
      "Connect with students from your university, major, and year. See what others are doing and find direction together.",
  },
  {
    Icon: CommunitiesIcon,
    title: "Student communities",
    description:
      "WhatsApp and Discord groups by major and university — collaboration and real-time support, not isolated exploration.",
  },
];

function FeatureCard({ feature, index, visible }) {
  const { Icon, title, description } = feature;
  return (
    <article
      className={clsx(
        "features-card group relative flex flex-col rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white/90 p-6 shadow-[0_8px_32px_rgba(2,6,23,0.06)] backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-300",
        visible && "features-card-visible"
      )}
      style={{ transitionDelay: `${120 + index * 90}ms` }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.04)_0%,transparent_55%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(124,58,237,0.12)] bg-[rgba(124,58,237,0.04)]">
        <Icon />
      </div>

      <h3 className="relative mb-2.5 font-heading text-[18px] font-bold tracking-[-0.02em] text-[#0F172A]">
        {title}
      </h3>
      <p className="relative text-[14px] leading-relaxed text-[rgba(15,23,42,0.55)]">
        {description}
      </p>
    </article>
  );
}

export default function Features() {
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
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#FAFAF9] py-[clamp(64px,10vw,112px)]"
      aria-labelledby="features-heading"
    >
      <div
        className="pointer-events-none absolute -bottom-32 -left-24 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.05)_0%,transparent_65%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1200px] px-[clamp(16px,4vw,32px)]">
        <div
          className={clsx(
            "features-header mx-auto mb-[clamp(40px,6vw,56px)] max-w-[560px] text-center",
            visible && "features-header-visible"
          )}
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-[20px] border border-[rgba(124,58,237,0.2)] bg-[#EDE9FE] px-3.5 py-1.5 text-[13px] font-semibold tracking-[0.01em] text-[#6D28D9]">
            <span className="inline-block h-[7px] w-[7px] rounded-full bg-[#7C3AED] shadow-[0_0_0_2px_rgba(124,58,237,0.25)]" />
            Features
          </span>
          <h2
            id="features-heading"
            className="font-heading text-[clamp(32px,4vw,44px)] font-bold tracking-[-0.03em] text-[#0F172A]"
          >
            What you get with <AccentUnderline>Masar</AccentUnderline>
          </h2>
          <p className="mt-3 text-[16px] leading-relaxed text-[rgba(15,23,42,0.55)]">
            Everything you need after signing up — clear direction, real skills, and a community that gets it.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 min-[640px]:grid-cols-2 min-[920px]:gap-6">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
