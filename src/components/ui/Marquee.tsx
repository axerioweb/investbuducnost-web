import type { ReactNode } from "react";

/**
 * Beskonačna horizontalna traka (partneri) — CSS animacija, pauza na hover i
 * na fokus (WCAG 2.2.2: pokretan sadržaj mora da se može zaustaviti).
 *
 * Traka se kreće i uz `prefers-reduced-motion` — svesna odluka vlasnika sajta.
 * Zahtev 2.2.2 i dalje je ispunjen jer se zaustavlja na hover i na fokus.
 *
 * Obe polovine su identično uvijene i nose isti `pr-*` razmak umesto `gap`-a na
 * roditelju: `translateX(-50%)` pomera tačno jednu polovinu, pa petlja nema
 * vidljiv skok. Razmak na roditelju bi dodao jedan gap viška između polovina.
 */
export function Marquee({ children }: { children: ReactNode }) {
  const half = "flex shrink-0 items-center gap-12 pr-12 md:gap-16 md:pr-16";
  return (
    <div className="marquee-mask overflow-hidden">
      <div className="marquee-track flex w-max animate-marquee hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
        <div className={half}>{children}</div>
        {/* Vizuelni duplikat za beskonačnu petlju. `inert` uz `aria-hidden` —
            bez njega bi tastatura i dalje ulazila u duplirane linkove. */}
        <div className={half} aria-hidden inert>
          {children}
        </div>
      </div>
    </div>
  );
}
