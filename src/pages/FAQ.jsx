import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { AccentUnderline } from "../components/SectionAccent";

const FAQ_ITEMS = [
  {
    question: "What is Masar?",
    answer:
      "Masar is a platform that helps students understand career paths, required skills, and structured learning roadmaps based on their major and interests.",
  },
  {
    question: "Is Masar only for computer science students?",
    answer:
      "No. Masar supports multiple majors including business, engineering, health, and more. The goal is to guide students across different fields.",
  },
  {
    question: "How does Masar create roadmaps?",
    answer:
      "Masar organizes career information into structured learning paths based on industry requirements, skills, and real-world expectations for each field.",
  },
  {
    question: "Is Masar free to use?",
    answer:
      "Yes, the core features are designed to be accessible for students.",
  },
  {
    question: "Does Masar give direct job placements?",
    answer:
      "No. Masar does not provide jobs. It helps you understand what to learn, what skills are needed, and how to prepare for your chosen career path.",
  },
  {
    question: "How is this different from just searching online?",
    answer:
      "Instead of scattered information, Masar organizes everything into clear step-by-step roadmaps tailored to your major and goals, saving time and confusion.",
  },
  {
    question: "Can I join communities through Masar?",
    answer:
      "Yes. Masar connects students through WhatsApp and Discord groups based on university, major, and year.",
  },
];

function FaqItem({ item, index, isOpen, onToggle, visible }) {
  const contentId = `faq-answer-${index}`;
  const buttonId = `faq-question-${index}`;

  return (
    <article
      className={clsx(
        "faq-item rounded-xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm transition-[border-color,box-shadow,background] duration-300",
        isOpen && "faq-item-open border-[rgba(124,58,237,0.28)] bg-white/[0.06]",
        visible && "faq-item-visible"
      )}
      style={{ transitionDelay: `${100 + index * 60}ms` }}
    >
      <button
        id={buttonId}
        type="button"
        className="faq-trigger flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-200 hover:bg-white/[0.03] min-[520px]:px-6 min-[520px]:py-[18px]"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={onToggle}
      >
        <span className="font-heading text-[15px] font-bold leading-snug text-white/90 min-[520px]:text-[16px]">
          {item.question}
        </span>
        <span
          className={clsx(
            "faq-chevron inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.10] bg-white/[0.05] text-[rgba(255,255,255,0.55)] transition-[transform,background,border-color,color] duration-300",
            isOpen && "rotate-180 border-[rgba(124,58,237,0.25)] bg-[rgba(124,58,237,0.12)] text-[#C4B5FD]"
          )}
          aria-hidden="true"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M3.5 5.25L7 8.75l3.5-3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      <div
        id={contentId}
        role="region"
        aria-labelledby={buttonId}
        className={clsx("faq-answer-wrap", isOpen && "faq-answer-open")}
      >
        <div className="faq-answer-inner overflow-hidden">
          <p className="px-5 pb-5 text-[14px] leading-relaxed text-[rgba(255,255,255,0.58)] min-[520px]:px-6 min-[520px]:pb-[22px] min-[520px]:text-[15px]">
            {item.answer}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function FAQ() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(0);

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
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleToggle = (index) => {
    setOpenIndex((current) => (current === index ? -1 : index));
  };

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0F172A] py-[clamp(64px,10vw,112px)]"
      aria-labelledby="faq-heading"
    >
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-[480px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.08)_0%,transparent_65%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[720px] px-[clamp(16px,4vw,32px)]">
        {/* Header */}
        <div
          className={clsx(
            "faq-header mb-10 text-center min-[520px]:mb-12",
            visible && "faq-header-visible"
          )}
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-[20px] border border-[rgba(124,58,237,0.35)] bg-[rgba(124,58,237,0.12)] px-3.5 py-1.5 text-[13px] font-semibold tracking-[0.01em] text-[#C4B5FD]">
            <span className="inline-block h-[7px] w-[7px] rounded-full bg-[#8B5CF6] shadow-[0_0_0_2px_rgba(139,92,246,0.35)]" />
            FAQ
          </span>
          <h2
            id="faq-heading"
            className="font-heading text-[clamp(28px,4vw,40px)] font-bold tracking-[-0.03em] text-white"
          >
            Frequently asked <AccentUnderline tone="dark">questions</AccentUnderline>
          </h2>
          <p className="mx-auto mt-3 max-w-[480px] text-[15px] leading-relaxed text-[rgba(255,255,255,0.55)]">
            Clear answers to common questions — so you can explore Masar with confidence.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => (
            <FaqItem
              key={item.question}
              item={item}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
              visible={visible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
