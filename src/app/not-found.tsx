import Link from "next/link";
import type { Metadata } from "next";
import "@fontsource-variable/sora";
import "@fontsource-variable/inter";
import "./globals.css";
import { routing } from "@/i18n/routing";
import messages from "@/messages/sr.json";

/**
 * Globalni 404.
 *
 * Proxy (`src/proxy.ts`) prepisuje svaku nepoznatu putanju na podrazumevani
 * jezik, pa Next za sve nepostojeće rute servira baš ovu stranicu — zato je
 * tekst na srpskom (podrazumevani jezik). Root layout ne renderuje `<html>`,
 * te ga ova stranica mora obezbediti sama. Next automatski šalje status 404
 * i `noindex`. Lokalizovani `[locale]/not-found.tsx` se koristi kada neka
 * stranica eksplicitno pozove `notFound()`.
 */
export const metadata: Metadata = {
  title: `404 — ${messages.notFound.title}`,
};

export default function GlobalNotFound() {
  const t = messages.notFound;

  return (
    <html lang={routing.defaultLocale}>
      <body>
        <main className="flex min-h-svh flex-col items-center justify-center bg-cloud px-6 text-center">
          <p className="font-display text-8xl font-bold text-brand-gradient">404</p>
          <h1 className="mt-4 font-display text-2xl font-bold text-ink">{t.title}</h1>
          <p className="mt-2 max-w-md text-sm text-slate-body">{t.text}</p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-600 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(44,106,166,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-650"
          >
            {t.button}
          </Link>
        </main>
      </body>
    </html>
  );
}
