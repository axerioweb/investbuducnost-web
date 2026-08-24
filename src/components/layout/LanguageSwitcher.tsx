"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { routing } from "@/i18n/routing";
import { localeFlags, localeNames } from "@/i18n/config";
import { Link, usePathname } from "@/i18n/navigation";
import { Flag } from "@/components/ui/Flag";
import { ChevronDown } from "@/components/ui/icons";

/** Prebacivanje jezika — zadržava trenutnu stranicu (lokalizovane putanje). */
export function LanguageSwitcher({ solid = true }: { solid?: boolean }) {
  const locale = useLocale();
  const t = useTranslations("nav");
  const pathname = usePathname();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        aria-label={`${t("languageSwitcher")}: ${localeNames[locale] ?? locale}`}
        aria-expanded={open}
        aria-haspopup="true"
        className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
          solid
            ? "border-line bg-white text-ink hover:border-brand-300 hover:text-brand-600"
            : "border-white/30 bg-white/10 text-white hover:bg-white/20"
        }`}
      >
        <Flag code={localeFlags[locale] ?? locale} className="h-3.5 w-[1.3125rem]" />
        {locale}
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: reduce ? 0 : 0.18 }}
            className="card absolute right-0 top-full z-50 mt-2 min-w-36 overflow-hidden rounded-xl py-1.5"
          >
            {routing.locales.map((l) => (
              <li key={l}>
                <Link
                  // @ts-expect-error — pathname + params su validni za trenutnu rutu
                  href={{ pathname, params }}
                  locale={l}
                  hrefLang={l}
                  lang={l}
                  onClick={() => setOpen(false)}
                  aria-current={l === locale ? "true" : undefined}
                  className={`flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors ${
                    l === locale
                      ? "bg-brand-50 font-semibold text-brand-600"
                      : "text-ink/85 hover:bg-brand-50 hover:text-brand-600"
                  }`}
                >
                  <Flag code={localeFlags[l] ?? l} className="h-3.5 w-[1.3125rem]" />
                  {localeNames[l] ?? l}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
