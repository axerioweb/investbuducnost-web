import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "./icons";

type LinkProps = ComponentProps<typeof Link>;

/**
 * Primarno plavo dugme sa hover sjajem.
 *
 * Strelica sedi u svetlom kružiću — isti zaobljeni „pločica" jezik kao ikone
 * usluga, i jedini element koji nosi pokret na hover. Visina (48px) je ista
 * kao kod `GhostButton`/`LightButton`: `py-2.5` + kružić 28px; zato se dugmad
 * poravnavaju kad stoje jedno uz drugo u hero sekciji.
 */
export function BrandButton({
  children,
  className = "",
  ...props
}: LinkProps & { children: ReactNode }) {
  return (
    <Link
      {...props}
      className={`group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full bg-brand-600 py-2.5 pl-7 pr-2.5 text-sm font-semibold tracking-wide text-white shadow-[0_8px_24px_rgba(44,106,166,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-650 hover:shadow-[0_12px_30px_rgba(59,130,196,0.32)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <span
        className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20 transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-white/30"
        aria-hidden
      >
        <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}

/** Sekundarno "outline" dugme. */
export function GhostButton({
  children,
  className = "",
  ...props
}: LinkProps & { children: ReactNode }) {
  return (
    <Link
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-brand-200 bg-white px-7 py-3.5 text-sm font-semibold tracking-wide text-brand-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-400 hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${className}`}
    >
      {children}
    </Link>
  );
}

/** Svetlo dugme za tamne pozadine (hero, CTA traka). */
export function LightButton({
  children,
  className = "",
  ...props
}: LinkProps & { children: ReactNode }) {
  return (
    <Link
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-7 py-3.5 text-sm font-semibold tracking-wide text-white backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${className}`}
    >
      {children}
    </Link>
  );
}
