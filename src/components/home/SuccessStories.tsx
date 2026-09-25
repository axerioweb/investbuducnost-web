import Image from "next/image";
import { useTranslations } from "next-intl";
import { asset } from "@/data/assets";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Flag } from "@/components/ui/Flag";
import { Check } from "@/components/ui/icons";

const STORIES = [
  { key: "lazar", img: "studentLazar" },
  { key: "bogdan", img: "studentBogdan" },
  { key: "aleksa", img: "studentAleksa" },
  { key: "borivoje", img: "studentBorivoje" },
] as const;

/**
 * Prevod opisuje put studenta kao „Škola (mesto) → Koledž — detalj".
 * Etape se razdvajaju na „→", a detalj (stipendija, sport) na „—",
 * pa se ceo put crta kao mala vremenska linija bez dodatnih ključeva.
 */
function parsePath(path: string) {
  return path.split("→").map((leg) => {
    const [place, ...rest] = leg.split(/\s[—–-]\s/);
    return { place: place.trim(), detail: rest.join(" — ").trim() };
  });
}

export function SuccessStories() {
  const t = useTranslations("home.stories");

  return (
    <section className="relative overflow-hidden bg-cloud px-6 py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-dots" />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading kicker={t("kicker")} title={t("title")} subtitle={t("subtitle")} />
        <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STORIES.map((story) => {
            const legs = parsePath(t(`${story.key}.path`));

            return (
              <RevealItem key={story.key}>
                <article className="group card relative flex h-full flex-col overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 hover:border-brand-300 hover:shadow-[0_18px_44px_rgba(59,130,196,0.18)]">
                  {/* Meka traka u pozadini iza avatara */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-br from-brand-100 via-brand-50 to-white" />

                  {/* Avatar — namerno mali, originalne fotke su niske rezolucije.
                      alt je prazan jer ime odmah ispod nosi <h3>. */}
                  <div className="relative w-fit">
                    <div className="relative shrink-0">
                      <Image
                        src={asset(story.img)}
                        alt=""
                        width={88}
                        height={88}
                        className="h-22 w-22 rounded-full object-cover ring-4 ring-white shadow-[0_8px_22px_rgba(29,58,102,0.18)] transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm">
                        <Flag code="US" className="h-3 w-4.5" />
                      </span>
                    </div>
                  </div>

                  <h3 className="relative mt-4 font-display text-lg font-bold text-ink">
                    {t(`${story.key}.name`)}
                  </h3>
                  <p className="relative mt-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600">
                    {t("badge")}
                  </p>

                  {/* Put studenta: škola → koledž, poslednja etapa je cilj */}
                  <ol role="list" className="relative mt-5 flex-1 space-y-4 border-t border-line pt-5">
                    {legs.map((leg, i) => {
                      const last = i === legs.length - 1;
                      return (
                        <li key={i} className="relative flex gap-3">
                          {!last && (
                            <span className="absolute left-2.5 -translate-x-1/2 top-5 h-[calc(100%+0.25rem)] w-px bg-brand-200" aria-hidden />
                          )}
                          <span
                            aria-hidden
                            className={
                              last
                                ? "relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white"
                                : "relative mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 border-brand-300 bg-white"
                            }
                          >
                            {last && <Check className="h-3 w-3" />}
                          </span>
                          <div className="min-w-0">
                            <p className={`text-[13px] leading-snug ${last ? "font-semibold text-ink" : "text-slate-body"}`}>
                              {leg.place}
                            </p>
                            {leg.detail && (
                              <p className="mt-1.5 inline-block rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-medium text-brand-700">
                                {leg.detail}
                              </p>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
