"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";
import { asset } from "@/data/assets";
import { BrandButton, LightButton } from "@/components/ui/Buttons";
import { Kicker } from "@/components/ui/Kicker";
import { Spark, WaveDivider } from "@/components/ui/icons";

export function Hero() {
  const t = useTranslations("home.hero");
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yImg = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", reduce ? "0%" : "22%"],
  );
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0]);
  // Indikator brze nestaje od ostatka hero-a — nema smisla dok se skroluje
  const hintOpacity = useTransform(
    scrollYProgress,
    [0, 0.25],
    [1, reduce ? 1 : 0],
  );

  // Kad indikator odbledi, gasimo mu animacije i vadimo ga iz tab redosleda
  const [hintOff, setHintOff] = useState(false);
  useMotionValueEvent(hintOpacity, "change", (v) => setHintOff(v < 0.1));

  const scrollToNext = () => {
    const next = ref.current?.nextElementSibling;
    if (next) {
      next.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    } else {
      window.scrollBy({
        top: window.innerHeight,
        behavior: reduce ? "auto" : "smooth",
      });
    }
  };

  // Animira se samo pomeraj (bez opacity) — tekst hero-a je vidljiv i bez JS-a
  const fadeUp = (delay: number) => ({
    initial: { y: 30 } as const,
    animate: { y: 0 },
    transition: {
      duration: reduce ? 0 : 0.8,
      delay: reduce ? 0 : delay,
      ease: [0.21, 0.65, 0.36, 1] as const,
    },
  });

  return (
    <section
      ref={ref}
      className="relative flex min-h-svh items-center overflow-hidden pt-24"
    >
      {/* Pozadina: fotografija + parallax */}
      <motion.div className="absolute inset-0" style={{ y: yImg }}>
        <Image
          src={asset("heroHome")}
          alt={t("imageAlt")}
          fill
          priority
          sizes="100vw"
          className="scale-110 object-cover"
        />
      </motion.div>
      {/* Plavi overlay u tonu logoa */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-900/85 via-navy-800/60 to-brand-700/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-transparent" />
      {/* Zatamnjenje ispod providnog header-a */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-navy-900/70 to-transparent" />

      <motion.div
        style={{ opacity }}
        className="relative mx-auto w-full max-w-7xl px-6 py-20"
      >
        <motion.p
          {...fadeUp(0.05)}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-white backdrop-blur"
        >
          <Spark className="h-2 w-2 shrink-0" />
          <Kicker text={t("kicker")} />
        </motion.p>

        <motion.h1
          {...fadeUp(0.15)}
          className="max-w-4xl font-display text-[2.7rem] font-bold leading-[1.05] text-white sm:text-6xl md:text-7xl"
        >
          {t("title")}
          <br />
          <span className="text-brand-200">{t("titleAccent")}</span>
        </motion.h1>

        <motion.p
          {...fadeUp(0.28)}
          className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg"
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          {...fadeUp(0.4)}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <BrandButton
            href="/contact"
            className="!shadow-[0_10px_30px_rgba(14,31,58,0.35)]"
          >
            {t("ctaPrimary")}
          </BrandButton>
          <LightButton href="/student-visa-f1">{t("ctaSecondary")}</LightButton>
        </motion.div>

        <motion.p
          {...fadeUp(0.52)}
          className="mt-10 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-white/75"
        >
          {t("availability")}
        </motion.p>
      </motion.div>

      {/* Scroll indikator — klik skroluje na sledecu sekciju */}
      <motion.div
        style={{
          opacity: hintOpacity,
          pointerEvents: hintOff ? "none" : "auto",
        }}
        className="absolute bottom-12 left-1/2 hidden -translate-x-1/2 md:block"
      >
        <button
          type="button"
          onClick={scrollToNext}
          aria-label={t("scrollAria")}
          tabIndex={hintOff ? -1 : 0}
          aria-hidden={hintOff || undefined}
          className="group flex cursor-pointer items-center justify-center rounded-full p-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {/* Okvir misa; tockic klizi gore-dole (CSS keyframes, vidi globals.css) */}
          <span className="flex h-12 w-7 justify-center rounded-full border-2 border-white/50 pt-2 transition-colors duration-300 group-hover:border-white">
            <span className="animate-scroll-dot h-2.5 w-[3px] rounded-full bg-white" />
          </span>
        </button>
      </motion.div>

      {/* Talasasti prelaz ka beloj pozadini */}
      <WaveDivider className="h-12 w-full text-white md:h-16" />
    </section>
  );
}
