import danielImage from "../../public/images/case-daniel.webp";
import melissaImage from "../../public/images/case-melissa.webp";
import carolineImage from "../../public/images/case-caroline.webp";
import atlasImage from "../../public/images/case-atlas.webp";
import { VideoPreviewCard } from "@/components/video-preview-card";
import { imageSizes } from "@/lib/image-sizes";

export function FeaturedWork() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      <VideoPreviewCard
        href="/work/daniel"
        image={danielImage}
        sizes={imageSizes.homeCard}
        title="Daniel G. Miller"
        description="Social Media Management"
        result={{ value: "57,680", label: "Social media views in 3 months" }}
        video="/videos/daniel/daniel-case.mp4"
        poster="/images/daniel/daniel-video-1-poster.webp"
      />
      <VideoPreviewCard
        href="/work/melissa"
        image={melissaImage}
        sizes={imageSizes.homeCard}
        title="Melissa Castro"
        description="Email & Social Media Marketing"
        result={{ value: "112%", label: "Of pre-order goal in 30 days" }}
        video="/videos/melissa/melissa-case.mp4"
        poster="/images/melissa/melissa-video-1-poster.webp"
      />
      <VideoPreviewCard
        href="/work/caroline"
        image={carolineImage}
        sizes={imageSizes.homeCard}
        title="Caroline Montague"
        description="Social Media Strategy & Brand Growth"
        result={{ value: "0 → 171K", label: "TikTok followers in 16 months" }}
        video="/videos/caroline/caroline-case.mp4"
        poster="/images/caroline/caroline-video-1-poster.webp"
      />
      <VideoPreviewCard
        href="/work/atlas"
        image={atlasImage}
        sizes={imageSizes.homeCard}
        title="Atlas Rose"
        description="Email Marketing & Automation"
        result={{ value: "+275.6%", label: "Email revenue in 90 days" }}
        video="/videos/atlas/case-atlas.mp4"
        poster="/images/case-atlas.webp"
      />
    </div>
  );
}
