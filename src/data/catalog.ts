/** Podaci koji se ne prevode: nazivi institucija, programa, cene. */

/** Naziv studijskog programa + trajanje u godinama. */
export type StudyProgram = { name: string; years: number };

/** Iznos školarine i period na koji se odnosi (label se prevodi u `common`). */
export type Tuition = { amount: string; per: "year" | "semester" | "total" };

export type University = {
  /** Ključ za prevode (`europe.items.<id>`) i za `assets.ts` logo. */
  id: string;
  name: string;
  city: string;
  /** ISO 3166-1 alpha-2 — koristi se za zastavicu. */
  country: string;
  /** Ključ u `src/data/assets.ts`. */
  logo: string;
  founded?: number;
  /** Npr. „40.000+" — formatiranje je jezički neutralno. */
  students?: string;
  /** Dodatni kampusi (nazivi gradova se ne prevode). */
  campuses?: readonly string[];
  bachelor?: readonly StudyProgram[];
  master?: readonly StudyProgram[];
  tuitionBachelor?: Tuition;
  tuitionMaster?: Tuition;
  /** Mesečni troškovi života, npr. „600–1.000 €". */
  living?: string;
  /** Ima i letnji/zimski program — vodi na /summer-camps. */
  hasCamp?: boolean;
};

/**
 * Partnerski univerziteti u Evropi.
 *
 * NAPOMENA o izvoru: stari Wix sajt je na više stranica imao ISTE tabele
 * programa (isti spisak stoji na AIS, CBS i Moscow Aviation, a zapravo pripada
 * UCAM-u; master spisak sa Aydin/GBSB stranica pripada EU Business School-u).
 * Zato `bachelor`/`master` postoje samo tamo gde je spisak stvarno jedinstven
 * za tu instituciju — bolje izostaviti nego prepisati tuđe programe.
 */
