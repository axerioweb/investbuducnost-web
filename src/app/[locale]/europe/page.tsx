import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildPageMetadata, absoluteUrl } from "@/lib/seo";
import { getPathname } from "@/i18n/navigation";
import { europeanUniversities, type Tuition } from "@/data/catalog";
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
  const common = await getTranslations("common");
  const meta = await getTranslations("meta.europe");

  /** „7.050 €" + „po semestru" — iznos je podatak, period se prevodi. */
  const money = (tuition?: Tuition) => {
    if (!tuition) return undefined;
    const per =
      tuition.per === "year"
        ? common("perYear")
        : tuition.per === "semester"
          ? common("perSemester")
          : common("total");
    return `${tuition.amount} ${per}`;
  };

  // Prevodi se razrešavaju na serveru — mreža dobija gotove stringove.
  const universities: UniversityView[] = europeanUniversities.map((uni) => ({
    id: uni.id,
    name: uni.name,
    city: uni.city,
    countryCode: uni.country,
    logo: asset(uni.logo as Parameters<typeof asset>[0]),
    tagline: t(`items.${uni.id}.tagline`),
    about: t(`items.${uni.id}.about`),
    founded: uni.founded ? String(uni.founded) : undefined,
    students: uni.students,
    campuses: uni.campuses?.join(" · "),
    tuitionBachelor: money(uni.tuitionBachelor),
    tuitionMaster: money(uni.tuitionMaster),
    living: uni.living ? `${uni.living} ${common("perMonth")}` : undefined,
    bachelor: uni.bachelor,
    master: uni.master,
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
              founded: t("detail.founded"),
              students: t("detail.students"),
              campuses: t("detail.campuses"),
              tuitionBachelor: t("detail.tuitionBachelor"),
              tuitionMaster: t("detail.tuitionMaster"),
              living: t("detail.living"),
              about: t("detail.about"),
              bachelor: t("detail.bachelor"),
              master: t("detail.master"),
              programsNote: t("detail.programsNote"),
              year: common("year"),
              years: common("years"),
              more: t("detail.more"),
              close: t("detail.close"),
              cta: t("detail.cta"),
              camp: t("detail.camp"),
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
