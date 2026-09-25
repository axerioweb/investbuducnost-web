---
name: connect-forms
description: Aktiviranje kontakt forme, newslettera i chata (trenutno su vizuelni/demo). Koristi kada vlasnik obezbedi backend i zatraži da forme postanu funkcionalne.
---

# Povezivanje formi i chata sa backendom

Sve tri komponente su namerno u demo režimu — UI je gotov, samo se menja submit logika.

## Kontakt forma — `src/components/forms/ContactForm.tsx`

1. Kreiraj API rutu `src/app/api/contact/route.ts` (POST): validacija (zod),
   honeypot polje protiv spama, rate limit, slanje mejla (Resend/Nodemailer/SMTP)
   na `investbuducnost@gmail.com`.
2. U `onSubmit` zameni `setSubmitted(true)` sa `fetch("/api/contact", …)` +
   stanja loading/success/error.
3. U messages fajlovima (sva 3 jezika!) zameni `contact.form.demo` porukama
   uspeha/greške i ukloni demo napomenu.
4. Proxy matcher u `src/proxy.ts` već preskače `/api` — ne diraj.

## Newsletter — `src/components/forms/NewsletterForm.tsx`

Isti obrazac: `POST /api/newsletter` → provajder (Mailchimp/Brevo/Buttondown).
Komponenta već ima `role="status"` poruku (`footer.newsletter.success`) — zameni je
porukama uspeha/greške sa servera i dodaj loading stanje na dugmetu.

## Chat — `src/components/chat/ChatWidget.tsx`

Chat VIŠE NIJE demo: tema → česta pitanja sa odgovorima (+ opciono sopstveno
pitanje) → `wa.me` link sa unapred napisanom porukom (korisnik je sam šalje).
WhatsApp dugme je dostupno u svakom koraku.
Teme/pitanja: `src/data/chatFlow.ts` + `chat.flow.*` u messages; broj: `site.whatsapp`.
Faza 2 (opciono): pri kliku na „Nastavi na WhatsApp-u" paralelno poslati odgovore
na API rutu (email/baza) da se upit ne izgubi ako korisnik ne pošalje poruku.

## Verifikacija

Test slanja na sva 3 jezika; provera da bot/spam zaštita radi; `npm run build`.
