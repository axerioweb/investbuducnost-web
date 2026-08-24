"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link, usePathname } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";
import { asset } from "@/data/assets";
import { ChevronDown } from "@/components/ui/icons";
import { LanguageSwitcher } from "./LanguageSwitcher";

type NavItem =
  | { key: string; href: AppPathname }
  | { key: "process"; children: { key: string; href: AppPathname }[] };

const NAV: NavItem[] = [
  { key: "home", href: "/" },
  { key: "europe", href: "/europe" },
  { key: "camps", href: "/summer-camps" },
  { key: "china", href: "/china" },
  {
    key: "process",
    children: [
      { key: "f1", href: "/student-visa-f1" },
      { key: "b1b2", href: "/tourist-visa-b1-b2" },
      { key: "usa", href: "/usa-employment" },
    ],
  },
  { key: "about", href: "/about" },
  { key: "faq", href: "/faq" },
];

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const uid = useId();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPinned, setDropdownPinned] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape zatvara meni/padajuću listu i vraća fokus na okidač
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (dropdownOpen) {
        setDropdownOpen(false);
        setDropdownPinned(false);
        dropdownButtonRef.current?.focus();
      }
      if (mobileOpen) {
        setMobileOpen(false);
        burgerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [dropdownOpen, mobileOpen]);

  // Klik izvan padajuće liste je zatvara
  useEffect(() => {
    if (!dropdownOpen) return;
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
        setDropdownPinned(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [dropdownOpen]);

  const closeMenus = () => {
    setMobileOpen(false);
    setDropdownOpen(false);
    setDropdownPinned(false);
  };

  const dropdownId = `${uid}-process`;
  const mobileMenuId = `${uid}-mobile`;

  // Preko hero fotografije tekst je beo; na skrolu bela traka + tamni tekst
  const solid = scrolled || mobileOpen;
  const linkBase = solid
    ? "text-ink/80 hover:text-brand-600"
    : "text-white/90 hover:text-white";
  const linkCls = (active: boolean) =>
    `relative whitespace-nowrap px-3 py-2 text-[13px] font-medium tracking-wide transition-colors duration-200 ${
      active ? (solid ? "text-brand-600" : "text-white") : linkBase
    }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        solid ? "bar-blur shadow-[0_6px_24px_rgba(29,58,102,0.08)]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Invest Budućnost">
          <Image
            src={asset("logoMark")}
            alt=""
            width={44}
            height={44}
            priority
            className="h-10 w-10 rounded-full bg-white object-contain ring-1 ring-brand-200"
          />
          <span
            className={`font-display text-[13px] font-bold tracking-wide sm:text-[15px] ${
              solid ? "text-ink" : "text-white"
            }`}
            aria-hidden
          >
            INVEST <span className="text-brand-gradient">BUDUĆNOST</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center xl:flex" aria-label={t("mainNav")}>
          {NAV.map((item) =>
            "children" in item ? (
              <div
                key={item.key}
                ref={dropdownRef}
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => {
                  // meni otvoren klikom ostaje otvoren dok se ne klikne ponovo
                  if (!dropdownPinned) setDropdownOpen(false);
                }}
              >
                <button
                  type="button"
                  ref={dropdownButtonRef}
                  className={`${linkCls(
                    item.children.some((c) => c.href === pathname)
                  )} flex items-center gap-1`}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                  aria-controls={dropdownOpen ? dropdownId : undefined}
                  onClick={() => {
                    setDropdownOpen((v) => !v);
                    setDropdownPinned((v) => !v);
                  }}
                >
                  {t("process")}
                  <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      id={dropdownId}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: reduce ? 0 : 0.18 }}
                      className="card absolute left-0 top-full mt-1 min-w-56 overflow-hidden rounded-xl py-2"
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.key}
                          href={child.href}
                          onClick={closeMenus}
                          aria-current={pathname === child.href ? "page" : undefined}
                          onBlur={(e) => {
                            // zatvori kad fokus napusti grupu (tastatura)
                            if (!dropdownRef.current?.contains(e.relatedTarget as Node)) {
                              setDropdownOpen(false);
                            }
                          }}
                          className="block px-5 py-2.5 text-[13px] font-medium text-ink/80 transition-colors hover:bg-brand-50 hover:text-brand-600"
                        >
                          {t(child.key)}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={item.key}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={linkCls(pathname === item.href)}
              >
                {t(item.key)}
                {pathname === item.href && (
                  <motion.span
                    layoutId="nav-underline"
                    transition={reduce ? { duration: 0 } : undefined}
                    className={`absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full ${
                      solid ? "bg-brand-600" : "bg-white"
                    }`}
                  />
                )}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher solid={solid} />
          <Link
            href="/contact"
            className="hidden rounded-full bg-brand-600 px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_6px_18px_rgba(44,106,166,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-650 md:inline-flex"
          >
            {t("apply")}
          </Link>
          {/* Mobile hamburger */}
          <button
            type="button"
            ref={burgerRef}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? t("menuClose") : t("menuOpen")}
            aria-expanded={mobileOpen}
            aria-controls={mobileOpen ? mobileMenuId : undefined}
            className={`flex h-10 w-10 items-center justify-center rounded-full border xl:hidden ${
              solid ? "border-line bg-white text-ink" : "border-white/30 bg-white/10 text-white"
            }`}
          >
            <div className="relative h-3.5 w-4.5">
              <span className={`absolute left-0 top-0 h-0.5 w-full bg-current transition-all duration-300 ${mobileOpen ? "top-1.5 rotate-45" : ""}`} />
              <span className={`absolute left-0 top-1.5 h-0.5 w-full bg-current transition-opacity duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 top-3 h-0.5 w-full bg-current transition-all duration-300 ${mobileOpen ? "top-1.5 -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            id={mobileMenuId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.3, ease: [0.21, 0.65, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-white xl:hidden"
            aria-label={t("mobileNav")}
          >
            {/* Skrol kad meni ne stane na niske ekrane / landscape */}
            <div className="max-h-[calc(100svh-72px)] space-y-1 overflow-y-auto overscroll-contain px-6 py-4">
              {NAV.flatMap((item) =>
                "children" in item ? item.children : [item]
              ).map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={closeMenus}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-brand-50 text-brand-600"
                      : "text-ink/80 hover:bg-brand-50 hover:text-brand-600"
                  }`}
                >
                  {t(item.key)}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={closeMenus}
                className="mt-3 block rounded-full bg-brand-600 px-5 py-3 text-center text-sm font-semibold text-white"
              >
                {t("apply")}
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
