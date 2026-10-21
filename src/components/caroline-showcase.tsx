import { WorkShowcase, type ShowcaseItem } from "@/components/work-showcase";
import post1 from "../../public/images/caroline/caroline-post-1.webp";
import post2 from "../../public/images/caroline/caroline-post-2.webp";
import post3 from "../../public/images/caroline/caroline-post-3.webp";
import post4 from "../../public/images/caroline/caroline-post-4.webp";
import post5 from "../../public/images/caroline/caroline-post-5.webp";

const columns: ShowcaseItem[][] = [
  [
    {
      image: post1,
      alt: "Caroline Montague arranging copies of The Pieces of Us beside flowers",
    },
    {
      video: "/videos/caroline/caroline-video-1.mp4",
      poster: "/images/caroline/caroline-video-1-poster.webp",
      alt: "Caroline Montague sharing a glimpse of her life as a writer",
    },
    {
      image: post3,
      alt: "The Pieces of Us by Caroline Montague on an outdoor table with strawberries",
    },
    {
      image: post5,
      alt: "A copy of An Italian Affair by Caroline Montague held in a sunlit courtyard",
    },
  ],
  [
    {
      video: "/videos/caroline/caroline-video-2.mp4",
      poster: "/images/caroline/caroline-video-2-poster.webp",
      alt: "Caroline Montague reading in bed",
    },
    {
      image: post2,
      alt: "Caroline Montague reading with a dog in her lap",
    },
    {
      image: post4,
      alt: "Caroline Montague holding The Pieces of Us outside a stone building",
    },
  ],
];

export function CarolineShowcase() {
  return (
    <WorkShowcase
      columns={columns}
      label="Caroline Montague Social Media Showcase"
    />
  );
}
