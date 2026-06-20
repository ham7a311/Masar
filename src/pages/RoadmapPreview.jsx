import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { AccentUnderline } from "../components/SectionAccent";
import TopicCard from "../components/dashboard/TopicCard";
import { getRoadmapForProfile } from "../data/roadmapTopics";
import { isPriorityTopic, sortTopicsByPriorityOrder } from "../utils/topicProgress";
import "../pages/dashboard-page.css";

const PREVIEW_PROFILE = {
  university: "GUtech (German University of Technology)",
  major: "Computer Science",
  year: "year-1-sem-1",
  currentStudyPeriod: "year-1-sem-1",
};

/** Demo priority — Programming Fundamentals first, same as a typical dashboard setup. */
const PREVIEW_PRIORITY_TOPICS = {
  "cs-1-101-programming-fundamentals": 1,
};

function RoadmapPreviewCard({ visible }) {
  const roadmap = useMemo(() => getRoadmapForProfile(PREVIEW_PROFILE), []);

  return (
    <div
      className={clsx(
        "roadmap-card group relative rounded-2xl border border-[rgba(15,23,42,0.10)] bg-white/75 p-6 shadow-[0_12px_40px_rgba(2,6,23,0.08)] backdrop-blur-md transition-[transform,box-shadow,border-color] duration-300 min-[920px]:p-7",
        visible && "roadmap-card-visible"
      )}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_20%_0%,rgba(124,58,237,0.06)_0%,transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/40" />

      <div className="relative mb-6 flex items-start justify-between gap-4 border-b border-[rgba(15,23,42,0.08)] pb-5">
        <div>
          <span className="mb-2 inline-block text-[11px] font-semibold tracking-[0.06em] text-[rgba(15,23,42,0.45)] uppercase">
            Career roadmap
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-heading text-[20px] font-bold tracking-[-0.02em] text-[#0F172A]">
              Computer Science
            </h3>
            <span className="roadmap-preview-chip">GUtech</span>
          </div>
        </div>
        <span className="roadmap-preview-chip">Preview</span>
      </div>

      <div className="roadmap-preview-topics relative">
        {roadmap.sections.map((section, sectionIndex) => (
          <div
            key={section.id}
            className={clsx("roadmap-phase", visible && "roadmap-phase-visible")}
            style={{ transitionDelay: `${200 + sectionIndex * 100}ms` }}
          >
            <div className="mb-3">
              <h4 className="font-heading text-[15px] font-bold text-[#0F172A]">
                {section.title}
              </h4>
              {section.description && (
                <p className="mt-1 text-[13px] text-[rgba(15,23,42,0.55)]">
                  {section.description}
                </p>
              )}
            </div>
            <div className="dash-topic-list">
              {sortTopicsByPriorityOrder(section.topics, PREVIEW_PRIORITY_TOPICS).map(
                (topic, topicIndex) => (
                <div
                  key={topic.id}
                  className={clsx("roadmap-item", visible && "roadmap-item-visible")}
                  style={{
                    transitionDelay: `${280 + sectionIndex * 100 + topicIndex * 60}ms`,
                  }}
                >
                  <TopicCard
                    topic={topic}
                    isPriority={isPriorityTopic(PREVIEW_PRIORITY_TOPICS, topic.id)}
                    onOpen={() => {}}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RoadmapPreview() {
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
      id="roadmap-preview"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#FAFAF9] py-[clamp(64px,10vw,112px)]"
      aria-labelledby="roadmap-preview-heading"
    >
      <div
        className="pointer-events-none absolute top-0 right-0 h-[480px] w-[480px] translate-x-1/4 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.05)_0%,transparent_65%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1200px] px-[clamp(16px,4vw,32px)]">
        <div className="grid grid-cols-1 items-center gap-10 min-[920px]:grid-cols-2 min-[920px]:gap-14">
          <div
            className={clsx(
              "roadmap-left max-w-[480px] min-[920px]:max-w-none",
              visible && "roadmap-left-visible"
            )}
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-[20px] border border-[rgba(124,58,237,0.2)] bg-[#EDE9FE] px-3.5 py-1.5 text-[13px] font-semibold tracking-[0.01em] text-[#6D28D9]">
              <span className="inline-block h-[7px] w-[7px] rounded-full bg-[#7C3AED] shadow-[0_0_0_2px_rgba(124,58,237,0.25)]" />
              Example roadmap
            </span>

            <h2
              id="roadmap-preview-heading"
              className="font-heading text-[clamp(32px,4vw,44px)] font-bold tracking-[-0.03em] text-[#0F172A]"
            >
              See your path <AccentUnderline>clearly</AccentUnderline>
            </h2>

            <p className="mt-4 text-[16px] leading-relaxed text-[rgba(15,23,42,0.55)]">
              Masar generates structured roadmaps based on your major and goals — so you
              always know what to focus on next.
            </p>
            <p className="mt-3 text-[16px] leading-relaxed text-[rgba(15,23,42,0.55)]">
              Each roadmap breaks down into steps, skills, and milestones — turning career
              uncertainty into a plan you can follow.
            </p>

            <ul className="mt-6 space-y-2.5">
              {[
                "Steps tailored to your major",
                "Skills mapped to each milestone",
                "Clear progression from basics to experience",
              ].map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-2.5 text-[14px] text-[rgba(15,23,42,0.62)]"
                >
                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgba(124,58,237,0.08)]">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                      <path
                        d="M2 5l2 2 4-4"
                        stroke="#7C3AED"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <RoadmapPreviewCard visible={visible} />
        </div>
      </div>
    </section>
  );
}
