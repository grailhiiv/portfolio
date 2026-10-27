import type { Metadata } from "next";
import { CaseStudy } from "@/components/case-study";
import { DanielShowcase } from "@/components/daniel-showcase";

const description =
  "A three-month social media campaign focused on expanding audience reach, strengthening the author's online presence, and encouraging meaningful reader interactions.";

export const metadata: Metadata = {
  title: "Daniel G. Miller Case Study",
  description,
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <CaseStudy
      title="Generating 57,680 Social Media Views in 3 Months for Daniel G. Miller"
      description={description}
      showcase={<DanielShowcase />}
      details={[
        { label: "Client", value: "Daniel G. Miller" },
        {
          label: "Focus",
          value: "Social Media Management, Content Strategy, Content Creation",
        },
        { label: "Platforms", value: "Facebook and Instagram" },
        { label: "Duration", value: "3 Months" },
      ]}
      metrics={[
        { value: "57,680", label: "Content Views", growth: "+41.4%" },
        { value: "13,225", label: "Accounts Reached", growth: "+60.9%" },
        { value: "3,156", label: "Total Engagements", growth: "+75.7%" },
        { value: "23.86%", label: "Engagement Rate" },
      ]}
      sections={[
        {
          title: "Challenge",
          content: (
            <>
              <p>
                Daniel G. Miller needed a stronger social media presence to
                increase visibility, connect with readers, and maintain
                consistent engagement across Facebook and Instagram.
              </p>
              <p>
                The challenge was to create a coordinated content approach that
                supported book promotion while building meaningful connections
                with existing and potential readers.
              </p>
            </>
          ),
        },
        {
          title: "Solution",
          content: (
            <>
              <p>
                The campaign combined strategic content planning, consistent
                publishing, and author-focused storytelling to build a stronger
                social media presence across Facebook and Instagram.
              </p>
              <p>
                A structured content calendar brought together book promotions,
                author updates, and reader-focused posts. Content was planned
                and adapted for each platform, with a mix of static visuals,
                engaging captions, and short-form content.
              </p>
              <p>
                Performance tracking helped evaluate audience reach and
                engagement throughout the campaign.
              </p>
            </>
          ),
        },
        {
          title: "What I Did",
          services: [
            "Social Media Strategy",
            "Content Planning",
            "Content Creation",
            "Content Scheduling",
            "Facebook & Instagram Management",
            "Engagement Monitoring",
            "Performance Reporting",
          ],
        },
        {
          title: "Results",
          content: (
            <>
              <p>
                Over the three-month campaign, Daniel G. Miller's social media
                accounts generated <strong>57,680 content views</strong>, a{" "}
                <strong>41.4% increase</strong> compared with the previous
                reporting period.
              </p>
              <p>
                Combined reach grew to <strong>13,225 accounts (+60.9%)</strong>
                , while total engagements reached{" "}
                <strong>3,156 (+75.7%)</strong>, achieving a{" "}
                <strong>23.86% engagement rate</strong>.
              </p>
              <p>
                The campaign also recorded{" "}
                <strong>1,314 engaged accounts (+53.5%)</strong> and{" "}
                <strong>1,099 profile views (+34.0%)</strong>.
              </p>
              <p>
                Facebook contributed <strong>23,660 content views</strong>,
                while Instagram generated <strong>34,020 views</strong>, showing
                increased visibility across both platforms.
              </p>
              <p>
                These results demonstrate improved content visibility, audience
                interaction, and social media performance during the campaign.
              </p>
            </>
          ),
        },
      ]}
      previousProject={{ href: "/work/atlas", title: "Atlas Rose" }}
      nextProject={{ href: "/work/melissa", title: "Melissa Castro" }}
    />
  );
}
