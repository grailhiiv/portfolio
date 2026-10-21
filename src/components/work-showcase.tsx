"use client";

import { useEffect, useRef } from "react";
import Image, { type StaticImageData } from "next/image";
import { ShowcaseVideo } from "@/components/showcase-video";

export type ShowcaseItem =
  | { image: StaticImageData; alt: string }
  | { video: string; poster: string; alt: string };

export function WorkShowcase({
  columns,
  label,
}: {
  columns: ShowcaseItem[][];
  label: string;
}) {
  const showcaseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tracks = showcaseRef.current?.querySelectorAll<HTMLElement>(".work-showcase-track");
    if (!tracks) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const track = entry.target.parentElement;
        if (track) track.style.animationDuration = `${entry.target.getBoundingClientRect().height / 70}s`;
      }
    });
    tracks.forEach((track) => {
      const group = track.querySelector<HTMLElement>(".work-showcase-group");
      if (group) observer.observe(group);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="work-showcase-showcase" ref={showcaseRef}>
      <div className="work-showcase-window" role="region" aria-label={label}>
        {columns.map((posts, column) => (
          <div className="work-showcase-column" key={column}>
            <div className="work-showcase-track">
              {[0, 1].map((copy) => (
                <div
                  className="work-showcase-group"
                  key={copy}
                  aria-hidden={copy === 1 ? true : undefined}
                >
                  {[...posts, ...posts].map((item, index) =>
                    "video" in item ? (
                      <ShowcaseVideo
                        key={index}
                        src={item.video}
                        poster={item.poster}
                        label={item.alt}
                        duplicate={copy !== 0 || index >= posts.length}
                      />
                    ) : (
                      <Image
                        key={index}
                        src={item.image}
                        alt={copy === 0 && index < posts.length ? item.alt : ""}
                        data-duplicate={copy !== 0 || index >= posts.length}
                        className="work-showcase-post"
                        sizes="(max-width: 767px) 50vw, 25vw"
                        loading="eager"
                      />
                    ),
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
