"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Flag } from "@/components/ui/Flag";
import { Kicker } from "@/components/ui/Kicker";
import { WaveDivider } from "@/components/ui/icons";

/**
 * Hero stranice institucije: fotografija kampusa sa plavim overlay-em, logo na
 * beloj pločici i naziv.
 *
 * Zaseban je od `ui/PageHero` jer nosi logo i pilule sa činjenicama, a naslov
 * mu je naziv institucije — dakle kraći i bez podnaslova preko cele širine.
 * Logo ide na belu pločicu iz istog razloga kao i na karticama: logotipi su
 * raznih pozadina i proporcija, pa `object-contain` na beloj podlozi jedini
 * garantuje da su čitljivi.
 */
export function InstitutionHero({
  name,
  city,
  countryCode,
  logo,
  logoAlt,
  image,
  imageAlt,
  kicker,
  pills,
  actions,
}: {
  name: string;
  city: string;
  countryCode: string;
  logo: string;
  logoAlt: string;
  image: string;
  imageAlt: string;
  kicker: string;
  pills: string[];
  actions?: ReactNode;
}) {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-[62vh] items-end overflow-hidden pb-14 pt-36 md:min-h-[68vh] md:pb-18">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: reduce ? 0 : 1.6, ease: [0.21, 0.65, 0.36, 1] }}
      >
        <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="object-cover" />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/55 to-brand-500/20" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-navy-900/75 to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:gap-8">
          <motion.div
            initial={{ y: 22 }}
            animate={{ y: 0 }}
            transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 0.1 }}
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white p-3.5 shadow-[0_12px_34px_rgba(0,0,0,0.28)] md:h-32 md:w-32 md:p-4"
          >
            <Image
              src={logo}
              alt={logoAlt}
              width={220}
              height={140}
              sizes="128px"
              className="h-full w-full object-contain"
            />
          </motion.div>

          <div className="min-w-0">
            <motion.p
              initial={{ y: 18 }}
              animate={{ y: 0 }}
              transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.15 }}
              className="mb-3 inline-block rounded-full bg-white/12 px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur"
            >
              {/* Isti put kao u `ui/PageHero` — `Kicker` deli tekst po „·" i
                  umeće `Spark`. Danas nadnaslov institucije nema separator, ali
                  bi se prvi koji ga dobije inače razišao od ostatka sajta. */}
              <Kicker text={kicker} />
            </motion.p>
            <motion.h1
              initial={{ y: 24 }}
              animate={{ y: 0 }}
              transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 0.22 }}
              className="max-w-3xl font-display text-3xl font-bold leading-[1.1] text-white md:text-5xl"
            >
              {name}
            </motion.h1>
            <motion.p
              initial={{ y: 24 }}
              animate={{ y: 0 }}
              transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 0.3 }}
              className="mt-3 flex items-center gap-2 text-sm font-medium text-white/85 md:text-base"
            >
              <Flag code={countryCode} className="h-3.5 w-[1.3125rem]" />
              {city}
            </motion.p>
          </div>
        </div>

        {(pills.length > 0 || actions) && (
          <motion.div
            initial={{ y: 24 }}
            animate={{ y: 0 }}
            transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 0.38 }}
            className="mt-7 flex flex-wrap items-center gap-2.5"
          >
            {pills.map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[13px] font-semibold text-white backdrop-blur"
              >
                {pill}
              </span>
            ))}
            {actions}
          </motion.div>
        )}
      </div>

      <WaveDivider className="h-10 w-full text-white md:h-14" />
    </section>
  );
}
