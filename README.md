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

## Kontakt forma (Gmail)

Forma šalje na `POST /api/contact`, koja upit prosleđuje mejlom preko Gmail SMTP-a
na `investbuducnost@gmail.com` (reply-to je adresa pošiljaoca — „Odgovori" u Gmailu
ide direktno klijentu). Zaštita: honeypot polje, minimalno vreme popunjavanja,
ograničenje 5 poruka / 10 min po IP adresi, obavezna saglasnost sa politikom privatnosti.

Podešavanje (jednom):

1. Na Gmail nalogu uključi **verifikaciju u dva koraka**.
2. Napravi **lozinku za aplikacije**: <https://myaccount.google.com/apppasswords>.
3. Kopiraj `.env.example` u `.env.local` i upiši `GMAIL_APP_PASSWORD`.
4. Iste promenljive (`GMAIL_USER`, `GMAIL_APP_PASSWORD`) unesi kod hosting
   provajdera (npr. Vercel → Settings → Environment Variables) i ponovo deployuj.

Bez lozinke forma prikazuje poruku o grešci sa email adresom za direktan kontakt.

Chat šalje korisnika na WhatsApp (`site.whatsapp`). Newsletter je uklonjen.

## Privatnost

- Stranica **Politika privatnosti** (`/politika-privatnosti`, `/en/privacy-policy`,
  `/es/politica-de-privacidad`), tekst u `privacy.*` u messages fajlovima. Pri
  izmeni teksta ažuriraj `LAST_UPDATED` u `src/app/[locale]/privacy/page.tsx`.
- Sajt **ne postavlja nijedan kolačić** (`localeCookie: false` u routingu), pa
  baner za kolačiće nije potreban. Ako se doda analitika ili skripta treće strane,
  prvo ažurirati politiku i po potrebi dodati baner za pristanak.
- Matični broj i PIB se upisuju u `site.registration` (`src/data/site.ts`).

## Preusmerenja sa starog sajta

Adrese starog Wix sajta koje su promenjene (`/studije-u-eu`, `/kina`,
`/zaposljavanje-u-usa` i 20 stranica institucija) trajno se preusmeravaju na nove —
spisak je u `next.config.ts`.

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
  app/[locale]/         # 10 stranica + /institutions/[slug] (20 institucija)
  app/sitemap.ts        # sitemap sa hreflang alternates
  components/           # layout / ui / home / forms / chat / seo
  data/                 # site.ts (kontakti), catalog.ts, institutions.ts, assets.ts
  i18n/                 # routing (lokalizovani slugovi), config, request
  messages/             # sr/en/es.json — tekst sajta
  messages/institutions/  # sr/en/es.json — prozni tekstovi 20 institucija
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
