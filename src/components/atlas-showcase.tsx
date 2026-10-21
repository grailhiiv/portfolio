import { WorkShowcase, type ShowcaseItem } from "@/components/work-showcase";
import post1 from "../../public/images/atlas/atlas-post-1.webp";
import post2 from "../../public/images/atlas/atlas-post-2.webp";
import post3 from "../../public/images/atlas/atlas-post-3.webp";
import post4 from "../../public/images/atlas/atlas-post-4.webp";
import post5 from "../../public/images/atlas/atlas-post-5.webp";
import post6 from "../../public/images/atlas/atlas-post-6.webp";
import post7 from "../../public/images/atlas/atlas-post-7.webp";
import post8 from "../../public/images/atlas/atlas-post-8.jpg";

const columns: ShowcaseItem[][] = [
  [
    { image: post1, alt: "Hollowed by A.K. Rose book release announcement" },
    {
      video: "/videos/atlas/atlas-video-1.mp4",
      poster: "/images/atlas/atlas-video-1-poster.webp",
      alt: "A woman holding the Hunted by My Stepbrothers omnibus",
    },
    { image: post3, alt: "Promotional graphic for Mine by A.K. Rose" },
    {
      image: post5,
      alt: "Blurb reveal for She Walks with Broken Things by A.K. Rose",
    },
    {
      image: post7,
      alt: "Mafia Monsters Omnibus by Atlas Rose promotional graphic",
    },
  ],
  [
    {
      image: post2,
      alt: "Chosen by the Vampire Omnibus by Atlas Rose beside white roses",
    },
    {
      video: "/videos/atlas/atlas-video-2.mp4",
      poster: "/images/atlas/atlas-video-2-poster.webp",
      alt: "A close-up of the Hunted by My Stepbrothers omnibus",
    },
    { image: post4, alt: "Promotional graphic for Hunted by My Stepbrothers" },
    {
      image: post6,
      alt: "Cover reveal for She Walks with Broken Things by A.K. Rose",
    },
    {
      image: post8,
      alt: "Mafia Monsters Omnibus by Atlas Rose with its story themes",
    },
  ],
];

export function AtlasShowcase() {
  return (
    <WorkShowcase columns={columns} label="Atlas Rose Campaign Showcase" />
  );
}
