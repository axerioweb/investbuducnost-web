# MASTER PROMPT — Invest Budućnost redizajn

> Ovaj prompt pokreni u Claude Code-u (ili Cowork-u) iz root-a projekta `website/`
> kada želiš da regenerišeš, proširiš ili doradiš sajt. Projekat je već izgrađen —
> prompt služi kao izvor istine o zahtevima i kao uputstvo agentima.

## Kontekst

Radiš redizajn sajta **Invest Budućnost** (www.investbuducnost.info) — agencije za
studije u inostranstvu, vize (F1, B1/B2), letnje kampove i zapošljavanje u SAD.
Kompletan izvorni sadržaj je u `../content-inventory/site-content.md`, a mapa svih
slika u `../content-inventory/assets.json` i `src/data/assets.ts`.

## Zahtevi (nepromenljivi)

1. **Stack:** Next.js (App Router, TypeScript), Tailwind CSS v4, next-intl, framer-motion.
2. **Jezici:** sr (podrazumevani, bez URL prefiksa), en, es — sa lokalizovanim slugovima.
   Arhitektura MORA omogućiti dodavanje novog jezika izmenom samo:
   `src/i18n/routing.ts`, `src/i18n/config.ts` i novim `src/messages/<kod>.json`.
3. **Dizajn:** „Plavo poverenje" (po logou) — plava (#3b82c4 / #2c6aa6) + bela, tamnoplavi
   footer (#152c50), bele kartice sa mekim senkama, Sora/Inter. Kompletan sistem u
   `DESIGN.md`. Ne uvodi nove boje bez potrebe. Beli tekst ide na `brand-600` ili tamnije
   (na `brand-500` je kontrast 4.06:1 — ispod WCAG AA).
4. **Animacije:** framer-motion; sve mora poštovati `prefers-reduced-motion`.
   Koristi postojeće primitive: `Reveal`, `RevealGroup/Item`, `AnimatedCounter`,
   `ProcessTimeline`, `Marquee`, `Accordion`.
5. **SEO:** svaka stranica ima `generateMetadata` preko `buildPageMetadata()` (canonical +
   hreflang + OG/Twitter), odgovarajući JSON-LD (Service/FAQPage + `PageBreadcrumbJsonLd`),
   ulaz u `src/app/sitemap.ts`. Sav sadržaj statički prerenderovan (SSG) — `setRequestLocale`
   na vrhu svake stranice. `meta.*.title` ≤ 42 karaktera (layout dodaje brend), `description`
   140–155 karaktera.
6. **Chat i kontakt forma su SAMO vizuelni** — bez backend logike. Ne implementiraj
   slanje dok vlasnik ne obezbedi backend; tačke za povezivanje su označene
   komentarima u `ContactForm.tsx` i `ChatWidget.tsx`.
7. **Slike:** koriste se preko `asset("ključ")` iz `src/data/assets.ts`. Za lokalizaciju
   slika postoji `npm run download-assets`.

## Stranice (10)

`/` početna · `/europe` · `/summer-camps` · `/china` · `/student-visa-f1` ·
`/tourist-visa-b1-b2` · `/usa-employment` · `/about` · `/faq` · `/contact`
(interni nazivi ruta; javni slugovi su lokalizovani u `src/i18n/routing.ts`)

## Proces rada

1. Pročitaj `DESIGN.md` i `README.md`.
2. Za sadržinske izmene: menjaj SVA TRI messages fajla (sr/en/es) — nikad samo jedan.
3. Za novu stranicu: prati skill `.claude/skills/new-page/SKILL.md`.
4. Za novi jezik: prati skill `.claude/skills/add-language/SKILL.md`.
5. Nakon svake izmene: `npm run build` mora proći bez grešaka; proveri da su svi
   jezici i hreflang linkovi ispravni.
6. Za završnu proveru pokreni agenta `seo-auditor` i `qa-reviewer`.

## Pristupačnost (obavezno)

- Svaka framer-motion animacija poštuje `useReducedMotion` kroz `transition.duration`
  (nikad kroz grananje `initial` — to pravi hydration mismatch).
- Vidljiv fokus (globalni `:focus-visible` u `globals.css`) — ne dodavati `focus:outline-none`.
- Sadržaj harmonika ostaje u DOM-u (samo se vizuelno skuplja) — zbog čitača ekrana i SEO-a.
- Sav tekst ide kroz next-intl; `aria-label` takođe.

## Definicija završenog

- `npm run build` prolazi; sve rute × svi jezici prerenderovani
- Lighthouse ciljevi: Performance ≥ 90, SEO = 100, Accessibility ≥ 95
- Nema hardkodovanog teksta u komponentama (sve kroz next-intl)
- hreflang + canonical + JSON-LD validni na svakoj stranici
