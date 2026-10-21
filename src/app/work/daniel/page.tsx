import imageAsset0 from "../../../../public/images/daniel/daniel-hero.webp";
import imageAsset1 from "../../../../public/images/daniel/daniel-1.webp";
import imageAsset2 from "../../../../public/images/daniel/daniel-2.webp";
import imageAsset3 from "../../../../public/images/daniel/daniel-3.webp";
import imageAsset4 from "../../../../public/images/daniel/4fett-4.webp";
import imageAsset5 from "../../../../public/images/daniel/4fett-5.webp";
import imageAsset6 from "../../../../public/images/daniel/4fett-6.webp";
import imageAsset7 from "../../../../public/images/daniel/4fett-7.webp";
import { imageSizes } from "@/lib/image-sizes";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal, AnimatedHeading } from "@/components/animation";

export const metadata: Metadata = {
  title: "Daniel G. Miller Case Study — Grailord Antonio",
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
              words={["Daniel\u00a0", "G.\u00a0", "Miller"].map((word) =>
                [...word].map((text) => ({ text, className: "" })),
              )}
            />
            <div className="flex flex-wrap gap-x-8 gap-y-5">
              <Reveal immediate={true}>
                <p className="text-xs text-gray-400 mb-1">{"Year"}</p>
                <p className="text-sm text-[#111111]">{"2026"}</p>
              </Reveal>
              <Reveal immediate={true} delay={0.12}>
                <p className="text-xs text-gray-400 mb-1">{"Primary Focus"}</p>
                <p className="text-sm text-[#111111]">
                  {"Content Strategy, Audience Growth & Community Engagement"}
                </p>
              </Reveal>
              <Reveal immediate={true} delay={0.24}>
                <p className="text-xs text-gray-400 mb-1">
                  {"Project Duration"}
                </p>
                <p className="text-sm text-[#111111]">{"3 Months"}</p>
              </Reveal>
              <Reveal immediate={true} delay={0.36}>
                <p className="text-xs text-gray-400 mb-1">{"Industry"}</p>
                <p className="text-sm text-[#111111]">
                  {"Book Publishing / Author Marketing"}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
      <Reveal immediate={false}>
        <section className="px-4">
          <div className="max-w-5xl mx-auto aspect-[10/7] rounded-lg relative bg-gray-100 overflow-hidden">
            <Image
              alt="Daniel G. Miller"
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
      <section className="px-4 py-10 md:py-12 lg:pt-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-4">
          <h2 className="md:sticky md:self-start md:top-4 text-lg leading-[36.4px] tracking-[-0.64px] text-black">
            Overview
          </h2>
          <Reveal>
            <p className="text-md leading-relaxed text-gray-500">
              {
                "Daniel G. Miller is an award-winning horror author with an established readership and a growing online presence. Over three months, I managed his social media content to strengthen brand consistency, increase visibility, and create more opportunities for readers to discover and engage with his work."
              }
            </p>
          </Reveal>
        </div>
      </section>
      <section className="px-4 py-10 md:py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-6">
          <Reveal>
            <h2 className="text-lg leading-[36.4px] tracking-[-0.64px] text-black mb-6">
              Goal
            </h2>
            <div className="md:max-w-[540px]">
              <p className="text-md leading-relaxed text-gray-500">
                {
                  "The challenge was to reach beyond Daniel's existing audience and turn his social media presence into a more active channel for reader discovery. The goal was to attract new readers, encourage meaningful interactions, and maintain consistent visibility between book releases without relying solely on promotional posts."
                }
              </p>
            </div>
          </Reveal>
          <Reveal>
            <div className="aspect-[10/6] relative rounded-lg overflow-hidden bg-gray-100">
              <Image
                alt="Daniel G. Miller Instagram Profile"
                className="object-cover"
                sizes={imageSizes.portrait}
                src={imageAsset1}
                quality={90}
                fill
              />
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
              src={imageAsset2}
              quality={90}
              fill={true}
            />
          </div>
          <div className="aspect-[4/3] relative overflow-hidden rounded-lg">
            <Image
              alt="4fett screen 2"
              className="object-contain"
              sizes={imageSizes.paired}
              src={imageAsset3}
              quality={90}
              fill={true}
            />
          </div>
        </Reveal>
      </section>
      <section className="px-4 py-10 md:py-12 border-t border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-4">
          <h2 className="md:sticky md:self-start md:top-4 text-lg leading-[36.4px] tracking-[-0.64px] text-black">
            {"Planning"}
          </h2>
          <Reveal immediate={false}>
            <div>
              <p className="text-md leading-relaxed text-gray-500">
                {
                  "The content strategy focused on three areas: book promotion, author storytelling, and reader engagement. I organised content around Daniel's published works, creative insights, and horror-related discussions, supported by a consistent publishing schedule designed to maintain audience interest and improve discoverability."
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
              alt="4fett"
              className="object-cover"
              sizes={imageSizes.full}
              src={imageAsset6}
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
              src={imageAsset7}
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
