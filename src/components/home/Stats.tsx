import { useTranslations } from "next-intl";
import { site } from "@/data/site";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

export function Stats() {
  const t = useTranslations("home.stats");

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-navy-800 px-6 py-20 md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-30" />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading kicker={t("kicker")} title={t("title")} tone="dark" />
        <RevealGroup className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7" stagger={0.06}>
          {site.stats.map((stat) => (
            <RevealItem key={stat.id}>
              <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-3 py-7 text-center backdrop-blur transition-colors duration-300 hover:bg-white/15">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  className="font-display text-3xl font-bold text-white md:text-4xl"
                />
                <p className="mt-2 text-[11px] font-medium uppercase tracking-wider text-brand-100 md:text-xs">
                  {t(stat.id)}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
