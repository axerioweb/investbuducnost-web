import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import { site } from "@/data/site";
import { asset } from "@/data/assets";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/forms/ContactForm";
import { OfficesJsonLd, PageBreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { Flag } from "@/components/ui/Flag";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "contact", "/contact");
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <>
      <PageBreadcrumbJsonLd locale={locale} pathname="/contact" name={t("hero.title")} />
      <OfficesJsonLd locale={locale} />
      <PageHero
        kicker={t("hero.kicker")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        image={asset("contactBg")}
        imageAlt={t("hero.imageAlt")}
      />

      <section className="bg-white px-6 py-20 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-5">
          {/* Forma (vizuelna — demo režim) */}
          <Reveal className="lg:col-span-3">
            <ContactForm />
          </Reveal>

          {/* Info */}
          <Reveal delay={0.15} className="lg:col-span-2">
            <div className="space-y-5">
              <h2 className="font-display text-xl font-bold text-ink">{t("info.title")}</h2>
              {site.offices.map((office) => (
                <div
                  key={office.id}
                  className="card rounded-2xl p-6 transition-all duration-300 hover:border-brand-300"
                >
                  <div className="flex items-center gap-3">
                    <Flag code={office.countryCode} className="h-5 w-[1.875rem]" />
                    <h3 className="font-display text-base font-bold text-ink">
                      {t(`offices.${office.id}`)}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm text-slate-body">{office.address}</p>
                  <div className="mt-2 space-y-1">
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
              ))}
              <div className="card rounded-2xl p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                  {t("info.emailLabel")}
                </p>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-1 block text-sm font-medium text-ink hover:text-brand-600"
                >
                  {site.email}
                </a>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-brand-600">
                  {t("info.socialLabel")}
                </p>
                <div className="mt-2 flex gap-4 text-sm">
                  <a
                    href={site.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-body transition-colors hover:text-brand-600"
                  >
                    Facebook
                  </a>
                  <a
                    href={site.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-body transition-colors hover:text-brand-600"
                  >
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
