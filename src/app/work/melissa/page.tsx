import type { Metadata } from "next";
import { CaseStudy } from "@/components/case-study";
import { MelissaShowcase } from "@/components/melissa-showcase";

const description =
  "An integrated email and social media campaign designed to build anticipation, engage readers, and turn audience interest into book pre-orders.";

export const metadata: Metadata = {
  title: "Melissa Castro Case Study",
  description,
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <CaseStudy
      title="A 30-Day Book Launch Campaign That Delivered a 100% Pre-Order Sales Goal"
      description={description}
      showcase={<MelissaShowcase />}
      details={[
        { label: "Client", value: "Melissa Castro" },
        {
          label: "Focus",
          value: "Social Media Management, Email Marketing, Content Strategy",
        },
        { label: "Project", value: "Intrinsic Leadership Book Launch" },
        { label: "Duration", value: "30 Days" },
      ]}
      metrics={[
        { value: "112%", label: "Sales Goal", growth: "+12%" },
        { value: "30 Days", label: "Campaign Duration" },
        { value: "72%", label: "Email Open Rate" },
        { value: "16%", label: "Email Click Rate" },
      ]}
      metricsNote="Email engagement metrics reflect one featured launch email, not campaign-wide averages."
      sections={[
        {
          title: "Challenge",
          content: (
            <>
              <p>
                Melissa Castro, a leadership coach and author, was preparing to
                launch <em>Intrinsic Leadership</em>, a book designed to help
                millennials build confidence, overcome burnout, and lead with
                purpose.
              </p>
              <p>
                To secure publication, the campaign needed to achieve its
                required pre-order sales target within just 30 days. The
                challenge was to generate awareness, mobilise her existing
                community, and convert audience interest into confirmed book
                pre-orders within a limited timeframe.
              </p>
            </>
          ),
        },
        {
          title: "Solution",
          content: (
            <>
              <p>
                A coordinated four-week marketing campaign combined segmented
                email outreach, platform-specific social media content, and
                video storytelling to build anticipation and encourage
                pre-orders.
              </p>
              <p>
                The strategy focused on reaching different audience segments
                through Instagram, Facebook, LinkedIn, and selected TikTok
                content. Promotional videos, personal stories, leadership
                insights, and interactive content helped communicate the book's
                value while maintaining consistent messaging.
              </p>
              <p>
                A structured content calendar and targeted email sequences
                supported the campaign, with clear calls to action designed to
                turn engagement into pre-order activity.
              </p>
            </>
          ),
        },
        {
          title: "What I Did",
          services: [
            "Email Marketing Strategy",
            "Audience Segmentation",
            "Social Media Content Strategy",
            "Content Planning & Scheduling",
            "Social Media Content Creation",
            "Video & Reels Production",
            "Community Engagement",
            "Campaign Performance Tracking",
          ],
        },
        {
          title: "Results",
          content: (
            <>
              <p>
                The 30-day campaign achieved{" "}
                <strong>112% of its pre-order sales goal</strong>, surpassing
                the required target by 12% and successfully meeting the book's
                pre-publication milestone.
              </p>
              <p>
                A featured campaign launch email recorded a{" "}
                <strong>72% open rate</strong> and{" "}
                <strong>16% click rate</strong>, reflecting strong response from
                the recipients of that email.
              </p>
              <p>
                By combining targeted email communication, social media
                storytelling, and consistent promotional activity, the campaign
                helped transform audience interest into measurable pre-order
                results.
              </p>
            </>
          ),
        },
      ]}
      previousProject={{ href: "/work/daniel", title: "Daniel G. Miller" }}
      nextProject={{ href: "/work/caroline", title: "Caroline Montague" }}
    />
  );
}
