import type { SVGProps } from "react";

/**
 * Ikonografija Invest Budućnost — jedan izvor za sve simbole u interfejsu.
 *
 * Pravila seta:
 * - `viewBox="0 0 24 24"`, crtež uvučen ~3px od ivice (zaobljeni krajevi
 *   poteza inače „iscure" van okvira i ikona deluje isečeno)
 * - potez `currentColor`, `strokeLinecap`/`strokeLinejoin` = `round`,
 *   debljina 2–2.4 — isti prijateljski, zaobljen ton kao kartice i dugmad
 * - sve su dekorativne (`aria-hidden`); značenje uvek nosi tekst pored njih
 *
 * Ranije su iste putanje bile prekucane po komponentama (strelica na četiri
 * mesta, „×" na tri), pa su se razilazile u debljini i dužini. Ovde se menjaju
 * na jednom mestu.
 */

export type IconProps = SVGProps<SVGSVGElement>;

/** Zajednička svojstva poteza — drže ceo set u istom tonu. */
const line = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * Potpisna strelica sajta — vodi oko ka sledećem koraku („Saznaj više",
 * CTA dugmad). Osovina je kraća od okvira da bi hover pomeraj imao kuda.
 */
export function ArrowRight({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...props}>
      <path {...line} strokeWidth={2.2} d="M3.6 12h15.2" />
      <path {...line} strokeWidth={2.2} d="M13.1 6.3 18.8 12l-5.7 5.7" />
    </svg>
  );
}

/** Ševron nadole — padajući meniji (rotira se na 180° kad je otvoren). */
export function ChevronDown({ className = "h-3 w-3", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...props}>
      <path {...line} strokeWidth={2.6} d="M5.5 9.2 12 15.4l6.5-6.2" />
    </svg>
  );
}

/** Kvačica — spiskovi „šta je uključeno" i uslovi. */
export function Check({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...props}>
      <path {...line} strokeWidth={2.6} d="m4.6 12.4 4.9 4.9L19.4 7.1" />
    </svg>
  );
}

/** Plus — harmonika; rotacijom za 45° postaje „×" bez zamene ikone. */
export function Plus({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...props}>
      <path {...line} strokeWidth={2.2} d="M12 5.4v13.2M5.4 12h13.2" />
    </svg>
  );
}

/** Zatvaranje — dijalog, chat, mobilni meni. */
export function Close({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...props}>
      <path {...line} strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

/** Avion — slanje poruke u chatu. Isti crtež kao pre, samo na jednom mestu. */
export function Send({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M3.4 20.4l17.45-7.48a1 1 0 000-1.84L3.4 3.6a.993.993 0 00-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z"
      />
    </svg>
  );
}

/** Oblačić razgovora — mehurić chata. Isti crtež kao pre. */
export function ChatBubble({ className = "h-6 w-6", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 11a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm4 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm4 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"
      />
    </svg>
  );
}

/**
 * Navodnik iznad citata — pun oblik, jer je ovo tipografski znak, a ne ikona.
 */
export function QuoteMark({ className = "h-5 w-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M9.6 5.2c-3.4 1.5-5.4 4.3-5.4 8.1 0 3.4 1.9 5.5 4.5 5.5 2.2 0 3.9-1.6 3.9-3.7 0-2-1.4-3.5-3.3-3.5-.4 0-.8.1-1 .2.3-1.6 1.4-3 3.2-4zm9.6 0c-3.4 1.5-5.4 4.3-5.4 8.1 0 3.4 1.9 5.5 4.5 5.5 2.2 0 3.9-1.6 3.9-3.7 0-2-1.4-3.5-3.3-3.5-.4 0-.8.1-1 .2.3-1.6 1.4-3 3.2-4z"
      />
    </svg>
  );
}

/**
 * Četvorokraka iskra — mikro-znak brenda. Zamenjuje „·" u nadnaslovima
 * („Studije · Vize · Putovanja") i tačku-marker u hero značci: tipografska
 * tačka se u različitim fontovima crta različito visoko i nikad ne pogađa
 * optičku sredinu verzalnog teksta, a ovaj oblik jeste centriran.
 */
export function Spark({ className = "h-2 w-2", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M8 0c0 4.4 3.6 8 8 8-4.4 0-8 3.6-8 8 0-4.4-3.6-8-8-8 4.4 0 8-3.6 8-8z"
      />
    </svg>
  );
}

/** Facebook — zvanični brend znak (pun oblik, bez poteza). */
export function FacebookIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      />
    </svg>
  );
}

/** Instagram — zvanični brend znak (pun oblik, bez poteza). */
export function InstagramIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
      />
    </svg>
  );
}

/**
 * Talasasti prelaz iz hero fotografije u belu sekciju. Isti oblik nose i
 * naslovnica i podstranice — jedan izvor da se krivina ne razmimoiđe.
 */
export function WaveDivider({ className = "h-12 w-full text-white md:h-16" }: { className?: string }) {
  return (
    <svg
      className={`absolute -bottom-px left-0 right-0 ${className}`}
      viewBox="0 0 1440 64"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M0,32 C240,64 480,0 720,16 C960,32 1200,64 1440,32 L1440,64 L0,64 Z"
        fill="currentColor"
      />
    </svg>
  );
}
