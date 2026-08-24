import Image from "next/image";
import type { ReactNode } from "react";
import { Check } from "@/components/ui/icons";

/**
 * Logo institucije na beloj pločici. Logotipi su raznih proporcija i pozadina,
 * pa idu `object-contain` na belom — nikad izrezani i uvek čitljivi.
 */
export function LogoTile({
  src,
  alt,
  size = "card",
}: {
  src: string;
  alt: string;
  size?: "card" | "dialog";
}) {
  const box =
    size === "card"
      ? "h-24 rounded-xl p-4 md:h-28"
      : "h-20 w-20 shrink-0 rounded-2xl p-2.5 md:h-24 md:w-24 md:p-3";
  return (
    <div className={`flex items-center justify-center bg-white ${box}`}>
      <Image
        src={src}
        alt={alt}
        width={220}
        height={140}
        sizes="220px"
        className="h-full w-full object-contain"
      />
    </div>
  );
}

/** Sitna oznaka (ECTS, uzrast, broj programa) — plava tint pilula. */
export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-600">
      {children}
    </span>
  );
}

export type Fact = { label: string; value: string };

/** Mreža „ključnih činjenica" u dijalogu (trajanje, termin, cena…). */
export function FactGrid({ facts }: { facts: Fact[] }) {
  if (facts.length === 0) return null;
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
      {facts.map((f) => (
        <div key={f.label} className="bg-cloud px-4 py-3.5">
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-mist">
            {f.label}
          </dt>
          <dd className="mt-1 font-display text-sm font-bold leading-snug text-ink">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Naslovljena sekcija unutar dijaloga. */
export function DialogSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-3 font-display text-[13px] font-bold uppercase tracking-[0.16em] text-brand-600">
        {title}
      </h3>
      {children}
    </section>
  );
}

/** Lista sa plavim kvačicama — „šta je uključeno". */
export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-2.5 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-body">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Aktivnosti kao „chip" oznake. */
export function ChipList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-full border border-line bg-white px-3.5 py-1.5 text-[13px] font-medium text-slate-body"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Tabela studijskih programa (naziv + trajanje) u dijalogu univerziteta. */
export function ProgramList({
  programs,
  yearLabel,
  yearsLabel,
}: {
  programs: readonly { name: string; years: number }[];
  yearLabel: string;
  yearsLabel: string;
}) {
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
      {programs.map((p) => (
        <li key={p.name} className="flex items-baseline justify-between gap-4 bg-white px-4 py-3">
          <span className="text-sm font-medium text-ink">{p.name}</span>
          <span className="shrink-0 text-[13px] font-semibold text-brand-600">
            {p.years} {p.years === 1 ? yearLabel : yearsLabel}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Zaglavlje dijaloga: plavi gradijent, logo na beloj pločici, naslov i lokacija. */
export function DialogHeader({
  logo,
  logoAlt,
  titleId,
  title,
  subtitle,
  location,
}: {
  logo: string;
  logoAlt: string;
  titleId: string;
  title: string;
  subtitle?: string;
  /** Zastava + grad — `ReactNode` jer zastava više nije emodži u tekstu. */
  location: ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 bg-gradient-to-br from-navy-900 via-navy-800 to-brand-600 px-5 py-5 pr-14 md:gap-5 md:px-7 md:py-6">
      <LogoTile src={logo} alt={logoAlt} size="dialog" />
      <div className="min-w-0">
        <h2
          id={titleId}
          className="font-display text-lg font-bold leading-tight text-white md:text-2xl"
        >
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-sm text-brand-100 md:text-[15px]">{subtitle}</p>}
        <p className="mt-1.5 flex items-center gap-1.5 text-[13px] font-medium text-white/80">
          {location}
        </p>
      </div>
    </div>
  );
}
