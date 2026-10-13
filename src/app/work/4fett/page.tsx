import { imageSizes } from "@/lib/image-sizes";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal, AnimatedHeading } from "@/components/animation";

export const metadata: Metadata = {
  title: "4fett Case Study — Arturo Spatino",
  description:
    "Product design and development for 4fett — a web app for Italian freelancers on the forfettario regime.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <main id="main-content">
      <section className="px-4 pt-10 md:pt-14 pb-10 md:pb-14">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-8">
          <div className="hidden md:block"></div>
          <div>
            <AnimatedHeading
              className="text-2xl leading-[1.05] tracking-[-2.56px] text-[#111111] mb-8"
              words={[
                [
                  { text: "4", className: "" },
                  { text: "f", className: "" },
                  { text: "e", className: "" },
                  { text: "t", className: "" },
                  { text: "t", className: "" },
                ],
              ]}
            />
            <div className="flex flex-wrap gap-x-8 gap-y-5">
              <Reveal immediate={true}>
                <p className="text-xs text-gray-400 mb-1">{"Year"}</p>
                <p className="text-sm text-[#111111]">{"2026"}</p>
              </Reveal>
              <Reveal immediate={true} delay={0.12}>
                <p className="text-xs text-gray-400 mb-1">{"Role"}</p>
                <p className="text-sm text-[#111111]">
                  {"Founder · Product Design & Development"}
                </p>
              </Reveal>
              <Reveal immediate={true} delay={0.24}>
                <p className="text-xs text-gray-400 mb-1">{"Type"}</p>
                <p className="text-sm text-[#111111]">{"Web App"}</p>
              </Reveal>
              <Reveal immediate={true} delay={0.36}>
                <p className="text-xs text-gray-400 mb-1">{"Link"}</p>
                <a
                  href="https://4fett.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#111111] underline underline-offset-4 hover:text-gray-500 transition-colors"
                >
                  {"Visit site"}
                </a>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
      <Reveal immediate={false}>
        <section className="px-4">
          <div className="max-w-5xl mx-auto aspect-[10/7] rounded-lg relative bg-gray-100 overflow-hidden">
            <Image
              alt="4fett web app"
              className="object-cover"
              sizes={imageSizes.full}
              src="/images/4fett/4fett-hero.webp"
              quality={90}
              fill={true}
              preload={true}
            />
          </div>
        </section>
      </Reveal>
      <section className="px-4 py-10 md:py-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-1">
          <div></div>
          <Reveal
            className="space-y-4 text-md leading-relaxed text-gray-500"
            immediate={false}
          >
            <p>
              {
                "4fett is a web app I designed and built from scratch to manage the financial side of working as a freelance on the Italian forfettario regime."
              }
            </p>
            <p>
              {
                "Most existing tools are either too generic or too complex — built for accountants, not for freelancers who just need to know how much they've earned, how much to set aside, and how much they can still invoice before hitting the annual limit. 4fett does exactly that, nothing more."
              }
            </p>
            <p>
              {
                "The product combines three things: a clean financial dashboard with real-time visibility on income, collected payments, and tax provisions; a time-tracking and consuntivazione view that connects work done to revenue; and an AI assistant that understands your specific fiscal situation and answers questions about it."
              }
            </p>
            <p>
              {
                "The design priority was clarity over completeness — every number visible at a glance, no setup overhead, no features that require an accountant to interpret."
              }
            </p>
          </Reveal>
        </div>
      </section>
      <Reveal immediate={false}>
        <section className="px-4 mb-4">
          <div className="max-w-5xl mx-auto aspect-[10/6] relative rounded-lg overflow-hidden bg-gray-100">
            <Image
              alt="4fett app screens"
              className="object-cover"
              sizes={imageSizes.full}
              src="/images/4fett/4fett-1.webp"
              quality={90}
              fill={true}
            />
          </div>
        </section>
      </Reveal>
      <section className="px-4 py-10 md:py-12 border-t border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-4">
          <h2 className="md:sticky md:self-start md:top-4 text-lg leading-[36.4px] tracking-[-0.64px] text-black">
            {"Design Goals"}
          </h2>
          <Reveal immediate={false}>
            <div>
              <p className="text-md leading-relaxed text-gray-500">
                {
                  "The challenge was making something inherently complex — Italian fiscal rules, tax brackets, INPS contributions — feel simple and immediate. The goals were straightforward: surface the numbers that actually matter on a single screen, make consuntivazione fast enough to become a daily habit, and build an AI layer that gives useful answers without pretending to be a commercialista. The visual language follows the same logic — clean, minimal, no noise."
                }
              </p>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="px-4 py-12 md:py-16">
        <Reveal
          className="max-w-5xl mx-auto grid grid-cols-2 gap-1"
          immediate={false}
        >
          <div className="aspect-[4/3] relative overflow-hidden rounded-lg">
            <Image
              alt="4fett screen 1"
              className="object-contain"
              sizes={imageSizes.paired}
              src="/images/4fett/4fett-2.webp"
              quality={90}
              fill={true}
            />
          </div>
          <div className="aspect-[4/3] relative overflow-hidden rounded-lg">
            <Image
              alt="4fett screen 2"
              className="object-contain"
              sizes={imageSizes.paired}
              src="/images/4fett/4fett-3.webp"
              quality={90}
              fill={true}
            />
          </div>
          <div className="aspect-[4/3] relative overflow-hidden rounded-lg">
            <Image
              alt="4fett screen 3"
              className="object-contain"
              sizes={imageSizes.paired}
              src="/images/4fett/4fett-4.webp"
              quality={90}
              fill={true}
            />
          </div>
          <div className="aspect-[4/3] relative overflow-hidden rounded-lg">
            <Image
              alt="4fett screen 4"
              className="object-contain"
              sizes={imageSizes.paired}
              src="/images/4fett/4fett-5.webp"
              quality={90}
              fill={true}
            />
          </div>
        </Reveal>
      </section>
      <Reveal immediate={false}>
        <section className="px-4 mb-4">
          <div className="max-w-5xl mx-auto aspect-[10/6] relative rounded-lg overflow-hidden bg-gray-100">
            <Image
              alt="4fett"
              className="object-cover"
              sizes={imageSizes.full}
              src="/images/4fett/4fett-6.webp"
              quality={90}
              fill={true}
            />
          </div>
        </section>
      </Reveal>
      <Reveal immediate={false}>
        <section className="px-4 mb-4">
          <div className="max-w-5xl mx-auto aspect-[10/6] relative rounded-lg overflow-hidden bg-gray-100">
            <Image
              alt="4fett"
              className="object-contain"
              sizes={imageSizes.full}
              src="/images/4fett/4fett-7.webp"
              quality={90}
              fill={true}
            />
          </div>
        </section>
      </Reveal>
      <Link
        className="block bg-[#ffffff] border-t border-gray-100 px-4 py-8 md:py-10 hover:bg-gray-50 transition-colors"
        href="/work/kiwi"
      >
        <div className="max-w-5xl mx-auto flex items-end justify-between">
          <div>
            <p className="text-xs text-gray-800 mb-1">{"Next project"}</p>
            <p className="text-2xl tracking-[-2.56px] text-black">{"Kiwi"}</p>
          </div>
          <span className="text-sm pb-4 text-black">{"Visualizza →"}</span>
        </div>
      </Link>
    </main>
  );
}
