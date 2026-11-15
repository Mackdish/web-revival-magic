import { useEffect, useRef, type ReactNode } from "react";
import { useLocation } from "@tanstack/react-router";

/** Progressive enhancement: content stays visible without JavaScript. */
export function ScrollAnimations({ children }: { children: ReactNode }) {
  const mainRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const main = mainRef.current;
    if (!main || !("IntersectionObserver" in window)) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    let targets: HTMLElement[] = [];

    const clear = () => {
      observer?.disconnect();
      targets.forEach((element) => {
        element.removeAttribute("data-scroll-reveal");
        element.removeAttribute("data-scroll-delay");
      });
      targets = [];
    };

    const prepare = () => {
      clear();
      if (motion.matches) return;

      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || !(entry.target instanceof HTMLElement)) return;
          entry.target.dataset["scrollReveal"] = "visible";
          observer?.unobserve(entry.target);
        });
      }, { threshold: 0, rootMargin: "0px 0px -48px 0px" });

      main.querySelectorAll<HTMLElement>("section").forEach((section, sectionIndex) => {
        // Keep the first screen immediately visible, including its existing entrance animation.
        if (sectionIndex === 0) return;
        const container = section.firstElementChild;
        if (!(container instanceof HTMLElement)) return;
        const items = Array.from(container.children).flatMap((child) =>
          child.classList.contains("grid") ? Array.from(child.children) : [child],
        );
        items.forEach((item, index) => {
          if (!(item instanceof HTMLElement) || item.getBoundingClientRect().top < window.innerHeight) return;
          item.dataset["scrollReveal"] = "pending";
          item.dataset["scrollDelay"] = String(index % 4);
          targets.push(item);
          observer?.observe(item);
        });
      });
    };

    prepare();
    motion.addEventListener("change", prepare);
    return () => {
      clear();
      motion.removeEventListener("change", prepare);
    };
  }, [pathname]);

  return <main ref={mainRef} id="main-content" className="pb-16 sm:pb-0">{children}</main>;
}