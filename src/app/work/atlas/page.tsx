import type { Metadata } from "next";
import { CaseStudy } from "@/components/case-study";
import { AtlasShowcase } from "@/components/atlas-showcase";

const description =
  "A 90-day email marketing and automation campaign focused on increasing book sales, strengthening reader retention, and turning email into a consistent revenue channel.";

export const metadata: Metadata = {
  title: "Atlas Rose Case Study",
  description,
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <CaseStudy
      title="Scaling Atlas Rose’s Email Revenue from $16K to $85K per Month"
      description={description}
      showcase={<AtlasShowcase />}
      details={[
        { label: "Brand", value: "Atlas Rose" },
        {
          label: "Focus",
          value: "Email Marketing, Marketing Automation, Audience Segmentation",
        },
        { label: "Platforms", value: "Shopify, Email and Push Notifications" },
        { label: "Duration", value: "90 Days" },
      ]}
      metrics={[
        { value: "$82.1K", label: "Email Revenue", growth: "+275.6%" },
        { value: "40%", label: "Store Revenue from Email", growth: "+24%" },
        { value: "$61.2K", label: "Automated Flow Revenue", growth: "+282.7%" },
        { value: "$21K", label: "Campaign Revenue", growth: "+256.2%" },
      ]}
      sections={[
        {
          title: "Challenge",
          content: (
            <>
              <p>
                Atlas Rose, a dark romance bookstore run by a bestselling
                author, had an established readership and growing product demand
                but struggled to maximise its email marketing potential.
              </p>
              <p>
                Email contributed only 16% of store revenue, while rising
                advertising costs, limited time, underperforming automations,
                and an unsegmented subscriber list restricted opportunities for
                growth.
              </p>
              <p>
                The challenge was to build a more effective email marketing
                system that increased sales, strengthened customer retention,
                and reduced the founder's manual workload.
              </p>
            </>
          ),
        },
        {
          title: "Solution",
          content: (
            <>
              <p>
                The campaign focused on transforming email marketing into a
                scalable revenue channel through audience segmentation,
                automated customer journeys, and strategic content.
              </p>
              <p>
                More than 25 automated flows were developed across the customer
                lifecycle, including welcome sequences, abandoned checkouts,
                browsing reminders, post-purchase recommendations, loyalty
                rewards, and re-engagement campaigns.
              </p>
              <p>
                Branded email designs, personalised messaging, and a structured
                campaign calendar supported book releases and special editions.
                Push notifications, loyalty incentives, and affiliate marketing
                further strengthened customer engagement and repeat purchasing.
              </p>
            </>
          ),
        },
        {
          title: "What Was Delivered",
          services: [
            "Email Marketing Strategy",
            "Audience Segmentation",
            "Email Campaign Planning",
            "Branded Email Design",
            "Marketing Automation",
            "Customer Retention",
            "Re-engagement Campaigns",
            "Loyalty & Affiliate Integration",
          ],
        },
        {
          title: "Results",
          content: (
            <>
              <p>
                Over 90 days, Atlas Rose's email marketing generated a reported{" "}
                <strong>275.6% increase in email-attributed revenue</strong>,
                with email contributing{" "}
                <strong>40% of total store revenue</strong>.
              </p>
              <p>
                Automated flow revenue increased by <strong>282.7%</strong>,
                generating <strong>$60,000 in automated sales</strong> through
                customer journeys designed to encourage purchases and repeat
                engagement.
              </p>
              <p>
                Audience segmentation and re-engagement campaigns reactivated{" "}
                <strong>more than 4,500 dormant subscribers</strong>, increased
                the active sending segment by <strong>31%</strong>, and achieved
                an average <strong>53.5% email open rate</strong>.
              </p>
              <p>
                The campaign demonstrated how coordinated email marketing and
                automation could turn an underused subscriber list into a
                stronger source of sales and customer retention.
              </p>
            </>
          ),
        },
      ]}
      previousProject={{ href: "/work/caroline", title: "Caroline Montague" }}
      nextProject={{ href: "/work/daniel", title: "Daniel G. Miller" }}
    />
  );
}
