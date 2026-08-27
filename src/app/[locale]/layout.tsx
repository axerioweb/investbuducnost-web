import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale, getTranslations, getMessages } from "next-intl/server";
import "@fontsource-variable/sora";
import "@fontsource-variable/inter";
import "../globals.css";
import { routing } from "@/i18n/routing";
import { site } from "@/data/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";

export const viewport: Viewport = {
  themeColor: "#3b82c4",
  colorScheme: "light",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Imenski prostori koje traže KLIJENTSKE komponente (`useTranslations`).
 *
 * Bez ovog spiska `NextIntlClientProvider` serijalizuje ceo katalog poruka u
 * flight payload svake stranice — uključujući `institutions`, gde je proza 20
 * institucija (~41 KB) koju čita isključivo serverska komponenta. Spisak
 * odgovara `useTranslations("<ns>")` pozivima u `src/`; kad neka klijentska
 * komponenta dobije nov imenski prostor, mora i ovde.
 */
const CLIENT_NAMESPACES = [
  "nav",
  "common",
  "home",
  "contact",
  "footer",
  "chat",
  "notFound",
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(site.url),
    title: {
      default: t("titleTemplate"),
      template: `%s | ${t("siteName")}`,
    },
    applicationName: t("siteName"),
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "nav" });

  const all = await getMessages();
  const clientMessages = Object.fromEntries(
    CLIENT_NAMESPACES.map((ns) => [ns, all[ns]])
  );

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={clientMessages}>
          <OrganizationJsonLd />
          <WebSiteJsonLd />
          <a
            href="#main"
            className="sr-only rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50"
          >
            {t("skipToContent")}
          </a>
          <Header />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <ChatWidget />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
