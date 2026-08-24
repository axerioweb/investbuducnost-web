import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildPageMetadata, absoluteUrl } from "@/lib/seo";
import { getPathname } from "@/i18n/navigation";
import { asset } from "@/data/assets";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProcessTimeline } from "@/components/ui/ProcessTimeline";
import { Kicker } from "@/components/ui/Kicker";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { CtaSection } from "@/components/ui/CtaSection";
import { ServiceJsonLd, PageBreadcrumbJsonLd } from "@/components/seo/JsonLd";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "b1b2", "/tourist-visa-b1-b2");
}

export default async function B1B2Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("b1b2");
  const common = await getTranslations("common");
  const meta = await getTranslations("meta.b1b2");

  const steps = Array.from({ length: 7 }, (_, i) => ({
    title: t(`steps.${i + 1}.title`),
    text: t(`steps.${i + 1}.text`),
  }));

  return (
    <>
      <PageBreadcrumbJsonLd locale={locale} pathname="/tourist-visa-b1-b2" name={t("hero.title")} />
      <ServiceJsonLd
        name={meta("title")}
        description={meta("description")}
        url={absoluteUrl(getPathname({ locale, href: "/tourist-visa-b1-b2" }))}
      />
      <PageHero
        kicker={t("hero.kicker")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        image={asset("heroB1B2")}
        imageAlt={t("hero.imageAlt")}
      />

      <section className="bg-white px-6 py-20 md:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading kicker={t("steps.kicker")} title={t("steps.title")} />
          <ProcessTimeline steps={steps} stepLabel={common("step")} />
        </div>
      </section>

      {/* Dodatne pogodnosti */}
      <section className="bg-cloud px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="mb-8 text-center text-[13px] font-semibold uppercase tracking-[0.22em] text-brand-600">
            <Kicker text={t("extras.kicker")} />
          </p>
          <RevealGroup className="grid gap-5 md:grid-cols-2">
            {(["family", "travel"] as const).map((key) => (
              <RevealItem key={key}>
                <div className="card h-full rounded-2xl border-l-4 !border-l-brand-500 p-7">
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {t(`extras.${key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-body">
                    {t(`extras.${key}.text`)}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <CtaSection title={t("cta.title")} text={t("cta.text")} buttonLabel={t("cta.button")} />
    </>
  );
}
