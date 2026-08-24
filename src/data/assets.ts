/**
 * Mapa svih vizuelnih asseta.
 * - Fotografije: besplatne sa Pexels-a (licenca dozvoljava komercijalnu upotrebu
 *   bez atribucije) + nekoliko originalnih sa starog sajta (logo, studenti).
 * - Pokreni `npm run download-assets` da preuzmeš sve slike u `public/images/`
 *   — skripta generiše `assets.local.json` i slike postaju lokalne.
 */
import localManifest from "./assets.local.json";

const WIX = "https://static.wixstatic.com/media/";
const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1920`;

const remote: Record<string, string> = {
  // Brend i stvarne osobe — sa postojećeg sajta
  logo: `${WIX}36a1e1_e45bb64bef224171939dc5ccba2960cd~mv2.png`,
  // Isečen znak iz logotipa (kapa + ruke) — za kružne prikaze (header, footer, ikone)
  logoMark: `${WIX}36a1e1_e45bb64bef224171939dc5ccba2960cd~mv2.png`,
  ogDefault: `${WIX}36a1e1_0673fc8023014a4d8985a7e171c09722~mv2.png`,
  studentLazar: `${WIX}36a1e1_a8ea2debcc7b43788a7755e3594d5c1a~mv2.png`,
  studentBogdan: `${WIX}36a1e1_b70bf666cee149cf96a1d97f468a2bd5~mv2.png`,
  studentAleksa: `${WIX}36a1e1_ba8064e638fa44fa8cb97f7c0c8a7d58~mv2.png`,
  studentBorivoje: `${WIX}36a1e1_67ac39f39f5949b194c0f68033021641~mv2.png`,
  testimonialAndrej: `${WIX}36a1e1_e5e30d935ae14001a6c082d45088bbdf~mv2.jpeg`,

  // Logotipi partnerskih univerziteta i škola — sa starog sajta
  uniEmuni: `${WIX}36a1e1_cf54461709f34961bba80b2e4d3d89c5~mv2.png`,
  // METU: verzija sa spiska je beo logo za tamnu podlogu — ovo je obojeni
  uniMetu: `${WIX}36a1e1_562686abdef4474ea869fafc13a4a83a~mv2.png`,
  uniAydin: `${WIX}36a1e1_8b2946b4a117465eb934e7d67344a207~mv2.png`,
  uniNicosia: `${WIX}36a1e1_a13359a6c146498ebb9aff0fa3bce254~mv2.png`,
  uniAis: `${WIX}36a1e1_a062022d53f34c22ab21db3b944bbb2d~mv2.png`,
  uniCbs: `${WIX}36a1e1_b3b25357e3604ac8ae73a3b3dfde99df~mv2.png`,
  uniEuBs: `${WIX}36a1e1_863961d415c84d7aa0cb3c4d0574e0c1~mv2.png`,
  uniIbs: `${WIX}36a1e1_58be809b985e46f8b45f6056caa645f3~mv2.png`,
  uniWittenborg: `${WIX}36a1e1_ce6856f1fd974ab499f84b153e487d2d~mv2.png`,
  uniUcam: `${WIX}36a1e1_37718f8c091244f7a3116e542b672328~mv2.png`,
  uniFsm: `${WIX}36a1e1_820240a0af5a454fb31a1886d784872b~mv2.png`,
  uniAubg: `${WIX}36a1e1_0174ff261963476b9425c9ff822eaebb~mv2.png`,
  uniJcu: `${WIX}36a1e1_dd2b834235574628a90d90c5f2d021c5~mv2.png`,
  uniGbsb: `${WIX}36a1e1_7f481ccad23f4e6fbd87e5ba02fdcf75~mv2.png`,
  uniBts: `${WIX}36a1e1_e03953270d6848fa84ffcc6e18a7bf2a~mv2.png`,
  uniHtl: `${WIX}36a1e1_72115830ce78444ea92dc0074911896f~mv2.png`,
  uniMai: `${WIX}36a1e1_de8adff018db4c569c420b33b8c0d915~mv2.png`,
  uniSrh: `${WIX}36a1e1_44077bb2b7064cd3a44cdd6ac05d73cc~mv2.png`,
  uniKozminski: `${WIX}36a1e1_e5c0d759fb2d429cb2840d84dfa7a8ab~mv2.png`,
  uniEuropea: `${WIX}36a1e1_b71dc233833641529073d50425c797b0~mv2.png`,

  // Logotipi partnera sa početne strane — EU Business School, EMUNI i GBSB
  // koriste iste fajlove kao `uniEuBs`, `uniEmuni` i `uniGbsb`
  partnerOxford: `${WIX}36a1e1_4ab3090a6f6f458c894ea45d6dbac29a~mv2.png`,
  partnerSpringfield: `${WIX}36a1e1_cf499c39e33942ca809358a695d07904~mv2.png`,
  partnerSantaRosa: `${WIX}36a1e1_0a70d970de694356ba854366116576fe~mv2.png`,
  partnerCcv: `${WIX}36a1e1_3474ef9a41384662ba028dec648b1645~mv2.png`,
  partnerGca: `${WIX}36a1e1_2eb2631568534aa58ec75aff9c41845e~mv2.png`,
  partnerHoosac: `${WIX}36a1e1_19bc400b60524b84b09b4217d142e099~mv2.png`,
  partnerSwiss: `${WIX}36a1e1_7d94d1e0d16548249ee7385c31632c0a~mv2.png`,
  partnerMoval: "https://www.moval.edu/wp-content/uploads/2026/08/MVU-Logo-2026_Pyramid.png",
  partnerHunter: "https://hunter.cuny.edu/assets/hunter-cuny-logo.v2.png",
  // rasterizovan iz SVG-a skriptom — zato .png, a ne izvorni URL
  partnerXjtlu: "https://www.xjtlu.edu.cn/wp-content/uploads/2024/01/en-header-logo.svg",
  partnerNovotek: "https://novotekmanpower.rs/wp-content/uploads/2025/04/logolevo.webp",

  // Fotografije — Pexels (besplatne)
  heroHome: px(3374249), // krilo aviona iznad oblaka, vedro plavo nebo
  heroEurope: px(34994033), // Prag, istorijska ulica u zlatnom svetlu
  heroCamps: px(5622112), // društvo mladih na travi, sunčan dan
  heroChina: px(25020077), // Šangaj, Oriental Pearl toranj danju
  heroF1: px(35487002), // diplomci slave ispred univerziteta
  heroB1B2: px(27807670), // Njujork iz vazduha, vedro nebo
  heroUsaJobs: px(34902065), // kamion na autoputu sa planinama
  usaJobsTruck: px(27099095), // crveni šleper na otvorenom putu
  usaJobsMoving: px(7464232), // dvojica radnika nose kutije
  usaJobsHospitality: px(33934080), // osoblje restorana u uniformama
  usaJobsCatering: px(34321369), // ketering posluženje na eventu
  aboutHero: px(12903168), // tim sarađuje u svetloj kancelariji
  faqHero: px(5405596), // pasoš, mapa i putne potrepštine
  contactBg: px(8134173), // kolege razgovaraju uz laptop
  campusFriends: px(1454360), // studenti sa rančevima na kampusu
  gradsCelebrate: px(29229903), // diplomci bacaju kape u vazduh
};

const local = localManifest as Record<string, string>;

/** Vrati URL asseta — lokalni ako je preuzet, inače CDN. */
export function asset(key: keyof typeof remote): string {
  return local[key] ?? remote[key];
}

export const assetKeys = Object.keys(remote) as (keyof typeof remote)[];
export { remote as remoteAssets };
