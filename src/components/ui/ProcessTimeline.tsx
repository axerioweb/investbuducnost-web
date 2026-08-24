"use client";

import { motion, useReducedMotion } from "framer-motion";

export type TimelineStep = { title: string; text: string };

/**
 * Vertikalna vremenska linija procesa sa animiranim pojavljivanjem koraka
 * i plavom linijom koja se "crta" tokom skrolovanja.
 */
export function ProcessTimeline({
  steps,
  stepLabel,
}: {
  steps: TimelineStep[];
  stepLabel: string;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="relative mx-auto max-w-3xl">
      {/* linija — van <ol> da lista ima samo <li> decu */}
      <motion.div
        aria-hidden
        className="absolute top-0 bottom-0 left-[27px] w-px origin-top bg-gradient-to-b from-brand-500/70 via-brand-300 to-transparent md:left-[31px]"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: reduce ? 0 : 1.4, ease: "easeOut" }}
      />
      <ol className="relative">
        {steps.map((step, i) => (
        <motion.li
          key={i}
          className="relative flex gap-6 pb-10 last:pb-0 md:gap-8"
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: reduce ? 0 : 0.55,
            delay: reduce ? 0 : i * 0.08,
            ease: [0.21, 0.65, 0.36, 1],
          }}
        >
          <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-brand-200 bg-white font-display text-lg font-bold text-brand-600 shadow-[0_6px_18px_rgba(59,130,196,0.18)] md:h-16 md:w-16 md:text-xl">
            {i + 1}
          </div>
          <div className="card grow rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300 md:p-6">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600">
              {stepLabel} {i + 1}
            </p>
            <h3 className="font-display text-lg font-semibold text-ink md:text-xl">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-body md:text-[15px]">
              {step.text}
            </p>
          </div>
        </motion.li>
        ))}
      </ol>
    </div>
  );
}
