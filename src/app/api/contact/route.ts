import nodemailer from "nodemailer";
import { site } from "@/data/site";
import { routing } from "@/i18n/routing";
import sr from "@/messages/sr.json";

/**
 * Kontakt forma → mejl na Gmail (SMTP sa lozinkom za aplikacije).
 *
 * Potrebne promenljive okruženja (vidi `.env.example`):
 *   GMAIL_USER          — Gmail nalog preko kog se šalje
 *   GMAIL_APP_PASSWORD  — lozinka za aplikacije (16 znakova, bez razmaka)
 *   CONTACT_TO_EMAIL    — opciono; primalac upita (podrazumevano `site.email`)
 *
 * Zaštita od spama: skriveno polje (honeypot), minimalno vreme popunjavanja
 * i ograničenje broja slanja po IP adresi.
 */
export const runtime = "nodejs";

const TOPICS = sr.contact.form.topics;
type TopicKey = keyof typeof TOPICS;

const LIMITS = { name: 80, email: 254, phone: 40, message: 5000 } as const;
/** Brže od ovoga forma ne može da se popuni rukom — to rade botovi. */
const MIN_FILL_MS = 3000;
const MAX_BODY_BYTES = 20_000;

/**
 * Ograničenje po IP adresi: najviše 5 poruka u 10 minuta.
 * Memorija jedne instance servera — na serverless hostingu je ovo „najbolji
 * pokušaj", ali uz honeypot i proveru vremena sasvim dovoljno za ovaj sajt.
 */
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  // Čisti samo istekle unose — `clear()` bi poplavom lažnih adresa poništio limit
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (now - times[times.length - 1] >= RATE_WINDOW_MS) hits.delete(key);
    }
  }
  return recent.length > RATE_MAX;
}

/** Jednolinijsko polje: bez kontrolnih znakova (novi redovi i sl.). */
function str(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const v = value.replace(/[\u0000-\u001F\u007F]/g, " ").trim();
  return v.length <= max ? v : null;
}

/** Višelinijsko polje: zadržava nove redove, uklanja ostale kontrolne znakove. */
function multiline(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const v = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
  return v.length <= max ? v : null;
}

/**
 * IP klijenta. Hosting platforma (Vercel) postavlja `x-real-ip`; prva vrednost
 * iz `x-forwarded-for` može da dođe od samog klijenta, pa je samo rezerva.
 */
function clientIp(request: Request): string {
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown"
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) {
    return Response.json({ ok: false, error: "invalid" }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  // Honeypot popunjen ili prebrzo slanje → bot. Odgovaramo „uspeh" da bot
  // ne bi znao da je odbijen, ali ništa ne šaljemo.
  const startedAt = Number(body.startedAt);
  if (body.hp_url || !startedAt || Date.now() - startedAt < MIN_FILL_MS) {
    console.warn("[contact] Odbijeno kao spam (honeypot ili prebrzo slanje)");
    return Response.json({ ok: true });
  }

  if (rateLimited(clientIp(request))) {
    return Response.json({ ok: false, error: "rate" }, { status: 429 });
  }

  const firstName = str(body.firstName, LIMITS.name);
  const lastName = str(body.lastName, LIMITS.name);
  const email = str(body.email, LIMITS.email);
  const phone = str(body.phone ?? "", LIMITS.phone);
  const message = multiline(body.message, LIMITS.message);
  const topic =
    typeof body.topic === "string" && Object.hasOwn(TOPICS, body.topic) ? (body.topic as TopicKey) : null;
  const locale = routing.locales.find((l) => l === body.locale) ?? routing.defaultLocale;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !EMAIL_RE.test(email) ||
    phone === null ||
    !message ||
    !topic ||
    body.consent !== true
  ) {
    return Response.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  if (!user || !pass) {
    console.error("[contact] Nedostaju GMAIL_USER / GMAIL_APP_PASSWORD");
    return Response.json({ ok: false, error: "server" }, { status: 500 });
  }

  const fullName = `${firstName} ${lastName}`;
  const topicLabel = TOPICS[topic];
  const rows: [string, string][] = [
    ["Ime i prezime", fullName],
    ["Email", email],
    ["Telefon", phone || "—"],
    ["Tema", topicLabel],
    ["Jezik sajta", locale.toUpperCase()],
  ];

  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nPoruka:\n${message}\n`;
  const html = `
    <table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="color:#51637a"><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`
        )
        .join("")}
    </table>
    <p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap;border-left:3px solid #3b82c4;padding-left:12px">${escapeHtml(message)}</p>
    <p style="font-family:Arial,sans-serif;font-size:12px;color:#888">Poslato sa kontakt forme na ${site.url}. Odgovor na ovaj mejl ide direktno pošiljaocu.</p>
  `;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
    await transporter.sendMail({
      from: { name: `${site.name} — sajt`, address: user },
      to: process.env.CONTACT_TO_EMAIL || site.email,
      replyTo: { name: fullName, address: email },
      subject: `Novi upit: ${topicLabel} — ${fullName}`,
      text,
      html,
    });
  } catch (err) {
    console.error("[contact] Slanje nije uspelo:", err);
    return Response.json({ ok: false, error: "server" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
