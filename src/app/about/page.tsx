import { imageSizes } from "@/lib/image-sizes";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal, AnimatedHeading } from "@/components/animation";

export const metadata: Metadata = {
  title: "About — Grailord Antonio",
  description:
    "Designer with 10+ years of experience across UX, UI and design systems. Based in Italy, working with startups, agencies and consulting environments.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <main id="main-content">
      <h1 className="sr-only" data-audit-heading="true">
        About Grailord Antonio
      </h1>
      <section className="px-4 pb-4 md:pb-14 pt-4">
        <div className="max-w-5xl mx-auto">
          <Reveal immediate={true}>
            <div className="aspect-[3/4] md:aspect-[2/1] rounded-lg relative overflow-hidden">
              <Image
                alt="Portrait of Grailord Antonio"
                className="object-cover"
                sizes={imageSizes.aboutHero}
                src="/images/about-hero.webp"
                quality={90}
                fill={true}
                preload={true}
              />
            </div>
          </Reveal>
        </div>
      </section>
      <section className="px-4 py-10 pt-4 md:py-12 border-t border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-6">
          <h2 className="md:sticky md:self-start md:top-4 text-lg leading-[36.4px] tracking-[-0.64px] text-black">
            {"Info"}
          </h2>
          <Reveal
            className="space-y-4 text-md leading-relaxed text-gray-500"
            immediate={false}
          >
            <p>
              {
                "I'm Arturo Spatino, a digital product designer based in Italy with over 10 years of experience designing digital products across startups, agencies and consulting environments."
              }
            </p>
            <p>
              {
                "Over the years, I've worked across UX, UI and design systems, helping teams create products that are clearer, more consistent and easier to use."
              }
            </p>
            <p>
              {
                "My career evolved from hands-on product design to leading teams, shaping design processes and mentoring designers through collaboration and training."
              }
            </p>
            <p>
              {
                "Today, I work as an independent designer, partnering with companies to build thoughtful digital experiences that balance user needs, business goals and scalable systems."
              }
            </p>
            <p>
              {
                "My work is driven by curiosity, clarity and a constant desire to improve how things work — both for people and for the teams building them."
              }
            </p>
          </Reveal>
        </div>
      </section>
      <section className="px-4 py-10 md:py-12 border-t border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-6">
          <h2 className="md:sticky md:self-start md:top-4 text-lg leading-[36.4px] tracking-[-0.64px] text-black">
            {"Work Experience"}
          </h2>
          <div className="divide-y divide-gray-100">
            <Reveal className="py-10 first:pt-0" immediate={false}>
              <div className="flex items-end justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0">
                    <Image
                      alt="Independent"
                      className="object-cover"
                      sizes="48px"
                      src="/icon.png"
                      quality={90}
                      fill={true}
                    />
                  </div>
                  <div>
                    <h3 className="text-md font-medium text-[#111111]">
                      {"Independent"}
                    </h3>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {"Freelance and partnerships"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-gray-500 leading-relaxed">
                  {
                    "I’m working with product teams and startups to help them build digital experiences that are clearer, more consistent and easier to use."
                  }
                </p>
              </div>
            </Reveal>
            <Reveal className="py-10 first:pt-0" immediate={false} delay={0.12}>
              <div className="flex items-end justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0">
                    <Image
                      alt="Nebula"
                      className="object-cover"
                      sizes="48px"
                      src="/images/nebula.png"
                      quality={90}
                      fill={true}
                    />
                  </div>
                  <div>
                    <h3 className="text-md font-medium text-[#111111]">
                      {"Nebula"}
                    </h3>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {"Co-founder and Lead of Design"}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 shrink-0 ml-4">
                  {"2024 — Today"}
                </span>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-gray-500 leading-relaxed">
                  {
                    "Nebula is an independent tech company focused on building digital products and tailored solutions for startups and businesses, combining design, technology and AI to create intuitive user experiences."
                  }
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {
                    "As Co-Founder and Lead Designer, I led the design direction across products, brand and user experience, helping shape the company vision from the ground up. I worked across UX, UI and design systems, while also guiding design decisions, collaboration processes and product strategy."
                  }
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {
                    "During this experience, I contributed to the launch of Togevent, a platform designed to simplify event organization through a shared digital space for guests, updates, media and communication."
                  }
                </p>
              </div>
            </Reveal>
            <Reveal className="py-10 first:pt-0" immediate={false} delay={0.24}>
              <div className="flex items-end justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0">
                    <Image
                      alt="Bip Red"
                      className="object-cover"
                      sizes="48px"
                      src="/images/bipred.png"
                      quality={90}
                      fill={true}
                    />
                  </div>
                  <div>
                    <p className="text-md font-medium text-[#111111]">
                      {"Bip Red"}
                    </p>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {"Senior UI Designer"}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 shrink-0 ml-4">
                  {"2022 — 2025"}
                </span>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-gray-500 leading-relaxed">
                  {
                    "BIP Red is the digital experience and innovation unit of BIP Group, focused on designing products and services that connect strategy, technology and user experience for large-scale companies and organizations."
                  }
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {
                    "As a Senior UI Designer, I worked on digital platforms and product experiences across different industries, collaborating with multidisciplinary teams to transform complex requirements into accessible, scalable and visually consistent interfaces."
                  }
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {
                    "My work focused on UI design, design systems and product consistency, contributing to the creation of cohesive user experiences aligned with both business objectives and user needs."
                  }
                </p>
              </div>
            </Reveal>
            <Reveal className="py-10 first:pt-0" immediate={false} delay={0.36}>
              <div className="flex items-end justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0">
                    <Image
                      alt="The Wave Studio"
                      className="object-cover"
                      sizes="48px"
                      src="/images/thewavestudio.png"
                      quality={90}
                      fill={true}
                    />
                  </div>
                  <div>
                    <p className="text-md font-medium text-[#111111]">
                      {"The Wave Studio"}
                    </p>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {"Lead UX / UI Designer"}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 shrink-0 ml-4">
                  {"2020 — 2022"}
                </span>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-gray-500 leading-relaxed">
                  {
                    "The Wave is a digital agency focused on designing and developing digital products, combining strategy, design and technology to create scalable experiences for startups and established companies."
                  }
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {
                    "As Lead Designer, I led design activities across multiple digital products and client projects, collaborating with cross-functional teams to shape user experiences from concept to delivery."
                  }
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {
                    "My role combined product thinking, UI design and design systems, while also guiding design direction, team collaboration and internal processes. Alongside project work, I was involved in training and mentoring activities, supporting the growth of junior designers and helping teams develop stronger design practices and workflows."
                  }
                </p>
              </div>
            </Reveal>
            <Reveal className="py-10 first:pt-0" immediate={false} delay={0.48}>
              <div className="flex items-end justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0">
                    <Image
                      alt="SEO Tester Online"
                      className="object-cover"
                      sizes="48px"
                      src="/images/seotesteronline.png"
                      quality={90}
                      fill={true}
                    />
                  </div>
                  <div>
                    <p className="text-md font-medium text-[#111111]">
                      {"SEO Tester Online"}
                    </p>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {"UX / UI Designer"}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 shrink-0 ml-4">
                  {"2018 — 2020"}
                </span>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-gray-500 leading-relaxed">
                  {
                    "SEO Tester Online is an all-in-one SEO platform used by marketers, agencies and businesses to improve website visibility through technical analysis, keyword research and optimization tools."
                  }
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {
                    "As UI/UX Designer, I worked on the evolution of the platform experience, designing interfaces and user flows aimed at simplifying complex SEO processes into more accessible and intuitive interactions."
                  }
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {
                    "My work focused on improving usability, visual consistency and product scalability across different tools and dashboards, collaborating closely with product and development teams to enhance both user experience and platform clarity."
                  }
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
      <section className="px-4 py-10 md:py-12 border-t border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-6">
          <h2 className="md:sticky md:self-start md:top-4 text-lg leading-[36.4px] tracking-[-0.64px] text-black">
            {"Clients"}
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-x-4 items-center">
            <div className="relative h-15 md:h-20 w-full">
              <Image
                alt="Talent Garden"
                className="object-contain object-left"
                sizes={imageSizes.clientLogo}
                src="/images/talentgarden.png"
                quality={90}
                fill={true}
              />
            </div>
            <div className="relative h-15 md:h-20 w-full">
              <Image
                alt="Sketchin"
                className="object-contain object-left"
                sizes={imageSizes.clientLogo}
                src="/images/sketchin.png"
                quality={90}
                fill={true}
              />
            </div>
            <div className="relative h-15 md:h-20 w-full">
              <Image
                alt="Tangity"
                className="object-contain object-left"
                sizes={imageSizes.clientLogo}
                src="/images/tangity.png"
                quality={90}
                fill={true}
              />
            </div>
            <div className="relative h-15 md:h-20 w-full">
              <Image
                alt="The Wave"
                className="object-contain object-left"
                sizes={imageSizes.clientLogo}
                src="/images/thewave.png"
                quality={90}
                fill={true}
              />
            </div>
            <div className="relative h-15 md:h-20 w-full">
              <Image
                alt="Kiwi"
                className="object-contain object-left"
                sizes={imageSizes.clientLogo}
                src="/images/kiwi.png"
                quality={90}
                fill={true}
              />
            </div>
            <div className="relative h-15 md:h-20 w-full">
              <Image
                alt="Poste Italiane"
                className="object-contain object-left"
                sizes={imageSizes.clientLogo}
                src="/images/poste.png"
                quality={90}
                fill={true}
              />
            </div>
            <div className="relative h-15 md:h-20 w-full">
              <Image
                alt="Barilla"
                className="object-contain object-left"
                sizes={imageSizes.clientLogo}
                src="/images/barilla.png"
                quality={90}
                fill={true}
              />
            </div>
            <div className="relative h-15 md:h-20 w-full">
              <Image
                alt="Giro d'Italia"
                className="object-contain object-left"
                sizes={imageSizes.clientLogo}
                src="/images/giroditalia.png"
                quality={90}
                fill={true}
              />
            </div>
            <div className="relative h-15 md:h-20 w-full">
              <Image
                alt="E.ON"
                className="object-contain object-left"
                sizes={imageSizes.clientLogo}
                src="/images/eon.png"
                quality={90}
                fill={true}
              />
            </div>
            <div className="relative h-15 md:h-20 w-full">
              <Image
                alt="Enel"
                className="object-contain object-left"
                sizes={imageSizes.clientLogo}
                src="/images/enel.png"
                quality={90}
                fill={true}
              />
            </div>
            <div className="relative h-15 md:h-20 w-full">
              <Image
                alt="Prada"
                className="object-contain object-left"
                sizes={imageSizes.clientLogo}
                src="/images/prada.png"
                quality={90}
                fill={true}
              />
            </div>
            <div className="relative h-15 md:h-20 w-full">
              <Image
                alt="Costa"
                className="object-contain object-left"
                sizes={imageSizes.clientLogo}
                src="/images/costa.png"
                quality={90}
                fill={true}
              />
            </div>
            <div className="relative h-15 md:h-20 w-full">
              <Image
                alt="BPER"
                className="object-contain object-left"
                sizes={imageSizes.clientLogo}
                src="/images/bper.png"
                quality={90}
                fill={true}
              />
            </div>
            <div className="relative h-15 md:h-20 w-full">
              <Image
                alt="Sanofi"
                className="object-contain object-left"
                sizes={imageSizes.clientLogo}
                src="/images/sanofi.png"
                quality={90}
                fill={true}
              />
            </div>
            <div className="relative h-15 md:h-20 w-full">
              <Image
                alt="DHL"
                className="object-contain object-left"
                sizes={imageSizes.clientLogo}
                src="/images/dhl.png"
                quality={90}
                fill={true}
              />
            </div>
            <div className="relative h-15 md:h-20 w-full">
              <Image
                alt="Brembo"
                className="object-contain object-left"
                sizes={imageSizes.clientLogo}
                src="/images/brembo.png"
                quality={90}
                fill={true}
              />
            </div>
            <div className="relative h-15 md:h-20 w-full">
              <Image
                alt="Mottura"
                className="object-contain object-left"
                sizes={imageSizes.clientLogo}
                src="/images/mottura.png"
                quality={90}
                fill={true}
              />
            </div>
            <div className="relative h-15 md:h-20 w-full">
              <Image
                alt="Monogrid"
                className="object-contain object-left"
                sizes={imageSizes.clientLogo}
                src="/images/monogrid.png"
                quality={90}
                fill={true}
              />
            </div>
            <div className="relative h-15 md:h-20 w-full">
              <Image
                alt="Tangible"
                className="object-contain object-left"
                sizes={imageSizes.clientLogo}
                src="/images/tangible.png"
                quality={90}
                fill={true}
              />
            </div>
            <div className="relative h-15 md:h-20 w-full">
              <Image
                alt="Togevent"
                className="object-contain object-left"
                sizes={imageSizes.clientLogo}
                src="/images/togevent.png"
                quality={90}
                fill={true}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
