import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import logo from "../assets/logo.png";
import HowItWorks from "./HowItWorks";
import Features from "./Features";
import RoadmapPreview from "./RoadmapPreview";
import StudentCommunity from "./StudentCommunity";
import FAQ from "./FAQ";
import FinalSignInCta from "./FinalSignInCta";
import Footer from "./Footer";
import SectionCta, { AccentUnderline } from "../components/SectionAccent";
import "./hero-page.css";

function cn(...inputs) {
  return clsx(inputs);
}

// ── Hero Logo Mark (large, animated) ────────────────────────────────────────
function HeroMark() {
  return (
    <div className="mark-anim hero-mark-wrap relative flex items-center justify-center">
      <div
        className="ring-1 hero-mark-ring pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-[#7C3AED]"
      />
      <div
        className="ring-2 hero-mark-ring pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-[#8B5CF6]"
      />
      <div
        className="ring-3 hero-mark-ring pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#A78BFA]"
      />
      <div
        className="hero-mark-glow absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.08)_0%,transparent_70%)]"
      />
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="logo-mark hero-mark-svg"
      >
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <g key={i} transform={`rotate(${deg} 100 100)`}>
            <path
              d="M100 100 C85 65, 65 55, 100 20 C135 55, 115 65, 100 100Z"
              fill="#8B7BA8"
              opacity="0.75"
            />
          </g>
        ))}
        {[30, 90, 150, 210, 270, 330].map((deg, i) => (
          <g key={i} transform={`rotate(${deg} 100 100)`}>
            <path
              d="M100 100 C88 72, 72 65, 100 38 C128 65, 112 72, 100 100Z"
              fill="#1E293B"
              opacity="0.9"
            />
          </g>
        ))}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <g key={i} transform={`rotate(${deg} 100 100)`}>
            <circle cx="100" cy="26" r="7" fill="none" stroke="#8B7BA8" strokeWidth="1.5" />
            <circle cx="100" cy="26" r="3" fill="#8B7BA8" />
          </g>
        ))}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <g key={i} transform={`rotate(${deg} 100 100)`}>
            <circle cx="100" cy="50" r="2.5" fill="#7C3AED" opacity="0.6" />
          </g>
        ))}
        <circle cx="100" cy="100" r="12" fill="#0F172A" />
        <circle cx="100" cy="100" r="5" fill="#7C3AED" />
      </svg>
    </div>
  );
}

// ── Grid background ──────────────────────────────────────────────────────────
function GridBg() {
  return (
    <div
      className="grid-bg pointer-events-none absolute inset-0 z-0 bg-[length:52px_52px] [background-image:linear-gradient(rgba(124,58,237,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.055)_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.15)_50%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.15)_50%,transparent_100%)]"
    />
  );
}

const headlineClass =
  "font-heading text-[clamp(48px,5.5vw,76px)] font-bold text-[#0F172A] leading-[1.08] tracking-[-0.03em]";

const NAV_SECTIONS = [
  { id: "how-it-works", label: "How it works" },
  { id: "features", label: "Features" },
  { id: "roadmap-preview", label: "Career paths" },
  { id: "community", label: "Community" },
  { id: "faq", label: "FAQ" },
];

