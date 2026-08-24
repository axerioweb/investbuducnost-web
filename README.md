# Invest Budućnost — redizajn sajta

Moderan, višejezični, SEO-optimizovan sajt agencije Invest Budućnost
(studije u inostranstvu · vize F1 i B1/B2 · letnji kampovi · zapošljavanje u SAD).

**Stack:** Next.js (App Router, TypeScript) · Tailwind CSS v4 · next-intl · framer-motion

## Pokretanje

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # produkcioni build (sve stranice SSG)
npm start          # produkcioni server
```

## Slike

Fotografije su besplatne sa **Pexels-a** (licenca dozvoljava komercijalnu upotrebu
bez atribucije), a logo i slike stvarnih studenata su sa starog sajta (Wix CDN).
**Sve slike su već preuzete** u `public/images/` (manifest: `src/data/assets.local.json`),
rekompresovane su i `remotePatterns` više nisu potrebni u `next.config.ts`.
Ako dodaješ nove asset-e u `src/data/assets.ts`, preuzmi ih sa:

```bash
npm run download-assets
```

## Jezici

- **sr** — podrazumevani, bez URL prefiksa (`/studije-u-evropi`)
- **en** — `/en/studies-in-europe`
- **es** — `/es/estudios-en-europa`

Dodavanje novog jezika: prati `.claude/skills/add-language/SKILL.md` (4 mala koraka —
routing, config, messages fajl, JSON-LD).

## Šta je namerno u demo režimu

- **Kontakt forma**, **newsletter** i **chat widget** su vizuelno kompletni ali ne
  šalju podatke. Aktivacija: `.claude/skills/connect-forms/SKILL.md`.

## SEO

Lokalizovani slugovi, hreflang + x-default, canonical, JSON-LD (Organization, WebSite,
Service, FAQPage), sitemap sa alternates, robots, jedinstveni meta title/description
po stranici i jeziku, kompletan SSG. Detalji u `DESIGN.md`.

## Poznata ograničenja

- **404 stranica je na srpskom.** Proxy prepisuje svaku nepoznatu putanju na
  podrazumevani jezik, pa Next za sve nepostojeće rute servira
  `src/app/not-found.tsx` (status 404 + `noindex`). Lokalizovani
  `[locale]/not-found.tsx` se koristi samo pri eksplicitnom `notFound()`.
- **Telefon slovenačke kancelarije** u `src/data/site.ts` ima srpski pozivni broj
  (`+381 61 158-6762`) — proveriti kod vlasnika (verovatno treba `+386`).
- Tri asseta (`xjtluLogo`, `campusFriends`, `gradsCelebrate`) su preuzeta ali se
  trenutno nigde ne koriste — ostavljena su za buduće stranice.

## Struktura

```
src/
  app/[locale]/         # 10 stranica (interni engleski nazivi ruta)
  app/sitemap.ts        # sitemap sa hreflang alternates
  components/           # layout / ui / home / forms / chat / seo
  data/                 # site.ts (kontakti, statistika), catalog.ts, assets.ts
  i18n/                 # routing (lokalizovani slugovi), config, request
  messages/             # sr.json, en.json, es.json — SAV tekst sajta
  lib/seo.ts            # buildPageMetadata helper
.claude/
  agents/               # translator, ui-builder, seo-auditor, qa-reviewer, content-scraper
  skills/               # add-language, new-page, connect-forms
prompts/MASTER_PROMPT.md  # glavni prompt za buduće izmene kroz Claude
DESIGN.md                 # dizajn sistem (boje, tipografija, animacije)
```

## Rad sa Claude agentima

U Claude Code-u iz ovog direktorijuma:

- veće izmene → nalepi `prompts/MASTER_PROMPT.md` kao kontekst zadatka
- novi jezik → „Dodaj nemački jezik" (skill se aktivira automatski)
- nova stranica → „Dodaj stranicu za stipendije" (skill `new-page`)
- pre deploya → „Pokreni seo-auditor i qa-reviewer agente"
