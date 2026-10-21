"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

export function VideoPreviewCard({
  image,
  sizes,
  title,
  description,
  href,
  video,
  poster,
  result,
}: {
  image: StaticImageData;
  sizes: string;
  title: string;
  description: string;
  href: string;
  video: string;
  poster: string;
  result: { value: string; label: string };
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const wanted = useRef(false);
  const [playing, setPlaying] = useState(false);

  function stop() {
    wanted.current = false;
    setPlaying(false);
    const element = ref.current;
    if (element) {
      element.pause();
      if (element.readyState > 0) element.currentTime = 0;
    }
  }

  function start() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    wanted.current = true;
    void ref.current?.play().catch(() => setPlaying(false));
  }

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onPreference = () => {
      if (preference.matches) stop();
    };
    const onVisibility = () => {
      if (document.hidden) stop();
    };
    preference.addEventListener("change", onPreference);
    document.addEventListener("visibilitychange", onVisibility);
    const element = ref.current;
    return () => {
      preference.removeEventListener("change", onPreference);
      document.removeEventListener("visibilitychange", onVisibility);
      element?.pause();
    };
  }, []);

  return (
    <Link
      className="block group video-preview-card"
      href={href}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") start();
      }}
      onPointerLeave={stop}
      onFocus={(event) => {
        if (event.currentTarget.matches(":focus-visible")) start();
      }}
      onBlur={stop}
    >
      <div className="aspect-[3/4] bg-gray-50 overflow-hidden rounded-lg relative mb-3">
        <Image
          alt={title}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          sizes={sizes}
          src={image}
          quality={90}
          fill
        />
        <video
          ref={ref}
          className="video-preview-card-video"
          data-playing={playing}
          src={video}
          poster={poster}
          width={720}
          height={1280}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          onPlaying={() => {
            if (wanted.current) setPlaying(true);
            else ref.current?.pause();
          }}
          onError={() => setPlaying(false)}
        />
        <div className="video-preview-card-result">
          <span className="video-preview-card-result-value">{result.value}</span>{" "}
          <span className="video-preview-card-result-label">{result.label}</span>
        </div>
      </div>
      <h3 className="text-sm font-medium text-[#111111]">{title}</h3>
      <p className="work-card-sublabel text-gray-400 mt-0.5">{description}</p>
    </Link>
  );
}
