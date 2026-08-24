import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import { site } from "@/data/site";
import { asset } from "@/data/assets";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { CtaSection } from "@/components/ui/CtaSection";
import { Partners } from "@/components/home/Partners";
import { PageBreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { Flag } from "@/components/ui/Flag";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "about", "/about");
}

const VALUES = ["transparency", "experience", "network", "support"] as const;
const VALUE_ICONS = ["🔍", "🏆", "🌍", "🤝"];

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const contact = await getTranslations("contact.offices");
  const home = await getTranslations("home.cta");

  return (
    <>
      <PageBreadcrumbJsonLd locale={locale} pathname="/about" name={t("hero.title")} />
      <PageHero
        kicker={t("hero.kicker")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        image={asset("aboutHero")}
        imageAlt={t("hero.imageAlt")}
      />

      {/* Priča */}
      <section className="bg-white px-6 py-20 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <h2 className="font-display text-3xl font-bold text-ink md:text-4xl">
              {t("story.title")}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-body md:text-lg">
              {t("story.text1")}
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-body md:text-lg">
              {t("story.text2")}
            </p>
          </Reveal>
          <Reveal delay={0.15} className="lg:col-span-2">
            <div className="card rounded-3xl p-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-500 font-display text-2xl font-bold text-white shadow-[0_10px_26px_rgba(59,130,196,0.35)]" aria-hidden>
                BR
              </div>
              <p className="mt-4 font-display text-lg font-bold text-ink">{site.founder}</p>
              <p className="mt-1 text-sm text-brand-600">{t("story.founderRole")}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Tim — fotografija */}
      <section className="bg-white px-6 pb-4">
        <Reveal className="mx-auto max-w-6xl overflow-hidden rounded-3xl shadow-[0_20px_50px_rgba(29,58,102,0.15)]">
          <Image
            src={asset("contactBg")}
            alt={t("story.imageAlt")}
            width={1600}
            height={700}
            sizes="(min-width: 1152px) 1152px, 100vw"
            className="h-64 w-full object-cover md:h-96"
          />
        </Reveal>
      </section>

      {/* Vrednosti */}
      <section className="bg-cloud px-6 py-20 md:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            kicker={t("values.kicker")}
            title={t("values.title")}
            subtitle={t("values.subtitle")}
          />
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((key, i) => (
              <RevealItem key={key}>
                <div className="card h-full rounded-2xl p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_14px_36px_rgba(59,130,196,0.15)]">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-3xl" aria-hidden>{VALUE_ICONS[i]}</span>
                  <h3 className="mt-4 font-display text-lg font-bold text-ink">
                    {t(`values.${key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-body">
                    {t(`values.${key}.text`)}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Kancelarije */}
      <section className="bg-white px-6 py-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading kicker={t("offices.kicker")} title={t("offices.title")} />
          <RevealGroup className="grid gap-5 md:grid-cols-3">
            {site.offices.map((office) => (
              <RevealItem key={office.id}>
                <div className="card h-full rounded-2xl p-7 transition-all duration-300 hover:border-brand-300 hover:shadow-[0_14px_36px_rgba(59,130,196,0.15)]">
                  <Flag code={office.countryCode} className="h-7 w-[2.625rem]" />
                  <h3 className="mt-3 font-display text-lg font-bold text-ink">
                    {contact(office.id)}
                  </h3>
                  <p className="mt-2 text-sm text-slate-body">{office.address}</p>
                  <div className="mt-3 space-y-1">
                    {office.phones.map((phone) => (
                      <a
                        key={phone.tel}
                        href={`tel:${phone.tel}`}
                        className="block text-sm font-medium text-brand-600 hover:text-brand-700"
                      >
                        {phone.label ? `${phone.label}: ` : ""}{phone.number}
                      </a>
                    ))}
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <Partners />
      <CtaSection title={home("title")} text={home("text")} buttonLabel={home("button")} />
    </>
  );
}
