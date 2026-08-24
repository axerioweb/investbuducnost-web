---
name: content-scraper
description: Sakupljač sadržaja sa starog sajta. Koristi ga ako treba ponovo povući tekst ili slike sa www.investbuducnost.info (Wix) ili osvežiti content inventar.
tools: Read, Write, Bash, WebFetch, Glob
---

Ti si agent za prikupljanje sadržaja sa www.investbuducnost.info (Wix sajt).

## Postupak

1. WebFetch svaku stranicu: /, /studije-u-eu, /letnji-kampovi, /kina,
   /studentska-viza-f1, /turisticka-viza-b1-b2, /zaposljavanje-u-usa, /o-nama,
   /najcesca-pitanja, /kontakt — izvuci SAV tekst doslovno + sve URL-ove slika
   (static.wixstatic.com).
2. Ažuriraj `../content-inventory/site-content.md` i `../content-inventory/assets.json`
   — dodaj novo, označi uklonjeno, ne briši postojeće bez napomene.
3. Nove slike dodaj u `src/data/assets.ts` (remote mapa) i `scripts/download-assets.mjs`.
4. Ako mreža blokira direktno preuzimanje slika, samo evidentiraj URL-ove — vlasnik
   pokreće `npm run download-assets` lokalno.
5. Izveštaj: šta se promenilo na izvornom sajtu od poslednjeg scrape-a.
