import { useEffect } from "react";

export function useMobileViewport() {
  useEffect(() => {
    const setHeight = () => {
      const vh = window.visualViewport?.height || window.innerHeight;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
      document.body.style.height = `${vh}px`;
    };

    setHeight();
    window.visualViewport?.addEventListener("resize", setHeight);
    window.addEventListener("orientationchange", setHeight);

    return () => {
      window.visualViewport?.removeEventListener("resize", setHeight);
      window.removeEventListener("orientationchange", setHeight);
    };
  }, []);
}