export const europeanUniversities: readonly University[] = [
  {
    id: "emuni",
    name: "EMUNI University",
    city: "Piran & Koper",
    country: "SI",
    logo: "uniEmuni",
    founded: 2008,
    hasCamp: true,
  },
  {
    id: "metu",
    name: "Budapest Metropolitan University",
    city: "Budapest",
    country: "HU",
    logo: "uniMetu",
    bachelor: [
      { name: "Film and Media Studies", years: 4 },
      { name: "Art & Design", years: 4 },
      { name: "Tourism and Catering", years: 4 },
      { name: "International Relations", years: 4 },
    ],
    master: [
      { name: "MBA", years: 1 },
      { name: "Tourism Management MSc", years: 1 },
      { name: "Marketing MSc", years: 1 },
      { name: "Management and Leadership MSc", years: 1 },
    ],
    tuitionBachelor: { amount: "2.600–4.990 €", per: "semester" },
    tuitionMaster: { amount: "3.100–4.990 €", per: "semester" },
    living: "420–840 €",
    hasCamp: true,
  },
  {
    id: "aydin",
    name: "Istanbul Aydin University",
    city: "Istanbul",
    country: "TR",
    logo: "uniAydin",
    founded: 2007,
    students: "40.000+",
    tuitionBachelor: { amount: "3.000–6.000 €", per: "year" },
    tuitionMaster: { amount: "3.000–5.000 €", per: "total" },
    living: "450–800 €",
    hasCamp: true,
  },
  {
    id: "nicosia",
    name: "University of Nicosia",
    city: "Nicosia",
    country: "CY",
    logo: "uniNicosia",
    founded: 1980,
    campuses: ["Nicosia", "Athens"],
    tuitionMaster: { amount: "8.000–15.000 €", per: "total" },
    living: "700–1.200 €",
  },
  {
    id: "ais",
    name: "American Institute of Applied Sciences",
    city: "La Tour-de-Peilz",
    country: "CH",
    logo: "uniAis",
    tuitionBachelor: { amount: "18.000–25.000 CHF", per: "year" },
    tuitionMaster: { amount: "16.000–25.000 CHF", per: "total" },
    living: "1.550–2.700 CHF",
  },
  {
    id: "cbs",
    name: "CBS International Business School",
    city: "Köln",
    country: "DE",
    logo: "uniCbs",
    founded: 1993,
    campuses: ["Köln", "Mainz", "Potsdam"],
    tuitionBachelor: { amount: "7.290–8.000 €", per: "semester" },
    tuitionMaster: { amount: "7.500–9.000 €", per: "semester" },
    living: "1.200–2.000 €",
  },
  {
    id: "eubs",
    name: "EU Business School",
    city: "Barcelona",
    country: "ES",
    logo: "uniEuBs",
    campuses: ["Barcelona", "Genève", "München"],
    bachelor: [
      { name: "Business Administration (BBA)", years: 3 },
      { name: "BA Digital Communication", years: 3 },
      { name: "BA Leisure & Tourism Management", years: 3 },
      { name: "BA International Relations", years: 3 },
    ],
    master: [
      { name: "Artificial Intelligence for Business", years: 1 },
      { name: "Business Analytics & Data Science", years: 1 },
      { name: "Digital Marketing, Transformation & Design Thinking", years: 1 },
      { name: "Fashion & Luxury Business", years: 1 },
    ],
    tuitionBachelor: { amount: "7.050 €", per: "semester" },
    tuitionMaster: { amount: "15.600 €", per: "year" },
    hasCamp: true,
  },
  {
    id: "ibs",
    name: "International Business School",
    city: "Budapest",
    country: "HU",
    logo: "uniIbs",
    founded: 1991,
    campuses: ["Budapest", "Wien", "Dubai"],
    bachelor: [
      { name: "Psychology", years: 4 },
      { name: "Commerce and Marketing", years: 4 },
      { name: "International Business Economics", years: 4 },
      { name: "Business Administration and Management", years: 4 },
    ],
    master: [
      { name: "International Management", years: 1 },
      { name: "IT for Business Data Analytics", years: 1 },
      { name: "Hospitality", years: 1 },
      { name: "AI and Cybersecurity", years: 1 },
    ],
    tuitionBachelor: { amount: "4.000 €", per: "semester" },
    tuitionMaster: { amount: "6.400 €", per: "semester" },
    living: "450–1.300 €",
  },
  {
    id: "wittenborg",
    name: "Wittenborg University",
    city: "Apeldoorn",
    country: "NL",
    logo: "uniWittenborg",
    founded: 1987,
    students: "1.200+",
    campuses: ["Apeldoorn", "Amsterdam", "München"],
    bachelor: [
      { name: "Real Estate Management", years: 4 },
      { name: "Logistics & International Trade", years: 4 },
      { name: "Economics & Management", years: 4 },
      { name: "Entrepreneurship & SME Management", years: 4 },
    ],
    master: [
      { name: "Business Management", years: 1 },
      { name: "Digital Marketing and Communication", years: 1 },
      { name: "Education", years: 1 },
      { name: "Finance", years: 1 },
    ],
    tuitionBachelor: { amount: "9.800 €", per: "year" },
    tuitionMaster: { amount: "13.300 €", per: "total" },
    living: "1.200–1.750 €",
  },
  {
    id: "ucam",
    name: "UCAM University",
    city: "Murcia",
    country: "ES",
    logo: "uniUcam",
    founded: 1996,
    campuses: ["Murcia", "Cartagena", "Madrid"],
    bachelor: [
      { name: "Tourism Management", years: 4 },
      { name: "Gastronomy", years: 4 },
      { name: "Nursing", years: 4 },
      { name: "Physiotherapy", years: 4 },
    ],
    master: [
      { name: "Hospitality Management", years: 1 },
      { name: "High Performance Sport: Strength & Conditioning", years: 1 },
      { name: "Innovation & Tourism Marketing", years: 1 },
      { name: "Bilingual Education (CLIL)", years: 1 },
    ],
    tuitionBachelor: { amount: "5.000–9.000 €", per: "year" },
    tuitionMaster: { amount: "8.000–12.000 €", per: "total" },
    living: "600–1.000 €",
    hasCamp: true,
  },
  {
    id: "fsm",
    name: "Fatih Sultan Mehmet University",
    city: "Istanbul",
    country: "TR",
    logo: "uniFsm",
    founded: 2010,
    students: "8.000+",
    bachelor: [
      { name: "Software Engineering", years: 4 },
      { name: "Biomedical Engineering", years: 4 },
      { name: "Interior Design", years: 4 },
      { name: "Architecture", years: 4 },
    ],
    master: [
      { name: "Clinical Psychology", years: 1 },
      { name: "Educational Sciences", years: 1 },
      { name: "History", years: 1 },
      { name: "History of Science", years: 1 },
    ],
    tuitionBachelor: { amount: "2.000–5.000 USD", per: "year" },
    tuitionMaster: { amount: "3.000–6.000 USD", per: "total" },
    living: "800–1.200 USD",
  },
  {
    id: "aubg",
    name: "American University in Bulgaria",
    city: "Blagoevgrad",
    country: "BG",
    logo: "uniAubg",
    founded: 1991,
    students: "1.000+",
    bachelor: [
      { name: "Economics", years: 4 },
      { name: "European Studies", years: 4 },
      { name: "History and Civilizations", years: 4 },
      { name: "Information Systems", years: 4 },
    ],
    tuitionBachelor: { amount: "6.700 €", per: "semester" },
    tuitionMaster: { amount: "15.000–20.000 €", per: "total" },
    living: "500–900 €",
    hasCamp: true,
  },
  {
    id: "jcu",
    name: "John Cabot University",
    city: "Roma",
    country: "IT",
    logo: "uniJcu",
    hasCamp: true,
  },
  {
    id: "gbsb",
    name: "GBSB Global Business School",
    city: "Barcelona",
    country: "ES",
    logo: "uniGbsb",
    campuses: ["Barcelona", "Madrid", "Birkirkara"],
    tuitionBachelor: { amount: "8.750–12.900 €", per: "year" },
    tuitionMaster: { amount: "15.900 €", per: "year" },
    living: "600–1.050 €",
    hasCamp: true,
  },
  {
    id: "bts",
    name: "BTS Technology School",
    city: "Barcelona",
    country: "ES",
    logo: "uniBts",
    hasCamp: true,
  },
  {
    id: "htl",
    name: "HTL University",
    city: "Barcelona",
    country: "ES",
    logo: "uniHtl",
    bachelor: [
      { name: "Business and Digital Marketing Management", years: 3 },
      { name: "International Business", years: 3 },
      { name: "Business Administration", years: 3 },
      { name: "Hotel & Tourism Studies", years: 3 },
    ],
    master: [
      { name: "Sports Tourism Management", years: 1 },
      { name: "Events Management", years: 1 },
      { name: "Restaurant Management", years: 1 },
      { name: "MBA", years: 2 },
    ],
    tuitionBachelor: { amount: "6.000–8.000 €", per: "year" },
    tuitionMaster: { amount: "5.000–6.000 €", per: "total" },
    living: "900–1.200 €",
  },
  {
    id: "mai",
    name: "Moscow Aviation Institute",
    city: "Moskva",
    country: "RU",
    logo: "uniMai",
    founded: 1930,
    students: "20.000+",
    tuitionBachelor: { amount: "3.000–6.000 USD", per: "year" },
    living: "500–800 USD",
  },
  {
    id: "srh",
    name: "SRH University",
    city: "Berlin",
    country: "DE",
    logo: "uniSrh",
    campuses: ["Berlin", "Heidelberg"],
    hasCamp: true,
  },
  {
    id: "kozminski",
    name: "Kozminski University",
    city: "Warszawa",
    country: "PL",
    logo: "uniKozminski",
    hasCamp: true,
  },
] as const;

