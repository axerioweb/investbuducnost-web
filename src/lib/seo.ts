import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing, type AppPathname } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { ogLocales } from "@/i18n/config";
import { site } from "@/data/site";
import { asset } from "@/data/assets";

type MetaKey =
  | "home"
  | "europe"
  | "camps"
  | "china"
  | "f1"
  | "b1b2"
  | "usa"
  | "about"
  | "faq"
  | "contact";

/**
 * Gradi kompletne SEO metapodatke za stranicu:
 * title, description, canonical, hreflang alternates (uključujući
 * x-default), OpenGraph i Twitter kartice.
 */
export async function buildPageMetadata(
  locale: string,
  metaKey: MetaKey,
  pathname: AppPathname
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });

  const canonical = absoluteUrl(getPathname({ locale, href: pathname }));
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = absoluteUrl(getPathname({ locale: l, href: pathname }));
  }
  languages["x-default"] = absoluteUrl(
    getPathname({ locale: routing.defaultLocale, href: pathname })
  );

  const title = t(`${metaKey}.title`);
  const description = t(`${metaKey}.description`);
  const siteName = t("siteName");

  return {
    // Početna je u istom segmentu kao layout, pa Next na nju ne primenjuje
    // `title.template` — brend dodajemo ručno.
    title: metaKey === "home" ? { absolute: `${title} | ${siteName}` } : title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      locale: ogLocales[locale] ?? locale,
      type: "website",
      images: [{ url: asset("ogDefault"), width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [asset("ogDefault")],
    },
  };
}

export function absoluteUrl(path: string): string {
  return `${site.url}${path === "/" ? "" : path}`;
}
