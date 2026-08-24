import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildPageMetadata, absoluteUrl } from "@/lib/seo";
import { getPathname } from "@/i18n/navigation";
import { xjtluBachelor, xjtluMaster } from "@/data/catalog";
import { asset } from "@/data/assets";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProcessTimeline } from "@/components/ui/ProcessTimeline";
import { CtaSection } from "@/components/ui/CtaSection";
import { ServiceJsonLd, PageBreadcrumbJsonLd } from "@/components/seo/JsonLd";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "china", "/china");
}

function ProgramTable({
  title,
  subtitle,
  rows,
  labels,
}: {
  title: string;
  subtitle: string;
  rows: readonly { name: string; years: number; price: string }[];
  labels: { program: string; duration: string; price: string; year: string; years: string };
}) {
  return (
    <Reveal>
      <div className="card overflow-hidden rounded-2xl">
        <div className="border-b border-line bg-cloud px-6 py-5">
          <h3 className="font-display text-xl font-bold text-ink">{title}</h3>
          <p className="mt-1 text-sm text-slate-body">{subtitle}</p>
        </div>
        {/* tabIndex — da se tabela može skrolovati i tastaturom */}
        <div className="overflow-x-auto" tabIndex={0} role="region" aria-label={title}>
          <table className="w-full text-left text-sm">
            <caption className="sr-only">{title}</caption>
            <thead>
              <tr className="border-b border-line text-[11px] uppercase tracking-wider text-brand-600">
                <th scope="col" className="px-6 py-3 font-semibold">{labels.program}</th>
                <th scope="col" className="px-6 py-3 font-semibold">{labels.duration}</th>
                <th scope="col" className="px-6 py-3 text-right font-semibold">{labels.price}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.name}
                  className="border-b border-line transition-colors last:border-0 hover:bg-brand-50/50"
                >
                  <td className="px-6 py-4 font-medium text-ink">{row.name}</td>
                  <td className="px-6 py-4 text-slate-body">
                    {row.years} {row.years === 1 ? labels.year : labels.years}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-brand-600">
                    {row.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Reveal>
  );
}

export default async function ChinaPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("china");
  const common = await getTranslations("common");
  const meta = await getTranslations("meta.china");

  const phases = Array.from({ length: 6 }, (_, i) => ({
    title: t(`phases.${i + 1}.title`),
    text: t(`phases.${i + 1}.text`),
  }));

  const tableLabels = {
    program: common("program"),
    duration: common("duration"),
    price: common("price"),
    year: common("year"),
    years: common("years"),
  };

  return (
    <>
      <PageBreadcrumbJsonLd locale={locale} pathname="/china" name={t("hero.title")} />
      <ServiceJsonLd
        name={meta("title")}
        description={meta("description")}
        url={absoluteUrl(getPathname({ locale, href: "/china" }))}
      />
      <PageHero
        kicker={t("hero.kicker")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        image={asset("heroChina")}
        imageAlt={t("hero.imageAlt")}
      />

      {/* O univerzitetu */}
      <section className="bg-white px-6 py-20 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl shadow-[0_20px_50px_rgba(29,58,102,0.15)]">
              <Image
                src={asset("heroChina")}
                alt={t("about.imageAlt")}
                width={720}
                height={520}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <h2 className="font-display text-3xl font-bold text-ink md:text-4xl">
              {t("about.title")}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-body md:text-lg">
              {t("about.text")}
            </p>
            <div className="mt-7 inline-flex items-center gap-4 rounded-2xl border border-brand-200 bg-brand-50 px-6 py-4">
              <span className="rounded-full bg-brand-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                {t("scholarship.badge")}
              </span>
              <p className="text-sm font-medium text-brand-700">{t("scholarship.text")}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Programi */}
      <section className="bg-cloud px-6 py-20 md:py-24">
        <div className="mx-auto max-w-5xl space-y-8">
          <ProgramTable
            title={t("bachelor.title")}
            subtitle={t("bachelor.subtitle")}
            rows={xjtluBachelor}
            labels={tableLabels}
          />
          <Reveal>
            <p className="px-2 text-sm leading-relaxed text-slate-body">{t("bachelor.extra")}</p>
          </Reveal>
          <ProgramTable
            title={t("master.title")}
            subtitle={t("master.subtitle")}
            rows={xjtluMaster}
            labels={tableLabels}
          />
        </div>
      </section>

      {/* Faze */}
      <section className="bg-white px-6 py-20 md:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading kicker={t("phases.kicker")} title={t("phases.title")} />
          <ProcessTimeline steps={phases} stepLabel={common("phase")} />
        </div>
      </section>

      <CtaSection title={t("cta.title")} text={t("cta.text")} buttonLabel={t("cta.button")} />
    </>
  );
}
