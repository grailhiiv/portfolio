import type { Metadata } from "next";
import { Reveal, AnimatedHeading } from "@/components/animation";
import { FeaturedWork } from "@/components/featured-work";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Social media, brand growth, and email marketing campaigns for Daniel G. Miller, Melissa Castro, Caroline Montague, and Atlas Rose.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <main id="main-content">
      <section className="px-4 pt-10 md:pt-14 pb-12 md:pb-25">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-6">
          <div className="hidden md:block"></div>
          <AnimatedHeading
            className="text-2xl leading-[1.05] md:leading-[68px] tracking-[-2.56px]"
            words={[
              [
                { text: "S", className: "text-[#111111]" },
                { text: "o", className: "text-[#111111]" },
                { text: "c", className: "text-[#111111]" },
                { text: "i", className: "text-[#111111]" },
                { text: "a", className: "text-[#111111]" },
                { text: "l", className: "text-[#111111]" },
                { text: "\u00a0", className: "" },
              ],
              [
                { text: "m", className: "text-[#111111]" },
                { text: "e", className: "text-[#111111]" },
                { text: "d", className: "text-[#111111]" },
                { text: "i", className: "text-[#111111]" },
                { text: "a", className: "text-[#111111]" },
                { text: "\u00a0", className: "" },
              ],
              [
                { text: "a", className: "text-[#b2b2b2]" },
                { text: "n", className: "text-[#b2b2b2]" },
                { text: "d", className: "text-[#b2b2b2]" },
                { text: "\u00a0", className: "" },
              ],
              [
                { text: "m", className: "text-[#111111]" },
                { text: "a", className: "text-[#111111]" },
                { text: "r", className: "text-[#111111]" },
                { text: "k", className: "text-[#111111]" },
                { text: "e", className: "text-[#111111]" },
                { text: "t", className: "text-[#111111]" },
                { text: "i", className: "text-[#111111]" },
                { text: "n", className: "text-[#111111]" },
                { text: "g", className: "text-[#111111]" },
                { text: "\u00a0", className: "" },
              ],
              [
                { text: "p", className: "text-[#111111]" },
                { text: "r", className: "text-[#111111]" },
                { text: "o", className: "text-[#111111]" },
                { text: "j", className: "text-[#111111]" },
                { text: "e", className: "text-[#111111]" },
                { text: "c", className: "text-[#111111]" },
                { text: "t", className: "text-[#111111]" },
                { text: "s", className: "text-[#111111]" },
                { text: ",", className: "text-[#111111]" },
                { text: "\u00a0", className: "" },
              ],
              [
                { text: "w", className: "text-[#b2b2b2]" },
                { text: "i", className: "text-[#b2b2b2]" },
                { text: "t", className: "text-[#b2b2b2]" },
                { text: "h", className: "text-[#b2b2b2]" },
                { text: "\u00a0", className: "" },
              ],
              [
                { text: "r", className: "text-[#111111]" },
                { text: "e", className: "text-[#111111]" },
                { text: "s", className: "text-[#111111]" },
                { text: "u", className: "text-[#111111]" },
                { text: "l", className: "text-[#111111]" },
                { text: "t", className: "text-[#111111]" },
                { text: "s", className: "text-[#111111]" },
                { text: ".", className: "text-[#111111]" },
              ],
            ]}
          />
        </div>
      </section>
      <section
        className="px-4 pb-10 md:pb-12 border-gray-100"
        aria-labelledby="case-studies-heading"
      >
        <div className="max-w-5xl mx-auto">
          <h2
            id="case-studies-heading"
            className="text-lg leading-[36.4px] tracking-[-0.64px] text-black mb-6 md:mb-8"
          >
            Case studies
          </h2>
          <FeaturedWork />
        </div>
      </section>
    </main>
  );
}