function getActiveSectionId() {
  const navH =
    parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 72;
  const marker = window.scrollY + navH + 80;

  let activeId = null;
  for (const { id } of NAV_SECTIONS) {
    const el = document.getElementById(id);
    if (!el) continue;
    const top = el.getBoundingClientRect().top + window.scrollY;
    if (top <= marker) activeId = id;
  }
  return activeId;
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function HeroPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobilePanelRef = useRef(null);
  const [badgeIndex, setBadgeIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [thirdIndex, setThirdIndex] = useState(0);

  const badgePhrases = [
    "Helping students navigate their future",
    "Explore careers with clear roadmaps",
    "Discover skills you actually need",
    "Make confident career decisions",
  ];

  const thirdPhrases = [
    "before choosing a major.",
    "before graduation.",
    "with confidence.",
    "with clear career roadmaps.",
  ];

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();

    if (media.addEventListener) media.addEventListener("change", update);
    else media.addListener(update);

    return () => {
      if (media.removeEventListener) media.removeEventListener("change", update);
      else media.removeListener(update);
    };
  }, []);

  useEffect(() => {
    let rafId = 0;

    const updateScrollState = () => {
      setScrolled(window.scrollY > 12);
      setActiveSection(getActiveSectionId());
    };

    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateScrollState);
    };

    updateScrollState();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setBadgeIndex((i) => (i + 1) % badgePhrases.length);
    }, 2600);
    return () => window.clearInterval(id);
  }, [badgePhrases.length]);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setThirdIndex((i) => (i + 1) % thirdPhrases.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, [reduceMotion, thirdPhrases.length]);

  return (
    <div
      className="masar-homepage min-h-screen bg-[#FAFAF9] font-sans text-[#0F172A] antialiased"
      id="top"
    >
      {/* ── NAVBAR ── */}
      <nav
        className={cn(
          "fixed top-0 right-0 left-0 z-[100] backdrop-blur-[14px] transition-[background,border-bottom,box-shadow] duration-300",
          scrolled
            ? "border-b border-white/10 bg-[rgba(15,23,42,0.78)] shadow-[0_10px_30px_rgba(2,6,23,0.22)]"
            : "border-b border-white/[0.06] bg-[rgba(15,23,42,0.92)] shadow-none"
        )}
      >
        <div className="mx-auto w-full max-w-[1200px] px-[clamp(16px,4vw,32px)]">
          <div className="flex h-[var(--nav-h)] items-center gap-4">
            {/* Brand */}
            <a href="#top" className="nav-item brand mr-auto flex min-w-0 items-center gap-2.5">
              <span
                className="brand-badge inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 bg-white/[0.06] shadow-[0_10px_24px_rgba(2,6,23,0.22),inset_0_1px_0_rgba(255,255,255,0.08)] max-[520px]:h-[38px] max-[520px]:w-[38px]"
                aria-hidden="true"
              >
                <img
                  src={logo}
                  alt=""
                  className="brand-logo h-[26px] w-[26px] object-contain max-[520px]:h-6 max-[520px]:w-6"
                />
              </span>
              <span className="brand-name font-heading whitespace-nowrap text-[17px] font-semibold tracking-[-0.02em] text-white max-[520px]:text-base">
                Masar
              </span>
            </a>

            {/* Desktop links */}
            <div className="nav-item nav-links mr-6 flex items-center gap-5 min-[1024px]:gap-6" aria-label="Primary navigation">
              {NAV_SECTIONS.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className={cn("nav-link", activeSection === id && "active")}
                  aria-current={activeSection === id ? "true" : undefined}
                >
                  {label}
                </a>
              ))}
            </div>

            {/* Desktop actions */}
            <div className="nav-item nav-right flex items-center gap-2.5">
              <Link to="/auth" className="nav-action nav-secondary">
                Sign in
              </Link>
              <a href="#community" className="nav-action nav-primary font-bold rounded-full">
                Start Exploring
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="nav-mobile-btn"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-panel"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? (
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path
                    d="M5 5l10 10M15 5L5 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path
                    d="M4 6h12M4 10h12M4 14h12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile panel */}
          {mobileOpen && (
            <div
              id="mobile-nav-panel"
              ref={mobilePanelRef}
              className="block border-t border-white/10 py-2.5 pb-[18px] max-[820px]:block"
              role="dialog"
              aria-modal="false"
            >
              <div className="grid gap-1">
                {NAV_SECTIONS.map(({ id, label }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className={cn("nav-mobile-link", activeSection === id && "active")}
                    aria-current={activeSection === id ? "true" : undefined}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span>{label}</span>
                    <span className="opacity-50">→</span>
                  </a>
                ))}
              </div>

              <div className="mt-2.5 grid grid-cols-2 gap-2.5">
                <Link to="/auth" className="nav-action nav-secondary w-full" onClick={() => setMobileOpen(false)}>
                  Sign in
                </Link>
                <a href="#community" className="nav-action nav-primary w-full" onClick={() => setMobileOpen(false)}>
                  Start Exploring
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-[#FAFAF9] pt-[calc(var(--nav-h)+clamp(18px,4vw,42px))]">
        <GridBg />

        {/* Ambient blob — top right */}
        <div
          className="pointer-events-none absolute -top-[120px] -right-20 z-0 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.07)_0%,transparent_65%)]"
          aria-hidden="true"
        />

        <div className="relative z-[1] mx-auto grid w-full max-w-[1200px] grid-cols-1 items-center gap-[clamp(24px,5vw,64px)] px-[clamp(16px,4vw,32px)] min-[920px]:grid-cols-[1fr_420px]">
          {/* ── LEFT COLUMN ── */}
          <div className="pb-10 min-[920px]:pb-0">
            {/* Badge pill */}
            <div className="pill-anim mb-8 inline-flex items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-[20px] border border-[rgba(124,58,237,0.2)] bg-[#EDE9FE] px-3.5 py-1.5 text-[13px] font-semibold tracking-[0.01em] text-[#6D28D9]">
                <span key={badgeIndex} className="badge-text">
                  <span className="inline-block h-[7px] w-[7px] rounded-full bg-[#7C3AED] shadow-[0_0_0_2px_rgba(124,58,237,0.25)]" />
                  {badgePhrases[badgeIndex]}
                </span>
              </span>
            </div>

            {/* H1 */}
            <div className="mt-[18px] mb-6">
              <h1 className={cn("h1-line-1", headlineClass, "mb-1")}>Find the path</h1>
              <h1 className={cn("h1-line-2", headlineClass, "mb-1")}>
                that&apos;s{" "}
                <AccentUnderline>right for you</AccentUnderline>
              </h1>
              <div className={cn("headline-line3-fixed", headlineClass)}>
                <h1 className="h1-line-3 line3-h1">
                  <span key={thirdIndex} className="line3-sweep">
                    {thirdPhrases[thirdIndex]}
                  </span>
                </h1>
              </div>
            </div>

            {/* Subtext */}
            <p className="sub-anim mb-10 max-w-[460px] text-lg leading-[1.65] font-normal text-[rgba(15,23,42,0.55)]">
              Explore careers, discover required skills, and follow clear roadmaps built by students,
              graduates, and industry professionals.
            </p>

            {/* CTA */}
            <div className="cta-anim mb-12">
              <Link to="/auth" className="hero-sign-in-btn">
                <span className="hero-sign-in-btn-text">Sign in</span>
                <span className="hero-sign-in-btn-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
              <p className="hero-sign-in-note">Free for students · Takes under a minute</p>
            </div>

            {/* Social proof */}
            <div className="proof-anim flex items-center gap-3 max-[520px]:items-start">
              <div className="flex items-center">
                {[
                  { bg: "#7C3AED", label: "NA" },
                  { bg: "#0F172A", label: "KM" },
                  { bg: "#6D28D9", label: "RS" },
                  { bg: "#4338CA", label: "YA" },
                ].map((a, i) => (
                  <div
                    key={i}
                    className="avatar"
                    style={{ background: a.bg, zIndex: 4 - i }}
                  >
                    {a.label}
                  </div>
                ))}
              </div>
              <div>
                <div className="mb-px flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                      <path
                        d="M6 1l1.3 2.6L10 4.1l-2 1.9.5 2.8L6 7.5l-2.5 1.3.5-2.8L2 4.1l2.7-.5z"
                        fill="#7C3AED"
                      />
                    </svg>
                  ))}
                </div>
                <span className="text-[13px] font-normal text-[rgba(15,23,42,0.5)]">
                  Helping <strong className="font-semibold text-[#0F172A]">students</strong> make more
                  confident career decisions
                </span>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="flex items-center justify-center min-[920px]:justify-center">
            <div className="mx-auto min-[920px]:mx-0">
              <HeroMark />
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div
          className="pointer-events-none absolute right-0 bottom-0 left-0 h-[120px] bg-[linear-gradient(to_top,rgba(250,250,249,0.8)_0%,transparent_100%)]"
          aria-hidden="true"
        />
      </section>

      <HowItWorks />

      <Features />

      <RoadmapPreview />

      <SectionCta
        text="You've seen the roadmap — now discover the community behind it."
        primaryLabel="Sign in"
        primaryHref="/auth"
        primaryClassName="cta-secondary"
      />

      <StudentCommunity />

      <FAQ />

      <FinalSignInCta />

      <Footer />
    </div>
  );
}
