"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link, usePathname } from "@/i18n/navigation";
import { site } from "@/data/site";
import { chatTopics, findTopic, topicForPathname, type ChatTopic } from "@/data/chatFlow";
import { ArrowRight, ChatBubble, Close, Send, WhatsAppIcon } from "@/components/ui/icons";

/**
 * Chat sa čestim pitanjima: tema → kratak odgovor + tipična pitanja → WhatsApp.
 *
 * Nema backenda — posetilac klikom dobija odgovore na česta pitanja, a
 * WhatsApp dugme je dostupno u svakom koraku. Na kraju se sastavlja `wa.me`
 * link sa unapred napisanom porukom (tema, pregledana pitanja i sopstveno
 * pitanje), a korisnik je sam šalje iz WhatsApp-a. Stanje stoji samo u
 * `sessionStorage` da razgovor preživi prelazak na drugu stranicu.
 * Teme i pitanja su u `src/data/chatFlow.ts`.
 */

type Answers = {
  topic?: string;
  /** Česta pitanja na koja je posetilac kliknuo, redom. */
  asked: string[];
  /** Sopstveno pitanje koje ide u WhatsApp poruku. */
  question?: string;
};

type Bubble = { id: string; from: "bot" | "user"; content: ReactNode };

const EMPTY: Answers = { asked: [] };
const STORAGE_KEY = "ib-chat";
const TEASER_KEY = "ib-chat-teaser";
const TEASER_DELAY_MS = 8000;
const TYPING_MS = 650;

function loadAnswers(): Answers | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    // Odbaci sve što ne odgovara trenutnom toku (npr. posle izmene chatFlow.ts)
    const data = JSON.parse(raw) as Record<string, unknown>;
    const topic = findTopic(typeof data.topic === "string" ? data.topic : undefined);
    if (!topic) return null;
    const asked = Array.isArray(data.asked)
      ? (data.asked as unknown[]).filter(
          (id, i, all): id is string => typeof id === "string" && topic.faqs.includes(id) && all.indexOf(id) === i,
        )
      : [];
    const question = typeof data.question === "string" && data.question.trim() ? data.question : undefined;
    return { topic: topic.id, asked, question };
  } catch {
    return null;
  }
}

function saveAnswers(a: Answers) {
  try {
    if (!a.topic) sessionStorage.removeItem(STORAGE_KEY);
    else sessionStorage.setItem(STORAGE_KEY, JSON.stringify(a));
  } catch {
    // privatni prozor / blokiran storage — chat radi i bez pamćenja
  }
}

function markTeaserSeen() {
  try {
    sessionStorage.setItem(TEASER_KEY, "1");
  } catch {
    // bez storage-a se teaser samo ponovo pojavi na sledećoj stranici
  }
}

