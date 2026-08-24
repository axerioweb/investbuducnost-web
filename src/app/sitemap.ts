import type { MetadataRoute } from "next";
import { routing, type AppPathname } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { absoluteUrl } from "@/lib/seo";

const ROUTES: { path: AppPathname; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/europe", priority: 0.9 },
  { path: "/summer-camps", priority: 0.9 },
  { path: "/china", priority: 0.9 },
  { path: "/student-visa-f1", priority: 0.9 },
  { path: "/tourist-visa-b1-b2", priority: 0.9 },
  { path: "/usa-employment", priority: 0.9 },
  { path: "/about", priority: 0.7 },
  { path: "/faq", priority: 0.7 },
  { path: "/contact", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(({ path, priority }) => {
    const languages: Record<string, string> = {};
    for (const locale of routing.locales) {
      languages[locale] = absoluteUrl(getPathname({ locale, href: path }));
    }
    languages["x-default"] = absoluteUrl(
      getPathname({ locale: routing.defaultLocale, href: path })
    );
    return {
      url: absoluteUrl(getPathname({ locale: routing.defaultLocale, href: path })),
      changeFrequency: "monthly",
      priority,
      alternates: { languages },
    };
  });
}
