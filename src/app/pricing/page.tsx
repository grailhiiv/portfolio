import type { Metadata } from "next";
import { AnimatedHeading } from "@/components/animation";
import ServiceIcon from "@/components/service-icon";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Explore social media management packages and optional website care, SEO audits, CRM setup, and automation services.",
  robots: { index: false, follow: false },
};

const plans = [
  {
    name: "Essentials",
    description:
      "A strong foundation for businesses that want a consistent, professional presence across their key social channels.",
    price: "$650",
    cta: "Discuss Essentials",
    features: [
      "12 original content pieces per month",
      "Management of up to 2 social media profiles",
      "Initial strategy and monthly content planning",
      "Branded graphics and captions",
      "Scheduling and publishing",
      "Routine community management, up to 2 hours per month",
      "Monthly performance report with recommendations",
      "One round of revisions per monthly content batch",
    ],
  },
  {
    name: "Growth",
    description:
      "For businesses ready to publish more often and connect with their audience through a mix of graphics and short-form video.",
    price: "$1,100",
    cta: "Discuss Growth",
    features: [
      "20 original content pieces per month, including up to 4 short videos",
      "Management of up to 3 social media profiles",
      "Initial strategy and monthly content planning",
      "Branded graphics and captions",
      "Scheduling and publishing",
      "Routine community management, up to 3 hours per month",
      "Monthly performance report with recommendations",
      "One 30-minute strategy call per month",
      "One round of revisions per monthly content batch",
    ],
  },
  {
    name: "Complete",
    description:
      "More content and ongoing support for the website and systems behind your marketing.",
    price: "$1,750",
    cta: "Discuss Complete",
    features: [
      "24 original content pieces per month, including up to 6 short videos",
      "Management of up to 3 social media profiles",
      "Initial strategy and monthly content planning",
      "Branded graphics and captions",
      "Scheduling and publishing",
      "Routine community management, up to 4 hours per month",
      "Monthly performance report with recommendations",
      "One 30-minute strategy call per month",
      "One round of revisions per monthly content batch",
      "Website care for one existing WordPress site, up to 2 hours per month",
      "Minor maintenance for one existing CRM and one existing automation workflow, up to 2 hours per month combined",
    ],
  },
];

const services = [
  {
    name: "Website Care",
    intro:
      "Keep your existing WordPress site current with routine updates, backup checks, and small content changes.",
    details:
      "Includes support for one existing WordPress site and up to two hours of work per month. Hosting, paid licenses, major changes, and repairs to pre-existing problems are quoted separately.",
    price: "$250",
    period: "month",
    cta: "Discuss Website Care",
  },
  {
    name: "SEO Audit",
    intro:
      "Understand what may be holding your site back in search and where to focus your efforts.",
    details:
      "Includes a technical and on-page review of one website, a prioritized findings report, and practical recommendations. Implementation is quoted separately.",
    price: "$450",
    period: "project",
    cta: "Discuss an SEO Audit",
  },
  {
    name: "CRM Setup",
    intro:
      "Get your customer information and sales process organized in a CRM that fits the way you work.",
    details:
      "A starting scope includes configuration of one CRM, one pipeline, and a basic workflow. Additional pipelines, integrations, data migration, and complex automations are quoted separately.",
    price: "$600",
    period: "project",
    cta: "Discuss CRM Setup",
  },
  {
    name: "Automation Build",
    intro:
      "Save time on repeat tasks with a workflow designed around your goals and existing tools.",
    details:
      "A starting scope includes one workflow connecting up to two existing tools. Complex logic, additional integrations, ongoing monitoring, and software fees are quoted separately.",
    price: "$750",
    period: "project",
    cta: "Discuss an Automation",
  },
];

const faqs = [
  {
    question: "What does the starting price cover?",
    answers: [
      "Each monthly package covers the content planning, writing, design, scheduling, publishing, community management, and reporting listed in the package. Starting prices apply to the standard scope shown above. If your needs require additional platforms, content, or support, I’ll provide a tailored quote before work begins.",
    ],
  },
  {
    question: "How are content pieces counted?",
    answers: [
      "One original post, carousel, or short video counts as one content piece. When that piece is adapted and shared across your selected profiles, it still counts as one piece.",
      "Video edits in Growth and Complete are included in the monthly content count. Substantially different content created specifically for another platform is scoped separately.",
    ],
  },
  {
    question: "What do short videos include?",
    answers: [
      "Short videos are edited from footage you provide and are designed for formats such as Reels, TikTok, or YouTube Shorts. The standard scope includes basic editing, captions, and videos up to 60 seconds.",
      "Filming, advanced animation, extensive footage sourcing, and more complex edits can be quoted separately.",
    ],
  },
  {
    question: "What do I need to provide?",
    answers: [
      "You’ll provide access to the relevant accounts, brand assets, and the photos, footage, product information, or other materials needed for your content.",
      "Before work begins, we’ll agree on a process and deadlines for submitting materials and approving content. Delayed materials or approvals may affect the publishing schedule.",
    ],
  },
  {
    question: "What does community management include?",
    answers: [
      "Community management includes routine monitoring and replies to comments and direct messages across your selected profiles, within your package’s monthly time allowance.",
      "Monitoring takes place on agreed business days and hours. I’ll refer sensitive issues, detailed customer support requests, and questions requiring your input to you. If your account needs support beyond the included allowance, I’ll discuss additional options with you before proceeding.",
    ],
  },
  {
    question: "How do content reviews and revisions work?",
    answers: [
      "You’ll receive your planned content for review before it is published. Each package includes one round of consolidated revisions per monthly content batch.",
      "Requests that change the agreed direction, require substantial new content, or exceed the included revision round may be quoted separately.",
    ],
  },
  {
    question: "What is included in the monthly report?",
    answers: [
      "Your report summarizes relevant performance measures across your managed profiles, highlights what worked, and identifies practical opportunities for the following month. Metrics may include reach, engagement, audience growth, and link activity where available.",
      "Growth and Complete also include a monthly 30-minute strategy call to discuss the report and next steps.",
    ],
  },
  {
    question: "What does Complete include for my website and systems?",
    answers: [
      "Complete includes up to two hours per month of care for one existing WordPress site. This can cover routine updates, backup checks, and small content changes.",
      "It also includes a separate allowance of up to two hours per month for minor maintenance across one existing CRM and one existing automation workflow.",
      "I’ll review your website and systems before confirming the scope. Repairs to pre-existing problems, new builds, major changes, and work beyond the included allowances are quoted separately. Unused monthly hours do not roll over.",
    ],
  },
  {
    question: "How do payment and cancellation work?",
    answers: [
      "Monthly packages are invoiced in advance. The initial term and any onboarding requirements are confirmed in your agreement before work begins. After the initial term, the service continues month to month and can be cancelled with 30 days’ written notice.",
      "Project work is quoted separately, with payment milestones confirmed before work begins. Additional work outside the agreed scope is quoted separately for your approval.",
    ],
  },
  {
    question: "Do you guarantee results?",
    answers: [
      "I don’t guarantee a specific follower count, search ranking, number of leads, or sales result. My work focuses on consistent execution, useful reporting, and making informed improvements over time.",
    ],
  },
];

