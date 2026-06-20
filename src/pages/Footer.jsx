import logo from "../assets/logo.png";
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
} from "../components/BrandIcons";

const EXPLORE_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Roadmap", href: "#roadmap-preview" },
  { label: "Community", href: "#community" },
  { label: "FAQ", href: "#faq" },
];

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/ham7a311__",
    Icon: InstagramIcon,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ham7a311/",
    Icon: LinkedInIcon,
  },
  {
    label: "GitHub",
    href: "https://github.com/ham7a311",
    Icon: ({ size }) => <GitHubIcon size={size} variant="light" />,
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-[#0B1220] pt-[clamp(56px,8vw,88px)] pb-8">
      <div
        className="pointer-events-none absolute top-0 left-1/2 h-px w-[min(720px,90%)] -translate-x-1/2 bg-[linear-gradient(90deg,transparent_0%,rgba(124,58,237,0.35)_50%,transparent_100%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1200px] px-[clamp(16px,4vw,32px)]">
        <div className="grid grid-cols-1 gap-10 min-[640px]:grid-cols-2 min-[920px]:grid-cols-4 min-[920px]:gap-12">
          {/* Brand */}
          <div className="min-[920px]:col-span-1">
            <a href="#top" className="mb-4 inline-flex items-center gap-2.5 transition-opacity hover:opacity-90">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <img src={logo} alt="" className="h-[26px] w-[26px] object-contain" />
              </span>
              <span className="font-heading text-[18px] font-semibold tracking-[-0.02em] text-white">
                Masar
              </span>
            </a>
            <p className="max-w-[260px] text-[14px] leading-relaxed text-[rgba(255,255,255,0.58)]">
              Helping students navigate future career paths
            </p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[rgba(124,58,237,0.2)] bg-[rgba(124,58,237,0.08)] px-2.5 py-1 text-[11px] font-medium text-[#C4B5FD]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#8B5CF6]" aria-hidden="true" />
              Early-stage project in active development
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 text-[11px] font-semibold tracking-[0.08em] text-[rgba(255,255,255,0.40)] uppercase">
              Explore
            </h3>
            <ul className="space-y-2.5">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="inline-flex items-center gap-2 text-[14px] text-[rgba(255,255,255,0.62)] transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Creator */}
          <div>
            <h3 className="mb-4 text-[11px] font-semibold tracking-[0.08em] text-[rgba(255,255,255,0.40)] uppercase">
              Creator
            </h3>
            <div className="space-y-1.5">
              <a
                href="https://github.com/ham7a311"
                target="_blank"
                rel="noopener noreferrer"
                className="font-heading text-[15px] font-bold text-white/90 transition-colors hover:text-white"
              >
                ham7a311
              </a>
              <p className="text-[13px] text-[rgba(255,255,255,0.50)]">© 2026 Masar</p>
              <p className="text-[13px] text-[rgba(255,255,255,0.42)]">Built independently</p>
            </div>
          </div>

          {/* Social / contact */}
          <div>
            <h3 className="mb-4 text-[11px] font-semibold tracking-[0.08em] text-[rgba(255,255,255,0.40)] uppercase">
              Connect
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.10] bg-white/[0.04] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-[rgba(124,58,237,0.30)] hover:bg-white/[0.07] hover:shadow-[0_0_20px_rgba(124,58,237,0.12)]"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
            <p className="mt-4 text-[12px] leading-relaxed text-[rgba(255,255,255,0.38)]">
              Reach out directly — feedback welcome while we build.
            </p>
          </div>
        </div>

        <div className="mt-[clamp(40px,6vw,56px)] border-t border-white/[0.06] pt-6">
          <p className="text-center text-[12px] text-[rgba(255,255,255,0.35)]">
            Masar is currently under active development. Built for students, evolving continuously.
          </p>
        </div>
      </div>
    </footer>
  );
}
