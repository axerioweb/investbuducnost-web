import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

// Sve slike su lokalne (public/images/ + src/data/assets.local.json),
// pa remotePatterns više nisu potrebni.
const nextConfig: NextConfig = {
  images: {
    // AVIF pre WebP-a — osetno manji fajlovi za iste fotografije
    formats: ["image/avif", "image/webp"],
    // Izvori su široki 1920 px; bez većih kandidata pretraživač ne bira
    // varijantu koja se re-enkodira na veću težinu od originala.
    deviceSizes: [640, 750, 828, 1080, 1200, 1600],
  },
};

export default withNextIntl(nextConfig);
