import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildPageMetadata, absoluteUrl } from "@/lib/seo";
import { getPathname } from "@/i18n/navigation";
import { usaJobLocations } from "@/data/catalog";
import { asset } from "@/data/assets";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProcessTimeline } from "@/components/ui/ProcessTimeline";
import { Kicker } from "@/components/ui/Kicker";
import { Check } from "@/components/ui/icons";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { CtaSection } from "@/components/ui/CtaSection";
import { ServiceJsonLd, PageBreadcrumbJsonLd } from "@/components/seo/JsonLd";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "usa", "/usa-employment");
}

const JOBS = [
  { key: "truck", img: "usaJobsTruck" },
  { key: "moving", img: "usaJobsMoving" },
  { key: "hospitality", img: "usaJobsHospitality" },
  { key: "catering", img: "usaJobsCatering" },
] as const;

export default async function UsaPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("usa");
  const common = await getTranslations("common");
  const meta = await getTranslations("meta.usa");

  const steps = Array.from({ length: 7 }, (_, i) => ({
    title: t(`steps.${i + 1}.title`),
    text: t(`steps.${i + 1}.text`),
  }));

  return (
    <>
      <PageBreadcrumbJsonLd locale={locale} pathname="/usa-employment" name={t("hero.title")} />
      <ServiceJsonLd
        name={meta("title")}
        description={meta("description")}
        url={absoluteUrl(getPathname({ locale, href: "/usa-employment" }))}
      />
      <PageHero
        kicker={t("hero.kicker")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        image={asset("heroUsaJobs")}
        imageAlt={t("hero.imageAlt")}
      />

      {/* Lokacije */}
      <section className="bg-white px-6 pt-16 md:pt-20">
        <div className="mx-auto max-w-7xl text-center">
          <Reveal>
            <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-brand-600">
              <Kicker text={t("locations.kicker")} />
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-ink md:text-3xl">
              {t("locations.title")}
            </h2>
          </Reveal>
          <RevealGroup className="mt-8 flex flex-wrap justify-center gap-3" stagger={0.06}>
            {usaJobLocations.map((loc) => (
              <RevealItem key={loc}>
                <span className="card inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-brand-300 hover:text-brand-600">
                  <span aria-hidden>📍</span> {loc}
                </span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Poslovi */}
      <section className="bg-white px-6 py-20 md:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading kicker={t("jobs.kicker")} title={t("jobs.title")} />
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {JOBS.map((job) => (
              <RevealItem key={job.key}>
                <article className="group card h-full overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-300 hover:shadow-[0_18px_44px_rgba(59,130,196,0.18)]">
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <Image
                      src={asset(job.img)}
                      alt={t(`jobs.${job.key}.title`)}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-base font-bold text-ink">
                      {t(`jobs.${job.key}.title`)}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-slate-body">
                      {t(`jobs.${job.key}.text`)}
                    </p>
                  </div>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Uslovi + činjenice */}
      <section className="bg-cloud px-6 py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-4">
          <Reveal className="lg:col-span-1">
            <div className="card h-full rounded-2xl border-l-4 !border-l-brand-500 p-6">
              <h3 className="font-display text-base font-bold text-ink">
                {t("eligibility.title")}
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-body">
                {[1, 2, 3].map((i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" />
                    {t(`eligibility.items.${i}`)}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          {(["salary", "payment", "duration"] as const).map((key, i) => (
            <Reveal key={key} delay={0.08 * (i + 1)}>
              <div className="card h-full rounded-2xl p-6">
                <h3 className="font-display text-base font-bold text-brand-600">
                  {t(`facts.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-body">
                  {t(`facts.${key}.text`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Koraci */}
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
