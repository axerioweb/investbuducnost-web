"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Plus } from "./icons";

export type AccordionItem = { q: string; a: string };

/**
 * FAQ harmonika sa glatkim otvaranjem/zatvaranjem.
 * Svi odgovori su UVEK u DOM-u (samo se vizuelno skupljaju) — tako ih
 * pretraživači vide u statičkom HTML-u i FAQPage rich result ostaje validan.
 */
export function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();
  const uid = useId();

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${uid}-panel-${i}`;
        const buttonId = `${uid}-button-${i}`;
        return (
          <div
            key={i}
            className={`card overflow-hidden rounded-2xl transition-colors duration-300 ${
              isOpen ? "border-brand-300" : "hover:border-brand-200"
            }`}
          >
            <h2>
              <button
                type="button"
                id={buttonId}
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left md:px-7 md:py-5"
              >
                <span className="font-display text-[15px] font-semibold text-ink md:text-base">
                  {item.q}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: reduce ? 0 : 0.25 }}
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                    isOpen
                      ? "border-brand-400 bg-brand-50 text-brand-600"
                      : "border-line text-mist"
                  }`}
                  aria-hidden
                >
                  <Plus className="h-3.5 w-3.5" />
                </motion.span>
              </button>
            </h2>
            <motion.div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!isOpen}
              inert={!isOpen}
              initial={false}
              animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
              transition={{ duration: reduce ? 0 : 0.35, ease: [0.21, 0.65, 0.36, 1] }}
              className="overflow-hidden"
            >
              <p className="px-5 pb-5 text-sm leading-relaxed text-slate-body md:px-7 md:pb-6 md:text-[15px]">
                {item.a}
              </p>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
