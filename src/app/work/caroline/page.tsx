import type { Metadata } from "next";
import { CaseStudy } from "@/components/case-study";
import { CarolineShowcase } from "@/components/caroline-showcase";

const description =
  "A 16-month social media campaign focused on growing the author's personal brand through video storytelling, authentic content and audience engagement across TikTok and Instagram.";

export const metadata: Metadata = {
  title: "Caroline Montague Case Study",
  description,
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <CaseStudy
      title="Growing Caroline Montague’s TikTok from 0 to 171K Followers in 16 Months"
      description={description}
      showcase={<CarolineShowcase />}
      details={[
        { label: "Client", value: "Caroline Montague" },
        {
          label: "Focus",
          value: "Social Media Strategy, Content Creation, Brand Growth",
        },
        { label: "Platforms", value: "TikTok and Instagram" },
        { label: "Duration", value: "16 Months" },
      ]}
      metrics={[
        { value: "171K", label: "TikTok Followers", growth: "From 0" },
        {
          value: "5.3M",
          label: "Total TikTok Likes",
          growth: "Across the account",
        },
        { value: "3.1M", label: "Top Video Views", growth: "Single video" },
        {
          value: "40K+",
          label: "Instagram Followers",
          growth: "From approximately 5K",
        },
      ]}
      sections={[
        {
          title: "Challenge",
          content: (
            <>
              <p>
                Caroline Montague, a British historical fiction author, needed a
                stronger social media presence to expand her readership and
                build meaningful audience connections.
              </p>
              <p>
                Despite working with different social media managers, her
                content remained inconsistent, Instagram growth had stalled at
                around 5,000 followers, and she had no established TikTok
                presence.
              </p>
              <p>
                The challenge was to transform her online presence into a
                recognisable personal brand that connected with readers beyond
                traditional book promotions.
              </p>
            </>
          ),
        },
        {
          title: "Solution",
          content: (
            <>
              <p>
                The campaign introduced a TikTok-first content strategy centred
                on authentic storytelling, short-form videos and Caroline's
                everyday life as an author.
              </p>
              <p>
                Content focused on her writing routine, reading interests, home
                and personal experiences, creating relatable moments designed to
                resonate with the global BookTok community.
              </p>
              <p>
                Consistent content production, publishing and creative
                optimisation supported audience growth across TikTok and
                Instagram, while carefully selected brand partnerships expanded
                her visibility.
              </p>
            </>
          ),
        },
        {
          title: "What I Did",
          services: [
            "Social Media Strategy",
            "Content Planning",
            "Short-form Video Creation",
            "Video Editing & Publishing",
            "TikTok & Instagram Management",
            "Audience Growth & Optimisation",
            "Influencer & Brand Partnerships",
          ],
        },
        {
          title: "Results",
          content: (
            <>
              <p>
                Over the 16-month campaign, Caroline Montague's TikTok account
                grew from <strong>zero to 171,000 followers</strong>, generating{" "}
                <strong>5.3 million likes</strong> across the account.
              </p>
              <p>
                Her top-performing video reached{" "}
                <strong>3.1 million views</strong>, demonstrating the audience
                reach achieved through authentic, video-led storytelling.
              </p>
              <p>
                Instagram also experienced substantial organic growth,
                increasing from approximately{" "}
                <strong>5,000 to over 40,000 followers</strong> alongside the
                TikTok campaign.
              </p>
              <p>
                The campaign established a stronger, more consistent author
                brand, expanding Caroline's online visibility and connecting her
                with audiences around the world.
              </p>
            </>
          ),
        },
      ]}
      previousProject={{ href: "/work/melissa", title: "Melissa Castro" }}
      nextProject={{ href: "/work/atlas", title: "Atlas Rose" }}
    />
  );
}
