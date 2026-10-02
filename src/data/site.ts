/** Centralna konfiguracija sajta — podaci koji se ne prevode. */
export const site = {
  name: "Invest Budućnost",
  legalName: "Invest Budućnost",
  url: "https://www.investbuducnost.info",
  email: "investbuducnost@gmail.com",
  founder: "Bogdan Radosavljević",
  /**
   * Registracioni podaci rukovaoca (APR) — prikazuju se u politici privatnosti
   * samo kada su popunjeni.
   * TODO: upisati matični broj i PIB od vlasnika.
   */
  registration: { companyId: "", taxId: "" } as { companyId: string; taxId: string },
  /**
   * Broj na koji chat šalje poruku (wa.me link) — samo cifre, sa pozivnim
   * brojem zemlje, bez „+", razmaka i vodeće nule.
   * TODO: privremeno glavni broj (Bogdan) — zameniti potvrđenim WhatsApp brojem.
   */
  whatsapp: "381659010720",
  social: {
    facebook: "https://www.facebook.com/investbuducnost/",
    instagram: "https://instagram.com/invest_buducnost",
  },
  offices: [
    {
      id: "rs",
      country: "Serbia",
      city: "Jagodina",
      address: "Vuka Karadžića 6, 35000 Jagodina",
      phones: [
        { label: "Bogdan", number: "+381 65 9010-720", tel: "+381659010720" },
        { label: "Sonja", number: "+381 69 3300-363", tel: "+381693300363" },
      ],
      /** ISO 3166-1 alpha-2 — crta se preko `components/ui/Flag.tsx`. */
      countryCode: "RS",
    },
    {
      id: "me",
      country: "Montenegro",
      city: "Podgorica",
      address: "Bulevar knjaza Danila Petrovića 13/32, 81101 Podgorica",
      phones: [{ label: "", number: "+382 68 702-648", tel: "+38268702648" }],
      countryCode: "ME",
    },
    {
      id: "si",
      country: "Slovenia",
      city: "Ljubljana",
      address: "Kamniška ulica 25, 1000 Ljubljana",
      phones: [{ label: "", number: "+381 61 158-6762", tel: "+381611586762" }],
      countryCode: "SI",
    },
  ],
  stats: [
    { id: "years", value: 8, suffix: "" },
    { id: "experts", value: 13, suffix: "" },
    { id: "clients", value: 70, suffix: "+" },
    { id: "partners", value: 27, suffix: "" },
    { id: "locations", value: 4, suffix: "" },
    { id: "collaborations", value: 320, suffix: "+" },
    { id: "universities", value: 25, suffix: "" },
  ],
} as const;
