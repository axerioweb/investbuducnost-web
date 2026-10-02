"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { site } from "@/data/site";

const TOPIC_KEYS = ["f1", "b1b2", "europe", "china", "camps", "usa", "other"] as const;

type Status = "idle" | "sending" | "success" | "error" | "rate";

const noopSubscribe = () => () => {};

/**
 * Kontakt forma — šalje na `POST /api/contact`, koja prosleđuje upit mejlom
 * (Gmail). Skriveno polje `hp_url` i `startedAt` služe zaštiti od botova.
 */
export function ContactForm() {
  const t = useTranslations("contact.form");
  const locale = useLocale();
  const [status, setStatus] = useState<Status>("idle");
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  // Dugme je aktivno tek posle hidratacije — inače bi nativni submit poslao
  // podatke GET-om u URL umesto na API.
  const ready = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
  const reduce = useReducedMotion();

  const inputCls =
    "w-full rounded-xl border border-line bg-cloud px-4 py-3 text-sm text-ink placeholder:text-slate-body transition-colors focus:border-brand-400 focus:bg-white";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          consent: data.consent === "on",
          locale,
          startedAt: startedAt.current,
        }),
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus(res.status === 429 ? "rate" : "error");
      }
    } catch {
      setStatus("error");
    }
  }

  const feedback =
    status === "success"
      ? t("success")
      : status === "error"
        ? t("error", { email: site.email })
        : status === "rate"
          ? t("rateLimited")
          : null;
  const isError = status === "error" || status === "rate";

  const required = (
    <span aria-hidden="true" className="text-brand-600">
      {" "}*
    </span>
  );

  return (
    <form className="card relative rounded-3xl p-6 md:p-8" onSubmit={onSubmit}>
      <h2 className="font-display text-xl font-bold text-ink">{t("title")}</h2>
      <p className="mb-6 mt-1 text-xs text-slate-body">{t("requiredNote")}</p>

      {/* Honeypot — skriven od ljudi i čitača ekrana, botovi ga popunjavaju */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="hp_url">URL</label>
        <input id="hp_url" name="hp_url" type="text" tabIndex={-1} autoComplete="new-password" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="mb-1.5 block text-xs font-medium text-slate-body">
            {t("firstName")}
            {required}
          </label>
          <input id="firstName" name="firstName" required maxLength={80} autoComplete="given-name" className={inputCls} />
        </div>
        <div>
          <label htmlFor="lastName" className="mb-1.5 block text-xs font-medium text-slate-body">
            {t("lastName")}
            {required}
          </label>
          <input id="lastName" name="lastName" required maxLength={80} autoComplete="family-name" className={inputCls} />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-slate-body">
            {t("email")}
            {required}
          </label>
          <input id="email" name="email" type="email" required maxLength={254} autoComplete="email" className={inputCls} />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-xs font-medium text-slate-body">
            {t("phone")} <span className="font-normal">({t("optional")})</span>
          </label>
          <input id="phone" name="phone" type="tel" maxLength={40} autoComplete="tel" className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="topic" className="mb-1.5 block text-xs font-medium text-slate-body">
            {t("topic")}
            {required}
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
            {required}
          </label>
          <textarea id="message" name="message" rows={5} required maxLength={5000} className={`${inputCls} resize-none`} />
        </div>
      </div>

      <div className="mt-5 flex items-start gap-3">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          required
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-brand-600"
        />
        <label htmlFor="consent" className="text-xs leading-relaxed text-slate-body">
          {t.rich("consent", {
            link: (chunks) => (
              <Link
                href="/privacy"
                target="_blank"
                rel="noopener"
                className="font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700"
              >
                {chunks}
                <span className="sr-only"> ({t("newTab")})</span>
              </Link>
            ),
          })}
          {required}
        </label>
      </div>

      <button
        type="submit"
        disabled={!ready || status === "sending"}
        className="mt-6 w-full rounded-full bg-brand-600 py-3.5 text-sm font-semibold tracking-wide text-white shadow-[0_8px_24px_rgba(59,130,196,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-650 disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0"
      >
        {status === "sending" ? t("sending") : t("submit")}
      </button>

      {/* Live region je uvek u DOM-u da bi ga čitači ekrana najavili */}
      <div role={isError ? "alert" : "status"} aria-live={isError ? "assertive" : "polite"}>
        <AnimatePresence mode="wait">
          {feedback && (
            <motion.p
              key={status}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.3 }}
              className={
                status === "success"
                  ? "mt-4 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-center text-sm text-brand-700"
                  : "mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700"
              }
            >
              {feedback}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
