---
name: add-language
description: Dodavanje novog jezika na Invest Budućnost sajt. Koristi kada korisnik traži novi jezik (npr. nemački, francuski, italijanski) pored sr/en/es.
---

# Dodavanje novog jezika

Sajt koristi next-intl sa lokalizovanim slugovima. Novi jezik = 4 koraka:

## 1. `src/i18n/routing.ts`

- Dodaj kod jezika u `locales` niz (npr. `"de"`).
- U `pathnames` dodaj lokalizovan slug za SVAKU rutu, npr:
  ```ts
  "/europe": {
    sr: "/studije-u-evropi",
    en: "/studies-in-europe",
    es: "/estudios-en-europa",
    de: "/studium-in-europa",   // ← novo
  },
  ```
  Slugovi: mala slova, crtice, bez dijakritika, sa ključnim rečima tog jezika.

## 2. `src/i18n/config.ts`

- `localeNames`: dodaj prikazno ime (`de: "Deutsch"`).
- `ogLocales`: dodaj OG kod (`de: "de_DE"`).

## 3. `src/messages/<kod>.json`

- Kopiraj `en.json` i prevedi SVE vrednosti (struktura ključeva mora ostati identična).
- Pravila prevođenja su u `.claude/agents/translator.md` (vlastite imenice se ne
  prevode; `meta.*` tekstovi moraju biti SEO optimizovani za taj jezik).

## 4. JSON-LD

- U `src/components/seo/JsonLd.tsx` dodaj kod jezika u `inLanguage` niz WebSite scheme.

## Verifikacija

```bash
npm run build   # nove rute × novi jezik moraju biti u SSG listi
```
Zatim proveri: language switcher prikazuje novi jezik, hreflang alternates uključuju
novi kod na svakoj stranici, `/sitemap.xml` sadrži nove URL-ove.

Middleware, sitemap, hreflang i switcher se ažuriraju AUTOMATSKI — ne diraj ih.
