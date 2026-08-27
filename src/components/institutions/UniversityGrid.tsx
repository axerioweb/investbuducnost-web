import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Link } from "@/i18n/navigation";
import { Flag } from "@/components/ui/Flag";
import { ArrowRight } from "@/components/ui/icons";
import { LogoTile, Pill } from "./parts";

/**
 * Kartica univerziteta na stranici „Studije u Evropi".
 *
 * Ranije je klik otvarao modalni dijalog; sada vodi na stranicu institucije
 * (`/institucije/<slug>`), gde ima mesta za fotografije kampusa, programe i
 * uslove upisa — i gde sadržaj postaje indeksabilan i deljiv linkom. Zato je
 * ovo sada serverska komponenta: bez stanja i bez dijaloga nema šta da se
 * izvršava u pregledaču, pa u bundle ne odlazi ništa osim `Reveal` omotača.
 */
export type UniversityView = {
  id: string;
  /** Segment u URL-u — iz `data/institutions.ts`. */
  slug: string;
  name: string;
  city: string;
  /** ISO 3166-1 alpha-2 — crta se preko `ui/Flag`. */
  countryCode: string;
  logo: string;
  tagline: string;
  founded?: string;
  students?: string;
  hasCamp: boolean;
};

export type UniversityLabels = {
  more: string;
  campBadge: string;
  /** Šablon sa `{name}`. */
  logoAlt: string;
};

export function UniversityGrid({
  universities,
  labels,
}: {
  universities: UniversityView[];
  labels: UniversityLabels;
}) {
  return (
    <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.04}>
      {universities.map((uni) => (
        <RevealItem key={uni.id} className="h-full">
          {/* Naslov nosi link koji se preko `::after` razvlači na celu karticu
              — ceo blok (i logo) je klikabilan, a pristupačno ime linka
              ostaje samo naziv institucije. */}
          <article className="card group relative flex h-full flex-col rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_14px_36px_rgba(59,130,196,0.15)]">
            <div className="relative mb-4 overflow-hidden rounded-xl border border-line bg-cloud transition-colors duration-300 group-hover:border-brand-200 group-hover:bg-brand-50">
              <LogoTile src={uni.logo} alt={labels.logoAlt.replace("{name}", uni.name)} />
              {uni.hasCamp && (
                <span className="absolute right-2 top-2 rounded-full border border-brand-200 bg-white/95 px-2 py-0.5 text-[10px] font-bold text-brand-600 shadow-sm">
                  {labels.campBadge}
                </span>
              )}
            </div>

            <p className="flex items-center gap-2 text-[13px] font-medium text-mist">
              <Flag code={uni.countryCode} className="h-3 w-[1.125rem]" />
              {uni.city}
            </p>
            <h3 className="mt-1 font-display text-base font-semibold leading-snug text-ink transition-colors group-hover:text-brand-600">
              <Link
                href={{ pathname: "/institutions/[slug]", params: { slug: uni.slug } }}
                className="after:absolute after:inset-0 after:rounded-2xl after:content-['']"
              >
                {uni.name}
              </Link>
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-body">
              {uni.tagline}
            </p>

            <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
              {uni.founded && <Pill>{uni.founded}</Pill>}
              {uni.students && <Pill>{uni.students}</Pill>}
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
