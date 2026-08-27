import Link from "next/link";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Flag } from "@/components/ui/Flag";
import { ArrowRight } from "@/components/ui/icons";
import { LogoTile, Pill } from "./parts";

/**
 * Kartica letnjeg kampa.
 *
 * Klik vodi na stranicu institucije koja program izvodi, na sidro `#kamp` —
 * tamo stoje puni detalji programa uz kontekst same institucije (kampus,
 * fotografije, studije). Ranije se otvarao modalni dijalog, pa je komponenta
 * morala biti klijentska; sada nema stanja i ostaje na serveru.
 *
 * `href` stiže gotov (lokalizovan) iz stranice, a ne kao slug: `Link` iz
 * `next-intl` ne prima hash u objektu putanje, pa se sidro ne bi moglo dodati.
 * Stranica ga sklapa preko `getPathname` i prosleđuje običnom `next/link`-u.
 */
export type CampView = {
  id: string;
  /** Gotova lokalizovana putanja ka instituciji, sa sidrom `#kamp`. */
  href: string;
  name: string;
  university: string;
  city: string;
  /** ISO 3166-1 alpha-2 — crta se preko `ui/Flag`. */
  countryCode: string;
  logo: string;
  ects?: string;
  tagline: string;
  duration: string;
};

export type CampLabels = {
  more: string;
  /** Šablon sa `{name}`. */
  logoAlt: string;
  discount: string;
};

export function CampGrid({
  camps,
  labels,
}: {
  camps: CampView[];
  labels: CampLabels;
}) {
  return (
    <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
      {camps.map((camp) => (
        <RevealItem key={camp.id} className="h-full">
          {/* Kartica je članak sa naslovom; link preko `::after` pokriva celu
              površinu — tako je ceo blok (i logo) klikabilan, a pristupačno
              ime linka ostaje samo naziv programa. */}
          <article className="card group relative flex h-full flex-col rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_14px_36px_rgba(59,130,196,0.15)]">
            <div className="relative mb-4 overflow-hidden rounded-xl border border-line bg-cloud transition-colors duration-300 group-hover:border-brand-200 group-hover:bg-brand-50">
              <LogoTile src={camp.logo} alt={labels.logoAlt.replace("{name}", camp.university)} />
              <span className="absolute right-2 top-2 rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                {labels.discount}
              </span>
            </div>

            <p className="flex items-center gap-2 text-[13px] font-medium text-mist">
              <Flag code={camp.countryCode} className="h-3 w-[1.125rem]" />
              {camp.city}
            </p>
            <h3 className="mt-1 font-display text-base font-semibold leading-snug text-ink transition-colors group-hover:text-brand-600">
              <Link
                href={camp.href}
                className="after:absolute after:inset-0 after:rounded-2xl after:content-['']"
              >
                {camp.name}
              </Link>
            </h3>
            <p className="mt-0.5 text-[13px] text-slate-body">{camp.university}</p>
            <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-slate-body">
              {camp.tagline}
            </p>

            <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
              <Pill>{camp.duration}</Pill>
              {camp.ects && <Pill>{camp.ects}</Pill>}
              <span className="ml-auto inline-flex items-center gap-1 text-[13px] font-semibold text-brand-600">
                {labels.more}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </article>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
