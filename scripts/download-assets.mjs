#!/usr/bin/env node
/**
 * Preuzima sve slike (Pexels fotografije + originalni asseti sa starog sajta)
 * u public/images/ i generiše src/data/assets.local.json — nakon toga sajt
 * koristi lokalne slike umesto CDN-ova.
 *
 * Pokretanje:  npm run download-assets
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const OUT_DIR = path.resolve("public/images");
const MANIFEST = path.resolve("src/data/assets.local.json");
const WIX = "https://static.wixstatic.com/media/";
const px = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1920`;

const ASSETS = {
  // Wix (logo + stvarne osobe sa starog sajta)
  logo: { url: `${WIX}36a1e1_e45bb64bef224171939dc5ccba2960cd~mv2.png`, ext: ".png" },
  ogDefault: { url: `${WIX}36a1e1_0673fc8023014a4d8985a7e171c09722~mv2.png`, ext: ".png" },
  studentLazar: { url: `${WIX}36a1e1_a8ea2debcc7b43788a7755e3594d5c1a~mv2.png`, ext: ".png" },
  studentBogdan: { url: `${WIX}36a1e1_b70bf666cee149cf96a1d97f468a2bd5~mv2.png`, ext: ".png" },
  studentAleksa: { url: `${WIX}36a1e1_ba8064e638fa44fa8cb97f7c0c8a7d58~mv2.png`, ext: ".png" },
  studentBorivoje: { url: `${WIX}36a1e1_67ac39f39f5949b194c0f68033021641~mv2.png`, ext: ".png" },
  testimonialAndrej: { url: `${WIX}36a1e1_e5e30d935ae14001a6c082d45088bbdf~mv2.jpeg`, ext: ".jpeg" },

  // Logotipi partnerskih univerziteta i škola (sa starog sajta)
  uniEmuni: { url: `${WIX}36a1e1_cf54461709f34961bba80b2e4d3d89c5~mv2.png`, ext: ".png" },
  // METU: logo sa spiska institucija je beo na providnoj pozadini (za tamnu
  // podlogu) i nevidljiv na beloj pločici — uzet je obojeni sa njihove podstranice
  uniMetu: { url: `${WIX}36a1e1_562686abdef4474ea869fafc13a4a83a~mv2.png`, ext: ".png" },
  uniAydin: { url: `${WIX}36a1e1_8b2946b4a117465eb934e7d67344a207~mv2.png`, ext: ".png" },
  uniNicosia: { url: `${WIX}36a1e1_a13359a6c146498ebb9aff0fa3bce254~mv2.png`, ext: ".png" },
  uniAis: { url: `${WIX}36a1e1_a062022d53f34c22ab21db3b944bbb2d~mv2.png`, ext: ".png" },
  uniCbs: { url: `${WIX}36a1e1_b3b25357e3604ac8ae73a3b3dfde99df~mv2.png`, ext: ".png" },
  uniEuBs: { url: `${WIX}36a1e1_863961d415c84d7aa0cb3c4d0574e0c1~mv2.png`, ext: ".png" },
  uniIbs: { url: `${WIX}36a1e1_58be809b985e46f8b45f6056caa645f3~mv2.png`, ext: ".png" },
  uniWittenborg: { url: `${WIX}36a1e1_ce6856f1fd974ab499f84b153e487d2d~mv2.png`, ext: ".png" },
  uniUcam: { url: `${WIX}36a1e1_37718f8c091244f7a3116e542b672328~mv2.png`, ext: ".png" },
  uniFsm: { url: `${WIX}36a1e1_820240a0af5a454fb31a1886d784872b~mv2.png`, ext: ".png" },
  uniAubg: { url: `${WIX}36a1e1_0174ff261963476b9425c9ff822eaebb~mv2.png`, ext: ".png" },
  uniJcu: { url: `${WIX}36a1e1_dd2b834235574628a90d90c5f2d021c5~mv2.png`, ext: ".png" },
  uniGbsb: { url: `${WIX}36a1e1_7f481ccad23f4e6fbd87e5ba02fdcf75~mv2.png`, ext: ".png" },
  uniBts: { url: `${WIX}36a1e1_e03953270d6848fa84ffcc6e18a7bf2a~mv2.png`, ext: ".png" },
  uniHtl: { url: `${WIX}36a1e1_72115830ce78444ea92dc0074911896f~mv2.png`, ext: ".png" },
  uniMai: { url: `${WIX}36a1e1_de8adff018db4c569c420b33b8c0d915~mv2.png`, ext: ".png" },
  uniSrh: { url: `${WIX}36a1e1_44077bb2b7064cd3a44cdd6ac05d73cc~mv2.png`, ext: ".png" },
  uniKozminski: { url: `${WIX}36a1e1_e5c0d759fb2d429cb2840d84dfa7a8ab~mv2.png`, ext: ".png" },
  uniEuropea: { url: `${WIX}36a1e1_b71dc233833641529073d50425c797b0~mv2.png`, ext: ".png" },

  // Logotipi partnera sa početne strane (EU Business School, EMUNI i GBSB
  // dele fajl sa `uni*` ključevima, pa se ne preuzimaju dvaput)
  partnerOxford: { url: `${WIX}36a1e1_4ab3090a6f6f458c894ea45d6dbac29a~mv2.png`, ext: ".png" },
  partnerSpringfield: { url: `${WIX}36a1e1_cf499c39e33942ca809358a695d07904~mv2.png`, ext: ".png" },
  partnerSantaRosa: { url: `${WIX}36a1e1_0a70d970de694356ba854366116576fe~mv2.png`, ext: ".png" },
  partnerCcv: { url: `${WIX}36a1e1_3474ef9a41384662ba028dec648b1645~mv2.png`, ext: ".png" },
  partnerGca: { url: `${WIX}36a1e1_2eb2631568534aa58ec75aff9c41845e~mv2.png`, ext: ".png" },
  partnerHoosac: { url: `${WIX}36a1e1_19bc400b60524b84b09b4217d142e099~mv2.png`, ext: ".png" },
  partnerSwiss: { url: `${WIX}36a1e1_7d94d1e0d16548249ee7385c31632c0a~mv2.png`, ext: ".png" },
  partnerMoval: {
    url: "https://www.moval.edu/wp-content/uploads/2026/08/MVU-Logo-2026_Pyramid.png",
    ext: ".png",
  },
  partnerHunter: { url: "https://hunter.cuny.edu/assets/hunter-cuny-logo.v2.png", ext: ".png" },
  // XJTLU nudi zaglavni logo samo kao SVG; next/image ga ne servira bez
  // `dangerouslyAllowSVG`, pa se rasterizuje odmah pri preuzimanju
  partnerXjtlu: {
    url: "https://www.xjtlu.edu.cn/wp-content/uploads/2024/01/en-header-logo.svg",
    ext: ".png",
    rasterizeWidth: 900,
  },
  partnerNovotek: {
    url: "https://novotekmanpower.rs/wp-content/uploads/2025/04/logolevo.webp",
    ext: ".webp",
  },

  // Pexels (besplatne fotografije)
  heroHome: { url: px(3374249), ext: ".jpg" },
  heroEurope: { url: px(34994033), ext: ".jpg" },
  heroCamps: { url: px(5622112), ext: ".jpg" },
  heroChina: { url: px(25020077), ext: ".jpg" },
  heroF1: { url: px(35487002), ext: ".jpg" },
  heroB1B2: { url: px(27807670), ext: ".jpg" },
  heroUsaJobs: { url: px(34902065), ext: ".jpg" },
  usaJobsTruck: { url: px(27099095), ext: ".jpg" },
  usaJobsMoving: { url: px(7464232), ext: ".jpg" },
  usaJobsHospitality: { url: px(33934080), ext: ".jpg" },
  usaJobsCatering: { url: px(34321369), ext: ".jpg" },
  aboutHero: { url: px(12903168), ext: ".jpg" },
  faqHero: { url: px(5405596), ext: ".jpg" },
  contactBg: { url: px(8134173), ext: ".jpg" },
  campusFriends: { url: px(1454360), ext: ".jpg" },
  gradsCelebrate: { url: px(29229903), ext: ".jpg" },

  // Fotografije kampusa za stranice institucija. Isti JSON čita i
  // `src/data/assets.ts` — .mjs ne može da importuje .ts, pa je zajednički
  // izvor JSON umesto da se 50+ URL-ova održava na dva mesta.
  // Wix URL-ovi već nose `/v1/fill/.../photo.jpg` transformaciju: bez nje
  // (`enc_auto` ili goli `/media/` put) Wix vraća AVIF pod .png imenom, a
  // takav fajl `next/image` ne prepoznaje po ekstenziji.
  ...Object.fromEntries(
    Object.entries(
      JSON.parse(await readFile(path.resolve("src/data/institution-photos.json"), "utf8"))
    ).map(([key, url]) => [key, { url, ext: ".jpg" }])
  ),
};

// `sharp` stiže preko Next-a, nije direktna zavisnost — bez njega se preuzimanje
// odvija normalno, samo izostaje provera kontrasta.
const sharp = await import("sharp").then((m) => m.default).catch(() => null);

/**
 * Logotipi za tamnu podlogu (beo tekst na providnom) su nevidljivi na našim
 * belim pločicama, a preuzimaju se sa HTTP 200 kao i svaki drugi.
 *
 * Meri se NAJTAMNIJI neprozirni piksel, ne udeo tamnih: proređeni logotipi
 * (tanak tekst, puno praznog prostora) imaju mali udeo tamnih piksela ali su
 * savršeno čitljivi, pa bi udeo davao lažne uzbune. Logo za tamnu podlogu
 * nema nijedan tamniji piksel — to ga nedvosmisleno odaje.
 * Vraća luminansu najtamnijeg piksela (0–255), ili `null` ako nije slika.
 */
