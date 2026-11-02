import imageAsset0 from "../../../public/images/about-hero.webp";
import imageAsset13 from "../../../public/images/icon.png";
import imageAsset14 from "../../../public/images/greenleaf.png";
import imageAsset15 from "../../../public/images/amplify.png";
import imageAsset16 from "../../../public/images/graywolf.png";
import { imageSizes } from "@/lib/image-sizes";
import type { Metadata } from "next";
import Image from "next/image";
import { AnimatedHeading, Reveal } from "@/components/animation";
import { Testimonials } from "@/components/testimonials";

export const metadata: Metadata = {
  title: "About Grailord Antonio",
  description:
    "I'm Grailord Antonio, a digital marketing specialist with a background in social media management, SEO, and WordPress management.",
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
    company: "Greenleaf Book Group",
    role: "Social Media Manager",
    period: "2022 — 2026",
    logo: imageAsset14,
    alt: "Greenleaf Book Group",
    delay: 0.12,
    paragraphs: [
      "As a Social Media Manager, I managed content for author and book marketing campaigns across multiple social media profiles. I developed monthly content calendars and coordinated scheduling and publishing through Buffer.",
      "I created platform-specific captions, branded graphics, and promotional materials to support consistent author campaigns.",
    ],
  },
  {
    company: "Amplify Publishing Group",
    role: "SEO Specialist",
    period: "2015 — 2022",
    logo: imageAsset15,
    alt: "Amplify Publishing Group",
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

export default function AboutPage() {
  return (
    <main id="main-content">
      <section className="about-hero px-4 pt-4 pb-2">
        <div className="about-hero-grid max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-6 items-stretch">
          <div className="flex flex-col justify-center py-4 md:py-16 md:h-full">
            <AnimatedHeading className="home-hero-heading text-2xl md:max-w-[540px] leading-none tracking-[-2.5px]">
              A little creative, <span className="text-[#b2b2b2]">a little technical,</span> always curious.
            </AnimatedHeading>
          </div>
          <Reveal immediate className="about-hero-image">
            <div className="about-hero-image-frame aspect-[3/4] rounded-lg relative overflow-hidden">
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
                "I'm Grailord Antonio, a digital marketing specialist. My background spans social media management, SEO, and WordPress management."
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
            Client Testimonials</h2>
          <Testimonials />
        </div>
      </section>
    </main>
  );
}
