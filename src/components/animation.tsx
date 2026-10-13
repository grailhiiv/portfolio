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

type Character = { text: string; className: string };

export function AnimatedHeading({
  words,
  className,
}: {
  words: Character[][];
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const label = words
    .flatMap((word) => word.map((char) => char.text))
    .join("")
    .replaceAll("\u00a0", " ");
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) return;
    const animations = Array.from(
      ref.current?.querySelectorAll("[data-letter]") ?? [],
    ).map((element, index) =>
      element.animate(frames, {
        duration: 450,
        delay: 50 + index * 18,
        easing,
        fill: "backwards",
      }),
    );
    const cancel = () => animations.forEach((animation) => animation.cancel());
    const onPreference = () => {
      if (preference.matches) cancel();
    };
    preference.addEventListener("change", onPreference);
    return () => {
      cancel();
      preference.removeEventListener("change", onPreference);
    };
  }, [label]);
  return (
    <h1 ref={ref} className={className} aria-label={label}>
      {words.map((word, index) => (
        <span
          key={index}
          aria-hidden="true"
          style={{ display: "inline-block", whiteSpace: "nowrap" }}
        >
          {word.map((char, charIndex) => (
            <span
              key={charIndex}
              data-letter={char.text === "\u00a0" ? undefined : ""}
              className={char.className}
              style={{ display: "inline-block" }}
            >
              {char.text}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}
