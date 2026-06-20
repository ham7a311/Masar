import {
  Briefcase,
  Palette,
  Sparkles,
  Users,
  Wrench,
  BookOpen,
} from "lucide-react";

export const CATEGORY_ICONS = {
  Tools: Wrench,
  Design: Palette,
  AI: Sparkles,
  Learning: BookOpen,
  Community: Users,
  Career: Briefcase,
};

export const CATEGORY_COLORS = {
  Tools: "#7C3AED",
  Design: "#DB2777",
  AI: "#2563EB",
  Learning: "#059669",
  Community: "#D97706",
  Career: "#0F172A",
};

export function pricingBadgeClass(pricing) {
  if (pricing === "Free") return "resources-badge-pricing-free";
  if (pricing === "Paid") return "resources-badge-pricing-paid";
  return "resources-badge-pricing-freemium";
}

export function priorityBadgeClass(priority) {
  if (priority === "Essential") return "resources-badge-priority-essential";
  if (priority === "Recommended") return "resources-badge-priority-recommended";
  return "resources-badge-priority-optional";
}

export function getPageNumbers(totalPages, currentPage) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set([1, totalPages, currentPage]);

  if (currentPage > 1) pages.add(currentPage - 1);
  if (currentPage < totalPages) pages.add(currentPage + 1);

  if (currentPage <= 3) {
    pages.add(2);
    pages.add(3);
  }

  if (currentPage >= totalPages - 2) {
    pages.add(totalPages - 1);
    pages.add(totalPages - 2);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result = [];

  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) {
      result.push("ellipsis");
    }
    result.push(page);
  });

  return result;
}
