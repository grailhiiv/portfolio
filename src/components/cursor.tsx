"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { useEffect, useState } from "react";

export default function Cursor({ primary = true }: { primary?: boolean }) {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { stiffness: 120, damping: 18, mass: 1 });
  const springY = useSpring(y, { stiffness: 120, damping: 18, mass: 1 });
  const [visible, setVisible] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const pointer = window.matchMedia("(pointer: fine)");
    let active = false;
    const interactiveTarget = (target: EventTarget | null) =>
      target instanceof Element &&
      !!target.closest('a, button, [role="button"], label, select, input');
    const move = (event: MouseEvent) => {
      if (!pointer.matches) return;
      x.set(event.clientX);
      y.set(event.clientY);
      if (!active) {
        active = true;
        if (primary) document.documentElement.dataset.pointer = "ready";
        setVisible(true);
        setInteractive(interactiveTarget(event.target));
      }
    };
    const over = (event: MouseEvent) => {
      if (active && pointer.matches) setInteractive(interactiveTarget(event.target));
    };
    const leave = () => {
      active = false;
      setVisible(false);
      if (primary) delete document.documentElement.dataset.pointer;
    };
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Tab") leave();
    };
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    window.addEventListener("blur", leave);
    window.addEventListener("keydown", keyboard);
    pointer.addEventListener("change", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.documentElement.removeEventListener("mouseleave", leave);
      window.removeEventListener("blur", leave);
      window.removeEventListener("keydown", keyboard);
      pointer.removeEventListener("change", leave);
      if (primary) delete document.documentElement.dataset.pointer;
    };
  }, [x, y, primary]);

  return (
    <div
      className="cursor fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: "exclusion" }}
    >
      <motion.div
        style={{
          x: reduced ? x : springX,
          y: reduced ? y : springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{ width: 40, height: 40, opacity: visible ? 0.25 : 0 }}
        transition={{ duration: 0.2 }}
        className="fixed top-0 left-0 rounded-full bg-white pointer-events-none"
      />
      <motion.div
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: interactive ? 44 : 16,
          height: interactive ? 44 : 16,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="fixed top-0 left-0 rounded-full bg-white pointer-events-none"
      />
    </div>
  );
}
