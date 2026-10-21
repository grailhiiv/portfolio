import type { ReactNode } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { Reveal, AnimatedHeading } from "@/components/animation";
import { imageSizes } from "@/lib/image-sizes";

type CaseStudySection = { title: string } & (
  | { content: ReactNode; services?: never }
  | { services: string[]; content?: never }
);

interface CaseStudyContent {
  title: string;
  description: string;
  focus?: string;
  details: { label: string; value: string }[];
  metrics?: { label: string; value: string; growth?: string }[];
  metricsNote?: string;
  sections: CaseStudySection[];
  previousProject?: { href: string; title: string };
  nextProject?: { href: string; title: string };
}

export type CaseStudyProps = CaseStudyContent &
  (
    | { image: StaticImageData; imageAlt: string; showcase?: never }
    | { showcase: ReactNode; image?: never; imageAlt?: never }
  );

export function CaseStudy({
  title,
  description,
  focus,
  image,
  imageAlt,
  showcase,
  details,
  metrics,
  metricsNote,
  sections,
  previousProject,
  nextProject,
}: CaseStudyProps) {
  return (
    <main id="main-content">
      <section className="px-4 pt-10 md:pt-14 pb-10 md:pb-14">
        <div className={`max-w-5xl mx-auto case-study-intro`}>
          <div className="case-study-text-column">
            <div className="case-study-summary">
              <AnimatedHeading
                className="case-study-heading"
                words={title
                  .split(" ")
                  .map((word, index, words) =>
                    [
                      ...(word + (index < words.length - 1 ? "\u00a0" : "")),
                    ].map((text) => ({ text, className: "" })),
                  )}
              />
              <Reveal immediate>
                <p className="case-study-description">{description}</p>
                {focus && <p className="case-study-focus">{focus}</p>}
              </Reveal>
              <Reveal immediate delay={0.12}>
                <dl className="case-study-details">
                  {details.map(({ label, value }) => (
                    <div key={label}>
                      <dt>{label}:</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
            <div className="case-study-sections">
              {!!metrics?.length && (
                <section className="case-study-content-section">
                  <div className="case-study-body-section">
                    <h2 className="case-study-section-title">
                      Metrics & Outcomes
                    </h2>
                    <Reveal>
                      <dl className="case-study-stats">
                        {metrics.map(({ label, value, growth }) => (
                          <div key={label} className="case-study-stat">
                            <dt>{label}</dt>
                            <dd>{value}</dd>
                            {growth && (
                              <span className="case-study-growth">
                                {growth}
                              </span>
                            )}
                          </div>
                        ))}
                      </dl>
                      {metricsNote && (
                        <p className="case-study-metrics-note">
                          <em>{metricsNote}</em>
                        </p>
                      )}
                    </Reveal>
                  </div>
                </section>
              )}
              {sections.map((section) => (
                <section
                  key={section.title}
                  className="case-study-content-section"
                >
                  <div className="case-study-body-section">
                    <h2 className="case-study-section-title">
                      {section.title}
                    </h2>
                    <Reveal>
                      {section.services ? (
                        <ul className="case-study-services">
                          {section.services.map((service) => (
                            <li key={service}>{service}</li>
                          ))}
                        </ul>
                      ) : (
                        <div className="case-study-body-copy">
                          {section.content}
                        </div>
                      )}
                    </Reveal>
                  </div>
                </section>
              ))}
            </div>
          </div>
          <aside className="case-study-image-column">
            {showcase ??
              (image ? (
                <div className="case-study-photo">
                  <Image
                    alt={imageAlt ?? title}
                    className="object-cover"
                    sizes={imageSizes.portrait}
                    src={image}
                    quality={90}
                    fill
                    preload
                  />
                </div>
              ) : null)}
          </aside>
        </div>
      </section>
      {(previousProject || nextProject) && (
        <nav className="case-study-project-nav" aria-label="Project navigation">
          <div className="case-study-project-nav-inner max-w-5xl mx-auto">
            {previousProject && (
              <Link
                className="case-study-project-link"
                href={previousProject.href}
              >
                <span className="case-study-project-direction">
                  ← Previous project
                </span>
                <span className="case-study-project-name">
                  {previousProject.title}
                </span>
              </Link>
            )}
            {nextProject && (
              <Link
                className="case-study-project-link case-study-project-link-next"
                href={nextProject.href}
              >
                <span className="case-study-project-direction">
                  Next project →
                </span>
                <span className="case-study-project-name">
                  {nextProject.title}
                </span>
              </Link>
            )}
          </div>
        </nav>
      )}
    </main>
  );
}
