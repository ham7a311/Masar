import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { DiscordIcon, WhatsAppIcon } from "../components/BrandIcons";
import { AccentUnderline } from "../components/SectionAccent";

const GROUPS = [
  {
    name: "Computer Science — Year 1",
    stat: "Active now",
    statType: "active",
    platform: "whatsapp",
    avatars: [
      { bg: "#7C3AED", label: "SA" },
      { bg: "#4338CA", label: "MK" },
      { bg: "#6D28D9", label: "LR" },
    ],
  },
  {
    name: "Business Administration — Year 2",
    stat: "98 members",
    statType: "members",
    platform: "discord",
    avatars: [
      { bg: "#8B5CF6", label: "NH" },
      { bg: "#0F172A", label: "OT" },
      { bg: "#7C3AED", label: "FA" },
    ],
  },
  {
    name: "Engineering Students — University of X",
    stat: "156 members",
    statType: "members",
    platform: "both",
    avatars: [
      { bg: "#6D28D9", label: "AM" },
      { bg: "#4338CA", label: "YK" },
      { bg: "#7C3AED", label: "JD" },
      { bg: "#0F172A", label: "RS" },
    ],
  },
  {
    name: "Freshman Career Explorers",
    stat: "Active now",
    statType: "active",
    platform: "whatsapp",
    avatars: [
      { bg: "#7C3AED", label: "EL" },
      { bg: "#6D28D9", label: "TM" },
      { bg: "#4338CA", label: "ZK" },
    ],
  },
];

function AvatarStack({ avatars }) {
  return (
    <div className="community-avatars flex items-center transition-transform duration-300 group-hover:scale-[1.03]">
      {avatars.map((a, i) => (
        <span
          key={a.label}
          className="community-avatar inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0F172A] text-[9px] font-semibold text-white"
          style={{ background: a.bg, marginLeft: i === 0 ? 0 : -8, zIndex: avatars.length - i }}
        >
          {a.label}
        </span>
      ))}
    </div>
  );
}

function GroupCard({ group, index, visible }) {
  const isActive = group.statType === "active";
  return (
    <article
      className={clsx(
        "community-group group flex items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.05] p-4 backdrop-blur-sm transition-[transform,box-shadow,border-color,background] duration-300",
        visible && "community-group-visible"
      )}
      style={{ transitionDelay: `${180 + index * 90}ms` }}
    >
      <AvatarStack avatars={group.avatars} />

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-heading text-[14px] font-bold tracking-[-0.01em] text-white/90">
          {group.name}
        </h3>
        <div className="mt-1 flex items-center gap-2">
          {isActive && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[rgba(255,255,255,0.5)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#34D399] shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
              {group.stat}
            </span>
          )}
          {!isActive && (
            <span className="text-[11px] font-medium text-[rgba(255,255,255,0.45)]">{group.stat}</span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 opacity-70 transition-opacity duration-300 group-hover:opacity-100">
        {(group.platform === "whatsapp" || group.platform === "both") && (
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.06]">
            <WhatsAppIcon size={14} />
          </span>
        )}
        {(group.platform === "discord" || group.platform === "both") && (
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.06]">
            <DiscordIcon size={14} />
          </span>
        )}
      </div>
    </article>
  );
}

function CommunityPanel({ visible }) {
  return (
    <div
      className={clsx(
        "community-panel relative rounded-2xl border border-white/[0.10] bg-white/[0.04] p-5 shadow-[0_16px_48px_rgba(0,0,0,0.25)] backdrop-blur-md min-[920px]:p-6",
        visible && "community-panel-visible"
      )}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_80%_0%,rgba(124,58,237,0.12)_0%,transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.06]" />

      <div className="relative mb-5 flex items-center justify-between border-b border-white/[0.08] pb-4">
        <div>
          <span className="text-[11px] font-semibold tracking-[0.06em] text-[rgba(255,255,255,0.45)] uppercase">
            Your groups
          </span>
          <p className="mt-1 font-heading text-[16px] font-bold text-white/90">Suggested communities</p>
        </div>
        <div className="flex items-center gap-1.5 opacity-60">
          <WhatsAppIcon size={16} />
          <DiscordIcon size={16} />
        </div>
      </div>

      <div className="relative space-y-3">
        {GROUPS.map((group, i) => (
          <GroupCard key={group.name} group={group} index={i} visible={visible} />
        ))}
      </div>
    </div>
  );
}

export default function StudentCommunity() {
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
      id="community"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0F172A] py-[clamp(64px,10vw,112px)]"
      aria-labelledby="community-heading"
    >
      {/* Top blend from previous light section */}
      <div
        className="pointer-events-none absolute top-0 right-0 left-0 h-24 bg-[linear-gradient(to_bottom,#FAFAF9_0%,transparent_100%)]"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute top-1/3 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.10)_0%,transparent_65%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1200px] px-[clamp(16px,4vw,32px)]">
        <div className="grid grid-cols-1 items-center gap-10 min-[920px]:grid-cols-2 min-[920px]:gap-14">
          {/* Left — message */}
          <div className={clsx("community-left", visible && "community-left-visible")}>
            <span className="mb-4 inline-flex items-center gap-2 rounded-[20px] border border-[rgba(124,58,237,0.35)] bg-[rgba(124,58,237,0.12)] px-3.5 py-1.5 text-[13px] font-semibold tracking-[0.01em] text-[#C4B5FD]">
              <span className="inline-block h-[7px] w-[7px] rounded-full bg-[#8B5CF6] shadow-[0_0_0_2px_rgba(139,92,246,0.35)]" />
              Community-driven learning
            </span>

            <h2
              id="community-heading"
              className="font-heading text-[clamp(32px,4vw,44px)] font-bold tracking-[-0.03em] text-white"
            >
              Learn with people <AccentUnderline tone="dark">like you</AccentUnderline>
            </h2>

            <p className="mt-4 text-[16px] leading-relaxed text-[rgba(255,255,255,0.62)]">
              You&apos;re not figuring it out alone. Students are grouped by university, major, and
              academic year — so you connect with peers on the same path.
            </p>
            <p className="mt-3 text-[16px] leading-relaxed text-[rgba(255,255,255,0.62)]">
              Share experiences, stay motivated, and grow together through structured communities on
              WhatsApp and Discord.
            </p>

            <p className="mt-6 text-[14px] font-medium text-[rgba(255,255,255,0.40)] italic">
              &ldquo;You&apos;re not figuring it out alone.&rdquo;
            </p>
          </div>

          {/* Right — community preview */}
          <CommunityPanel visible={visible} />
        </div>
      </div>
    </section>
  );
}
