"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ArrowRight } from "@/components/ui/icons";

const CARDS: { key: string; href: AppPathname; icon: string }[] = [
  { key: "europe", href: "/europe", icon: "🎓" },
  { key: "china", href: "/china", icon: "🏮" },
  { key: "camps", href: "/summer-camps", icon: "🏕️" },
  { key: "f1", href: "/student-visa-f1", icon: "🛂" },
  { key: "b1b2", href: "/tourist-visa-b1-b2", icon: "🗽" },
  { key: "usa", href: "/usa-employment", icon: "💼" },
];

export function Services() {
  const t = useTranslations("home.services");
  const common = useTranslations("common");

  return (
    <section className="relative bg-white px-6 py-20 md:py-28">
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading kicker={t("kicker")} title={t("title")} subtitle={t("subtitle")} />

        {/* Dva stuba poverenja */}
        <RevealGroup className="mx-auto mb-12 grid max-w-4xl gap-5 md:grid-cols-2">
          {(["docs", "interview"] as const).map((key) => (
            <RevealItem key={key}>
              <div className="card h-full rounded-2xl border-l-4 !border-l-brand-500 p-6 md:p-7">
                <h3 className="font-display text-lg font-semibold text-ink">
                  {t(`${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-body">{t(`${key}.text`)}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Grid usluga */}
        <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((card) => (
            <RevealItem key={card.key}>
              <Link href={card.href} className="group block h-full">
                <div className="card relative h-full overflow-hidden rounded-2xl p-7 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-brand-300 group-hover:shadow-[0_16px_40px_rgba(59,130,196,0.16)]">
                  <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-2xl transition-colors duration-300 group-hover:bg-brand-100" aria-hidden>
                    {card.icon}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-ink transition-colors group-hover:text-brand-600">
                    {t(`cards.${card.key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-body">
                    {t(`cards.${card.key}.text`)}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600">
                    {common("learnMore")}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
