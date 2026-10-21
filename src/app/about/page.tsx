import imageAsset0 from "../../../public/images/about-hero.webp";
import imageAsset1 from "../../../public/images/canva.png";
import imageAsset2 from "../../../public/images/buffer.png";
import imageAsset3 from "../../../public/images/meta.png";
import imageAsset4 from "../../../public/images/chatgpt.png";
import imageAsset5 from "../../../public/images/analytics.png";
import imageAsset6 from "../../../public/images/zapier.png";
import imageAsset7 from "../../../public/images/mailchimp.png";
import imageAsset8 from "../../../public/images/attio.png";
import imageAsset9 from "../../../public/images/wordpress.png";
import imageAsset10 from "../../../public/images/sitebulb.png";
import imageAsset11 from "../../../public/images/pipedrive.png";
import imageAsset12 from "../../../public/images/claude.png";
import imageAsset13 from "../../../public/images/icon.png";
import imageAsset14 from "../../../public/images/penguin.png";
import imageAsset15 from "../../../public/images/macmillan.png";
import imageAsset16 from "../../../public/images/graywolf.png";
import { imageSizes } from "@/lib/image-sizes";
import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/animation";

export const metadata: Metadata = {
  title: "About Grailord Antonio",
  description:
    "I'm Grailord Antonio, a digital marketing specialist based in the Philippines with a background in social media management, SEO, and WordPress management.",
  robots: { index: false, follow: false },
};

const workExperience = [
  {
    company: "Independent",
    role: "Freelance and Partnerships",
    period: null,
    logo: imageAsset13,
    alt: "Freelancer",
    delay: 0,
    paragraphs: [
      "I work with authors and businesses on social media management, content strategy, SEO, and website management. My work includes planning content, supporting websites, and helping clients maintain a consistent online presence.",
    ],
  },
  {
    company: "Penguin Random House",
    role: "Social Media Manager",
    period: "2022 — 2026",
    logo: imageAsset14,
    alt: "Penguin Random House",
    delay: 0.12,
    paragraphs: [
      "As a Social Media Manager, I managed content for author and book marketing campaigns across multiple social media profiles. I developed monthly content calendars and coordinated scheduling and publishing through Buffer.",
      "I created platform-specific captions, branded graphics, and promotional materials to support consistent author campaigns.",
    ],
  },
  {
    company: "Pan Macmillan",
    role: "SEO Specialist",
    period: "2015 — 2022",
    logo: imageAsset15,
    alt: "Pan Macmillan",
    delay: 0.24,
    paragraphs: [
      "I progressed from Junior to Senior SEO Specialist, working on technical SEO and website optimisation to support organic search visibility.",
      "My work included technical audits, on-page optimisation, structured data, internal linking, and performance improvements. I also collaborated with development teams on website redesigns and migrations, helping maintain SEO practices during those changes.",
    ],
  },
  {
    company: "Graywolf Press",
    role: "Lead Researcher",
    period: "2012 — 2015",
    logo: imageAsset16,
    alt: "Graywolf Press",
    delay: 0.36,
    paragraphs: [
      "As a Lead Researcher, I identified prospective authors and researched publications to support sales outreach. I gathered contact information, organised prospect records, and maintained research data for the outreach team.",
    ],
  },
];

const clientLogos = [
  { name: "Canva", image: imageAsset1 },
  { name: "Buffer", image: imageAsset2 },
  { name: "Meta", image: imageAsset3 },
  { name: "ChatGPT", image: imageAsset4 },
  { name: "Google Analytics", image: imageAsset5 },
  { name: "Zapier", image: imageAsset6 },
  { name: "Mailchimp", image: imageAsset7 },
  { name: "Attio", image: imageAsset8 },
  { name: "WordPress", image: imageAsset9 },
  { name: "Sitebulb", image: imageAsset10 },
  { name: "Pipedrive", image: imageAsset11 },
  { name: "Claude", image: imageAsset12 },
];

export default function AboutPage() {
  return (
    <main id="main-content">
      <h1 className="sr-only" data-audit-heading="true">
        About Grailord Antonio
      </h1>
      <section className="px-4 pb-4 md:pb-14 pt-4">
        <div className="max-w-5xl mx-auto">
          <Reveal immediate>
            <div className="aspect-[3/4] md:aspect-[2/1] rounded-lg relative overflow-hidden">
              <Image
                alt="Portrait of Grailord Antonio"
                className="object-cover"
                sizes={imageSizes.aboutHero}
                src={imageAsset0}
                quality={90}
                fill
                preload
              />
            </div>
          </Reveal>
        </div>
      </section>
      <section className="px-4 py-10 pt-4 md:py-12 border-t border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-6">
          <h2 className="section-heading md:sticky md:self-start md:top-4 text-lg leading-[36.4px] tracking-[-0.64px] text-black">
            Info
          </h2>
          <Reveal className="space-y-4 text-md leading-relaxed text-gray-500">
            <p>
              {
                "I'm Grailord Antonio, a digital marketing specialist based in the Philippines. My background spans social media management, SEO, and WordPress management."
              }
            </p>
            <p>
              {
                "I've worked with authors and businesses on content, search, and websites. Today, I focus on social media management, brand growth, and marketing automation—bringing creative work and practical systems together to help businesses reach their audiences and organise their marketing."
              }
            </p>
          </Reveal>
        </div>
      </section>
      <section className="px-4 py-10 md:py-12 border-t border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-6">
          <h2 className="section-heading md:sticky md:self-start md:top-4 text-lg leading-[36.4px] tracking-[-0.64px] text-black">
            Work Experience
          </h2>
          <div className="divide-y divide-gray-100">
            {workExperience.map((experience) => (
              <Reveal
                key={experience.company}
                className="py-10 first:pt-0"
                delay={experience.delay}
              >
                <div className="flex items-end justify-between mb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0">
                      <Image
                        alt={experience.alt}
                        className="object-cover"
                        sizes="48px"
                        src={experience.logo}
                        quality={90}
                        fill
                      />
                    </div>
                    <div>
                      <h3 className="text-md font-medium text-[#111111]">
                        {experience.company}
                      </h3>
                      <p className="text-sm text-gray-400 mt-0.5">
                        {experience.role}
                      </p>
                    </div>
                  </div>
                  {experience.period && (
                    <span className="text-xs text-gray-400 shrink-0 ml-4">
                      {experience.period}
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  {experience.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-sm text-gray-500 leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="px-4 py-10 md:py-12 border-t border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-6">
          <h2 className="section-heading md:sticky md:self-start md:top-4 text-lg leading-[36.4px] tracking-[-0.64px] text-black">
            Tools & Platforms
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-x-4 items-center">
            {clientLogos.map((logo) => (
              <div key={logo.name} className="relative h-15 md:h-20 w-full">
                <Image
                  alt={logo.name}
                  className="object-contain object-left"
                  sizes={imageSizes.clientLogo}
                  src={logo.image}
                  quality={90}
                  fill
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
