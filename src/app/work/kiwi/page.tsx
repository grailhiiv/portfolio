import { imageSizes } from "@/lib/image-sizes";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal, AnimatedHeading } from "@/components/animation";

export const metadata: Metadata = {
  title: "Kiwi Case Study — Arturo Spatino",
  description:
    "End to end product design for Kiwi — a mobile app that helps people track and reduce their vaping without judgment.",
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
                  { text: "K", className: "" },
                  { text: "i", className: "" },
                  { text: "w", className: "" },
                  { text: "i", className: "" },
                ],
              ]}
            />
            <div className="flex flex-wrap gap-x-8 gap-y-5">
              <Reveal immediate={true}>
                <p className="text-xs text-gray-400 mb-1">{"Year"}</p>
                <p className="text-sm text-[#111111]">{"2024"}</p>
              </Reveal>
              <Reveal immediate={true} delay={0.12}>
                <p className="text-xs text-gray-400 mb-1">{"Role"}</p>
                <p className="text-sm text-[#111111]">
                  {"End to end product design"}
                </p>
              </Reveal>
              <Reveal immediate={true} delay={0.24}>
                <p className="text-xs text-gray-400 mb-1">{"Type"}</p>
                <p className="text-sm text-[#111111]">{"Mobile App"}</p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
      <Reveal immediate={false}>
        <section className="px-4">
          <div className="max-w-5xl mx-auto aspect-[10/7] rounded-lg relative bg-gray-100 overflow-hidden">
            <Image
              alt="kiwi mobile app"
              className="object-cover"
              sizes={imageSizes.full}
              src="/images/kiwi/kiwi-hero.webp"
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
                "Kiwi is a mobile app designed to help people track and gradually reduce their vaping — without judgment."
              }
            </p>
            <p>
              {
                "The challenge wasn't just functional. Early research revealed that most existing tools used punitive language and rigid tracking — the kind that makes people feel like they're failing rather than improving."
              }
            </p>
            <p>
              {
                "The brief was to design something that felt supportive instead: an app that frames every small reduction as progress, not a deficit."
              }
            </p>
            <p>
              {
                "I focused on three things: simplified flows that remove friction from daily tracking, micro-interactions that reinforce a sense of forward motion, and a visual language — calm colors, clear hierarchy, measured use of feedback — that communicates trust rather than pressure. The result is a product that doesn't lecture. It listens."
              }
            </p>
          </Reveal>
        </div>
      </section>
      <Reveal immediate={false}>
        <section className="px-4 mb-4">
          <div className="max-w-5xl mx-auto aspect-[10/6] relative rounded-lg overflow-hidden bg-gray-100">
            <Image
              alt="kiwi app screens"
              className="object-cover"
              sizes={imageSizes.full}
              src="/images/kiwi/kiwi-1.webp"
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
                  "The core tension was designing for a behavior people want to change but aren't always ready to confront. For someone trying to reduce their vaping, an app that counts and judges every session is the last thing that helps. The goals were clear: automate tracking to remove any friction from the daily habit, design flows simple enough to disappear into the routine, use micro-interactions to make every reduction feel like a win, and build a visual language — color, typography, feedback — that communicates calm and trust rather than pressure or guilt."
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
          <div className="aspect-square relative overflow-hidden rounded-lg">
            <Image
              alt="kiwi screen 1"
              className="object-cover"
              sizes={imageSizes.paired}
              src="/images/kiwi/kiwi-2.webp"
              quality={90}
              fill={true}
            />
          </div>
          <div className="aspect-square relative overflow-hidden rounded-lg">
            <Image
              alt="kiwi screen 2"
              className="object-cover"
              sizes={imageSizes.paired}
              src="/images/kiwi/kiwi-3.webp"
              quality={90}
              fill={true}
            />
          </div>
          <div className="aspect-square relative overflow-hidden rounded-lg">
            <Image
              alt="kiwi screen 3"
              className="object-cover"
              sizes={imageSizes.paired}
              src="/images/kiwi/kiwi-4.webp"
              quality={90}
              fill={true}
            />
          </div>
          <div className="aspect-square relative overflow-hidden rounded-lg">
            <Image
              alt="kiwi screen 4"
              className="object-cover"
              sizes={imageSizes.paired}
              src="/images/kiwi/kiwi-5.webp"
              quality={90}
              fill={true}
            />
          </div>
        </Reveal>
      </section>
      <Reveal immediate={false}>
        <section className="px-4 mb-4">
          <div className="max-w-5xl mx-auto aspect-[10/6] relative rounded-lg overflow-hidden">
            <Image
              alt="kiwi colors"
              className="object-cover"
              sizes={imageSizes.full}
              src="/images/kiwi/kiwi-ds.webp"
              quality={90}
              fill={true}
            />
          </div>
        </section>
      </Reveal>
      <Reveal immediate={false}>
        <section className="px-4 mb-1">
          <div className="max-w-5xl mx-auto rounded-lg bg-gray-100">
            <Image
              alt="kiwi screens"
              width={0}
              height={0}
              className="w-full h-auto rounded-lg"
              sizes={imageSizes.portrait}
              src="/images/kiwi/kiwi-6.webp"
              quality={90}
            />
          </div>
        </section>
      </Reveal>
      <Link
        className="block bg-[#ffffff] border-t border-gray-100 px-4 py-8 md:py-10 hover:bg-gray-50 transition-colors"
        href="/work/togevent"
      >
        <div className="max-w-5xl mx-auto flex items-end justify-between">
          <div>
            <p className="text-xs text-gray-800 mb-1">{"Next project"}</p>
            <p className="text-2xl tracking-[-2.56px] text-black">
              {"Togevent"}
            </p>
          </div>
          <span className="text-sm pb-4 text-black">{"Visualizza →"}</span>
        </div>
      </Link>
    </main>
  );
}
