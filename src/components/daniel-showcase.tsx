import { WorkShowcase, type ShowcaseItem } from "@/components/work-showcase";
import post1 from "../../public/images/daniel/daniel-post-1.webp";
import post2 from "../../public/images/daniel/daniel-post-2.webp";
import post3 from "../../public/images/daniel/daniel-post-3.webp";
import post4 from "../../public/images/daniel/daniel-post-4.webp";
import post5 from "../../public/images/daniel/daniel-post-5.webp";
import post6 from "../../public/images/daniel/daniel-post-6.webp";
import post7 from "../../public/images/daniel/daniel-post-7.webp";

const columns: ShowcaseItem[][] = [
  [
    {
      image: post1,
      alt: "The Orphanage by the Lake by Daniel G. Miller, surrounded by reader quotes praising its suspense and twists",
    },
    {
      video: "/videos/daniel/daniel-video-1.mp4",
      poster: "/images/daniel/daniel-video-1-poster.webp",
      alt: "Daniel G. Miller presenting The Red Letter in a bookstore beside an escalator",
    },
    {
      image: post3,
      alt: "Five-star reader review of The Red Letter by Daniel G. Miller, praising Hazel and the fast-paced mystery",
    },
    {
      image: post5,
      alt: "Daniel G. Miller smiling and holding Harlan Coben's Plot Twist book",
    },
    {
      image: post7,
      alt: "Daniel G. Miller smiling and holding multiple copies of The Red Letter in a bookstore",
    },
  ],
  [
    {
      video: "/videos/daniel/daniel-video-2.mp4",
      poster: "/images/daniel/daniel-video-2-poster.webp",
      alt: "Daniel G. Miller showcasing The Red Letter and The Orphanage by the Lake in a bookstore",
    },
    {
      image: post2,
      alt: "Buried in the Woods Below by Daniel G. Miller displayed on an e-reader among purple flowers, notebooks and coffee",
    },
    {
      image: post4,
      alt: "Six five-star reader reviews surrounding Buried in the Woods Below by Daniel G. Miller against a forest background",
    },
    {
      image: post6,
      alt: "A reader holding The Orphanage by the Lake by Daniel G. Miller in front of bookshelves",
    },
  ],
];

export function DanielShowcase() {
  return (
    <WorkShowcase
      columns={columns}
      label="Daniel G. Miller Social Media Showcase"
    />
  );
}
