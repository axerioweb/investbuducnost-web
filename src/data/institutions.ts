/**
 * Registar pojedinačnih stranica institucija (`/institucije/<slug>`).
 *
 * `catalog.ts` nosi činjenice koje se ne prevode (školarine, programi, gradovi),
 * a `messages/institutions/<locale>.json` prozne sekcije. Ovde stoji ono što
 * povezuje to dvoje sa rutom: slug, zvanični sajt i ključevi fotografija.
 *
 * Slugovi su isti na sva tri jezika — nazivi institucija su vlastita imena i ne
 * prevode se, pa bi lokalizovani slug samo razbio deljive linkove. Prevodi se
 * samo segment ispred njih (`/institucije` ↔ `/institutions` ↔ `/instituciones`).
 *
 * NAPOMENA o izvoru fotografija: `photo*` ključevi su fotografije kampusa sa
 * starog sajta (agencija ih je preuzela od samih institucija). Tri institucije
 * ih tamo nemaju (METU, BTS, HTL) — one dobijaju fotografiju svog grada sa
 * Pexels-a, a AUBG zvaničnu fotografiju kampusa sa aubg.edu. Nikad se ne
 * prikazuje tuđi kampus kao njihov.
 */
import { europeanUniversities, summerCamps, type SummerCamp, type University } from "./catalog";

export type Institution = {
  /** Segment u URL-u — isti na svim jezicima. */
  slug: string;
  /** `id` iz `europeanUniversities` / `summerCamps`. */
  id: string;
  /** Zvanični sajt institucije — otvara se u novoj kartici. */
  website: string;
  /** Ključevi iz `institution-photos.json`; prvi je hero. */
  photos: readonly string[];
  /**
   * `true` kad institucija nema nijednu svoju fotografiju ni na starom sajtu
   * ni na zvaničnom, pa hero prikazuje fotografiju njenog grada. Alt tekst i
   * `og:image` tada ne smeju da tvrde da je to kampus te institucije.
   */
  cityPhoto?: boolean;
};

export const institutions: readonly Institution[] = [
  {
    slug: "emuni-university",
    id: "emuni",
    website: "https://emuni.si/",
    photos: ["photoEmuni1", "photoEmuni2", "photoEmuni3", "photoEmuni4"],
  },
  {
    slug: "budapest-metropolitan-university",
    id: "metu",
    website: "https://www.metropolitan.hu/en",
    photos: ["photoMetu1"],
    cityPhoto: true,
  },
  {
    slug: "istanbul-aydin-university",
    id: "aydin",
    website: "https://www.aydin.edu.tr/en-us",
    photos: ["photoAydin1", "photoAydin2", "photoAydin3"],
  },
  {
    slug: "university-of-nicosia",
    id: "nicosia",
    website: "https://www.unic.ac.cy/",
    photos: ["photoNicosia1", "photoNicosia2", "photoNicosia3", "photoNicosia4"],
  },
  {
    slug: "american-institute-switzerland",
    id: "ais",
    website: "https://www.americaninstitute.ch/",
    photos: ["photoAis1", "photoAis2", "photoAis3"],
  },
  {
    slug: "cbs-international-business-school",
    id: "cbs",
    website: "https://www.cbs.de/en/",
    photos: ["photoCbs1"],
  },
  {
    slug: "eu-business-school",
    id: "eubs",
    website: "https://www.euruni.edu/",
    photos: ["photoEubs1", "photoEubs2"],
  },
  {
    slug: "international-business-school",
    id: "ibs",
    website: "https://www.ibs-b.hu/",
    photos: ["photoIbs1"],
  },
  {
    slug: "wittenborg-university",
    id: "wittenborg",
    website: "https://www.wittenborg.eu/",
    photos: ["photoWittenborg1", "photoWittenborg2", "photoWittenborg3", "photoWittenborg4"],
  },
  {
    slug: "ucam-university",
    id: "ucam",
    website: "https://www.ucam.edu/en",
    photos: ["photoUcam1", "photoUcam2", "photoUcam3", "photoUcam4"],
  },
  {
    slug: "fatih-sultan-mehmet-university",
    id: "fsm",
    website: "https://www.fsm.edu.tr/en",
    photos: ["photoFsm1", "photoFsm2", "photoFsm3", "photoFsm4"],
  },
  {
    slug: "american-university-in-bulgaria",
    id: "aubg",
    website: "https://www.aubg.edu/",
    photos: ["photoAubg1"],
  },
  {
    slug: "john-cabot-university",
    id: "jcu",
    website: "https://www.johncabot.edu/",
    photos: ["photoJcu1", "photoJcu2"],
  },
  {
    slug: "gbsb-global-business-school",
    id: "gbsb",
    website: "https://www.global-business-school.org/",
    photos: ["photoGbsb1", "photoGbsb2", "photoGbsb3", "photoGbsb4", "photoGbsb5"],
  },
  {
    slug: "barcelona-technology-school",
    id: "bts",
    website: "https://barcelonatechnologyschool.com/",
    photos: ["photoBts1"],
    cityPhoto: true,
  },
  {
    slug: "htl-university",
    id: "htl",
    website: "https://www.htlbcn.com/",
    photos: ["photoHtl1"],
    cityPhoto: true,
  },
  {
    slug: "moscow-aviation-institute",
    id: "mai",
    website: "https://mai.ru/eng/",
    photos: ["photoMai1", "photoMai2", "photoMai3", "photoMai4"],
  },
  {
    slug: "srh-university",
    id: "srh",
    website: "https://www.srh-university.de/en/",
    photos: ["photoSrh1", "photoSrh2"],
  },
  {
    slug: "kozminski-university",
    id: "kozminski",
    website: "https://www.kozminski.edu.pl/en",
    photos: [
      "photoKozminski1",
      "photoKozminski2",
      "photoKozminski3",
      "photoKozminski4",
      "photoKozminski5",
    ],
  },
  {
    slug: "universidad-europea",
    id: "europea",
    website: "https://universidadeuropea.com/en/",
    photos: ["photoEuropea1", "photoEuropea2", "photoEuropea3"],
  },
] as const;

const bySlug = new Map(institutions.map((i) => [i.slug, i]));
const byId = new Map(institutions.map((i) => [i.id, i]));
const uniById = new Map(europeanUniversities.map((u) => [u.id, u]));
const campById = new Map(summerCamps.map((c) => [c.universityId ?? c.id, c]));

/** Sve što jedna stranica institucije prikazuje — spojeno iz tri izvora. */
export type InstitutionRecord = Institution & {
  university?: University;
  camp?: SummerCamp;
};

export function getInstitutionBySlug(slug: string): InstitutionRecord | undefined {
  const base = bySlug.get(slug);
  if (!base) return undefined;
  return { ...base, university: uniById.get(base.id), camp: campById.get(base.id) };
}

/** Slug institucije po `id`-u iz kataloga — za linkove sa mreža i iz kampova. */
export function slugForId(id: string): string | undefined {
  return byId.get(id)?.slug;
}
