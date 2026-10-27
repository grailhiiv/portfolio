"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type MouseEvent } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "#contact", label: "Contact" },
];

function Brand() {
  return (
    <Link className="brand" href="/" aria-label="GrailHiiv home">
      <Image className="brand-mark" src="/images/grailhiiv-logo.svg" alt="" width={32} height={34} />
      <span className="text-md font-medium leading-none">GrailHiiv</span>
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const previousY = useRef(0);
  const frame = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 80) setVisible(false);
      else if (y !== previousY.current) setVisible(y < previousY.current);
      previousY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const stopScroll = () => cancelAnimationFrame(frame.current);
    window.addEventListener("wheel", stopScroll, { passive: true });
    window.addEventListener("touchstart", stopScroll, { passive: true });
    window.addEventListener("keydown", stopScroll);
    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", stopScroll);
      window.removeEventListener("touchstart", stopScroll);
      window.removeEventListener("keydown", stopScroll);
    };
  }, []);

  useEffect(() => {
    // A contact animation must not continue scrolling the next route.
    return () => cancelAnimationFrame(frame.current);
  }, [pathname]);

  function contact(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (href !== "#contact") return;
    if (
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const target = document.getElementById("contact");
    if (!target) return;
    event.preventDefault();
    cancelAnimationFrame(frame.current);
    if (window.location.hash !== "#contact") {
      window.history.pushState(window.history.state, "", "#contact");
    }
    target.focus({ preventScroll: true });
    const startY = window.scrollY;
    const distance = target.getBoundingClientRect().top;
    if (reduced) {
      window.scrollTo(0, startY + distance);
      return;
    }
    let start: number | undefined;
    const step = (time: number) => {
      start ??= time;
      const progress = Math.min((time - start) / 900, 1);
      window.scrollTo(0, startY + distance * (1 - (1 - progress) ** 3));
      if (progress < 1) frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
  }

  const nav = (
    <nav aria-label="Main navigation" className="flex gap-4 md:gap-5 shrink-0">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          aria-current={
            pathname === href
              ? "page"
              : href === "/work" && pathname.startsWith("/work/")
                ? "location"
                : undefined
          }
          onClick={(event) => contact(event, href)}
          className={`transition-colors text-sm md:text-md ${pathname === href || (href === "/work" && pathname.startsWith("/work/")) ? "text-[#111111]" : "text-gray-400 hover:text-[#111111]"}`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      <header className="header px-4 py-4 border-b border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 items-start md:items-end justify-between gap-4">
          <div className="flex flex-col">
            <Brand />
          </div>
          <div className="md:justify-end flex">{nav}</div>
        </div>
      </header>
      <motion.header
        initial={{ y: "-100%" }}
        animate={{ y: visible ? 0 : "-100%" }}
        transition={{
          duration: reduced ? 0 : 0.35,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        inert={!visible}
        className="header fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-4 py-4"
      >
        <div className="max-w-5xl mx-auto flex-col md:flex-row flex md:items-center gap-2 justify-between">
          <Brand />
          {nav}
        </div>
      </motion.header>
    </>
  );
}
