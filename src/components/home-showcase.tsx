import { WorkShowcase, type ShowcaseItem } from "@/components/work-showcase";
import daniel1 from "../../public/images/daniel/daniel-post-1.webp";
import daniel2 from "../../public/images/daniel/daniel-post-2.webp";
import daniel3 from "../../public/images/daniel/daniel-post-3.webp";
import melissa1 from "../../public/images/melissa/melissa-post-1.webp";
import melissa2 from "../../public/images/melissa/melissa-post-2.webp";
import melissa3 from "../../public/images/melissa/melissa-post-3.webp";
import atlas1 from "../../public/images/atlas/atlas-post-1.webp";
import atlas2 from "../../public/images/atlas/atlas-post-2.webp";
import atlas3 from "../../public/images/atlas/atlas-post-3.webp";

const columns: ShowcaseItem[][] = [
  [
    { image: daniel1, alt: "Reader reviews of The Orphanage by the Lake by Daniel G. Miller" },
    { video: "/videos/melissa/melissa-video-1.mp4", poster: "/images/melissa/melissa-video-1-poster.webp", alt: "Melissa Castro discusses Intrinsic Leadership" },
    { image: atlas1, alt: "Hollowed by A.K. Rose book release announcement" },
    { video: "/videos/daniel/daniel-video-1.mp4", poster: "/images/daniel/daniel-video-1-poster.webp", alt: "Daniel G. Miller presents The Red Letter in a bookstore" },
    { image: melissa1, alt: "Intrinsic Leadership by Melissa M. Castro on a yellow background" },
    { image: daniel3, alt: "A reader review of The Red Letter by Daniel G. Miller" },
    { video: "/videos/atlas/atlas-video-1.mp4", poster: "/images/atlas/atlas-video-1-poster.webp", alt: "A woman holding the Hunted by My Stepbrothers omnibus" },
    { image: melissa3, alt: "Lifting Leaders podcast announcement featuring Melissa Castro" },
  ],
  [
    { video: "/videos/daniel/daniel-video-2.mp4", poster: "/images/daniel/daniel-video-2-poster.webp", alt: "Daniel G. Miller showcases his books in a bookstore" },
    { image: melissa2, alt: "Countdown to pre-order Intrinsic Leadership by Melissa M. Castro" },
    { image: atlas2, alt: "Chosen by the Vampire Omnibus by Atlas Rose beside white roses" },
    { video: "/videos/atlas/atlas-video-2.mp4", poster: "/images/atlas/atlas-video-2-poster.webp", alt: "A close-up of the Hunted by My Stepbrothers omnibus" },
    { image: daniel2, alt: "Buried in the Woods Below by Daniel G. Miller on an e-reader" },
    { video: "/videos/melissa/melissa-video-2.mp4", poster: "/images/melissa/melissa-video-2-poster.webp", alt: "Melissa Castro shares a book launch thank-you message" },
    { image: atlas3, alt: "Promotional graphic for Mine by A.K. Rose" },
  ],
];

export function HomeShowcase() {
  return <WorkShowcase columns={columns} label="Selected social media work for Daniel, Melissa, and Atlas" />;
}
