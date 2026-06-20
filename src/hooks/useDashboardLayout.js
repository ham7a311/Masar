import { useEffect, useState } from "react";

const PHONE_QUERY = "(max-width: 639px)";
const TABLET_QUERY = "(max-width: 899px)";

function getLayout() {
  if (typeof window === "undefined") return "desktop";
  if (window.matchMedia(PHONE_QUERY).matches) return "phone";
  if (window.matchMedia(TABLET_QUERY).matches) return "tablet";
  return "desktop";
}

/**
 * @returns {"phone" | "tablet" | "desktop"}
 */
export function useDashboardLayout() {
  const [layout, setLayout] = useState(getLayout);

  useEffect(() => {
    const phoneMq = window.matchMedia(PHONE_QUERY);
    const tabletMq = window.matchMedia(TABLET_QUERY);

    const update = () => setLayout(getLayout());

    phoneMq.addEventListener("change", update);
    tabletMq.addEventListener("change", update);
    update();

    return () => {
      phoneMq.removeEventListener("change", update);
      tabletMq.removeEventListener("change", update);
    };
  }, []);

  return layout;
}
