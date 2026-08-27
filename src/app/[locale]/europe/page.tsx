import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildPageMetadata, absoluteUrl } from "@/lib/seo";
import { getPathname } from "@/i18n/navigation";
import { europeanUniversities } from "@/data/catalog";
import { slugForId } from "@/data/institutions";
import { asset } from "@/data/assets";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaSection } from "@/components/ui/CtaSection";
import { UniversityGrid, type UniversityView } from "@/components/institutions/UniversityGrid";
import {
  ServiceJsonLd,
  PageBreadcrumbJsonLd,
  UniversityListJsonLd,
} from "@/components/seo/JsonLd";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "europe", "/europe");
}

export default async function EuropePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("europe");
  const meta = await getTranslations("meta.europe");

  // Prevodi se razrešavaju na serveru — mreža dobija gotove stringove.
  // Kartica nosi samo ono što se na njoj i vidi; školarine, programi i uslovi
  // upisa žive na stranici institucije, pa ih više ne treba slati ovde.
  const universities: UniversityView[] = europeanUniversities.map((uni) => ({
    id: uni.id,
    slug: slugForId(uni.id)!,
    name: uni.name,
    city: uni.city,
    countryCode: uni.country,
    logo: asset(uni.logo as Parameters<typeof asset>[0]),
    tagline: t(`items.${uni.id}.tagline`),
    founded: uni.founded ? String(uni.founded) : undefined,
    students: uni.students,
    hasCamp: uni.hasCamp ?? false,
  }));

  const pageUrl = absoluteUrl(getPathname({ locale, href: "/europe" }));

  return (
    <>
      <PageBreadcrumbJsonLd locale={locale} pathname="/europe" name={t("hero.title")} />
      <ServiceJsonLd name={meta("title")} description={meta("description")} url={pageUrl} />
      <UniversityListJsonLd
        url={pageUrl}
        items={europeanUniversities.map((uni) => ({
          name: uni.name,
          description: t(`items.${uni.id}.about`),
          city: uni.city,
          country: uni.country,
          url: absoluteUrl(
            getPathname({
              locale,
              href: { pathname: "/institutions/[slug]", params: { slug: slugForId(uni.id)! } },
            })
          ),
        }))}
      />

      <PageHero
        kicker={t("hero.kicker")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        image={asset("heroEurope")}
        imageAlt={t("hero.imageAlt")}
      />

      <section className="bg-white px-6 py-20 md:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            kicker={t("unis.kicker")}
            title={t("unis.title")}
            subtitle={t("unis.subtitle")}
          />
          <UniversityGrid
            universities={universities}
            labels={{
              more: t("detail.more"),
              campBadge: t("detail.campBadge"),
              logoAlt: t.raw("detail.logoAlt") as string,
            }}
          />
        </div>
      </section>

      <CtaSection title={t("cta.title")} text={t("cta.text")} buttonLabel={t("cta.button")} />
    </>
  );
}
