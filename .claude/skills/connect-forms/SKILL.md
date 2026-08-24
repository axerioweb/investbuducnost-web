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

Opcije: (a) embed provajdera (Tawk.to/Crisp) — tada widget zameni njihovim SDK-om
ali zadrži postojeći vizuelni stil ako provajder dozvoljava; (b) sopstveni backend —
poveži `handleSend()` na API/WebSocket i renderuj poruke iz stanja.
Ukloni `demoNote` logiku kada chat postane funkcionalan.

## Verifikacija

Test slanja na sva 3 jezika; provera da bot/spam zaštita radi; `npm run build`.
