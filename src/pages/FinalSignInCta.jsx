import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { AccentUnderline } from "../components/SectionAccent";

export default function FinalSignInCta() {
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
      { threshold: 0.2, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="final-sign-in relative overflow-hidden py-[clamp(56px,8vw,96px)]"
      aria-labelledby="final-sign-in-heading"
    >
      <div className="final-sign-in-glow pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-[1200px] px-[clamp(16px,4vw,32px)]">
        <div
          className={clsx(
            "final-sign-in-card mx-auto max-w-[640px] text-center",
            visible && "final-sign-in-card-visible"
          )}
        >
          <span className="final-sign-in-eyebrow">Your journey starts here</span>

          <h2 id="final-sign-in-heading" className="final-sign-in-title">
            Ready to find your <AccentUnderline tone="dark">path</AccentUnderline>?
          </h2>

          <p className="final-sign-in-desc">
            Sign in to get a roadmap built for your major, track your progress, and
            discover resources picked for where you are right now.
          </p>

          <div className="final-sign-in-actions">
            <Link to="/auth" className="final-sign-in-btn">
              Sign in
              <span className="final-sign-in-btn-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>

          <p className="final-sign-in-footnote">Free for students · Takes under a minute</p>
        </div>
      </div>
    </section>
  );
}
