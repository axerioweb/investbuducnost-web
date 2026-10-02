import type { MetadataRoute } from "next";
import { routing, type AppPathname } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { absoluteUrl } from "@/lib/seo";
import { institutions } from "@/data/institutions";

/** Statične rute — putanja i prioritet. */
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
  { path: "/privacy", priority: 0.3 },
];

/**
 * Jedan unos sa `hreflang` alternativama za sve jezike.
 * `href` je isti oblik koji prima `getPathname` — string za statične rute,
 * objekat sa `params` za `/institutions/[slug]`.
 */
function entry(
  href: Parameters<typeof getPathname>[0]["href"],
  priority: number
): MetadataRoute.Sitemap[number] {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = absoluteUrl(getPathname({ locale, href }));
  }
  languages["x-default"] = absoluteUrl(
    getPathname({ locale: routing.defaultLocale, href })
  );
  return {
    url: absoluteUrl(getPathname({ locale: routing.defaultLocale, href })),
    changeFrequency: "monthly",
    priority,
    alternates: { languages },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...ROUTES.map(({ path, priority }) => entry(path, priority)),
    // Stranice institucija nose stvarni sadržaj (programi, školarine, kampus),
    // pa idu odmah ispod stranica usluga po prioritetu.
    ...institutions.map((i) =>
      entry({ pathname: "/institutions/[slug]", params: { slug: i.slug } }, 0.8)
    ),
  ];
}
