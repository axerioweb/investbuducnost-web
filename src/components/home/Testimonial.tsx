import Image from "next/image";
import { useTranslations } from "next-intl";
import { asset } from "@/data/assets";
import { Reveal } from "@/components/ui/Reveal";
import { QuoteMark } from "@/components/ui/icons";

export function Testimonial() {
  const t = useTranslations("home.testimonial");

  return (
    <section className="relative bg-white px-6 py-20 md:py-24">
      <div className="pointer-events-none absolute inset-0 glow-brand" />
      <Reveal className="relative mx-auto max-w-3xl">
        <figure className="card relative rounded-[2rem] px-8 py-10 text-center md:px-14 md:py-12">
          <span className="absolute -top-6 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-brand-500 text-white shadow-[0_8px_20px_rgba(59,130,196,0.4)]" aria-hidden>
            <QuoteMark className="h-5 w-5" />
          </span>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-600">
            {t("kicker")}
          </p>
          <blockquote className="font-display text-xl leading-relaxed text-ink md:text-2xl">
            {t("quote")}
          </blockquote>
          <figcaption className="mt-7 flex items-center justify-center gap-3">
            <Image
              src={asset("testimonialAndrej")}
              alt={t("author")}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-brand-300"
            />
            <div className="text-left">
              <p className="text-sm font-semibold text-ink">{t("author")}</p>
              <p className="text-xs text-slate-body">{t("role")}</p>
            </div>
          </figcaption>
        </figure>
      </Reveal>
    </section>
  );
}