function emailLink(subject: string) {
  return `mailto:social@grailhiiv.com?subject=${encodeURIComponent(subject)}`;
}

export default function PricingPage() {
  return (
    <main id="main-content">
      <section className="px-4 pt-10 md:pt-14 pb-12 md:pb-25">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-6">
          <div className="hidden md:block" />
          <AnimatedHeading className="text-2xl leading-[1.05] md:leading-[68px] tracking-[-2.56px]">
            Social media management <span className="text-[#b2b2b2]">packages and pricing</span> for your business.
          </AnimatedHeading>
        </div>
      </section>
      <div className="pricing-container">
        <section
          id="packages"
          className="pricing-packages"
          aria-label="Social media packages"
        >
          <div className="pricing-plan-grid">
            {plans.map((plan, index) => (
              <article
                className={`pricing-plan ${index === 1 ? "pricing-plan-featured" : ""} border border-gray-200 rounded-lg p-6`}
                key={plan.name}
              >
                <h2 className="text-xl font-medium">{plan.name}</h2>
                <p className="pricing-plan-description">{plan.description}</p>
                <div className="pricing-plan-price">
                  <span>From</span>
                  <p>
                    {plan.price} <small>USD / month</small>
                  </p>
                </div>
                <ul className="pricing-plan-features">
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <a className="pricing-button" href={emailLink(plan.cta)}>
                  {plan.cta}
                  <span aria-hidden="true">→</span>
                </a>
              </article>
            ))}
          </div>
          <p className="pricing-package-note">
            One content piece is an original post, carousel, or short video.
            Adapted versions shared across your selected profiles count as one
            piece. Video edits use footage you provide. Advertising, software
            subscriptions, hosting, and paid licenses are separate. Every
            engagement begins with an agreed scope.
          </p>
        </section>
      </div>
      <section className="pricing-section" aria-labelledby="services-heading">
        <div className="pricing-container">
          <h2
            id="services-heading"
            className="pricing-section-heading section-heading text-lg leading-[36.4px] tracking-[-0.64px] text-black mb-6 md:mb-8"
          >
            Add-ons
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {services.map((service, index) => (
              <article
                className="pricing-addon-card service-card flex flex-col border border-gray-200 rounded-lg p-6"
                key={service.name}
              >
                <div>
                  <p className="text-xs text-gray-400">
                    {String(index + 1).padStart(3, "0")}
                  </p>
                  <div
                    className={
                      index === 2 ? "pricing-crm-icon" : index > 0 ? "pricing-enlarged-icon" : undefined
                    }
                  >
                    <ServiceIcon index={[4, 7, 5, 6][index]} />
                  </div>
                </div>
                <div className="pricing-addon-content">
                  <h3 className="text-xl font-medium text-[#111111]">
                    {service.name}
                  </h3>
                  <p className="pricing-addon-intro">{service.intro}</p>
                  <p className="pricing-addon-details">{service.details}</p>
                  <div className="pricing-addon-action">
                    <div className="pricing-service-price">
                      <span>From</span>
                      <p>
                        {service.price} <small>USD / {service.period}</small>
                      </p>
                    </div>
                    <a
                      className="pricing-text-link"
                      href={emailLink(service.cta)}
                    >
                      {service.cta} <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="pricing-section" aria-labelledby="faq-heading">
        <div className="pricing-container pricing-faq-layout">
          <h2
            id="faq-heading"
            className="pricing-section-heading section-heading text-lg leading-[36.4px] tracking-[-0.64px] text-black mb-6 md:mb-8"
          >
            FAQs
          </h2>
          <div className="pricing-faq-list">
            {faqs.map((faq, index) => (
              <details
                className="pricing-faq"
                name="pricing-faq"
                key={faq.question}
                open={index === 0 ? true : undefined}
              >
                <summary>
                  {faq.question}
                  <span aria-hidden="true" />
                </summary>
                <div>
                  {faq.answers.map((answer) => (
                    <p key={answer}>{answer}</p>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
