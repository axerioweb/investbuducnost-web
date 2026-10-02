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
  | "contact"
  | "privacy";

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

/**
 * Metapodaci stranice jedne institucije.
 *
 * Odvojeno od `buildPageMetadata` jer je putanja dinamička (`/institucije/[slug]`),
 * pa `getPathname` traži `params`. OG slika je fotografija kampusa umesto
 * podrazumevanog vizuala: deljenje linka na instituciju treba da pokaže baš tu
 * instituciju.
 *
 * Opis dolazi iz `institutions.<id>.metaDescription`, po instituciji. Jedan
 * zajednički šablon ovde ne radi: fiksni deo je ~115 znakova, a naziv i grad
 * variraju od 23 do 54 — nijedan šablon ne može da pogodi opseg od 15 znakova,
 * pa bi trećina opisa bila odsečena u rezultatima pretrage.
 */
export async function buildInstitutionMetadata({
  locale,
  slug,
  name,
  description,
  image,
}: {
  locale: string;
  slug: string;
  name: string;
  description: string;
  image: string;
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });
  const href = { pathname: "/institutions/[slug]", params: { slug } } as const;

  const canonical = absoluteUrl(getPathname({ locale, href }));
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = absoluteUrl(getPathname({ locale: l, href }));
  }
  languages["x-default"] = absoluteUrl(
    getPathname({ locale: routing.defaultLocale, href })
  );

  const title = t("institution.title", { name });
  const siteName = t("siteName");

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      locale: ogLocales[locale] ?? locale,
      type: "website",
      images: [{ url: absoluteUrl(image), width: 1600, height: 1000 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(image)],
    },
  };
}

export function absoluteUrl(path: string): string {
  // `asset()` po ugovoru pada nazad na CDN URL kad slika nije preuzeta lokalno.
  // Bez ove provere bi tada nastalo „https://naš.domen https://cdn…" u OG
  // slici i JSON-LD-u — apsolutan URL je već apsolutan.
  if (/^https?:\/\//.test(path)) return path;
  return `${site.url}${path === "/" ? "" : path}`;
}
