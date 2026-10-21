"use client";

import { useEffect, useRef } from "react";

export function ShowcaseVideo({
  src,
  poster,
  label,
  duplicate,
}: {
  src: string;
  poster: string;
  label: string;
  duplicate: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const updatePlayback = () => {
      if (visible && !preference.matches && !document.hidden) {
        void video.play().catch(() => {
          // Keep the poster visible when the browser declines autoplay.
        });
      } else {
        video.pause();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updatePlayback();
    });
    observer.observe(video);
    preference.addEventListener("change", updatePlayback);
    document.addEventListener("visibilitychange", updatePlayback);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", updatePlayback);
      document.removeEventListener("visibilitychange", updatePlayback);
      video.pause();
    };
  }, []);

  return (
    <video
      ref={ref}
      className="work-showcase-post"
      src={src}
      poster={poster}
      width={720}
      height={1280}
      muted
      loop
      playsInline
      preload="none"
      aria-label={duplicate ? undefined : label}
      aria-hidden={duplicate || undefined}
      data-duplicate={duplicate}
    />
  );
}
