import { useEffect, useState } from "react";

const MOBILE_PAGE_SIZE = 6;
const DESKTOP_PAGE_SIZE = 9;
const BREAKPOINT = 768;

export function usePageSize() {
  const [pageSize, setPageSize] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < BREAKPOINT
      ? MOBILE_PAGE_SIZE
      : DESKTOP_PAGE_SIZE
  );

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${BREAKPOINT - 1}px)`);

    const update = () => {
      setPageSize(media.matches ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE);
    };

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return pageSize;
}
