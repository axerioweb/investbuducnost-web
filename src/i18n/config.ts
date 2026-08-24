/** Prikazna imena jezika — dodaj novi jezik i ovde. */
export const localeNames: Record<string, string> = {
  sr: "Srpski",
  en: "English",
  es: "Español",
};

/**
 * Zastava uz jezik u prekidaču — ISO 3166-1 alpha-2 kôd zemlje čiji je to
 * službeni jezik (engleski nosi britansku zastavu, kao i većina jezičkih
 * prekidača). Dodaj novi jezik i ovde; crteži su u `components/ui/Flag.tsx`.
 */
export const localeFlags: Record<string, string> = {
  sr: "RS",
  en: "GB",
  es: "ES",
};

/** BCP-47 → OpenGraph locale mapping */
export const ogLocales: Record<string, string> = {
  sr: "sr_RS",
  en: "en_US",
  es: "es_ES",
};
