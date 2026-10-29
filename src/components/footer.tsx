"use client";

import { useEffect, useState } from "react";

export default function Footer() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-PH", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Manila",
        }));
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
            <a
              href="mailto:social@grailhiiv.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Email Grailhiiv (opens in a new tab)"
              className="text-[#b2b2b2] hover:text-[#111111] transition-colors"
            >
              Email me.
            </a>
          </h2>
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
            © 2026 — {time} PHT
          </p>
        </div>
      </div>
    </footer>
  );
}
