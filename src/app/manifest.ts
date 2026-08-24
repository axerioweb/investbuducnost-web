import type { MetadataRoute } from "next";
import { site } from "@/data/site";

/** Web app manifest — ikone i boja teme za mobilne pretraživače. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "Invest Budućnost",
    description:
      "Studije u inostranstvu, vize F1 i B1/B2, letnji kampovi i zapošljavanje u SAD.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#3b82c4",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
