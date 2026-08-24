import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildPageMetadata, absoluteUrl } from "@/lib/seo";
import { getPathname } from "@/i18n/navigation";
import { asset } from "@/data/assets";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProcessTimeline } from "@/components/ui/ProcessTimeline";
import { CtaSection } from "@/components/ui/CtaSection";
import { ServiceJsonLd, PageBreadcrumbJsonLd } from "@/components/seo/JsonLd";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "f1", "/student-visa-f1");
}

export default async function F1Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("f1");
  const common = await getTranslations("common");
  const meta = await getTranslations("meta.f1");

  const steps = Array.from({ length: 6 }, (_, i) => ({
    title: t(`steps.${i + 1}.title`),
    text: t(`steps.${i + 1}.text`),
  }));

  return (
    <>
      <PageBreadcrumbJsonLd locale={locale} pathname="/student-visa-f1" name={t("hero.title")} />
      <ServiceJsonLd
        name={meta("title")}
        description={meta("description")}
        url={absoluteUrl(getPathname({ locale, href: "/student-visa-f1" }))}
      />
      <PageHero
        kicker={t("hero.kicker")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        image={asset("heroF1")}
        imageAlt={t("hero.imageAlt")}
      />
      <section className="bg-white px-6 py-20 md:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading kicker={t("steps.kicker")} title={t("steps.title")} />
          <ProcessTimeline steps={steps} stepLabel={common("step")} />
        </div>
      </section>
      <CtaSection title={t("cta.title")} text={t("cta.text")} buttonLabel={t("cta.button")} />
    </>
  );
}
