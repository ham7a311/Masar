export const THEME_STORAGE_KEY = "masar-theme";

export function getStoredTheme() {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return "light";
}

export function applyTheme(theme) {
  if (typeof document === "undefined") return;
  const isDark = theme === "dark";
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
}

export function themeFromProfile(profile) {
  if (profile?.darkMode === true) return "dark";
  if (profile?.darkMode === false) return "light";
  return null;
}
