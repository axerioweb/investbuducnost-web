# Invest Budućnost — dizajn sistem redizajna

## Koncept: „Plavo poverenje" (po logou)

Vizuelni identitet prati logo agencije (plava akademska kapa u rukama): prijatne
plave nijanse + bela. Svetao, prozračan, prijateljski izgled po uzoru na moderne
travel/visa sajtove — bele sekcije sa mekim senkama, plavi CTA elementi, fotografije
sa plavim overlay-em u hero sekcijama i tamnoplavi footer.

## Paleta

| Token | Hex | Upotreba |
|---|---|---|
| `brand-500` | `#3b82c4` | Primarna plava (kapa iz logoa) — akcenti, ivice, ikone |
| `brand-600` | `#2c6aa6` | CTA dugmad i sve površine sa belim tekstom (AA 5.65:1) |
| `brand-700` | `#235587` | Hover CTA, tamniji gradijenti |
| `brand-400/300/200` | `#5ba1d6/#8dc0e5/#bcdaf0` | Svetliji akcenti, ivice |
| `brand-50/100` | `#f0f7fc/#ddedf8` | Plave tint pozadine ikonica/badge-eva |
| `navy-800` | `#1d3a66` | Tamna plava (ruke iz logoa) — gradijenti |
| `navy-900` | `#152c50` | Footer pozadina |
| `ink` | `#16273d` | Naslovi / glavni tekst |
| `slate-body` | `#51637a` | Tekst pasusa |
| `mist` | `#6b7d93` | Sekundarni sitni tekst |
| `cloud` | `#f5f9fd` | Naizmenične svetle sekcije |
| `line` | `#e3ecf4` | Ivice kartica |

Definisano u `src/app/globals.css` kroz Tailwind v4 `@theme` — menja se na jednom mestu.
Sve ručno pisane klase (`.card`, `.bar-blur`, `:focus-visible`…) su u `@layer components`
da bi Tailwind utility klase (`hover:border-brand-300`, `focus-visible:outline-white`)
mogle da ih nadjačaju — neslojevit CSS uvek pobeđuje slojevit.

## Tipografija

- **Display (naslovi):** Sora Variable — geometrijski, moderan
- **Body:** Inter Variable — vrhunska čitljivost
- Fontovi preko npm paketa (`@fontsource-variable/*`) — bez Google CDN-a (GDPR + brzina).

## Ključni UI obrasci

- **Bele kartice** (`.card`): bela pozadina, `line` ivica, meka plava senka; hover: lift + `brand-300` ivica + jača senka
- **`.bar-blur`**: poluprovidna bela traka (header na scroll)
- **Plavi gradijent tekst** (`.text-brand-gradient`) za naglaske
- **`.bg-dots`**: suptilna plava tačkasta tekstura na gradijent sekcijama
- **Talasasti SVG prelaz** iz hero fotografije u belu sekciju (travel stil)
- **Hero overlay**: gradijent `navy-900 → brand-500` preko fotografija, beli tekst
- **Sekcije se smenjuju**: bela → `cloud` → bela; statistika i CTA na plavom gradijentu
- **Kartica institucije** (`components/institutions/`): logo na beloj pločici (`object-contain`,
  nikad izrezan) u `cloud` okviru, pa lokacija sa zastavicom, naziv, tagline i pilule sa
  ključnim podacima. Ceo blok je klikabilan preko `after:absolute after:inset-0` na dugmetu
  u naslovu — validan HTML (dugme prima samo phrasing content) i pristupačno ime dugmeta
  ostaje samo naziv institucije
- **Modalni dijalog** (`ui/Modal.tsx`): portal na `body` (kartice su unutar `motion.div`
  elemenata čiji `transform` pravi novi stacking context i lomi `position: fixed`),
  zamka fokusa, Escape u capture fazi, zaključan scroll sa kompenzacijom scrollbar-a i
  povratak fokusa na okidač. Zaglavlje nosi isti plavi gradijent kao hero

## Ikonografija

