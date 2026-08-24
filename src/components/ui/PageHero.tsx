"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Kicker } from "./Kicker";
import { WaveDivider } from "./icons";

/** Hero za podstranice: naslov preko fotografije sa plavim overlay-em. */
export function PageHero({
  kicker,
  title,
  subtitle,
  image,
  imageAlt = "",
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-[56vh] items-end overflow-hidden pb-16 pt-36 md:min-h-[62vh] md:pb-20">
      {image && (
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: reduce ? 0 : 1.6, ease: [0.21, 0.65, 0.36, 1] }}
        >
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      )}
      {/* Plavi overlay u tonu logoa */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/85 via-navy-900/45 to-brand-500/20" />
      {/* Zatamnjenje ispod providnog header-a — čitljivost navigacije na svetlim fotografijama */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-navy-900/75 to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-6">
        <motion.p
          initial={{ y: 18 }}
          animate={{ y: 0 }}
          transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.1 }}
          className="mb-4 inline-block rounded-full bg-white/12 px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur"
        >
          <Kicker text={kicker} />
        </motion.p>
        <motion.h1
          initial={{ y: 24 }}
          animate={{ y: 0 }}
          transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 0.2 }}
          className="max-w-3xl font-display text-4xl font-bold leading-[1.08] text-white md:text-6xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ y: 24 }}
            animate={{ y: 0 }}
            transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 0.32 }}
            className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* Talasasti prelaz ka beloj pozadini */}
      <WaveDivider className="h-10 w-full text-white md:h-14" />
    </section>
  );
}
