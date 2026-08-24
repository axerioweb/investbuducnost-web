"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Close } from "./icons";

/** Nema spoljašnjeg izvora koji se menja — `mounted` se prevrće samo hidracijom. */
const noopSubscribe = () => () => {};

/** Elementi koji mogu da prime fokus — za zamku fokusa unutar dijaloga. */
const FOCUSABLE =
  'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

type Props = {
  open: boolean;
  onClose: () => void;
  /** `id` naslova unutar dijaloga — vezuje se preko `aria-labelledby`. */
  labelledBy: string;
  closeLabel: string;
  children: ReactNode;
};

/**
 * Modalni dijalog: portal na `document.body`, zamka fokusa, Escape, zaključan
 * scroll pozadine i klik na zatamnjenje.
 *
 * Portal je obavezan — kartice koje otvaraju dijalog žive unutar `motion.div`
 * elemenata sa `transform`-om, a transform pravi novi stacking context u kome
 * `position: fixed` više nije u odnosu na viewport.
 */
export function Modal({ open, onClose, labelledBy, closeLabel, children }: Props) {
  // `createPortal` traži `document`, koji na serveru ne postoji
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
  const panelRef = useRef<HTMLDivElement>(null);
  /** Element koji je bio fokusiran pre otvaranja — fokus mu se vraća na zatvaranju. */
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();

  // Zapamti okidač i pomeri fokus u panel
  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    // rAF — čeka da AnimatePresence montira panel
    const raf = requestAnimationFrame(() => panelRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, [open]);

  const close = useCallback(() => {
    onClose();
    returnFocusRef.current?.focus();
  }, [onClose]);

  // Escape + zamka fokusa
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null
      );
      if (items.length === 0) {
        e.preventDefault();
        panel.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === panel)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [open, close]);

  // Zaključaj scroll pozadine bez skoka sadržaja (kompenzacija širine scrollbar-a)
  useEffect(() => {
    if (!open) return;
    const { body } = document;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    };
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.25 }}
            onClick={close}
            className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm"
            aria-hidden
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            tabIndex={-1}
            initial={{ opacity: 0, y: reduce ? 0 : 32, scale: reduce ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : 32, scale: reduce ? 1 : 0.98 }}
            transition={{ duration: reduce ? 0 : 0.3, ease: [0.21, 0.65, 0.36, 1] }}
            className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-[0_30px_80px_rgba(14,31,58,0.35)] outline-none sm:max-h-[88vh] sm:rounded-3xl"
          >
            <button
              type="button"
              onClick={close}
              aria-label={closeLabel}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white/90 text-mist backdrop-blur transition-colors hover:border-brand-300 hover:text-brand-600"
            >
              <Close className="h-4 w-4" />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
