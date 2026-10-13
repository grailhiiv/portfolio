import { imageSizes } from "@/lib/image-sizes";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal, AnimatedHeading } from "@/components/animation";

export const metadata: Metadata = {
  title: "Bounty Hunters Case Study — Arturo Spatino",
  description:
    "Design and development for Bounty Hunters — an independent platform that promotes and publishes graphic design work from studios and designers around the world.",
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
                  { text: "B", className: "" },
                  { text: "o", className: "" },
                  { text: "u", className: "" },
                  { text: "n", className: "" },
                  { text: "t", className: "" },
                  { text: "y", className: "" },
                  { text: " ", className: "" },
                ],
                [
                  { text: "H", className: "" },
                  { text: "u", className: "" },
                  { text: "n", className: "" },
                  { text: "t", className: "" },
                  { text: "e", className: "" },
                  { text: "r", className: "" },
                  { text: "s", className: "" },
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
                  {"Design and development"}
                </p>
              </Reveal>
              <Reveal immediate={true} delay={0.24}>
                <p className="text-xs text-gray-400 mb-1">{"Type"}</p>
                <p className="text-sm text-[#111111]">{"Website"}</p>
              </Reveal>
              <Reveal immediate={true} delay={0.36}>
                <p className="text-xs text-gray-400 mb-1">{"Link"}</p>
                <a
                  href="https://www.bounty-hunters.co.uk/"
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
              alt="Bounty Hunters website"
              className="object-cover"
              sizes={imageSizes.full}
              src="/images/bounty-hunters/bh-hero.png"
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
                "Bounty Hunters is an independent platform that promotes and publishes graphic design work from studios and designers around the world. The content was already there: strong, curated, consistent."
              }
            </p>
            <p>
              {
                "The problem was everything around it: navigation that got in the way, a content structure that made discovery harder than it needed to be, and a visual language that didn't match the quality of what it was showcasing."
              }
            </p>
            <p>
              {
                "The brief was to redesign the site without losing the identity it had built. Same editorial attitude, better everything else. I redesigned the UX from the ground up , restructuring how content is organized and surfaced, and developed the final product on WordPress."
              }
            </p>
            <p>
              {
                "One deliberate change: replacing Helvetica with Saans by Displaay Type. Not just for legibility, but because it felt right for a platform that champions original work: a typeface with character, without the generic neutrality that Helvetica brings to almost everything it touches."
              }
            </p>
          </Reveal>
        </div>
      </section>
      <Reveal immediate={false}>
        <section className="px-4 mb-4">
          <div className="max-w-5xl mx-auto aspect-[10/6] relative rounded-lg overflow-hidden bg-gray-100">
            <Image
              alt="Bounty Hunters screens"
              className="object-cover"
              sizes={imageSizes.full}
              src="/images/bounty-hunters/bh-1.png"
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
                  "The content was the strength of the platform — the design just needed to get out of its way. The goals were to make navigation intuitive enough to disappear, restructure the content architecture so that good work could actually be found, and build a visual language that felt as considered as the projects it was featuring. Preserving the editorial identity while upgrading everything else."
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
              alt="bounty-hunters screen 2"
              className="object-contain"
              sizes={imageSizes.paired}
              src="/images/bounty-hunters/bh-2.png"
              quality={90}
              fill={true}
            />
          </div>
          <div className="aspect-[4/3] relative overflow-hidden rounded-lg">
            <Image
              alt="bounty-hunters screen 3"
              className="object-contain"
              sizes={imageSizes.paired}
              src="/images/bounty-hunters/bh-3.png"
              quality={90}
              fill={true}
            />
          </div>
          <div
            className="aspect-[4/3] relative overflow-hidden rounded-lg"
            style={{ gridColumn: "span 2" }}
          >
            <Image
              alt="bounty-hunters screen 4"
              className="object-contain"
              sizes={imageSizes.full}
              src="/images/bounty-hunters/bh-4.png"
              quality={90}
              fill={true}
            />
          </div>
        </Reveal>
      </section>
      <section className="px-4 py-10 md:py-12 border-t border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-4">
          <h2 className="md:sticky md:self-start md:top-4 text-lg leading-[36.4px] tracking-[-0.64px] text-black">
            {"The Build"}
          </h2>
          <Reveal immediate={false}>
            <div>
              <p className="text-md leading-relaxed text-gray-500">
                {
                  "The site runs on a custom WordPress theme built from scratch. The goal was to give the Bounty Hunters team full control over content: publishing, editing, archiving, without depending on a developer for every change. No off-the-shelf template compromises, no plugin bloat: just a theme designed around how they actually work."
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
              alt="Bounty Hunters mobile"
              className="object-cover"
              sizes={imageSizes.full}
              src="/images/bounty-hunters/bh-5.png"
              quality={90}
              fill={true}
            />
          </div>
        </section>
      </Reveal>
      <Reveal immediate={false}>
        <section className="px-4 mb-4">
          <div className="max-w-5xl mx-auto aspect-[10/6] relative rounded-lg overflow-hidden">
            <Image
              alt="Bounty Hunters share your work"
              className="object-cover"
              sizes={imageSizes.full}
              src="/images/bounty-hunters/bh-6.png"
              quality={90}
              fill={true}
            />
          </div>
        </section>
      </Reveal>
      <Link
        className="block bg-[#ffffff] border-t border-gray-100 px-4 py-8 md:py-10 hover:bg-gray-50 transition-colors"
        href="/work/4fett"
      >
        <div className="max-w-5xl mx-auto flex items-end justify-between">
          <div>
            <p className="text-xs text-gray-800 mb-1">{"Next project"}</p>
            <p className="text-2xl tracking-[-2.56px] text-black">{"4fett"}</p>
          </div>
          <span className="text-sm pb-4 text-black">{"Visualizza →"}</span>
        </div>
      </Link>
    </main>
  );
}
