"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import ux from "@/data/service-0.json";
import ui from "@/data/service-1.json";
import system from "@/data/service-2.json";
import accessibility from "@/data/service-3.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
const animations = [ux, ui, system, accessibility];

export default function ServiceIcon({ index }: { index: number }) {
  const reduced = useReducedMotion();
  return (
    <div className="w-20 h-20 md:w-25 md:h-25 mt-6" aria-hidden="true">
      <Lottie
        animationData={animations[index]}
        loop={!reduced}
        autoplay={!reduced}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
