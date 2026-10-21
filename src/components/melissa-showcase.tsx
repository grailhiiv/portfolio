import { WorkShowcase, type ShowcaseItem } from "@/components/work-showcase";
import post1 from "../../public/images/melissa/melissa-post-1.webp";
import post2 from "../../public/images/melissa/melissa-post-2.webp";
import post3 from "../../public/images/melissa/melissa-post-3.webp";
import post4 from "../../public/images/melissa/melissa-post-4.webp";
import post5 from "../../public/images/melissa/melissa-post-5.webp";
import post6 from "../../public/images/melissa/melissa-post-6.webp";

const columns: ShowcaseItem[][] = [
  [
    {
      image: post1,
      alt: "Intrinsic Leadership by Melissa M. Castro, a coaching guide for millennials, displayed on a yellow background",
    },
    {
      video: "/videos/melissa/melissa-video-1.mp4",
      poster: "/images/melissa/melissa-video-1-poster.webp",
      alt: "Melissa Castro speaking to camera in her office in an Intrinsic Leadership book launch video",
    },
    {
      image: post3,
      alt: "Lifting Leaders podcast announcement featuring Melissa Castro in the Coaching for a Better World series",
    },
    {
      image: post5,
      alt: "The Well Read Coach giveaway of Intrinsic Leadership by Melissa M. Castro, with instructions to follow, like and tag friends",
    },
  ],
  [
    {
      video: "/videos/melissa/melissa-video-2.mp4",
      poster: "/images/melissa/melissa-video-2-poster.webp",
      alt: "Melissa Castro sharing a thank-you message in an Intrinsic Leadership book launch video",
    },
    {
      image: post2,
      alt: "Three-day countdown to pre-order Intrinsic Leadership by Melissa M. Castro before the October 18 deadline",
    },
    {
      image: post4,
      alt: "Intrinsic Lead reading post with purple books and the message: Before Kindle and BookTok, there was the library card",
    },
    {
      image: post6,
      alt: "Day 2 deep dive into Intrinsic Leadership by Melissa M. Castro, hosted by The Well Read Coach",
    },
  ],
];

export function MelissaShowcase() {
  return (
    <WorkShowcase
      columns={columns}
      label="Melissa Castro Social Media Showcase"
    />
  );
}
