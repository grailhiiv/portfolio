import imageAsset0 from "../../public/images/home-hero-social-media.webp";
import imageAsset1 from "../../public/images/case-daniel.webp";
import imageAsset2 from "../../public/images/case-togevent.webp";
import imageAsset3 from "../../public/images/napoli3.webp";
import imageAsset4 from "../../public/images/napoli2.webp";
import imageAsset5 from "../../public/images/fantacalcio2.webp";
import imageAsset6 from "../../public/images/fantacalcio3.webp";
import imageAsset7 from "../../public/images/canva.png";
import imageAsset8 from "../../public/images/buffer.png";
import imageAsset9 from "../../public/images/meta.png";
import imageAsset10 from "../../public/images/chatgpt.png";
import imageAsset11 from "../../public/images/analytics.png";
import imageAsset12 from "../../public/images/zapier.png";
import imageAsset13 from "../../public/images/mailchimp.png";
import imageAsset14 from "../../public/images/attio.png";
import imageAsset15 from "../../public/images/wordpress.png";
import imageAsset16 from "../../public/images/sitebulb.png";
import imageAsset17 from "../../public/images/pipedrive.png";
import imageAsset18 from "../../public/images/claude.png";
import { imageSizes } from "@/lib/image-sizes";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal, AnimatedHeading } from "@/components/animation";
import Gallery from "@/components/gallery";
import ServiceIcon from "@/components/service-icon";

export const metadata: Metadata = {
  title: "Grailord Antonio — Social Media Manager",
  description:
    "I help businesses grow their social media presence, create strategic content that connects with the right audience, and streamline lead management through CRM and marketing automation.",
  robots: { index: false, follow: false },
};

const toolLogos = [
  { name: "Canva", image: imageAsset7 },
  { name: "Buffer", image: imageAsset8 },
  { name: "Meta", image: imageAsset9 },
  { name: "ChatGPT", image: imageAsset10 },
  { name: "Google Analytics", image: imageAsset11 },
  { name: "Zapier", image: imageAsset12 },
  { name: "Mailchimp", image: imageAsset13 },
  { name: "Attio", image: imageAsset14 },
  { name: "WordPress", image: imageAsset15 },
  { name: "Sitebulb", image: imageAsset16 },
  { name: "Pipedrive", image: imageAsset17 },
  { name: "Claude", image: imageAsset18 },
];

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
                  "I help businesses grow their social media presence, create strategic content that connects with the right audience, and streamline lead management through CRM and marketing automation."
                }
              </p>
            </Reveal>
          </div>
          <Reveal immediate={true}>
            <div className="aspect-[3/4] md:aspect-square relative overflow-hidden rounded-lg">
              <Image
                alt="Social Media Campaign Designs for Author Daniel G. Miller"
                className="object-cover"
                sizes={imageSizes.portrait}
                src={imageAsset0}
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
                  "I'm a digital marketing specialist based in the Philippines with a background in social media management, SEO, and website management. I currently specialise in social media management, brand growth, CRM, and marketing automation, combining creative strategy with smarter marketing systems to help businesses grow."
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
                  {"Social Media Management"}
                </h3>
                <p className="text-sm font-medium text-[#111111] mt-2 mb-4">
                  {"Strategic content that builds stronger brands."}
                </p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {
                    "Creating and managing content that grows visibility, engages audiences, and strengthens brand presence."
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
                  {"Website Management"}
                </h3>
                <p className="text-sm font-medium text-[#111111] mt-2 mb-4">
                  {"Reliable websites that support business growth."}
                </p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {
                    "Keeping websites secure, updated, and optimised for performance and user experience."
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
                  {"CRM & Lead Management"}
                </h3>
                <p className="text-sm font-medium text-[#111111] mt-2 mb-4">
                  {"Organised leads that build better relationships."}
                </p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {
                    "Streamlining contact management, lead tracking, and follow-ups to keep opportunities moving."
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
                  {"Marketing Automation"}
                </h3>
                <p className="text-sm font-medium text-[#111111] mt-2 mb-4">
                  {"Smarter workflows that save time and effort."}
                </p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {
                    "Automating repetitive tasks and connecting marketing tools to improve efficiency and consistency."
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
                  "A selection of projects showcasing social media management, brand growth, website management, and smarter marketing systems that help businesses strengthen their digital presence."
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
            <Link className="block group" href="/work/daniel">
              <div className="aspect-[3/4] bg-gray-50 overflow-hidden rounded-lg relative mb-3">
                <Image
                  alt="Daniel G. Miller"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes={imageSizes.homeCard}
                  src={imageAsset1}
                  quality={90}
                  fill={true}
                />
              </div>
              <h3 className="text-sm font-medium text-[#111111]">
                {"Daniel G. Miller"}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {"Social Media Management"}
              </p>
            </Link>
            <Link className="block group" href="/work/togevent">
              <div className="aspect-[3/4] bg-gray-100 overflow-hidden rounded-lg relative mb-3">
                <Image
                  alt="Togevent"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes={imageSizes.homeCard}
                  src={imageAsset2}
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
                  { src: imageAsset3.src, alt: "Exploration" },
                  { src: imageAsset4.src, alt: "Exploration" },
                  { src: imageAsset5.src, alt: "Exploration" },
                  { src: imageAsset6.src, alt: "Exploration" },
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
            {[false, true].flatMap((duplicate) =>
              toolLogos.map((logo) => (
                <Image
                  key={`${logo.name}-${duplicate}`}
                  aria-hidden={duplicate}
                  alt={duplicate ? "" : logo.name}
                  width={195}
                  height={82}
                  className="h-12 md:h-20 w-auto object-contain shrink-0"
                  sizes="240px"
                  src={logo.image}
                  quality={90}
                />
              )),
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
