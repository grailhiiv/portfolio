import { imageSizes } from "@/lib/image-sizes";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal, AnimatedHeading } from "@/components/animation";
import Gallery from "@/components/gallery";
import ServiceIcon from "@/components/service-icon";

export const metadata: Metadata = {
  title: "Arturo Spatino — Product Designer",
  description:
    "Product Designer with 10+ years of experience designing digital products across startups, agencies and consulting environments.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <main id="main-content">
      <section className="px-4 pt-4 pb-2">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-6 items-stretch">
          <div className="flex flex-col justify-end py-4 md:py-16 gap-6 md:gap-10 md:h-full">
            <AnimatedHeading
              className="home-hero-heading text-2xl md:max-w-[540px] leading-none tracking-[-2.5px]"
              words={[
                [
                  { text: "B", className: "text-[#111111]" },
                  { text: "u", className: "text-[#111111]" },
                  { text: "i", className: "text-[#111111]" },
                  { text: "l", className: "text-[#111111]" },
                  { text: "d", className: "text-[#111111]" },
                  { text: "i", className: "text-[#111111]" },
                  { text: "n", className: "text-[#111111]" },
                  { text: "g", className: "text-[#111111]" },
                  { text: " ", className: "" },
                ],
                [
                  { text: "b", className: "text-[#111111]" },
                  { text: "r", className: "text-[#111111]" },
                  { text: "a", className: "text-[#111111]" },
                  { text: "n", className: "text-[#111111]" },
                  { text: "d", className: "text-[#111111]" },
                  { text: "s", className: "text-[#111111]" },
                  { text: " ", className: "" },
                ],
                [
                  { text: "t", className: "text-[#111111]" },
                  { text: "h", className: "text-[#111111]" },
                  { text: "r", className: "text-[#111111]" },
                  { text: "o", className: "text-[#111111]" },
                  { text: "u", className: "text-[#111111]" },
                  { text: "g", className: "text-[#111111]" },
                  { text: "h", className: "text-[#111111]" },
                  { text: " ", className: "" },
                ],
                [
                  { text: "s", className: "text-[#b2b2b2]" },
                  { text: "o", className: "text-[#b2b2b2]" },
                  { text: "c", className: "text-[#b2b2b2]" },
                  { text: "i", className: "text-[#b2b2b2]" },
                  { text: "a", className: "text-[#b2b2b2]" },
                  { text: "l", className: "text-[#b2b2b2]" },
                  { text: " ", className: "" },
                ],
                [
                  { text: "m", className: "text-[#b2b2b2]" },
                  { text: "e", className: "text-[#b2b2b2]" },
                  { text: "d", className: "text-[#b2b2b2]" },
                  { text: "i", className: "text-[#b2b2b2]" },
                  { text: "a", className: "text-[#b2b2b2]" },
                  { text: " ", className: "" },
                ],
                [
                  { text: "a", className: "text-[#b2b2b2]" },
                  { text: "n", className: "text-[#b2b2b2]" },
                  { text: "d", className: "text-[#b2b2b2]" },
                  { text: " ", className: "" },
                ],
                [
                  { text: "s", className: "text-[#b2b2b2]" },
                  { text: "m", className: "text-[#b2b2b2]" },
                  { text: "a", className: "text-[#b2b2b2]" },
                  { text: "r", className: "text-[#b2b2b2]" },
                  { text: "t", className: "text-[#b2b2b2]" },
                  { text: "e", className: "text-[#b2b2b2]" },
                  { text: "r", className: "text-[#b2b2b2]" },
                  { text: " ", className: "" },
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
                  { text: " ", className: "" },
                ],
                [
                  { text: "s", className: "text-[#111111]" },
                  { text: "y", className: "text-[#111111]" },
                  { text: "s", className: "text-[#111111]" },
                  { text: "t", className: "text-[#111111]" },
                  { text: "e", className: "text-[#111111]" },
                  { text: "m", className: "text-[#111111]" },
                  { text: "s", className: "text-[#111111]" },
                  { text: ".", className: "text-[#b2b2b2]" },
                ],
              ]}
            />
            <Reveal immediate={true}>
              <p className="text-md md:max-w-[540px] leading-relaxed text-gray-400">
                {
                  "Social Media Manager specializing in brand growth, CRM, and marketing automation. I help businesses strengthen their online presence, create strategic content, and build smarter workflows that turn attention into opportunities."
                }
              </p>
            </Reveal>
          </div>
          <Reveal immediate={true}>
            <div className="aspect-[3/4] md:aspect-square relative overflow-hidden rounded-lg">
              <Image
                alt="Social media campaign designs for Daniel G. Miller"
                className="object-cover"
                sizes={imageSizes.portrait}
                src="/images/home-hero-social-media.webp"
                quality={90}
                fill={true}
                preload={true}
              />
            </div>
          </Reveal>
        </div>
      </section>
      <section className="px-4 py-16 md:py-24 border-t border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-4">
          <h2 className="md:sticky md:self-start md:top-4 text-lg leading-[36.4px] tracking-[-0.64px] text-black">
            {"Info"}
          </h2>
          <Reveal immediate={false}>
            <div>
              <p className="text-md leading-relaxed text-gray-500">
                {
                  "I'm Grailord Antonio, a digital marketing specialist based in the Philippines with over 10 years of experience, specializing in social media management, brand growth, and marketing automation. My work combines creative strategy, technical expertise, and marketing systems to help businesses build a stronger, more connected digital presence."
                }
              </p>
              <Link
                className="inline-block mt-4 text-md underline underline-offset-4 text-gray-400 hover:text-[#111111] transition-colors"
                href="/about"
              >
                {"Discover more"}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="px-4 py-16 md:py-24 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-lg leading-[36.4px] tracking-[-0.64px] text-black mb-6 md:mb-8">
            {"Services"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <Reveal
              className="flex flex-col gap-28 border border-gray-200 rounded-lg p-6"
              immediate={false}
            >
              <div className="flex flex-col">
                <p className="text-xs text-gray-400">{"001"}</p>
                <ServiceIcon index={0} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-medium text-[#111111]">
                  {"UX Design"}
                </h3>
                <p className="text-sm font-medium text-[#111111] mt-2 mb-4">
                  {"Understand before designing."}
                </p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {
                    "I turn user needs into flows that reduce friction and guesswork, so your product just makes sense."
                  }
                </p>
              </div>
            </Reveal>
            <Reveal
              className="flex flex-col gap-28 border border-gray-200 rounded-lg p-6"
              immediate={false}
              delay={0.12}
            >
              <div className="flex flex-col">
                <p className="text-xs text-gray-400">{"002"}</p>
                <ServiceIcon index={1} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-medium text-[#111111]">
                  {"UI Design"}
                </h3>
                <p className="text-sm font-medium text-[#111111] mt-2 mb-4">
                  {"Clarity, hierarchy, and detail."}
                </p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {
                    "Interfaces that look sharp and drive action, balancing usability with a personality that fits your brand."
                  }
                </p>
              </div>
            </Reveal>
            <Reveal
              className="flex flex-col gap-28 border border-gray-200 rounded-lg p-6"
              immediate={false}
              delay={0.24}
            >
              <div className="flex flex-col">
                <p className="text-xs text-gray-400">{"003"}</p>
                <ServiceIcon index={2} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-medium text-[#111111]">
                  {"Design System"}
                </h3>
                <p className="text-sm font-medium text-[#111111] mt-2 mb-4">
                  {"Consistency that scales."}
                </p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {
                    "Systems that let your team ship faster and stay aligned as the product grows."
                  }
                </p>
              </div>
            </Reveal>
            <Reveal
              className="flex flex-col gap-28 border border-gray-200 rounded-lg p-6"
              immediate={false}
              delay={0.36}
            >
              <div className="flex flex-col">
                <p className="text-xs text-gray-400">{"004"}</p>
                <ServiceIcon index={3} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-medium text-[#111111]">
                  {"Accessibility"}
                </h3>
                <p className="text-sm font-medium text-[#111111] mt-2 mb-4">
                  {"Design for everyone."}
                </p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {
                    "Inclusive, WCAG-compliant experiences that widen your reach, so no one gets left out."
                  }
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
      <section className="px-4 py-16 md:py-24 border-t border-gray-100">
        <Reveal className="max-w-5xl mx-auto" immediate={false}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-4 mb-6 md:mb-8">
            <h2 className="md:sticky md:self-start md:top-4 text-lg leading-[36.4px] tracking-[-0.64px] text-black">
              {"Work"}
            </h2>
            <div>
              <p className="text-sm leading-relaxed text-gray-500">
                {
                  "A selection of projects across product design, interfaces and design systems — built with teams that care about how things look."
                }
              </p>
              <Link
                className="inline-block mt-4 text-sm underline underline-offset-4 text-gray-400 hover:text-[#111111] transition-colors"
                href="/work"
              >
                {"View all"}
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Link className="block group" href="/work/4fett">
              <div className="aspect-[3/4] bg-gray-50 overflow-hidden rounded-lg relative mb-3">
                <Image
                  alt="4fett"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes={imageSizes.homeCard}
                  src="/images/case-4fett.webp"
                  quality={90}
                  fill={true}
                />
              </div>
              <h3 className="text-sm font-medium text-[#111111]">{"4fett"}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{"Web app"}</p>
            </Link>
            <Link className="block group" href="/work/togevent">
              <div className="aspect-[3/4] bg-gray-100 overflow-hidden rounded-lg relative mb-3">
                <Image
                  alt="Togevent"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes={imageSizes.homeCard}
                  src="/images/case-togevent.webp"
                  quality={90}
                  fill={true}
                />
              </div>
              <h3 className="text-sm font-medium text-[#111111]">
                {"Togevent"}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">{"App, Web app"}</p>
            </Link>
            <div>
              <Gallery
                compact={true}
                images={[
                  { src: "/images/napoli3.webp", alt: "Exploration" },
                  { src: "/images/napoli2.webp", alt: "Exploration" },
                  { src: "/images/fantacalcio2.webp", alt: "Exploration" },
                  { src: "/images/fantacalcio3.webp", alt: "Exploration" },
                ]}
              />
              <h3 className="text-sm font-medium text-[#111111]">
                {"Explorations"}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {"Design passions & experiments"}
              </p>
            </div>
          </div>
        </Reveal>
      </section>
      <section className="py-16 md:py-24 border-t border-gray-100 overflow-hidden">
        <div className="px-4"></div>
        <div className="marquee-mask overflow-hidden">
          <div className="animate-marquee flex w-max items-center gap-5 hover:[animation-play-state:paused]">
            <Image
              aria-hidden="false"
              alt="Talent Garden"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/talentgarden.png"
              quality={90}
            />
            <Image
              aria-hidden="false"
              alt="Sketchin"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/sketchin.png"
              quality={90}
            />
            <Image
              aria-hidden="false"
              alt="Tangity"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/tangity.png"
              quality={90}
            />
            <Image
              aria-hidden="false"
              alt="The Wave"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/thewave.png"
              quality={90}
            />
            <Image
              aria-hidden="false"
              alt="Kiwi"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/kiwi.png"
              quality={90}
            />
            <Image
              aria-hidden="false"
              alt="Poste Italiane"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/poste.png"
              quality={90}
            />
            <Image
              aria-hidden="false"
              alt="Barilla"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/barilla.png"
              quality={90}
            />
            <Image
              aria-hidden="false"
              alt="Giro d'Italia"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/giroditalia.png"
              quality={90}
            />
            <Image
              aria-hidden="false"
              alt="E.ON"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/eon.png"
              quality={90}
            />
            <Image
              aria-hidden="false"
              alt="Enel"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/enel.png"
              quality={90}
            />
            <Image
              aria-hidden="false"
              alt="Prada"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/prada.png"
              quality={90}
            />
            <Image
              aria-hidden="false"
              alt="Costa"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/costa.png"
              quality={90}
            />
            <Image
              aria-hidden="false"
              alt="BPER"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/bper.png"
              quality={90}
            />
            <Image
              aria-hidden="false"
              alt="Sanofi"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/sanofi.png"
              quality={90}
            />
            <Image
              aria-hidden="false"
              alt="DHL"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/dhl.png"
              quality={90}
            />
            <Image
              aria-hidden="false"
              alt="Brembo"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/brembo.png"
              quality={90}
            />
            <Image
              aria-hidden="false"
              alt="Mottura"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/mottura.png"
              quality={90}
            />
            <Image
              aria-hidden="false"
              alt="Monogrid"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/monogrid.png"
              quality={90}
            />
            <Image
              aria-hidden="false"
              alt="Tangible"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/tangible.png"
              quality={90}
            />
            <Image
              aria-hidden="false"
              alt="Togevent"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/togevent.png"
              quality={90}
            />
            <Image
              aria-hidden="true"
              alt="Talent Garden"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/talentgarden.png"
              quality={90}
            />
            <Image
              aria-hidden="true"
              alt="Sketchin"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/sketchin.png"
              quality={90}
            />
            <Image
              aria-hidden="true"
              alt="Tangity"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/tangity.png"
              quality={90}
            />
            <Image
              aria-hidden="true"
              alt="The Wave"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/thewave.png"
              quality={90}
            />
            <Image
              aria-hidden="true"
              alt="Kiwi"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/kiwi.png"
              quality={90}
            />
            <Image
              aria-hidden="true"
              alt="Poste Italiane"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/poste.png"
              quality={90}
            />
            <Image
              aria-hidden="true"
              alt="Barilla"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/barilla.png"
              quality={90}
            />
            <Image
              aria-hidden="true"
              alt="Giro d'Italia"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/giroditalia.png"
              quality={90}
            />
            <Image
              aria-hidden="true"
              alt="E.ON"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/eon.png"
              quality={90}
            />
            <Image
              aria-hidden="true"
              alt="Enel"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/enel.png"
              quality={90}
            />
            <Image
              aria-hidden="true"
              alt="Prada"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/prada.png"
              quality={90}
            />
            <Image
              aria-hidden="true"
              alt="Costa"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/costa.png"
              quality={90}
            />
            <Image
              aria-hidden="true"
              alt="BPER"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/bper.png"
              quality={90}
            />
            <Image
              aria-hidden="true"
              alt="Sanofi"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/sanofi.png"
              quality={90}
            />
            <Image
              aria-hidden="true"
              alt="DHL"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/dhl.png"
              quality={90}
            />
            <Image
              aria-hidden="true"
              alt="Brembo"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/brembo.png"
              quality={90}
            />
            <Image
              aria-hidden="true"
              alt="Mottura"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/mottura.png"
              quality={90}
            />
            <Image
              aria-hidden="true"
              alt="Monogrid"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/monogrid.png"
              quality={90}
            />
            <Image
              aria-hidden="true"
              alt="Tangible"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/tangible.png"
              quality={90}
            />
            <Image
              aria-hidden="true"
              alt="Togevent"
              width={195}
              height={82}
              className="h-12 md:h-20 w-auto object-contain shrink-0"
              sizes="240px"
              src="/images/togevent.png"
              quality={90}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
