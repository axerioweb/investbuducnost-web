"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ChatBubble, Close, Send } from "@/components/ui/icons";

/**
 * Chat widget — VIZUELNI (demo režim).
 * Nema backend konekcije; kada chat servis bude spreman, poveži
 * slanje poruka u handleSend() (npr. WebSocket / API poziv).
 */
export function ChatWidget() {
  const t = useTranslations("chat");
  const [open, setOpen] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const reduce = useReducedMotion();
  const uid = useId();
  const panelId = `${uid}-panel`;
  const titleId = `${uid}-title`;
  const bubbleRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fokus u panel pri otvaranju, nazad na mehurić pri zatvaranju + Escape
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        bubbleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function handleSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setShowNote(true);
    e.currentTarget.reset();
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 md:bottom-7 md:right-7">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: reduce ? 0 : 0.25, ease: [0.21, 0.65, 0.36, 1] }}
            id={panelId}
            role="dialog"
            aria-modal="false"
            aria-labelledby={titleId}
            className="card absolute bottom-[76px] right-0 w-[calc(100vw-2.5rem)] max-w-sm overflow-hidden rounded-3xl shadow-[0_24px_60px_rgba(29,58,102,0.25)]"
          >
            {/* Header */}
            <div className="flex items-center gap-3 bg-gradient-to-r from-brand-600 to-brand-700 px-5 py-4">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white font-display text-sm font-bold text-brand-600">
                IB
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-brand-500 bg-emerald-400" aria-hidden />
              </div>
              <div>
                <p id={titleId} className="font-display text-sm font-bold text-white">{t("title")}</p>
                <p className="text-[11px] text-brand-100">{t("status")}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  bubbleRef.current?.focus();
                }}
                aria-label={t("close")}
                className="ml-auto flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
              >
                <Close className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="max-h-72 space-y-3 overflow-y-auto bg-cloud px-5 py-4" role="log" aria-live="polite">
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: reduce ? 0 : 0.15, duration: reduce ? 0 : undefined }}
                className="max-w-[85%] rounded-2xl rounded-tl-sm border border-line bg-white px-4 py-3 text-sm leading-relaxed text-ink shadow-sm"
              >
                {t("greeting")}
              </motion.div>
              <AnimatePresence>
                {showNote && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-[85%] rounded-2xl rounded-tl-sm border border-brand-200 bg-brand-50 px-4 py-3 text-sm leading-relaxed text-brand-700"
                  >
                    {t("demoNote")}
                    <Link
                      href="/contact"
                      className="group mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
                    >
                      <span className="underline underline-offset-2">{t("ctaContact")}</span>
                      <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="flex gap-2 border-t border-line bg-white p-3">
              <input
                type="text"
                required
                placeholder={t("placeholder")}
                aria-label={t("placeholder")}
                className="w-full rounded-full border border-line bg-cloud px-4 py-2.5 text-sm text-ink placeholder:text-slate-body focus:border-brand-400 focus:bg-white"
              />
              <button
                type="submit"
                aria-label={t("send")}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white transition-colors hover:bg-brand-650"
              >
                <Send className="h-4 w-4 translate-x-px" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bubble */}
      <motion.button
        type="button"
        ref={bubbleRef}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t("close") : t("open")}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        whileHover={reduce ? undefined : { scale: 1.06 }}
        whileTap={reduce ? undefined : { scale: 0.94 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-[0_10px_30px_rgba(44,106,166,0.5)]"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-brand-400/40 [animation-duration:3s] motion-reduce:hidden" aria-hidden />
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.18 }}
              className="relative flex"
            >
              <Close className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.18 }}
              className="relative flex"
            >
              <ChatBubble className="h-6 w-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
