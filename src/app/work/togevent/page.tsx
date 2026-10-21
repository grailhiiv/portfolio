import imageAsset0 from "../../../../public/images/togevent/tog-hero.webp";
import imageAsset1 from "../../../../public/images/togevent/tog-1.webp";
import imageAsset2 from "../../../../public/images/togevent/tog-2.webp";
import imageAsset3 from "../../../../public/images/togevent/tog-3.webp";
import imageAsset4 from "../../../../public/images/togevent/tog-4.webp";
import imageAsset5 from "../../../../public/images/togevent/tog-5.webp";
import imageAsset6 from "../../../../public/images/togevent/tog-6.webp";
import imageAsset7 from "../../../../public/images/togevent/tog-7.webp";
import imageAsset8 from "../../../../public/images/togevent/tog-ds.webp";
import imageAsset9 from "../../../../public/images/togevent/tog-8.webp";
import { imageSizes } from "@/lib/image-sizes";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal, AnimatedHeading } from "@/components/animation";

export const metadata: Metadata = {
  title: "Togevent Case Study — Arturo Spatino",
  description:
    "End to end product design for Togevent — an event platform across mobile and web. 400+ screens built on a single design system.",
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
                  { text: "T", className: "" },
                  { text: "o", className: "" },
                  { text: "g", className: "" },
                  { text: "e", className: "" },
                  { text: "v", className: "" },
                  { text: "e", className: "" },
                  { text: "n", className: "" },
                  { text: "t", className: "" },
                ],
              ]}
            />
            <div className="flex flex-wrap gap-x-8 gap-y-5">
              <Reveal immediate={true}>
                <p className="text-xs text-gray-400 mb-1">{"Year"}</p>
                <p className="text-sm text-[#111111]">{"2025"}</p>
              </Reveal>
              <Reveal immediate={true} delay={0.12}>
                <p className="text-xs text-gray-400 mb-1">{"Role"}</p>
                <p className="text-sm text-[#111111]">
                  {"End to end product design"}
                </p>
              </Reveal>
              <Reveal immediate={true} delay={0.24}>
                <p className="text-xs text-gray-400 mb-1">{"Type"}</p>
                <p className="text-sm text-[#111111]">
                  {"Mobile, App, Web app"}
                </p>
              </Reveal>
              <Reveal immediate={true} delay={0.36}>
                <p className="text-xs text-gray-400 mb-1">{"Link"}</p>
                <a
                  href="https://togevent.com"
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
              alt="Togevent mobile app"
              className="object-cover"
              sizes={imageSizes.full}
              src={imageAsset0}
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
                "Togevent is a digital platform for creating, managing, and joining events — designed from scratch across mobile and web."
              }
            </p>
            <p>
              {
                "Before this product existed, there was no single place to handle the full lifecycle of an event. Organizers used multiple platforms to manage guests, communicate and share media. There was no consistent way to discover and engage."
              }
            </p>
            <p>
              {
                "I designed the product as a single system rather than two separate ones. Same interaction patterns, same components, same design language — whether you're organizing from your desktop or checking in at the door. That decision kept the experience coherent and the system approachable as the product grew."
              }
            </p>
            <p>
              {
                "The result: 400+ screens across mobile and web, built on a design system flexible enough to scale."
              }
            </p>
          </Reveal>
        </div>
      </section>
      <Reveal immediate={false}>
        <section className="px-4 mb-4">
          <div className="max-w-5xl mx-auto aspect-[10/6] relative rounded-lg overflow-hidden bg-gray-100">
            <Image
              alt="Togevent app screens"
              className="object-cover"
              sizes={imageSizes.full}
              src={imageAsset1}
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
                  "The core challenge was designing for two very different user types, on two very different platforms, at the same time. For organizers, the flows had to be clear and efficient — creating an event, managing guests, tracking what's happening. For participants, the experience had to feel effortless — discovering events, registering, showing up. Across both, the goal was coherence: same patterns, same language, same level of accessibility, whether you're on a phone or a desktop."
                }
              </p>
            </div>
          </Reveal>
        </div>
      </section>
      <Reveal immediate={false}>
        <section className="px-4 mb-4">
          <div className="max-w-5xl mx-auto aspect-[10/6] relative rounded-lg overflow-hidden bg-gray-100">
            <Image
              alt="Togevent desktop screens"
              className="object-cover"
              sizes={imageSizes.full}
              src={imageAsset2}
              quality={90}
              fill={true}
            />
          </div>
        </section>
      </Reveal>
      <section className="px-4 py-12 md:py-16">
        <Reveal
          className="max-w-5xl mx-auto grid grid-cols-2 gap-1"
          immediate={false}
        >
          <div className="aspect-square relative overflow-hidden rounded-lg">
            <Image
              alt="Togevent screen 1"
              className="object-cover"
              sizes={imageSizes.paired}
              src={imageAsset3}
              quality={90}
              fill={true}
            />
          </div>
          <div className="aspect-square relative overflow-hidden rounded-lg">
            <Image
              alt="Togevent screen 2"
              className="object-cover"
              sizes={imageSizes.paired}
              src={imageAsset4}
              quality={90}
              fill={true}
            />
          </div>
          <div className="aspect-square relative overflow-hidden rounded-lg">
            <Image
              alt="Togevent screen 3"
              className="object-cover"
              sizes={imageSizes.paired}
              src={imageAsset5}
              quality={90}
              fill={true}
            />
          </div>
          <div className="aspect-square relative overflow-hidden rounded-lg">
            <Image
              alt="Togevent screen 4"
              className="object-cover"
              sizes={imageSizes.paired}
              src={imageAsset6}
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
              alt="Togevent desktop screens"
              className="object-cover"
              sizes={imageSizes.full}
              src={imageAsset7}
              quality={90}
              fill={true}
            />
          </div>
        </section>
      </Reveal>
      <section className="px-4 py-10 md:py-12 border-t border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-4">
          <h2 className="md:sticky md:self-start md:top-4 text-lg leading-[36.4px] tracking-[-0.64px] text-black">
            {"The System"}
          </h2>
          <Reveal immediate={false}>
            <div>
              <p className="text-md leading-relaxed text-gray-500">
                {
                  "The decision to build a single system rather than two separate ones was a deliberate design choice. Maintaining two parallel design languages would have meant twice the decisions, twice the inconsistencies, and a noticeably different experience depending on which device you were using. A shared system — same components, same interaction patterns, same tokens — kept the product coherent for users and significantly reduced overhead for the development team."
                }
              </p>
            </div>
          </Reveal>
        </div>
      </section>
      <Reveal immediate={false}>
        <section className="px-4 mb-4">
          <div className="max-w-5xl mx-auto">
            <Image
              alt="Togevent design system"
              width={0}
              height={0}
              className="w-full h-auto rounded-lg"
              sizes={imageSizes.portrait}
              src={imageAsset8}
              quality={90}
            />
          </div>
        </section>
      </Reveal>
      <Reveal immediate={false}>
        <section className="px-4 mb-20">
          <div className="max-w-5xl mx-auto">
            <Image
              alt="Togevent screens"
              width={0}
              height={0}
              className="w-full h-auto rounded-lg"
              sizes={imageSizes.portrait}
              src={imageAsset9}
              quality={90}
            />
          </div>
        </section>
      </Reveal>
      <Link
        className="block bg-[#ffffff] border-t border-gray-100 px-4 py-8 md:py-10 hover:bg-gray-50 transition-colors"
        href="/work/bounty-hunters"
      >
        <div className="max-w-5xl mx-auto flex items-end justify-between">
          <div>
            <p className="text-xs text-gray-800 mb-1">{"Next project"}</p>
            <p className="text-2xl tracking-[-2.56px] text-black">
              {"Bounty Hunters"}
            </p>
          </div>
          <span className="text-sm pb-4 text-black">{"Visualizza →"}</span>
        </div>
      </Link>
    </main>
  );
}
