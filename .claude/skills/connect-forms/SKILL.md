---
name: connect-forms
description: Izmene backenda kontakt forme (Gmail), vraćanje newslettera ili povezivanje chata sa API-jem. Koristi kada treba promeniti način slanja upita ili dodati novu formu.
---

# Povezivanje formi i chata sa backendom

Sve tri komponente su namerno u demo režimu — UI je gotov, samo se menja submit logika.

## Kontakt forma — POVEZANA

`src/components/forms/ContactForm.tsx` → `src/app/api/contact/route.ts` → Gmail SMTP
(nodemailer, lozinka za aplikacije; promenljive u `.env.example`). Sadrži honeypot,
minimalno vreme popunjavanja, rate limit i obaveznu saglasnost (`contact.form.consent`
sa linkom na `/privacy`). Promena primaoca: `CONTACT_TO_EMAIL`. Prelazak na Resend ili
drugi servis menja samo blok `transporter.sendMail` u API ruti.

## Newsletter — UKLONJEN

Ako se vrati: nova komponenta + `POST /api/newsletter` → provajder
(Brevo/Mailchimp), double opt-in, i dopuna politike privatnosti (svrha, pravni
osnov = pristanak, primalac = provajder, odjava).

## Chat — `src/components/chat/ChatWidget.tsx`

Chat VIŠE NIJE demo: tema → česta pitanja sa odgovorima (+ opciono sopstveno
pitanje) → `wa.me` link sa unapred napisanom porukom (korisnik je sam šalje).
WhatsApp dugme je dostupno u svakom koraku.
Teme/pitanja: `src/data/chatFlow.ts` + `chat.flow.*` u messages; broj: `site.whatsapp`.
Faza 2 (opciono): pri kliku na „Nastavi na WhatsApp-u" paralelno poslati odgovore
na API rutu (email/baza) da se upit ne izgubi ako korisnik ne pošalje poruku.

## Verifikacija

Test slanja na sva 3 jezika; provera da bot/spam zaštita radi; `npm run build`.
