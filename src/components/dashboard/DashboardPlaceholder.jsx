import { Map, Users, BookOpen } from "lucide-react";

const COPY = {
  roadmaps: {
    icon: Map,
    title: "Roadmaps",
    description:
      "Saved and full degree paths will live here — browse structured career journeys tailored to your field.",
    hint: "Coming soon",
  },
  community: {
    icon: Users,
    title: "Community",
    description:
      "Connect with students from your university — WhatsApp groups, Discord channels, and peer circles.",
    hint: "Coming soon",
  },
  resources: {
    icon: BookOpen,
    title: "Resources",
    description:
      "Curated learning materials, guides, and links to help you move through your roadmap faster.",
    hint: "Coming soon",
  },
};

export default function DashboardPlaceholder({ view }) {
  const { icon: Icon, title, description, hint } = COPY[view] || COPY.roadmaps;

  return (
    <div className="dash-placeholder dash-fade-up">
      <div className="dash-placeholder-icon" aria-hidden="true">
        <Icon size={28} strokeWidth={1.75} />
      </div>
      <span className="dash-placeholder-badge">{hint}</span>
      <h1 className="dash-page-title">{title}</h1>
      <p className="dash-page-subtitle">{description}</p>
    </div>
  );
}
