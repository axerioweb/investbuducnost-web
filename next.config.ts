import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/**
 * Adrese sa starog Wix sajta → nove adrese (trajno preusmerenje).
 * Čuva pozicije u Google-u i stare linkove sa društvenih mreža.
 * Spisak je uzet iz starog sitemap-a (pages-sitemap.xml). Stranice čija se
 * adresa nije promenila (/kontakt, /o-nama, /letnji-kampovi…) nisu ovde.
 */
const LEGACY_PAGES: Record<string, string> = {
  "/studije-u-eu": "/studije-u-evropi",
  "/kina": "/studije-u-kini",
  "/zaposljavanje-u-usa": "/zaposljavanje-u-americi",
};

/** Stari slug institucije (u korenu sajta) → slug u `src/data/institutions.ts`. */
const LEGACY_INSTITUTIONS: Record<string, string> = {
  "emuni-university": "emuni-university",
  "budapest-metropolitan-university": "budapest-metropolitan-university",
  "istanbul-ayadin-university": "istanbul-aydin-university",
  "university-of-nicosia": "university-of-nicosia",
  "american-institutein-switzerland": "american-institute-switzerland",
  "cbs-international-business-school": "cbs-international-business-school",
  "eu-business-school": "eu-business-school",
  "international-business-school": "international-business-school",
  "wittenborg-university": "wittenborg-university",
  "ucam-university": "ucam-university",
  "faith-sultan-mehmet-university": "fatih-sultan-mehmet-university",
  "american-university-in-bulgaria": "american-university-in-bulgaria",
  "american-university-in-bulgaria-1": "american-university-in-bulgaria",
  "john-cabot-university": "john-cabot-university",
  "global-business-school": "gbsb-global-business-school",
  "bts-technology-school": "barcelona-technology-school",
  "htl-university": "htl-university",
  "moscow-aviation-institute": "moscow-aviation-institute",
  "srh-university": "srh-university",
  "kozminski-university": "kozminski-university",
  "universidad-europea": "universidad-europea",
};

// Sve slike su lokalne (public/images/ + src/data/assets.local.json),
// pa remotePatterns više nisu potrebni.
const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...Object.entries(LEGACY_PAGES).map(([source, destination]) => ({
        source,
        destination,
        permanent: true,
      })),
      ...Object.entries(LEGACY_INSTITUTIONS).map(([from, to]) => ({
        source: `/${from}`,
        destination: `/institucije/${to}`,
        permanent: true,
      })),
    ];
  },
  images: {
    // AVIF pre WebP-a — osetno manji fajlovi za iste fotografije
    formats: ["image/avif", "image/webp"],
    // Izvori su široki 1920 px; bez većih kandidata pretraživač ne bira
    // varijantu koja se re-enkodira na veću težinu od originala.
    deviceSizes: [640, 750, 828, 1080, 1200, 1600],
  },
};

export default withNextIntl(nextConfig);
