"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
const animations = [
  () => import("@/data/service-0.json"),
  () => import("@/data/service-1.json"),
  () => import("@/data/service-2.json"),
  () => import("@/data/service-3.json"),
  () => import("@/data/addons-1.json"),
  () => import("@/data/addons-3.json"),
  () => import("@/data/addons-4.json"),
  () => import("@/data/addons-2.json"),
];

export default function ServiceIcon({ index }: { index: number }) {
  const reduced = useReducedMotion();
  const container = useRef<HTMLDivElement>(null);
  const [animationData, setAnimationData] = useState<unknown>(null);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    let cancelled = false;
    setAnimationData(null);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      void animations[index]().then((module) => {
        if (!cancelled) setAnimationData(module.default);
      }).catch((error) => {
        if (!cancelled) console.error("Unable to load service animation", error);
      });
    }, { rootMargin: "200px" });
    observer.observe(element);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [index]);

  return (
    <div ref={container} className="w-20 h-20 md:w-25 md:h-25 mt-6" aria-hidden="true">
      {animationData !== null && <Lottie
        animationData={animationData}
        loop={!reduced}
        autoplay={!reduced}
        style={{ width: "100%", height: "100%" }}
      />}
    </div>
  );
}
