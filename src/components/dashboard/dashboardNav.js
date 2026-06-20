import { Compass, Map, Users, BookOpen, User } from "lucide-react";

export const DASHBOARD_NAV_ITEMS = [
  { id: "explore", label: "Explore your career path", shortLabel: "Explore", icon: Compass },
  { id: "roadmaps", label: "Roadmaps", shortLabel: "Roadmaps", icon: Map },
  { id: "community", label: "Community", shortLabel: "Community", icon: Users },
  { id: "resources", label: "Resources", shortLabel: "Resources", icon: BookOpen },
];

export const DASHBOARD_PROFILE_NAV = {
  id: "profile",
  label: "Profile",
  shortLabel: "Profile",
  icon: User,
};
