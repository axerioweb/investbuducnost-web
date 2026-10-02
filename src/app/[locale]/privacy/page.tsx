import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import { site } from "@/data/site";
import { asset } from "@/data/assets";
import { PageHero } from "@/components/ui/PageHero";
import { PageBreadcrumbJsonLd } from "@/components/seo/JsonLd";

type Props = { params: Promise<{ locale: string }> };

type Section = {
  id: string;
  title: string;
  paragraphs?: string[];
  items?: string[];
  after?: string[];
};

/** Datum poslednje izmene — ažurirati pri svakoj promeni teksta politike. */
const LAST_UPDATED = "2026-10-02";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "privacy", "/privacy");
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");
  const sections = t.raw("sections") as Section[];
  const office = site.offices[0];
  // "sr" bi u Intl-u dao ćirilicu; sajt je na latinici. UTC — da datum ne
  // sklizne na prethodni dan u zonama zapadno od Griniča.
  const date = new Intl.DateTimeFormat(locale === "sr" ? "sr-Latn" : locale, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(LAST_UPDATED));

  const controller: [string, React.ReactNode][] = [
    [t("controllerCard.address"), office.address],
    [
      t("controllerCard.email"),
      <a key="email" href={`mailto:${site.email}`} className="text-brand-600 hover:text-brand-700">
        {site.email}
      </a>,
    ],
    [
      t("controllerCard.phone"),
      <a key="phone" href={`tel:${office.phones[0].tel}`} className="text-brand-600 hover:text-brand-700">
        {office.phones[0].number}
      </a>,
    ],
  ];
  if (site.registration.companyId) controller.push([t("controllerCard.companyId"), site.registration.companyId]);
  if (site.registration.taxId) controller.push([t("controllerCard.taxId"), site.registration.taxId]);

  return (
    <>
      <PageBreadcrumbJsonLd locale={locale} pathname="/privacy" name={t("hero.title")} />
      <PageHero
        kicker={t("hero.kicker")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        image={asset("faqHero")}
      />

      <section className="bg-white px-6 py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm text-slate-body">{t("updated", { date })}</p>

          {sections.map((s, i) => (
            <div key={s.id} id={s.id} className="mt-10 scroll-mt-28">
              <h2 className="font-display text-xl font-bold text-ink md:text-2xl">
                {i + 1}. {s.title}
              </h2>
              {s.paragraphs?.map((p, j) => (
                <p key={j} className="mt-3 leading-relaxed text-slate-body">
                  {p}
                </p>
              ))}
              {s.items && (
                <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-slate-body marker:text-brand-500">
                  {s.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              )}
              {s.after?.map((p, j) => (
                <p key={j} className="mt-3 leading-relaxed text-slate-body">
                  {p}
                </p>
              ))}
              {s.id === "controller" && (
                <div className="card mt-5 rounded-2xl p-6 text-sm">
                  <p className="font-display text-base font-bold text-ink">{site.legalName}</p>
                  <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-[auto_1fr]">
                    {controller.map(([label, value]) => (
                      <div key={label} className="contents">
                        <dt className="font-medium text-ink">{label}</dt>
                        <dd className="text-slate-body">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
