"use client";

import { useEffect, useState } from "react";

export default function Footer() {
  const [clock, setClock] = useState({ date: "", time: "" });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setClock({
        date: now.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
          timeZone: "Asia/Manila",
        }),
        time: now.toLocaleTimeString("en-PH", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Manila",
        }),
      });
    };
    update();
    const timer = setInterval(update, 30_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer
      id="contact"
      tabIndex={-1}
      className="bg-gray-100 px-4 pt-10 md:pt-16 pb-10 md:pb-12"
    >
      <div className="max-w-5xl mx-auto flex flex-col gap-16 md:gap-64">
        <div>
          <h2 className="text-2xl font-light leading-[1.1] tracking-[-2px] md:tracking-[-2.56px] text-[#111111]">
            {"Have a project in mind?"}
            <br />
            {"Let's talk."}
          </h2>
          <a
            href="mailto:social@grailhiiv.com"
            className="footer-email block text-2xl font-light text-[#b2b2b2] hover:text-[#111111] transition-colors"
          >
            {"social@grailhiiv.com"}
          </a>
        </div>
        <div className="flex flex-col gap-6 items-start">
          <a
            href="https://www.linkedin.com/in/grailordsmm/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Grailord Antonio on LinkedIn (opens in new tab)"
            className="block text-2xl font-light text-[#b2b2b2] hover:text-[#111111] transition-colors"
          >
            {"LinkedIn"}
          </a>
          <p className="text-2xl font-light text-[#b2b2b2]">
            {clock.date} — {clock.time} PHT
          </p>
        </div>
      </div>
    </footer>
  );
}
