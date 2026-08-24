import { getTranslations } from "next-intl/server";
import { site } from "@/data/site";
import { asset } from "@/data/assets";
import { absoluteUrl } from "@/lib/seo";
import { getPathname } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";

function Script({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Organization + WebSite schema — na svakoj stranici (u layout-u). */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    logo: absoluteUrl(asset("logo")),
    email: site.email,
    founder: { "@type": "Person", name: site.founder },
    sameAs: [site.social.facebook, site.social.instagram],
    address: site.offices.map((o) => ({
      "@type": "PostalAddress",
      streetAddress: o.address.split(",")[0],
      addressLocality: o.city,
      addressCountry: o.id.toUpperCase(),
    })),
    contactPoint: site.offices.map((o) => ({
      "@type": "ContactPoint",
      telephone: o.phones[0].tel,
      contactType: "customer service",
      areaServed: o.id.toUpperCase(),
    })),
  };
  return <Script data={data} />;
}

export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    publisher: { "@id": `${site.url}/#organization` },
    inLanguage: ["sr", "en", "es"],
  };
  return <Script data={data} />;
}

/** Service schema — za stranice usluga. */
export function ServiceJsonLd({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    provider: { "@id": `${site.url}/#organization` },
    areaServed: ["RS", "ME", "SI"],
  };
  return <Script data={data} />;
}

/** FAQPage schema — za FAQ stranicu. */
export function FaqJsonLd({
  items,
}: {
  items: { q: string; a: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
  return <Script data={data} />;
}

/** BreadcrumbList schema. */
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return <Script data={data} />;
}

/**
 * Breadcrumb za podstranicu: Početna → trenutna stranica.
 * Putanje su lokalizovane, pa se generišu iz routing konfiguracije.
 */
export async function PageBreadcrumbJsonLd({
  locale,
  pathname,
  name,
}: {
  locale: string;
  pathname: AppPathname;
  name: string;
}) {
  const t = await getTranslations({ locale, namespace: "nav" });
  return (
    <BreadcrumbJsonLd
      items={[
        { name: t("home"), url: absoluteUrl(getPathname({ locale, href: "/" })) },
        { name, url: absoluteUrl(getPathname({ locale, href: pathname })) },
      ]}
    />
  );
}

/** LocalBusiness po kancelariji — signal za lokalnu pretragu (kontakt stranica). */
export function OfficesJsonLd({ locale }: { locale: string }) {
  const data = site.offices.map((o) => ({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.url}/#office-${o.id}`,
    name: `${site.name} — ${o.city}`,
    parentOrganization: { "@id": `${site.url}/#organization` },
    url: absoluteUrl(getPathname({ locale, href: "/contact" })),
    image: absoluteUrl(asset("ogDefault")),
    email: site.email,
    telephone: o.phones.map((ph) => ph.tel),
    address: {
      "@type": "PostalAddress",
      streetAddress: o.address.split(",")[0],
      addressLocality: o.city,
      addressCountry: o.id.toUpperCase(),
    },
    areaServed: o.country,
  }));
  return (
    <>
      {data.map((d) => (
        <Script key={String(d["@id"])} data={d} />
      ))}
    </>
  );
}

/**
 * ItemList sa `Course` elementima — letnji kampovi.
 * Detalji programa žive u modalnom dijalogu, pa strukturirani podaci nose
 * iste činjenice u formi koju pretraživači čitaju bez izvršavanja JS-a.
 */
export function CourseListJsonLd({
  items,
  url,
}: {
  items: { name: string; description: string; provider: string; city: string; price?: string }[];
  url: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    url,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Course",
        name: item.name,
        description: item.description,
        provider: { "@type": "CollegeOrUniversity", name: item.provider },
        locationCreated: { "@type": "Place", name: item.city },
        ...(item.price ? { offers: { "@type": "Offer", description: item.price } } : {}),
      },
    })),
  };
  return <Script data={data} />;
}

/** ItemList sa `CollegeOrUniversity` elementima — partnerski univerziteti. */
export function UniversityListJsonLd({
  items,
  url,
}: {
  items: { name: string; description: string; city: string; country: string }[];
  url: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    url,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "CollegeOrUniversity",
        name: item.name,
        description: item.description,
        address: {
          "@type": "PostalAddress",
          addressLocality: item.city,
          addressCountry: item.country,
        },
      },
    })),
  };
  return <Script data={data} />;
}