async function darkestPixel(buf) {
  if (!sharp) return null;
  try {
    const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
    const ch = info.channels;
    let darkest = 255;
    for (let i = 0; i < data.length; i += ch) {
      const alpha = ch === 4 ? data[i + 3] : 255;
      if (alpha <= 10) continue;
      const luma = (data[i] + data[i + 1] + data[i + 2]) / 3;
      if (luma < darkest) darkest = luma;
    }
    return Math.round(darkest);
  } catch {
    return null;
  }
}

await mkdir(OUT_DIR, { recursive: true });

/**
 * Zadrži ručno dodate assete (npr. `logoMark` — isečen znak iz logotipa) koje
 * skripta ne preuzima: bez ovoga bi svako pokretanje izbacilo takve ključeve
 * iz manifesta i slika bi pala nazad na CDN URL koji next.config više ne dozvoljava.
 */
const manifest = {};
try {
  const previous = JSON.parse(await readFile(MANIFEST, "utf8"));
  for (const [key, value] of Object.entries(previous)) {
    if (key in ASSETS) continue;
    if (existsSync(path.resolve("public", value.replace(/^\//, "")))) manifest[key] = value;
  }
} catch {
  /* prvi put — manifest još ne postoji */
}
let ok = 0;
let failed = 0;
let lowContrast = 0;

for (const [key, { url, ext, rasterizeWidth }] of Object.entries(ASSETS)) {
  const filename = `${key}${ext}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    let buf = Buffer.from(await res.arrayBuffer());
    if (rasterizeWidth) {
      if (!sharp) throw new Error("rasterizacija SVG-a traži `sharp`");
      buf = await sharp(buf, { density: 400 }).resize({ width: rasterizeWidth }).png().toBuffer();
    }
    await writeFile(path.join(OUT_DIR, filename), buf);
    manifest[key] = `/images/${filename}`;
    ok++;
    console.log(`✓ ${key} → public/images/${filename} (${(buf.length / 1024).toFixed(0)} KB)`);
    if (/^(uni|partner)|Logo$/.test(key)) {
      const darkest = await darkestPixel(buf);
      if (darkest !== null && darkest > 200) {
        lowContrast++;
        console.warn(
          `  ⚠ ${key}: najtamniji piksel je ${darkest}/255 — logo za tamnu ` +
            "podlogu, biće nevidljiv na beloj pločici. Nađi obojenu verziju " +
            "(često postoji na podstranici institucije)."
        );
      }
    }
  } catch (err) {
    failed++;
    console.warn(`✗ ${key}: ${err.message} — ostaje CDN URL`);
  }
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(
  `\nGotovo: ${ok} preuzeto, ${failed} neuspešno` +
    (lowContrast ? `, ${lowContrast} sa slabim kontrastom (vidi ⚠ iznad).` : ".")
);
console.log("Manifest: src/data/assets.local.json");
if (ok > 0) {
  console.log(
    "Slike su sada lokalne. remotePatterns u next.config.ts mogu da se uklone ako je sve preuzeto."
  );
}
