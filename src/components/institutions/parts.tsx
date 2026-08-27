import Image from "next/image";
import type { ReactNode } from "react";
import { Check } from "@/components/ui/icons";

/**
 * Logo institucije na beloj pločici. Logotipi su raznih proporcija i pozadina,
 * pa idu `object-contain` na belom — nikad izrezani i uvek čitljivi.
 */
export function LogoTile({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex h-24 items-center justify-center rounded-xl bg-white p-4 md:h-28">
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

/** Mreža „ključnih činjenica" (osnovan, školarina, troškovi života…). */
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

/** Tabela studijskih programa (naziv + trajanje). */
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
