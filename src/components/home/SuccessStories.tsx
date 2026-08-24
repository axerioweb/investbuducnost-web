import Image from "next/image";
import { useTranslations } from "next-intl";
import { asset } from "@/data/assets";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Fragment } from "react";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ArrowRight } from "@/components/ui/icons";

const STORIES = [
  { key: "lazar", img: "studentLazar" },
  { key: "bogdan", img: "studentBogdan" },
  { key: "aleksa", img: "studentAleksa" },
  { key: "borivoje", img: "studentBorivoje" },
] as const;

export function SuccessStories() {
  const t = useTranslations("home.stories");

  return (
    <section className="bg-cloud px-6 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading kicker={t("kicker")} title={t("title")} subtitle={t("subtitle")} />
        <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STORIES.map((story) => (
            <RevealItem key={story.key}>
              <article className="group card relative h-full overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-300 hover:shadow-[0_18px_44px_rgba(59,130,196,0.18)]">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={asset(story.img)}
                    alt={t(`${story.key}.name`)}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 via-transparent to-transparent" />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold text-ink">
                    {t(`${story.key}.name`)}
                  </h3>
                  {/* Prevod razdvaja etape znakom „→"; crta se ista strelica
                      kao u dugmadima, umesto tipografske iz sistemskog fonta. */}
                  <p className="mt-1.5 text-[13px] leading-relaxed text-slate-body">
                    {t(`${story.key}.path`)
                      .split("→")
                      .map((leg, i) => (
                        <Fragment key={i}>
                          {i > 0 && (
                            <ArrowRight className="mx-1 inline h-3 w-3 shrink-0 align-[-1px] text-brand-500" />
                          )}
                          {leg.trim()}
                        </Fragment>
                      ))}
                  </p>
                </div>
                <div className="absolute right-4 top-4 rounded-full bg-brand-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow">{t("badge")}</div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
