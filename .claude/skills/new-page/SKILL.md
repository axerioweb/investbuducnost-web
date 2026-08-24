---
name: new-page
description: Dodavanje nove stranice na Invest Budućnost sajt (npr. blog, nova usluga, landing za kampanju) — sa kompletnim i18n i SEO tretmanom.
---

# Nova stranica

## Koraci

1. **Ruta:** u `src/i18n/routing.ts` dodaj internu putanju + lokalizovane slugove za
   sve jezike:
   ```ts
   "/scholarships": {
     sr: "/stipendije",
     en: "/scholarships",
     es: "/becas",
   },
   ```

2. **Prevodi:** u SVA TRI `src/messages/*.json` dodaj:
   - `meta.<ključ>` (title < 60 kar., description < 160 kar., sa ključnim rečima)
   - namespace sa sadržajem stranice (hero, sekcije, cta)

3. **SEO helper:** u `src/lib/seo.ts` dodaj novi ključ u `MetaKey` tip.

4. **Stranica:** `src/app/[locale]/<interna-ruta>/page.tsx` po šablonu postojećih:
   ```tsx
   export async function generateMetadata({ params }) {
     const { locale } = await params;
     return buildPageMetadata(locale, "<metaKljuč>", "/<interna-ruta>");
   }
   // U komponenti: setRequestLocale(locale) PRE getTranslations!
   ```
   Koristi `PageHero`, `SectionHeading`, `Reveal*`, `CtaSection` — vidi `DESIGN.md`.

5. **Povezivanje:** dodaj u `src/app/sitemap.ts` (ROUTES niz), u Header/Footer
   navigaciju ako pripada, i interno linkuj sa srodnih stranica.

6. **JSON-LD:** stranica usluge → `ServiceJsonLd`; FAQ sadržaj → `FaqJsonLd`.

## Verifikacija

`npm run build` — nova ruta mora biti SSG (●) za sve jezike; curl-uj lokalizovane
slugove; proveri hreflang blok u HTML-u.
