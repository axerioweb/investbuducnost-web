import { defineRouting } from "next-intl/routing";

/**
 * ─── DODAVANJE NOVOG JEZIKA ──────────────────────────────────────────────
 * 1. Dodaj kod jezika u `locales` ispod (npr. "de").
 * 2. Kreiraj `src/messages/de.json` (kopiraj en.json i prevedi).
 * 3. Dodaj lokalizovane putanje za "de" u `pathnames` ispod.
 * 4. Dodaj naziv jezika u `localeNames` u `src/i18n/config.ts`.
 * To je sve — middleware, sitemap, hreflang i language switcher se
 * automatski ažuriraju.
 * ─────────────────────────────────────────────────────────────────────────
 */
export const routing = defineRouting({
  locales: ["sr", "en", "es"],
  defaultLocale: "sr",
  localePrefix: "as-needed",
  // Bez automatskog preusmeravanja po Accept-Language zaglavlju: "/" uvek
  // servira srpsku verziju (canonical + x-default), a jezik se bira
  // prekidačem. Sprečava 307 redirect crawlera sa "/" na "/en".
  localeDetection: false,
  pathnames: {
    "/": "/",
    "/europe": {
      sr: "/studije-u-evropi",
      en: "/studies-in-europe",
      es: "/estudios-en-europa",
    },
    "/summer-camps": {
      sr: "/letnji-kampovi",
      en: "/summer-camps",
      es: "/campamentos-de-verano",
    },
    // Slug institucije je vlastito ime i isti je na svim jezicima; prevodi se
    // samo segment ispred njega. Vidi `src/data/institutions.ts`.
    "/institutions/[slug]": {
      sr: "/institucije/[slug]",
      en: "/institutions/[slug]",
      es: "/instituciones/[slug]",
    },
    "/china": {
      sr: "/studije-u-kini",
      en: "/study-in-china",
      es: "/estudiar-en-china",
    },
    "/student-visa-f1": {
      sr: "/studentska-viza-f1",
      en: "/student-visa-f1",
      es: "/visa-de-estudiante-f1",
    },
    "/tourist-visa-b1-b2": {
      sr: "/turisticka-viza-b1-b2",
      en: "/tourist-visa-b1-b2",
      es: "/visa-de-turista-b1-b2",
    },
    "/usa-employment": {
      sr: "/zaposljavanje-u-americi",
      en: "/work-in-usa",
      es: "/trabajar-en-eeuu",
    },
    "/about": {
      sr: "/o-nama",
      en: "/about-us",
      es: "/sobre-nosotros",
    },
    "/faq": {
      sr: "/najcesca-pitanja",
      en: "/faq",
      es: "/preguntas-frecuentes",
    },
    "/contact": {
      sr: "/kontakt",
      en: "/contact",
      es: "/contacto",
    },
  },
});

/**
 * Putanje koje se navode golim stringom (`href="/europe"`).
 *
 * Dinamičke rute su namerno izuzete: `/institutions/[slug]` bez `params` nije
 * upotrebljiva putanja, pa bi je tip propuštao kao ispravnu, a `getPathname` i
 * `Link` bi je odbili tek u radu. Za njih se koristi objektni oblik
 * `{ pathname: "/institutions/[slug]", params: { slug } }`.
 */
type StaticPathname<T> = T extends `${string}[${string}` ? never : T;

export type AppPathname = StaticPathname<keyof typeof routing.pathnames>;
