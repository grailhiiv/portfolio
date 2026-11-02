"use client";

import { useEffect, useRef, useState } from "react";

const videos = [
  { id: "caroline", name: "Caroline Montague", service: "Social Media Strategy & Brand Growth", value: "0 → 171K", result: "TikTok Followers in 16 Months" },
  { id: "daniel", name: "Daniel G. Miller", service: "Social Media Management", value: "57,680", result: "Social Media Views in 3 Months" },
  { id: "melissa", name: "Melissa Castro", service: "Email & Social Media Marketing", value: "112%", result: "Pre-Order Goal in 30 Days" },
];

export function Testimonials() {
  const [active, setActive] = useState(0);
  const [muted, setMuted] = useState(true);
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const element = carouselRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(element);
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    const video = refs.current[active];
    if (!video) return;
    if (visible && pageVisible) void video.play().catch(() => {});
    else video.pause();
    return () => video.pause();
  }, [active, visible, pageVisible]);

  return (
    <div ref={carouselRef} className="testimonial-carousel" aria-label="Client testimonials">
      <div className="testimonial-track" style={{ transform: `translateX(calc(-${active} * (50% + 8px)))` }}>
        {[...videos, videos[0]].map((item, index) => (
          <div className="testimonial-item" key={`${item.id}-${index}`}>
            <button type="button" className="testimonial-card" onClick={() => setMuted(value => !value)} aria-label={`${muted ? "Enable" : "Mute"} sound for testimonials`}>
              <video ref={index < videos.length ? (node) => { refs.current[index] = node; } : undefined} className="testimonial-video" src={`/videos/testimonials/${item.id}-testi.mp4`} muted={muted} playsInline preload="metadata" aria-label={`${item.name} testimonial`} onEnded={(event) => { event.currentTarget.currentTime = 0; setActive((index + 1) % videos.length); }} />
            </button>
            <h3 className="text-sm font-medium text-[#111111]">{item.name}</h3>
            <p className="work-card-sublabel text-gray-400 mt-0.5">{item.service}</p>
            <p className="video-preview-card-result"><span className="video-preview-card-result-value">{item.value}</span><span className="video-preview-card-result-label">{item.result}</span></p>
          </div>
        ))}
      </div>
      <span className="testimonial-sound" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5 6 9H3v6h3l5 4V5Z" />
          {muted ? <path d="m16 9 5 6m0-6-5 6" /> : <><path d="M15 9a4 4 0 0 1 0 6" /><path d="M18 6a8 8 0 0 1 0 12" /></>}
        </svg>
      </span>
    </div>
  );
}
