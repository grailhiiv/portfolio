import imageAsset7 from "../../public/images/canva.png";
import imageAsset8 from "../../public/images/buffer.png";
import imageAsset9 from "../../public/images/meta.png";
import imageAsset10 from "../../public/images/chatgpt.png";
import imageAsset12 from "../../public/images/zapier.png";
import imageAsset13 from "../../public/images/mailchimp.png";
import imageAsset14 from "../../public/images/attio.png";
import imageAsset15 from "../../public/images/wordpress.png";
import imageAsset16 from "../../public/images/sitebulb.png";
import imageAsset17 from "../../public/images/pipedrive.png";
import imageAsset18 from "../../public/images/claude.png";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal, AnimatedHeading } from "@/components/animation";
import ServiceIcon from "@/components/service-icon";
import { FeaturedWork } from "@/components/featured-work";
import { HomeShowcase } from "@/components/home-showcase";

export const metadata: Metadata = {
  title: "GrailHiiv",
  description:
    "I create and manage social content, email campaigns, and marketing workflows that help businesses reach their audience and keep opportunities moving.",
  robots: { index: false, follow: false },
};

const toolLogos = [
  { name: "Canva", image: imageAsset7 },
  { name: "Buffer", image: imageAsset8 },
  { name: "Meta", image: imageAsset9 },
  { name: "ChatGPT", image: imageAsset10 },
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
      <section className="home-hero px-4 pt-4 pb-2">
        <div className="home-hero-grid max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-6 items-stretch">
          <div className="flex flex-col justify-center py-4 md:py-16 gap-6 md:gap-10 md:h-full">
            <AnimatedHeading className="home-hero-heading text-2xl md:max-w-[540px] leading-none tracking-[-2.5px]">
              Social media and <span className="text-[#b2b2b2]">marketing systems that help</span> brands connect and grow.
            </AnimatedHeading>
            <Reveal immediate={true}>
              <p className="text-md md:max-w-[540px] leading-relaxed text-gray-400">
                {
                  "I create and manage social content, email campaigns, and marketing workflows that help businesses reach their audience and keep opportunities moving."
                }
              </p>
            </Reveal>
          </div>
          <Reveal immediate={true} className="home-hero-showcase">
            <div className="home-showcase">
              <HomeShowcase />
            </div>
          </Reveal>
        </div>
      </section>
      <section className="px-4 py-16 md:py-24 border-t border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-4">
          <h2 className="section-heading md:sticky md:self-start md:top-4 text-lg leading-[36.4px] tracking-[-0.64px] text-black">
            {"Info"}
          </h2>
          <Reveal immediate={false}>
            <div>
              <p className="text-md leading-relaxed text-gray-500">
                {
                  "I'm a digital marketing specialist with a background in social media, SEO, and website management. My work brings content and marketing systems together."
                }
              </p>
              <Link
                className="inline-block mt-4 text-md underline underline-offset-4 text-gray-400 hover:text-[#111111] transition-colors"
                href="/about"
              >
                {"More about me"}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="px-4 py-16 md:py-24 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="section-heading text-lg leading-[36.4px] tracking-[-0.64px] text-black mb-6 md:mb-8">
            {"Services"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <Reveal
              className="service-card flex flex-col gap-28 border border-gray-200 rounded-lg p-6"
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
                    "Plan, create, and manage social content that helps your brand reach and engage its audience."
                  }
                </p>
              </div>
            </Reveal>
            <Reveal
              className="service-card flex flex-col gap-28 border border-gray-200 rounded-lg p-6"
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
                    "Keep your website updated, secure, and easy for visitors to use."
                  }
                </p>
              </div>
            </Reveal>
            <Reveal
              className="service-card flex flex-col gap-28 border border-gray-200 rounded-lg p-6"
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
                    "Organise contacts, track leads, and manage follow-ups so opportunities are easier to keep moving."
                  }
                </p>
              </div>
            </Reveal>
            <Reveal
              className="service-card flex flex-col gap-28 border border-gray-200 rounded-lg p-6"
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
                    "Connect your marketing tools and automate recurring tasks, from lead follow-ups to email workflows."
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
            <h2 className="section-heading md:sticky md:self-start md:top-4 text-lg leading-[36.4px] tracking-[-0.64px] text-black">
              {"Work"}
            </h2>
            <div>
              <p className="text-md leading-relaxed text-gray-500">
                {
                  "A selection of social media, email, and marketing projects for authors and businesses."
                }
              </p>
              <Link
                className="inline-block mt-4 text-md underline underline-offset-4 text-gray-400 hover:text-[#111111] transition-colors"
                href="/work"
              >
                {"View all work"}
              </Link>
            </div>
          </div>
          <FeaturedWork />
        </Reveal>
      </section>
      <section className="py-16 md:py-24 border-t border-gray-100 overflow-hidden">
        <div className="px-4"></div>
        <div className="home-logo-desktop marquee-mask overflow-hidden">
          <div className="animate-marquee flex w-max items-center gap-5">
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
        <div className="home-logo-mobile">
          {[toolLogos.slice(0, 6), toolLogos.slice(6)].map((row, rowIndex) => (
            <div className="about-logo-row" key={rowIndex}>
              <div className={`about-logo-track${rowIndex === 1 ? " about-logo-track-reverse" : ""}`}>
                {[false, true].map((duplicate) => (
                  <div className="about-logo-group" key={String(duplicate)} aria-hidden={duplicate}>
                    {row.map((logo) => (
                      <div key={logo.name} className="about-logo-item">
                        <Image
                          alt={duplicate ? "" : logo.name}
                          className="object-contain"
                          sizes="33vw"
                          src={logo.image}
                          quality={90}
                          fill
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
