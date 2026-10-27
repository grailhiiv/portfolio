"use client";

import { useEffect, useRef, type ReactNode } from "react";

const frames = [
  { opacity: 0, transform: "translateY(18px)" },
  { opacity: 1, transform: "translateY(0)" },
];
const easing = "cubic-bezier(.25,.1,.25,1)";

// Visible server HTML remains readable even when JavaScript is unavailable.
export function Reveal({
  children,
  className,
  immediate = false,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  immediate?: boolean;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!element || preference.matches) return;
    let animation: Animation | undefined;
    const play = () => {
      animation = element.animate(frames, {
        duration: 600,
        delay: delay * 1000,
        easing,
        fill: "backwards",
      });
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          play();
          observer.disconnect();
        }
      },
      { rootMargin: "-40px" },
    );
    if (immediate) play();
    else observer.observe(element);
    const onPreference = () => {
      if (preference.matches) {
        animation?.cancel();
        observer.disconnect();
      }
    };
    preference.addEventListener("change", onPreference);
    return () => {
      animation?.cancel();
      observer.disconnect();
      preference.removeEventListener("change", onPreference);
    };
  }, [immediate, delay]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function AnimatedHeading({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) return;
    const animation = ref.current?.animate(frames, {
      duration: 600,
      easing,
      fill: "backwards",
    });
    const cancel = () => animation?.cancel();
    const onPreference = () => {
      if (preference.matches) cancel();
    };
    preference.addEventListener("change", onPreference);
    return () => {
      cancel();
      preference.removeEventListener("change", onPreference);
    };
  }, []);
  return (
    <h1 ref={ref} className={className}>{children}</h1>
  );
}