export function ChatWidget() {
  const t = useTranslations("chat");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [typing, setTyping] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const reduce = useReducedMotion();
  const uid = useId();
  const panelId = `${uid}-panel`;
  const titleId = `${uid}-title`;
  const bubbleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const restoredRef = useRef(false);
  const typingTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const teaserTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const topic = findTopic(answers.topic);
  const remaining = topic ? topic.faqs.filter((id) => !answers.asked.includes(id)) : [];

  // Tema stranice na kojoj je posetilac ide prva u listi
  const contextTopic = topicForPathname(pathname);
  const orderedTopics = contextTopic
    ? [...chatTopics].sort((a, b) => Number(b.id === contextTopic) - Number(a.id === contextTopic))
    : chatTopics;

  useEffect(() => () => clearTimeout(typingTimer.current), []);

  // Nenametljiv poziv pored mehurića — jednom po sesiji, posle par sekundi
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(TEASER_KEY) === "1" || sessionStorage.getItem(STORAGE_KEY) !== null;
    } catch {
      // storage nedostupan — prikaži teaser
    }
    if (seen) return;
    teaserTimer.current = setTimeout(() => setTeaser(true), TEASER_DELAY_MS);
    return () => clearTimeout(teaserTimer.current);
  }, []);

  // Escape zatvara panel i vraća fokus na mehurić
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      const active = document.activeElement;
      const inChat = active === bubbleRef.current || panelRef.current?.contains(active);
      if (e.key === "Escape" && inChat) {
        setOpen(false);
        bubbleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Nova poruka → skrol na dno
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTo({ top: log.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [answers, typing, open, reduce]);

  // Pri otvaranju i kad bot završi „kucanje", fokus ide na prvu kontrolu
  // koraka — samo ako fokus nije otišao van chata (ne otimamo ga sa stranice).
  useEffect(() => {
    if (!open || typing) return;
    const active = document.activeElement;
    const inPanel =
      !active ||
      active === document.body ||
      active === bubbleRef.current ||
      panelRef.current?.contains(active);
    if (!inPanel || footerRef.current?.contains(active)) return;
    footerRef.current?.querySelector<HTMLElement>("button, a, input")?.focus();
  }, [open, typing, answers.topic, answers.asked.length, answers.question]);

  function dismissTeaser() {
    clearTimeout(teaserTimer.current);
    setTeaser(false);
    markTeaserSeen();
  }

  function toggle() {
    dismissTeaser();
    if (!open && !restoredRef.current) {
      restoredRef.current = true;
      const saved = loadAnswers();
      if (saved) setAnswers(saved);
    }
    setOpen((v) => !v);
  }

  function commit(next: Answers, withTyping = true) {
    setAnswers(next);
    saveAnswers(next);
    clearTimeout(typingTimer.current);
    if (withTyping && !reduce) {
      setTyping(true);
      typingTimer.current = setTimeout(() => setTyping(false), TYPING_MS);
    } else {
      setTyping(false);
    }
  }

  function handleQuestion(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = String(new FormData(e.currentTarget).get("message") ?? "").trim();
    if (!value) return;
    commit({ ...answers, question: value });
    e.currentTarget.reset();
  }

  const topicKey = (id: string) => `flow.topics.${id}`;
  const faqKey = (item: ChatTopic, faq: string) => `${topicKey(item.id)}.faq.${faq}`;
  const topicLabel = topic ? t(`${topicKey(topic.id)}.label`) : "";

  // ── Transkript se izvodi iz odgovora, pa promena jezika radi sama ──
  const bubbles: Bubble[] = [{ id: "greeting", from: "bot", content: t("greeting") }];
  if (topic) {
    bubbles.push({ id: "topic", from: "user", content: topicLabel });
    bubbles.push({
      id: "info",
      from: "bot",
      content: (
        <>
          {t(`${topicKey(topic.id)}.info`)}
          <Link
            href={topic.href}
            className="group mt-2 flex w-fit items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            <span className="underline underline-offset-2">{t("flow.learnMore")}</span>
            <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </>
      ),
    });
    bubbles.push({ id: "faq-intro", from: "bot", content: t("flow.faqIntro") });
    for (const faq of answers.asked) {
      bubbles.push({ id: `q-${faq}`, from: "user", content: t(`${faqKey(topic, faq)}.q`) });
      bubbles.push({ id: `a-${faq}`, from: "bot", content: t(`${faqKey(topic, faq)}.a`) });
    }
    if (answers.question) {
      bubbles.push({ id: "question", from: "user", content: answers.question });
      bubbles.push({ id: "question-reply", from: "bot", content: t("flow.questionReply") });
    } else if (answers.asked.length > 0) {
      // Posle prvog odgovora bot jasno nudi prelazak na WhatsApp
      bubbles.push({
        id: `nudge-${answers.asked.length}`,
        from: "bot",
        content: t(remaining.length === 0 ? "flow.allAnswered" : "flow.nudge"),
      });
    }
  }

  // Dok bot „kuca", sakrij njegove poruke posle poslednjeg odgovora korisnika
  let visible = bubbles;
  if (typing) {
    let lastUser = -1;
    bubbles.forEach((b, i) => {
      if (b.from === "user") lastUser = i;
    });
    visible = bubbles.slice(0, lastUser + 1);
  }

  function whatsappHref() {
    const lines = [t("flow.wa.greeting")];
    if (topic) {
      lines.push(t("flow.wa.topic", { topic: topicLabel }));
      if (answers.asked.length > 0) {
        const questions = answers.asked.map((faq) => t(`${faqKey(topic, faq)}.q`)).join(" / ");
        lines.push(t("flow.wa.asked", { questions }));
      }
      if (answers.question) lines.push(t("flow.wa.question", { question: answers.question }));
    } else {
      lines.push(t("flow.wa.general"));
    }
    return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
  }

  const waLabel = !topic
    ? t("flow.whatsappDirect")
    : answers.question
      ? t("flow.whatsappWithQuestion")
      : t("flow.whatsapp");

  const chipBase =
    "rounded-full border px-3.5 py-2 text-left text-xs font-semibold text-brand-700 transition-colors hover:border-brand-400 hover:bg-brand-50";
  const chip = `${chipBase} border-brand-200 bg-white`;
  const chipActive = `${chipBase} border-brand-400 bg-brand-50`;
  const textLink = "-mx-2 min-h-6 px-2 py-1.5 text-xs font-medium text-slate-body underline-offset-2 hover:text-brand-700 hover:underline";

  return (
    <div className="fixed bottom-5 right-5 z-50 md:bottom-7 md:right-7">
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: reduce ? 0 : 0.25, ease: [0.21, 0.65, 0.36, 1] }}
            id={panelId}
            role="dialog"
            aria-modal="false"
            aria-labelledby={titleId}
            className="card absolute bottom-[76px] right-0 flex max-h-[calc(100dvh-7rem)] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-3xl shadow-[0_24px_60px_rgba(29,58,102,0.25)]"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center gap-3 bg-gradient-to-r from-brand-600 to-brand-700 px-5 py-4 [@media(max-height:500px)]:py-2">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white font-display text-sm font-bold text-brand-600">
                IB
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-brand-500 bg-emerald-400" aria-hidden />
              </div>
              <div className="min-w-0">
                <p id={titleId} className="font-display text-sm font-bold text-white">{t("title")}</p>
                <p className="text-[11px] text-brand-100 [@media(max-height:500px)]:hidden">{t("status")}</p>
              </div>
              {/* Na niskim ekranima red sa linkovima je sakriven — „Promeni temu" prelazi ovde */}
              {topic && (
                <button
                  type="button"
                  onClick={() => commit(EMPTY, false)}
                  disabled={typing}
                  aria-label={t("flow.restart")}
                  title={t("flow.restart")}
                  className="ml-auto hidden h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-white disabled:opacity-50 [@media(max-height:500px)]:flex"
                >
                  <span aria-hidden>←</span>
                </button>
              )}
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t("flow.whatsappHeader")} (${t("flow.newTab")})`}
                title={t("flow.whatsappHeader")}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-white ${topic ? "ml-auto [@media(max-height:500px)]:ml-0" : "ml-auto"}`}
              >
                <WhatsAppIcon className="h-4.5 w-4.5" />
              </a>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  bubbleRef.current?.focus();
                }}
                aria-label={t("close")}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-white"
              >
                <Close className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={logRef}
              className="max-h-88 min-h-10 flex-1 space-y-3 overflow-y-auto bg-cloud px-5 py-4"
              role="log"
              aria-live="polite"
            >
              {visible.map((b) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, x: b.from === "bot" ? -12 : 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: reduce ? 0 : 0.25 }}
                  className={
                    b.from === "bot"
                      ? "max-w-[85%] rounded-2xl rounded-tl-sm border border-line bg-white px-4 py-3 text-sm leading-relaxed text-ink shadow-sm wrap-break-word"
                      : "ml-auto w-fit max-w-[85%] whitespace-pre-line wrap-break-word rounded-2xl rounded-tr-sm bg-brand-600 px-4 py-2.5 text-sm leading-relaxed text-white"
                  }
                >
                  {b.content}
                </motion.div>
              ))}
              {typing && (
                <div
                  className="flex w-fit items-center gap-1 rounded-2xl rounded-tl-sm border border-line bg-white px-4 py-3.5 shadow-sm"
                  aria-hidden
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-400"
                      style={{ animationDelay: `${i * 150}ms` }}
                      aria-hidden
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Kontrole */}
            <div ref={footerRef} className="flex max-h-[45dvh] shrink-0 flex-col gap-2.5 border-t border-line bg-white p-3 [@media(max-height:500px)]:gap-2 [@media(max-height:500px)]:p-2">
              {!typing && !topic && (
                <div role="group" aria-label={t("flow.options")} className="-m-1 flex min-h-0 flex-wrap gap-2 overflow-y-auto p-1 [@media(max-height:500px)]:shrink-0 [@media(max-height:500px)]:flex-nowrap [@media(max-height:500px)]:overflow-x-auto [@media(max-height:500px)]:overflow-y-hidden [@media(max-height:500px)]:[&>button]:shrink-0 [@media(max-height:500px)]:[&>button]:whitespace-nowrap">
                  {orderedTopics.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => commit({ topic: item.id, asked: [] })}
                      className={item.id === contextTopic ? chipActive : chip}
                    >
                      {t(`${topicKey(item.id)}.label`)}
                    </button>
                  ))}
                </div>
              )}

              {!typing && topic && remaining.length > 0 && !answers.question && (
                <div role="group" aria-label={t("flow.options")} className="-m-1 flex min-h-0 flex-wrap gap-2 overflow-y-auto p-1 [@media(max-height:500px)]:shrink-0 [@media(max-height:500px)]:flex-nowrap [@media(max-height:500px)]:overflow-x-auto [@media(max-height:500px)]:overflow-y-hidden [@media(max-height:500px)]:[&>button]:shrink-0 [@media(max-height:500px)]:[&>button]:whitespace-nowrap">
                  {remaining.map((faq) => (
                    <button
                      key={faq}
                      type="button"
                      onClick={() => commit({ ...answers, asked: [...answers.asked, faq] })}
                      className={chip}
                    >
                      {t(`${faqKey(topic, faq)}.q`)}
                    </button>
                  ))}
                </div>
              )}

              {typing && <div className="h-10 shrink-0" aria-hidden />}

              {/* WhatsApp je uvek na dohvat ruke — posle prvog odgovora postaje glavno dugme */}
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex w-full shrink-0 items-center justify-center gap-2 rounded-full px-4 text-sm [@media(max-height:500px)]:py-2 font-semibold transition-colors ${
                  topic && (answers.asked.length > 0 || answers.question)
                    ? "bg-emerald-700 py-3 text-white hover:bg-emerald-800"
                    : "border border-emerald-700/30 bg-emerald-50 py-2.5 text-emerald-800 hover:bg-emerald-100"
                }`}
              >
                <WhatsAppIcon className="h-5 w-5" />
                {waLabel}
                <span className="sr-only">({t("flow.newTab")})</span>
              </a>

              {topic && (
                <form onSubmit={handleQuestion} className="flex shrink-0 gap-2">
                  <input
                    type="text"
                    name="message"
                    required
                    maxLength={500}
                    autoComplete="off"
                    placeholder={t("flow.questionPlaceholder")}
                    aria-label={t("flow.questionPlaceholder")}
                    className="w-full rounded-full border border-line bg-cloud px-4 py-2.5 text-base text-ink sm:text-sm placeholder:text-slate-body focus:border-brand-400 focus:bg-white"
                  />
                  <button
                    type="submit"
                    aria-label={t("send")}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white transition-colors hover:bg-brand-650"
                  >
                    <Send className="h-4 w-4 translate-x-px" />
                  </button>
                </form>
              )}

              <div className="flex shrink-0 items-center justify-between gap-3 [@media(max-height:500px)]:hidden">
                {topic ? (
                  <button
                    type="button"
                    onClick={() => commit(EMPTY, false)}
                    disabled={typing}
                    className={`${textLink} disabled:opacity-50`}
                  >
                    <span aria-hidden>←</span> {t("flow.restart")}
                  </button>
                ) : (
                  <span />
                )}
                <Link href="/contact" className={textLink}>
                  {t("flow.contactForm")}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Teaser pored mehurića */}
      <AnimatePresence>
        {teaser && !open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: reduce ? 0 : 0.25 }}
            className="absolute bottom-[72px] right-0 flex w-max max-w-[calc(100vw-2.5rem)] items-center gap-1 rounded-2xl rounded-br-sm border border-line bg-white py-1 pl-4 pr-1 shadow-[0_12px_30px_rgba(29,58,102,0.18)]"
          >
            <button type="button" onClick={toggle} className="py-1.5 text-left text-sm font-semibold text-ink hover:text-brand-700">
              {t("teaser")} <span aria-hidden>👋</span>
            </button>
            <button
              type="button"
              onClick={() => {
                dismissTeaser();
                bubbleRef.current?.focus();
              }}
              aria-label={t("teaserClose")}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-body transition-colors hover:bg-cloud hover:text-ink"
            >
              <Close className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bubble */}
      <motion.button
        type="button"
        ref={bubbleRef}
        onClick={toggle}
        aria-label={open ? t("close") : t("open")}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        // Gestovi uvek postoje (framer-motion zbog whileTap dodaje tabindex u SSR);
        // uslovno ih uklanjati po `reduce` pravi hydration mismatch.
        whileHover={{ scale: reduce ? 1 : 1.06 }}
        whileTap={{ scale: reduce ? 1 : 0.94 }}
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
