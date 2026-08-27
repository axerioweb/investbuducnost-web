import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildPageMetadata, absoluteUrl } from "@/lib/seo";
import { getPathname } from "@/i18n/navigation";
import { summerCamps } from "@/data/catalog";
import { slugForId } from "@/data/institutions";
import { asset } from "@/data/assets";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CtaSection } from "@/components/ui/CtaSection";
import { CampGrid, type CampView } from "@/components/institutions/CampGrid";
import {
  ServiceJsonLd,
  PageBreadcrumbJsonLd,
  CourseListJsonLd,
} from "@/components/seo/JsonLd";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "camps", "/summer-camps");
}

export default async function CampsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("camps");
  const meta = await getTranslations("meta.camps");

  /**
   * Kartica vodi na stranicu institucije, na sidro `#kamp`. Putanja se sklapa
   * ovde jer `Link` iz `next-intl` ne prima hash u objektu putanje — a bez
   * sidra bi klik na kamp otvorio vrh stranice institucije, ne sam program.
   */
  const campHref = (id: string) =>
    `${getPathname({
      locale,
      href: { pathname: "/institutions/[slug]", params: { slug: slugForId(id)! } },
    })}#kamp`;

  // Prevodi se razrešavaju na serveru; puni detalji programa (šta je uključeno,
  // aktivnosti, smeštaj, sertifikat) žive na stranici institucije.
  const camps: CampView[] = summerCamps.map((camp) => ({
    id: camp.id,
    href: campHref(camp.universityId ?? camp.id),
    name: camp.name,
    university: camp.university,
    city: camp.city,
    countryCode: camp.country,
    logo: asset(camp.logo as Parameters<typeof asset>[0]),
    ects: camp.ects,
    tagline: t(`items.${camp.id}.tagline`),
    duration: t(`items.${camp.id}.duration`),
  }));

  const pageUrl = absoluteUrl(getPathname({ locale, href: "/summer-camps" }));

  return (
    <>
      <PageBreadcrumbJsonLd locale={locale} pathname="/summer-camps" name={t("hero.title")} />
      <ServiceJsonLd name={meta("title")} description={meta("description")} url={pageUrl} />
      <CourseListJsonLd
        url={pageUrl}
        items={summerCamps.map((camp) => ({
          name: `${camp.university} — ${camp.name}`,
          description: t(`items.${camp.id}.about`),
          provider: camp.university,
          city: camp.city,
          price: camp.price,
          url: absoluteUrl(campHref(camp.universityId ?? camp.id)),
        }))}
      />

      <PageHero
        kicker={t("hero.kicker")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        image={asset("heroCamps")}
        imageAlt={t("hero.imageAlt")}
      />

      {/* Promo traka */}
      <Reveal className="bg-white px-6 pt-2">
        <div className="mx-auto flex max-w-3xl items-center gap-5 rounded-2xl border border-brand-200 bg-gradient-to-r from-brand-50 to-white px-6 py-5 shadow-[0_10px_30px_rgba(59,130,196,0.12)] md:px-8">
          <span className="font-display text-3xl font-bold text-brand-700 md:text-4xl">
            {t("promo.badge")}
          </span>
          <p className="text-sm font-medium text-ink md:text-base">{t("promo.text")}</p>
        </div>
      </Reveal>

      <section className="bg-white px-6 py-20 md:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading title={t("chooseTitle")} subtitle={t("chooseSubtitle")} />
          <CampGrid
            camps={camps}
            labels={{
              more: t("detail.more"),
              logoAlt: t.raw("detail.logoAlt") as string,
              discount: t("promo.badge"),
            }}
          />
        </div>
      </section>

      <CtaSection title={t("cta.title")} text={t("cta.text")} buttonLabel={t("cta.button")} />
    </>
  );
}