export type SummerCamp = {
  /** Ključ za prevode (`camps.items.<id>`). */
  id: string;
  name: string;
  /** Institucija koja izvodi program. */
  university: string;
  city: string;
  country: string;
  /** Ključ u `src/data/assets.ts`. */
  logo: string;
  /** Cena programa; `undefined` = na upit. */
  price?: string;
  /** Broj ECTS kredita, ako ih program nosi. */
  ects?: string;
  ageMin?: number;
  ageMax?: number;
  /** `id` iz `europeanUniversities` — veza ka stranici studija. */
  universityId?: string;
};

export const summerCamps: readonly SummerCamp[] = [
  {
    id: "emuni",
    name: "HALS Summer School",
    university: "EMUNI University",
    city: "Piran & Koper",
    country: "SI",
    logo: "uniEmuni",
    ects: "3 ECTS",
    ageMin: 18,
    universityId: "emuni",
  },
  {
    id: "metu",
    name: "METU Summer School",
    university: "Budapest Metropolitan University",
    city: "Budapest",
    country: "HU",
    logo: "uniMetu",
    price: "600–1.300 €",
    universityId: "metu",
  },
  {
    id: "aydin",
    name: "Delightful Istanbul Summer School",
    university: "Istanbul Aydin University",
    city: "Istanbul",
    country: "TR",
    logo: "uniAydin",
    price: "800–1.500 €",
    ects: "3–6 ECTS",
    universityId: "aydin",
  },
  {
    id: "eubs",
    name: "International Summer School",
    university: "EU Business School",
    city: "Barcelona",
    country: "ES",
    logo: "uniEuBs",
    price: "3.850 €",
    ageMin: 16,
    ageMax: 18,
    universityId: "eubs",
  },
  {
    id: "bts",
    name: "Summer Course in AI Foundations",
    university: "Barcelona Technology School",
    city: "Barcelona",
    country: "ES",
    logo: "uniBts",
    price: "1.600 €",
    ageMin: 18,
    universityId: "bts",
  },
  {
    id: "ucam",
    name: "Spanish Language & Culture",
    university: "UCAM University",
    city: "Murcia",
    country: "ES",
    logo: "uniUcam",
    price: "800–2.240 €",
    ects: "2–4 ECTS",
    ageMin: 17,
    universityId: "ucam",
  },
  {
    id: "jcu",
    name: "Summer Sessions",
    university: "John Cabot University",
    city: "Roma",
    country: "IT",
    logo: "uniJcu",
    ects: "3–6 ECTS",
    universityId: "jcu",
  },
  {
    id: "gbsb",
    name: "Summer School AI & Digital Business",
    university: "GBSB Global Business School",
    city: "Barcelona",
    country: "ES",
    logo: "uniGbsb",
    price: "1.200–1.500 €",
    universityId: "gbsb",
  },
  {
    id: "srh",
    name: "Solar Summer Team-up!",
    university: "SRH University",
    city: "Berlin",
    country: "DE",
    logo: "uniSrh",
    price: "330–660 €",
    universityId: "srh",
  },
  {
    id: "aubg",
    name: "AUBG Summer Programs",
    university: "American University in Bulgaria",
    city: "Blagoevgrad",
    country: "BG",
    logo: "uniAubg",
    price: "400–600 €",
    ageMin: 8,
    ageMax: 17,
    universityId: "aubg",
  },
  {
    id: "kozminski",
    name: "Warsaw International Summer School",
    university: "Kozminski University",
    city: "Warszawa",
    country: "PL",
    logo: "uniKozminski",
    price: "500–1.000 €",
    ects: "4 ECTS",
    universityId: "kozminski",
  },
  {
    id: "europea",
    name: "Universidad Europea Summer Camp",
    university: "Universidad Europea",
    city: "Madrid",
    country: "ES",
    logo: "uniEuropea",
    price: "300–600 €",
    ageMin: 15,
    ageMax: 18,
  },
] as const;

