"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import animationData from "@/data/not-found.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function NotFoundAnimation() {
  const reducedMotion = useReducedMotion();
  return <div className="not-found__animation" aria-hidden="true"><Lottie animationData={animationData} loop={!reducedMotion} autoplay={!reducedMotion} /></div>;
}
