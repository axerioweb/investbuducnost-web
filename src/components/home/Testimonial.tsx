"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { asset } from "@/data/assets";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight, Pause, Play, QuoteMark } from "@/components/ui/icons";

const ITEMS = [
  { key: "andrej", img: "testimonialAndrej" },
  { key: "igor", img: "testimonialIgor" },
  { key: "aljosa", img: "testimonialAljosa" },
  { key: "marko", img: "testimonialMarko" },
] as const;

const AUTOPLAY_MS = 7000;

const control =
  "flex h-10 w-10 items-center justify-center rounded-full border border-brand-200 text-brand-600 transition-colors hover:border-brand-300 hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500";

export function Testimonial() {
  const t = useTranslations("home.testimonial");
  const reduce = useReducedMotion();
  const headingId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.4 });
  const [[index, dir], setState] = useState<[number, number]>([0, 1]);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  // Ručna pauza (WCAG 2.2.2) — hover/fokus pauziraju samo privremeno.
  const [stopped, setStopped] = useState(false);

  const go = useCallback((step: number) => {
    setState(([i]) => [(i + step + ITEMS.length) % ITEMS.length, step]);
  }, []);

  // Rotacija teče samo dok je sekcija na ekranu i niko je ne čita — tekst
  // mora ostati dovoljno dugo da se pročita; uz reduced motion je nema.
  const rotating = !stopped && !reduce && inView;
  const paused = hovered || focused;
  useEffect(() => {
    if (!rotating || paused) return;
    const id = setTimeout(() => go(1), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [index, rotating, paused, go]);

  const item = ITEMS[index];
  const offset = reduce ? 0 : 40;

  return (
    <section className="relative bg-white px-6 py-20 md:py-24">
      <div className="pointer-events-none absolute inset-0 glow-brand" />
      <Reveal className="relative mx-auto max-w-3xl">
        <div
          ref={rootRef}
          role="region"
          aria-roledescription="carousel"
          aria-labelledby={headingId}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            // Prelazak fokusa između dugmadi karusela nije napuštanje karusela.
            if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") go(-1);
            if (e.key === "ArrowRight") go(1);
          }}
          className="card relative rounded-[2rem] px-8 pb-8 pt-10 text-center md:px-14 md:pt-12"
        >
          <span className="absolute -top-6 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-brand-500 text-white shadow-[0_8px_20px_rgba(59,130,196,0.4)]" aria-hidden>
            <QuoteMark className="h-5 w-5" />
          </span>
          <h2 id={headingId} className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-600">
            {t("kicker")}
          </h2>

          {/* Grid slaže sve slajdove u istu ćeliju: nevidljive kopije drže visinu
              najdužeg utiska, pa strelice ne skaču, a svi citati sa autorima su
              u SSR HTML-u i za pretraživače. */}
          <div className="grid" aria-live={paused || !rotating ? "polite" : "off"}>
            {ITEMS.map((it) => (
              <div key={it.key} aria-hidden className="invisible col-start-1 row-start-1">
                <p className="font-display text-xl leading-relaxed md:text-2xl">
                  {t(`items.${it.key}.quote`)}
                </p>
                <p className="mt-7 flex h-12 flex-col justify-center text-sm">
                  <span>{t(`items.${it.key}.author`)}</span>
                  <span className="text-xs">{t(`items.${it.key}.role`)}</span>
                </p>
              </div>
            ))}
            <AnimatePresence initial={false} custom={dir}>
              <motion.figure
                key={item.key}
                custom={dir}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} / ${ITEMS.length}`}
                initial={{ opacity: 0, x: dir * offset }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -dir * offset }}
                transition={{ duration: reduce ? 0 : 0.45, ease: [0.21, 0.65, 0.36, 1] }}
                className="col-start-1 row-start-1 flex flex-col justify-center"
              >
                <blockquote className="font-display text-xl leading-relaxed text-ink md:text-2xl">
                  {t(`items.${item.key}.quote`)}
                </blockquote>
                <figcaption className="mt-7 flex items-center justify-center gap-3">
                  {/* alt je prazan jer ime odmah pored nosi figcaption */}
                  <Image
                    src={asset(item.img)}
                    alt=""
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-brand-300"
                  />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-ink">{t(`items.${item.key}.author`)}</p>
                    <p className="text-xs text-slate-body">{t(`items.${item.key}.role`)}</p>
                  </div>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button type="button" onClick={() => go(-1)} aria-label={t("prev")} className={control}>
              <ArrowRight className="h-4 w-4 rotate-180" />
            </button>
            <div className="flex items-center gap-1">
              {ITEMS.map((it, i) => (
                <button
                  key={it.key}
                  type="button"
                  onClick={() => setState(([cur]) => [i, i >= cur ? 1 : -1])}
                  aria-label={t("goTo", { n: i + 1 })}
                  aria-current={i === index ? "true" : undefined}
                  className="group flex h-6 w-6 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-500"
                >
                  <span
                    className={`block h-2 rounded-full transition-all duration-300 motion-reduce:transition-none ${
                      i === index ? "w-6 bg-brand-700" : "w-2 bg-brand-500 group-hover:bg-brand-600"
                    }`}
                  />
                </button>
              ))}
            </div>
            <button type="button" onClick={() => go(1)} aria-label={t("next")} className={control}>
              <ArrowRight className="h-4 w-4" />
            </button>
            {/* Uz reduced motion nema rotacije, pa ni dugmeta — sakriva ga CSS
                da server i klijent renderuju isto stablo. */}
            <button
              type="button"
              onClick={() => setStopped((s) => !s)}
              aria-label={stopped ? t("play") : t("pause")}
              className={`${control} motion-reduce:hidden`}
            >
              {stopped ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