/** Zastavice po ISO kodu — dele ih stranice Evrope i letnjih kampova. */
export const xjtluBachelor = [
  { name: "BA English and Communication Studies", years: 4, price: "12.100 EUR" },
  { name: "BA German Studies (Chinese-English Bilingual)", years: 4, price: "12.100 EUR" },
  { name: "BA International Business Administration", years: 4, price: "12.100 EUR" },
  { name: "BA Media and Communication", years: 4, price: "12.100 EUR" },
] as const;

export const xjtluMaster = [
  { name: "MSc Accounting and Finance", years: 1, price: "15.600 EUR" },
  { name: "MSc Entrepreneurship and Innovation Management", years: 1, price: "15.600 EUR" },
  { name: "MSc Financial Computing", years: 1, price: "15.600 EUR" },
  { name: "MSc International Business with Contemporary Entrepreneurialism", years: 1, price: "15.600 EUR" },
] as const;

/** Partner sa logotipom i linkom na zvanični sajt. */
export type Partner = {
  name: string;
  /** Ključ u `src/data/assets.ts`. */
  logo: string;
  /** Zvanični sajt — otvara se u novoj kartici. */
  url: string;
};

/**
 * Redosled i linkovi prate traku „Naši partneri" sa stare početne strane.
 * Missouri Valley, Hunter i XJTLU tamo stoje samo kao tekst, pa su im logotipi
 * i linkovi uzeti sa njihovih zvaničnih sajtova.
 */
export const partners: readonly Partner[] = [
  {
    name: "Akademija Oxford",
    logo: "partnerOxford",
    url: "https://www.akademijaoxford.com/o_nama_informacije.php",
  },
  { name: "Springfield College", logo: "partnerSpringfield", url: "https://springfield.edu/" },
  {
    name: "Santa Rosa Junior College",
    logo: "partnerSantaRosa",
    url: "https://www.santarosa.edu/",
  },
  {
    name: "EU Business School",
    logo: "uniEuBs",
    url: "https://www.euruni.edu/en/Home/Top-Business-School-in-Europe-EU-Business-School.html",
  },
  { name: "EMUNI University", logo: "uniEmuni", url: "https://emuni.si/" },
  { name: "Community College of Vermont", logo: "partnerCcv", url: "https://ccv.edu/" },
  { name: "Grace Christian Academy", logo: "partnerGca", url: "https://www.gcarams.org/" },
  { name: "Hoosac School", logo: "partnerHoosac", url: "https://hoosac.org/" },
  {
    name: "GBSB Global Business School",
    logo: "uniGbsb",
    url: "https://www.global-business-school.org/",
  },
  { name: "Swiss Education", logo: "partnerSwiss", url: "https://www.swisseducation.com/en/" },
  // Ranije „Missouri Valley College" — 2026. prebrendirani u University
  { name: "Missouri Valley University", logo: "partnerMoval", url: "https://www.moval.edu/" },
  { name: "Hunter College", logo: "partnerHunter", url: "https://hunter.cuny.edu/" },
  {
    name: "Xi'an Jiaotong-Liverpool University",
    logo: "partnerXjtlu",
    url: "https://www.xjtlu.edu.cn/en",
  },
  { name: "Novotek Radna Snaga", logo: "partnerNovotek", url: "https://novotekmanpower.rs/o-nama/" },
] as const;

export const usaJobLocations = [
  "New York",
  "Chicago",
  "Miami",
  "Seattle",
  "North Carolina",
] as const;
