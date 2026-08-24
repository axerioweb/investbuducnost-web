import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import { asset } from "@/data/assets";
import { PageHero } from "@/components/ui/PageHero";
import { Accordion } from "@/components/ui/Accordion";
import { CtaSection } from "@/components/ui/CtaSection";
import { FaqJsonLd, PageBreadcrumbJsonLd } from "@/components/seo/JsonLd";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "faq", "/faq");
}

const FAQ_COUNT = 8;

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faq");

  const items = Array.from({ length: FAQ_COUNT }, (_, i) => ({
    q: t(`items.${i + 1}.q`),
    a: t(`items.${i + 1}.a`),
  }));

  return (
    <>
      <PageBreadcrumbJsonLd locale={locale} pathname="/faq" name={t("hero.title")} />
      <FaqJsonLd items={items} />
      <PageHero
        kicker={t("hero.kicker")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        image={asset("faqHero")}
        imageAlt={t("hero.imageAlt")}
      />
      <section className="px-6 py-20 md:py-24">
        <Accordion items={items} />
      </section>
      <CtaSection title={t("cta.title")} text={t("cta.text")} buttonLabel={t("cta.button")} />
    </>
  );
}
