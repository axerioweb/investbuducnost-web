import type { AppPathname } from "@/i18n/routing";
import { LightButton } from "./Buttons";
import { Reveal } from "./Reveal";

/** Završna CTA traka — plavi gradijent u tonu logoa. */
export function CtaSection({
  title,
  text,
  buttonLabel,
  href = "/contact",
}: {
  title: string;
  text: string;
  buttonLabel: string;
  href?: AppPathname;
}) {
  return (
    <section className="px-6 py-20 md:py-24">
      <Reveal className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-600 via-brand-700 to-navy-800 px-8 py-12 text-center shadow-[0_24px_60px_rgba(29,58,102,0.25)] md:px-16 md:py-16">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[28rem] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-dots opacity-40" />
          <h2 className="relative font-display text-3xl font-bold text-white md:text-4xl">
            {title}
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-base text-white/90 md:text-lg">
            {text}
          </p>
          <div className="relative mt-8 flex justify-center">
            <LightButton href={href}>{buttonLabel}</LightButton>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