Tipografski znakovi koji su ranije stajali u interfejsu (→ u dugmadima i „Saznaj
više", · između pojmova u nadnaslovu, ✓, +, „) crta font operativnog sistema, pa
su na svakoj platformi drugačije debljine i visine i nikad ne pogađaju optičku
sredinu reda. Zamenjeni su SVG-ovima u `components/ui/icons.tsx` — jedan izvor,
`viewBox` 24×24, `currentColor`, zaobljeni krajevi, potez 2–2.6.

- **`ArrowRight`** — potpisna strelica; u `BrandButton` sedi u svetlom kružiću
  (isti zaobljeni „pločica" jezik kao ikone usluga), koji je jedini nosilac
  pokreta na hover. Visina dugmeta ostaje 48px kao kod `Ghost/LightButton`
- **`Spark`** — četvorokraka iskra, mikro-znak brenda. Zamenjuje „·" u
  nadnaslovima i tačku-marker u hero značci
- **`Kicker`** (`components/ui/Kicker.tsx`) — deli prevod po „·" i umeće `Spark`;
  prevodi ostaju nepromenjeni, razdvajač je čista grafika
- Ostatak seta (`ChevronDown`, `Check`, `Plus`, `Close`, `Send`, `ChatBubble`,
  `QuoteMark`, `FacebookIcon`, `InstagramIcon`, `WaveDivider`) je preseljen iz
  komponenata bez promene izgleda — iste putanje su bile prekucane na po tri-četiri
  mesta i razilazile se u debljini
- **Emodži u plavim pločicama** (usluge na naslovnoj, vrednosti na „O nama")
  ostaju emodži — oni su uzor stila za ostatak ikonografije, a ne meta zamene

### Zastave

`components/ui/Flag.tsx` crta zastave po ISO 3166-1 alpha-2 kôdu. Emodži zastava je
par „regional indicator" slova koje font mora da spoji u jedan znak; Windows to ne
radi (sistemski font nema zastave), pa se 🇷🇸 tamo prikaza kao slova „RS" — isti sajt
izgleda potpuno drugačije po platformama. Crtež je pojednostavljen jer se na 21×14 px
heraldika ionako ne raspoznaje: zvanične boje i osnovna polja.

Koriste se u prekidaču jezika (`localeFlags` u `i18n/config.ts` — sr→RS, en→GB, es→ES),
na karticama i u dijalozima institucija (`countryCode` iz `catalog.ts`), uz kancelarije
(`site.offices[].countryCode`) i u podnožju. Zaokruživanje ivica radi `overflow-hidden`
na omotaču, a ne `clipPath` — `clipPath` traži jedinstven `id`, a isti kôd zastave se
na strani ponavlja.

## Fotografije

Besplatne sa Pexels-a (bez obavezne atribucije), mapirane u `src/data/assets.ts`;
`npm run download-assets` ih preuzima lokalno. Logo, fotografije stvarnih
studenata/klijenata i 20 logotipa partnerskih institucija (`uni*`) su sa starog sajta.
Skripta čuva ručno dodate ključeve iz `assets.local.json` (npr. `logoMark`) — bez toga
bi svako pokretanje izbacilo takav asset iz manifesta i slika bi pala na nedozvoljen CDN URL.

Skripta ume i da rasterizuje SVG u PNG (`rasterizeWidth`) — `next/image` ne servira SVG
bez `dangerouslyAllowSVG`, a XJTLU nudi zaglavni logo samo u tom formatu.

Za `uni*`, `partner*` i `*Logo` ključeve skripta meri **najtamniji neprozirni piksel** i
upozorava ako je iznad 200: logotipi za tamnu podlogu (beo tekst na providnom) preuzimaju
se sa HTTP 200 kao i svaki drugi, a na beloj pločici su nevidljivi. Udeo tamnih piksela
ne valja kao mera — proređeni logotipi bi davali lažne uzbune.

## Animacije (framer-motion)

| Element | Animacija |
|---|---|
| Hero | Parallax fotografije, staggered fade-up, scroll indikator, talasasti prelaz |
| Sekcije | `Reveal` — fade + slide-up na ulazak u viewport |
| Grid kartice | `RevealGroup/Item` stagger; hover lift + plava senka |
| Statistika | `AnimatedCounter` count-up na plavoj gradijent sekciji |
| Proces | `ProcessTimeline` — plava linija se „crta", koraci ulaze sleva |
| FAQ | Harmonika sa spring visinom i rotacijom ikone |
| Partneri | Beskonačni CSS marquee s leva na desno, logotipi vode na sajt partnera; pauza na hover i na fokus (WCAG 2.2.2), duplikat je `aria-hidden` + `inert`. Jedina animacija izuzeta iz `prefers-reduced-motion` kill-switch-a (`.marquee-track`) — odluka vlasnika sajta |
| Header | Providan (beli tekst preko fotografije) → bela blur traka na scroll |
| Chat | Plavi mehurić, scale/fade otvaranje, ping puls |
| Dijalog institucije | Fade zatamnjenja + slide-up/scale panela; oba gase trajanje na `prefers-reduced-motion` |

**Pristupačnost:** `prefers-reduced-motion` poštovan svuda — CSS kill-switch + `useReducedMotion`
koji gasi **trajanje** animacije (nikad `initial`, da ne bi bilo hydration mismatch-a).
Globalni `:focus-visible` prsten, skip link ka `#main`, Escape + upravljanje fokusom za
padajuće menije i chat, harmonika sa `aria-controls`/`role="region"` i sadržajem koji uvek
ostaje u DOM-u. Beli tekst ide isključivo na `brand-600` ili tamnije. Hero i podnaslovi
animiraju samo pomeraj (bez `opacity`) da bi bili vidljivi i bez JavaScript-a
(uz `@media (scripting: none)` fallback).

## SEO arhitektura

- Lokalizovani slugovi po jeziku (`/studije-u-evropi` ↔ `/en/studies-in-europe` ↔ `/es/estudios-en-europa`)
- `hreflang` alternates + `x-default`; canonical URL-ovi
- JSON-LD: Organization, WebSite, Service (usluge), FAQPage
- `sitemap.xml` sa hreflang alternates, `robots.txt`
- Jedinstveni title/description po stranici i jeziku (`messages/*.json` → `meta.*`);
  title ≤ 42 znaka (layout dodaje „| Invest Budućnost"), description 140–155 znakova
- `BreadcrumbList` na podstranicama, `LocalBusiness` po kancelariji na kontaktu
- `ItemList` sa `Course` (letnji kampovi) i `CollegeOrUniversity` (Evropa) — detalji programa
  žive u dijalogu, pa strukturirani podaci nose iste činjenice bez izvršavanja JavaScript-a
- OG vizual 1200×630 (`public/images/ogDefault.png`), `manifest.ts` + `apple-icon.png`
- Bez automatske detekcije jezika (`localeDetection: false`) — „/" je uvek srpski
- Sav sadržaj SSG — brz TTFB, potpuno indeksabilan
