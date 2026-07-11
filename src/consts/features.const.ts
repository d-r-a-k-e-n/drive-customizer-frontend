import { LucideIcon, Palette, Camera, Share2 } from "lucide-react";

interface IFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const FEATURES: IFeature[] = [
  {
    icon: Palette,
    title: "PBR Rendering",
    description: "Ultra-realistic materials: carbon, matte, and leather.",
  },
  {
    icon: Camera,
    title: "Virtual Studio",
    description:
      "Professional lighting and camera angles for the perfect shot of your car.",
  },
  {
    icon: Share2,
    title: "Social Sync",
    description:
      "Share your configuration with your friends using a single link.",
  },
];
