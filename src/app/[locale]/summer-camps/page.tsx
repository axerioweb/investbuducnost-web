import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildPageMetadata, absoluteUrl } from "@/lib/seo";
import { getPathname } from "@/i18n/navigation";
import { summerCamps } from "@/data/catalog";
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
  const common = await getTranslations("common");
  const meta = await getTranslations("meta.camps");

  /**
   * Prevodi se razrešavaju na serveru, a mreža dobija gotove stringove —
   * tako u klijentski bundle ne odlazi ceo `messages` katalog.
   */
  const camps: CampView[] = summerCamps.map((camp) => {
    const item = `items.${camp.id}`;
    const age =
      camp.ageMin && camp.ageMax
        ? t("detail.ageRange", { min: camp.ageMin, max: camp.ageMax })
        : camp.ageMin
          ? t("detail.agePlus", { min: camp.ageMin })
          : undefined;

    return {
      id: camp.id,
      name: camp.name,
      university: camp.university,
      city: camp.city,
      countryCode: camp.country,
      logo: asset(camp.logo as Parameters<typeof asset>[0]),
      price: camp.price,
      ects: camp.ects,
      age,
      tagline: t(`${item}.tagline`),
      about: t(`${item}.about`),
      duration: t(`${item}.duration`),
      dates: t(`${item}.dates`),
      language: t(`${item}.language`),
      included: t.raw(`${item}.included`) as string[],
      activities: t.raw(`${item}.activities`) as string[],
      accommodation: t(`${item}.accommodation`),
      certificate: t(`${item}.certificate`),
    };
  });

  const pageUrl = absoluteUrl(getPathname({ locale, href: "/summer-camps" }));

  return (
    <>
      <PageBreadcrumbJsonLd locale={locale} pathname="/summer-camps" name={t("hero.title")} />
      <ServiceJsonLd name={meta("title")} description={meta("description")} url={pageUrl} />
      <CourseListJsonLd
        url={pageUrl}
        items={camps.map((c) => ({
          name: `${c.university} — ${c.name}`,
          description: c.about,
          provider: c.university,
          city: c.city,
          price: c.price,
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
              duration: common("duration"),
              dates: t("detail.dates"),
              price: common("price"),
              onRequest: t("detail.onRequest"),
              age: t("detail.age"),
              language: t("detail.language"),
              ects: t("detail.ects"),
              about: t("detail.about"),
              included: t("detail.included"),
              activities: t("detail.activities"),
              accommodation: t("detail.accommodation"),
              certificate: t("detail.certificate"),
              more: t("detail.more"),
              close: t("detail.close"),
              cta: t("detail.cta"),
              studies: t("detail.studies"),
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
