"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const TOPIC_KEYS = ["f1", "b1b2", "europe", "china", "camps", "usa", "other"] as const;

/**
 * Kontakt forma — VIZUELNA (demo režim).
 * Slanje nije povezano sa backendom; kada backend bude spreman,
 * zameni onSubmit logiku pozivom API rute (npr. POST /api/contact).
 */
export function ContactForm() {
  const t = useTranslations("contact.form");
  const [submitted, setSubmitted] = useState(false);
  const reduce = useReducedMotion();

  const inputCls =
    "w-full rounded-xl border border-line bg-cloud px-4 py-3 text-sm text-ink placeholder:text-slate-body transition-colors focus:border-brand-400 focus:bg-white";

  return (
    <form
      className="card relative rounded-3xl p-6 md:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <h2 className="mb-6 font-display text-xl font-bold text-ink">{t("title")}</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="mb-1.5 block text-xs font-medium text-slate-body">
            {t("firstName")}
          </label>
          <input id="firstName" name="firstName" required autoComplete="given-name" className={inputCls} />
        </div>
        <div>
          <label htmlFor="lastName" className="mb-1.5 block text-xs font-medium text-slate-body">
            {t("lastName")}
          </label>
          <input id="lastName" name="lastName" required autoComplete="family-name" className={inputCls} />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-slate-body">
            {t("email")}
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" className={inputCls} />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-xs font-medium text-slate-body">
            {t("phone")}
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="topic" className="mb-1.5 block text-xs font-medium text-slate-body">
            {t("topic")}
          </label>
          <select
            id="topic"
            name="topic"
            defaultValue="f1"
            className={`${inputCls} appearance-none bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2351637a' stroke-width='2.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")] bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-11`}
          >
            {TOPIC_KEYS.map((key) => (
              <option key={key} value={key}>
                {t(`topics.${key}`)}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className="mb-1.5 block text-xs font-medium text-slate-body">
            {t("message")}
          </label>
          <textarea id="message" name="message" rows={5} required className={`${inputCls} resize-none`} />
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 w-full rounded-full bg-brand-600 py-3.5 text-sm font-semibold tracking-wide text-white shadow-[0_8px_24px_rgba(59,130,196,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-650"
      >
        {t("submit")}
      </button>

      {/* Live region je uvek u DOM-u da bi ga čitači ekrana najavili */}
      <div role="status" aria-live="polite">
        <AnimatePresence>
          {submitted && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.3 }}
              className="mt-4 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-center text-sm text-brand-700"
            >
              {t("demo")}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
