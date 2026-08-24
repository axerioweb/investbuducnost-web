import Image from "next/image";
import { useTranslations } from "next-intl";
import { partners } from "@/data/catalog";
import { asset } from "@/data/assets";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { Kicker } from "@/components/ui/Kicker";

export function Partners() {
  const t = useTranslations("home.partners");

  return (
    <section className="border-y border-line bg-cloud py-14">
      <Reveal className="mb-8 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-600">
          <Kicker text={t("kicker")} />
        </p>
        <h2 className="mt-2 font-display text-xl font-bold text-ink md:text-2xl">
          {t("title")}
        </h2>
      </Reveal>
      <Marquee>
        {partners.map((partner) => (
          <a
            key={partner.name}
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            title={partner.name}
            className="flex h-16 w-36 shrink-0 items-center justify-center rounded-xl opacity-80 transition-all duration-300 hover:scale-105 hover:opacity-100 focus-visible:opacity-100 md:w-44"
          >
            <Image
              src={asset(partner.logo as Parameters<typeof asset>[0])}
              alt={t("logoAlt", { name: partner.name })}
              width={200}
              height={80}
              sizes="200px"
              className="max-h-12 w-auto object-contain"
            />
          </a>
        ))}
      </Marquee>
    </section>
  );
}
