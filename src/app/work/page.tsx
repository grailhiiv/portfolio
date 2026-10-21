import imageAsset0 from "../../../public/images/case-4fett.webp";
import imageAsset1 from "../../../public/images/case-togevent.webp";
import imageAsset2 from "../../../public/images/case-bh.png";
import imageAsset3 from "../../../public/images/case-kiwi.webp";
import imageAsset4 from "../../../public/images/fantacalcio1.webp";
import imageAsset5 from "../../../public/images/fantacalcio2.webp";
import imageAsset6 from "../../../public/images/fantacalcio3.webp";
import imageAsset7 from "../../../public/images/napoli1.webp";
import imageAsset8 from "../../../public/images/napoli2.webp";
import imageAsset9 from "../../../public/images/napoli3.webp";
import imageAsset10 from "../../../public/images/lumina1.webp";
import imageAsset11 from "../../../public/images/lumina2.webp";
import { imageSizes } from "@/lib/image-sizes";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal, AnimatedHeading } from "@/components/animation";
import Gallery from "@/components/gallery";

export const metadata: Metadata = {
  title: "Work — Arturo Spatino",
  description:
    "A collection of projects, explorations and details across product design, interfaces and design systems.",
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
                { text: "A", className: "text-[#b2b2b2]" },
                { text: " ", className: "" },
              ],
              [
                { text: "c", className: "text-[#b2b2b2]" },
                { text: "o", className: "text-[#b2b2b2]" },
                { text: "l", className: "text-[#b2b2b2]" },
                { text: "l", className: "text-[#b2b2b2]" },
                { text: "e", className: "text-[#b2b2b2]" },
                { text: "c", className: "text-[#b2b2b2]" },
                { text: "t", className: "text-[#b2b2b2]" },
                { text: "i", className: "text-[#b2b2b2]" },
                { text: "o", className: "text-[#b2b2b2]" },
                { text: "n", className: "text-[#b2b2b2]" },
                { text: " ", className: "" },
              ],
              [
                { text: "o", className: "text-[#b2b2b2]" },
                { text: "f", className: "text-[#b2b2b2]" },
                { text: " ", className: "" },
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
                { text: ",", className: "text-[#b2b2b2]" },
                { text: " ", className: "" },
              ],
              [
                { text: "e", className: "text-[#111111]" },
                { text: "x", className: "text-[#111111]" },
                { text: "p", className: "text-[#111111]" },
                { text: "l", className: "text-[#111111]" },
                { text: "o", className: "text-[#111111]" },
                { text: "r", className: "text-[#111111]" },
                { text: "a", className: "text-[#111111]" },
                { text: "t", className: "text-[#111111]" },
                { text: "i", className: "text-[#111111]" },
                { text: "o", className: "text-[#111111]" },
                { text: "n", className: "text-[#111111]" },
                { text: "s", className: "text-[#111111]" },
                { text: " ", className: "" },
              ],
              [
                { text: "a", className: "text-[#b2b2b2]" },
                { text: "n", className: "text-[#b2b2b2]" },
                { text: "d", className: "text-[#b2b2b2]" },
                { text: " ", className: "" },
              ],
              [
                { text: "d", className: "text-[#111111]" },
                { text: "e", className: "text-[#111111]" },
                { text: "t", className: "text-[#111111]" },
                { text: "a", className: "text-[#111111]" },
                { text: "i", className: "text-[#111111]" },
                { text: "l", className: "text-[#111111]" },
                { text: "s", className: "text-[#111111]" },
                { text: ".", className: "text-[#b2b2b2]" },
                { text: " ", className: "" },
              ],
              [
                { text: "S", className: "text-[#b2b2b2]" },
                { text: "o", className: "text-[#b2b2b2]" },
                { text: "m", className: "text-[#b2b2b2]" },
                { text: "e", className: "text-[#b2b2b2]" },
                { text: " ", className: "" },
              ],
              [
                { text: "a", className: "text-[#b2b2b2]" },
                { text: "r", className: "text-[#b2b2b2]" },
                { text: "e", className: "text-[#b2b2b2]" },
                { text: " ", className: "" },
              ],
              [
                { text: "c", className: "text-[#b2b2b2]" },
                { text: "a", className: "text-[#b2b2b2]" },
                { text: "s", className: "text-[#b2b2b2]" },
                { text: "e", className: "text-[#b2b2b2]" },
                { text: " ", className: "" },
              ],
              [
                { text: "s", className: "text-[#b2b2b2]" },
                { text: "t", className: "text-[#b2b2b2]" },
                { text: "u", className: "text-[#b2b2b2]" },
                { text: "d", className: "text-[#b2b2b2]" },
                { text: "i", className: "text-[#b2b2b2]" },
                { text: "e", className: "text-[#b2b2b2]" },
                { text: "s", className: "text-[#b2b2b2]" },
                { text: ".", className: "text-[#b2b2b2]" },
                { text: " ", className: "" },
              ],
              [
                { text: "S", className: "text-[#b2b2b2]" },
                { text: "o", className: "text-[#b2b2b2]" },
                { text: "m", className: "text-[#b2b2b2]" },
                { text: "e", className: "text-[#b2b2b2]" },
                { text: " ", className: "" },
              ],
              [
                { text: "a", className: "text-[#b2b2b2]" },
                { text: "r", className: "text-[#b2b2b2]" },
                { text: "e", className: "text-[#b2b2b2]" },
                { text: " ", className: "" },
              ],
              [
                { text: "j", className: "text-[#b2b2b2]" },
                { text: "u", className: "text-[#b2b2b2]" },
                { text: "s", className: "text-[#b2b2b2]" },
                { text: "t", className: "text-[#b2b2b2]" },
                { text: " ", className: "" },
              ],
              [
                { text: "g", className: "text-[#b2b2b2]" },
                { text: "o", className: "text-[#b2b2b2]" },
                { text: "o", className: "text-[#b2b2b2]" },
                { text: "d", className: "text-[#b2b2b2]" },
                { text: " ", className: "" },
              ],
              [
                { text: "w", className: "text-[#b2b2b2]" },
                { text: "o", className: "text-[#b2b2b2]" },
                { text: "r", className: "text-[#b2b2b2]" },
                { text: "k", className: "text-[#b2b2b2]" },
                { text: ".", className: "text-[#b2b2b2]" },
              ],
            ]}
          />
        </div>
      </section>
      <section className="px-4 pb-10 md:pb-12 border-gray-100">
        <div className="max-w-5xl mx-auto flex flex-col gap-y-6">
          <Reveal immediate={false}>
            <h2 className="work-case-heading text-lg leading-[36.4px] tracking-[-0.64px] text-black">
              {"Case studies"}
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Reveal immediate={false}>
              <Link className="block group" href="/work/daniel">
                <div className="aspect-[3/4] bg-gray-100 overflow-hidden rounded-lg relative mb-3">
                  <Image
                    alt="Daniel G. Miller"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes={imageSizes.workCard}
                    src={imageAsset0}
                    quality={90}
                    fill={true}
                    preload={true}
                  />
                </div>
                <h3 className="text-sm font-medium text-[#111111]">
                  {"Daniel G. Miller"}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">{"Web app"}</p>
              </Link>
            </Reveal>
            <Reveal immediate={false} delay={0.12}>
              <Link className="block group" href="/work/togevent">
                <div className="aspect-[3/4] bg-gray-100 overflow-hidden rounded-lg relative mb-3">
                  <Image
                    alt="Togevent"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes={imageSizes.workCard}
                    src={imageAsset1}
                    quality={90}
                    fill={true}
                  />
                </div>
                <h3 className="text-sm font-medium text-[#111111]">
                  {"Togevent"}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">{"App, Web app"}</p>
              </Link>
            </Reveal>
            <Reveal immediate={false} delay={0.24}>
              <Link className="block group" href="/work/bounty-hunters">
                <div className="aspect-[3/4] bg-gray-100 overflow-hidden rounded-lg relative mb-3">
                  <Image
                    alt="Bounty Hunters"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes={imageSizes.workCard}
                    src={imageAsset2}
                    quality={90}
                    fill={true}
                  />
                </div>
                <h3 className="text-sm font-medium text-[#111111]">
                  {"Bounty Hunters"}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">{"Website"}</p>
              </Link>
            </Reveal>
            <Reveal immediate={false} delay={0.36}>
              <Link className="block group" href="/work/kiwi">
                <div className="aspect-[3/4] bg-gray-100 overflow-hidden rounded-lg relative mb-3">
                  <Image
                    alt="Kiwi"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes={imageSizes.workCard}
                    src={imageAsset3}
                    quality={90}
                    fill={true}
                  />
                </div>
                <h3 className="text-sm font-medium text-[#111111]">{"Kiwi"}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{"App"}</p>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
      <section className="px-4 py-10 md:py-12 border-t border-gray-100">
        <Reveal className="max-w-5xl mx-auto" immediate={false}>
          <h2 className="text-lg leading-[36.4px] tracking-[-0.64px] text-black mb-6 md:mb-8">
            {"Explorations"}
          </h2>
          <Gallery
            compact={false}
            images={[
              { src: imageAsset4.src, alt: "Exploration 1" },
              { src: imageAsset5.src, alt: "Exploration 2" },
              { src: imageAsset6.src, alt: "Exploration 3" },
              { src: imageAsset7.src, alt: "Exploration 4" },
              { src: imageAsset8.src, alt: "Exploration 5" },
              { src: imageAsset9.src, alt: "Exploration 6" },
              { src: imageAsset10.src, alt: "Exploration 7" },
              { src: imageAsset11.src, alt: "Exploration 8" },
            ]}
          />
        </Reveal>
      </section>
    </main>
  );
}
