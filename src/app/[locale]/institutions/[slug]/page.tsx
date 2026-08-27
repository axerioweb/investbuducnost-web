import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildInstitutionMetadata, absoluteUrl } from "@/lib/seo";
import { getPathname, Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { asset } from "@/data/assets";
import { type Tuition } from "@/data/catalog";
import { getInstitutionBySlug, institutions } from "@/data/institutions";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaSection } from "@/components/ui/CtaSection";
import { GhostButton } from "@/components/ui/Buttons";
import { ArrowRight, Check } from "@/components/ui/icons";
import { Flag } from "@/components/ui/Flag";
import { InstitutionHero } from "@/components/institutions/InstitutionHero";
import { Gallery } from "@/components/institutions/Gallery";
import {
  CheckList,
  ChipList,
  FactGrid,
  LogoTile,
  ProgramList,
  type Fact,
} from "@/components/institutions/parts";
import {
  InstitutionJsonLd,
  InstitutionBreadcrumbJsonLd,
} from "@/components/seo/JsonLd";

type Props = { params: Promise<{ locale: string; slug: string }> };

/** Sve kombinacije jezika i institucija se generišu unapred — stranice su SSG. */
export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    institutions.map((i) => ({ locale, slug: i.slug }))
  );
}

const img = (key: string) => asset(key as Parameters<typeof asset>[0]);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const record = getInstitutionBySlug(slug);
  if (!record) return {};
  const t = await getTranslations({ locale, namespace: `institutions.${record.id}` });
  return buildInstitutionMetadata({
    locale,
    slug,
    name: record.university?.name ?? record.camp?.university ?? "",
    description: t("metaDescription"),
    image: img(record.photos[0]),
  });
}

export default async function InstitutionPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const record = getInstitutionBySlug(slug);
  if (!record) notFound();

  const { university: uni, camp } = record;
  const t = await getTranslations("institution");
  const common = await getTranslations("common");
  const detail = await getTranslations("europe.detail");
  const europe = await getTranslations("europe");
  const camps = await getTranslations("camps");
  const nav = await getTranslations("nav");
  const campDetail = await getTranslations("camps.detail");
  const content = await getTranslations(`institutions.${record.id}`);

  const name = uni?.name ?? camp?.university ?? "";
  const city = uni?.city ?? camp?.city ?? "";
  const country = uni?.country ?? camp?.country ?? "";
  const logo = img(uni?.logo ?? camp?.logo ?? "logo");

  /** „7.050 €" + „po semestru" — iznos je podatak, period se prevodi. */
  const money = (tuition?: Tuition) => {
    if (!tuition) return undefined;
    const per =
      tuition.per === "year"
        ? common("perYear")
        : tuition.per === "semester"
          ? common("perSemester")
          : common("total");
    return `${tuition.amount} ${per}`;
  };

  const facts: Fact[] = [];
  if (uni?.founded) facts.push({ label: detail("founded"), value: String(uni.founded) });
  if (uni?.students) facts.push({ label: detail("students"), value: uni.students });
  if (uni?.campuses) facts.push({ label: detail("campuses"), value: uni.campuses.join(" · ") });
  if (uni?.tuitionBachelor)
    facts.push({ label: detail("tuitionBachelor"), value: money(uni.tuitionBachelor)! });
  if (uni?.tuitionMaster)
    facts.push({ label: detail("tuitionMaster"), value: money(uni.tuitionMaster)! });
  if (uni?.living)
    facts.push({ label: detail("living"), value: `${uni.living} ${common("perMonth")}` });

  // Pilule u hero sekciji su najkraće činjenice — godina i broj studenata.
  const pills: string[] = [];
  if (uni?.founded) pills.push(`${detail("founded")} ${uni.founded}`);
  if (uni?.students) pills.push(`${uni.students} ${detail("students").toLowerCase()}`);
  if (camp) pills.push(detail("campBadge"));

  /**
   * Alt fotografije. Za tri institucije bez ijedne svoje fotografije hero je
   * snimak njihovog grada, pa alt to i kaže — inače bi tvrdio da čitalac gleda
   * kampus koji na slici ne postoji.
   */
  const photoAlt = (index: number) =>
    record.cityPhoto
      ? t("cityPhotoAlt", { name, city })
      : t("photoAlt", { name, city, index: index + 1, total: record.photos.length });

  const highlights = content.raw("highlights") as string[];
  const documents = content.raw("documents") as string[];
  const gallery = record.photos.slice(1).map((key, i) => ({
    src: img(key),
    alt: photoAlt(i + 1),
  }));

  const hasPrograms = Boolean(uni?.bachelor?.length || uni?.master?.length);

  // Činjenice o kampu — isti skup koji je ranije stajao u dijalogu. `ageMin`/
  // `ageMax` postoje samo za deo programa, pa se uzrast dodaje uslovno.
  const campFacts: Fact[] = [];
  if (camp) {
    const age =
      camp.ageMin && camp.ageMax
        ? campDetail("ageRange", { min: camp.ageMin, max: camp.ageMax })
        : camp.ageMin
          ? campDetail("agePlus", { min: camp.ageMin })
          : undefined;
    campFacts.push(
      { label: common("duration"), value: camps(`items.${camp.id}.duration`) },
      { label: campDetail("dates"), value: camps(`items.${camp.id}.dates`) },
      { label: common("price"), value: camp.price ?? campDetail("onRequest") },
      { label: campDetail("language"), value: camps(`items.${camp.id}.language`) }
    );
    if (age) campFacts.push({ label: campDetail("age"), value: age });
    if (camp.ects) campFacts.push({ label: campDetail("ects"), value: camp.ects });
  }

  /**
   * Sekcije se smenjuju bela → `cloud` → bela. Pola sekcija je opciono
   * (programi, galerija, kamp), pa se pozadina ne može upisati u svaku
   * pojedinačno: čim jedna izostane, dve susedne ispadnu iste boje.
   *
   * Zato se boje dodeljuju unapred, po spisku sekcija koje se stvarno
   * renderuju. Brojač koji se pomera u toku JSX-a bio bi kraći, ali React
   * compiler s pravom zabranjuje mutaciju tokom rendera.
   */
  const rendered = [
    "about",
    ...(hasPrograms ? ["programs"] : []),
    "campus",
    "admissions",
    ...(gallery.length > 0 ? ["gallery"] : []),
    ...(camp ? ["camp"] : []),
    "related",
  ];
  const tone = Object.fromEntries(
    // Sekcija „U kratkim crtama" iznad je bela, pa smenjivanje kreće od `cloud`.
    rendered.map((key, i) => [key, i % 2 === 0 ? "bg-cloud" : "bg-white"])
  ) as Record<string, string>;
  const pageUrl = absoluteUrl(
    getPathname({ locale, href: { pathname: "/institutions/[slug]", params: { slug } } })
  );

  /**
   * Do tri „slične institucije": najviše dve iz iste zemlje, ostatak ciklično
   * od trenutne pozicije u spisku.
   *
   * Ciklus (a ne abecedni red) zato što bi abecedno svaka stranica bez zemljaka
   * nudila iste tri institucije na „A".
   *
   * Samo JEDAN slot ide zemljaku, iako ih ponekad ima više: grupe iz iste
   * zemlje inače pojedu sve slotove — četiri španske institucije stoje blizu
   * jedna drugoj u spisku i međusobno popunjavaju sve preporuke, pa institucije
   * oko njih ostaju bez ijednog ulaznog linka sa srodne stranice. Sa jednim
   * rezervisanim slotom preostala dva uvek uzimaju susede na rastojanju 1 i 2,
   * čime svaka institucija dobija najmanje dva ulazna linka (plus link sa
   * pregleda Evrope). Sve je determinističko — statički generisane stranice
   * ostaju iste između build-ova.
   */
  const self = institutions.findIndex((i) => i.slug === slug);
  const candidates = institutions
    .map((i, index) => ({
      i,
      u: getInstitutionBySlug(i.slug)!,
      distance: (index - self + institutions.length) % institutions.length,
    }))
    .filter((r) => r.distance !== 0)
    .sort((a, b) => a.distance - b.distance);

  const sameCountry = candidates
    .filter((r) => r.u.university?.country === country)
    .slice(0, 1);
  const related = [
    ...sameCountry,
    ...candidates.filter((r) => !sameCountry.includes(r)),
  ].slice(0, 3);

  return (
    <>
      <InstitutionBreadcrumbJsonLd locale={locale} slug={slug} name={name} />
      <InstitutionJsonLd
        name={name}
        description={content("intro")}
        url={pageUrl}
        website={record.website}
        image={absoluteUrl(img(record.photos[0]))}
        city={city}
        country={country}
        founded={uni?.founded}
      />

      <InstitutionHero
        name={name}
        city={city}
        countryCode={country}
        logo={logo}
        logoAlt={detail("logoAlt", { name })}
        image={img(record.photos[0])}
        imageAlt={photoAlt(0)}
        kicker={t("kicker")}
        pills={pills}
        actions={
          <a
            href={record.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-[13px] font-semibold text-white backdrop-blur transition-colors duration-300 hover:bg-white hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {t("website")}
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        }
      />

      {/* Pregled: uvodni pasus + mreža ključnih činjenica */}
      <section className="bg-white px-6 pb-16 pt-14 md:pb-20 md:pt-16">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            {/* Vidljiv breadcrumb prati `InstitutionBreadcrumbJsonLd` — do sada
                je struktura postojala samo za pretraživač, ne i za čitaoca. */}
            <nav aria-label={t("breadcrumb")}>
              <ol className="flex flex-wrap items-center gap-2 text-[13px] font-medium text-mist">
                <li>
                  <Link href="/" className="transition-colors hover:text-brand-600">
                    {nav("home")}
                  </Link>
                </li>
                <li aria-hidden className="text-line">
                  /
                </li>
                <li>
                  <Link href="/europe" className="transition-colors hover:text-brand-600">
                    {europe("hero.title")}
                  </Link>
                </li>
                <li aria-hidden className="text-line">
                  /
                </li>
                <li aria-current="page" className="font-semibold text-ink">
                  {name}
                </li>
              </ol>
            </nav>
            <p className="mt-6 text-lg leading-relaxed text-slate-body md:text-xl">
              {content("intro")}
            </p>
          </Reveal>
          {facts.length > 0 && (
            <Reveal delay={0.1} className="mt-10">
              <h2 className="mb-4 font-display text-[13px] font-bold uppercase tracking-[0.16em] text-brand-600">
                {t("overview")}
              </h2>
              <FactGrid facts={facts} />
            </Reveal>
          )}
        </div>
      </section>

      {/* O instituciji: opis, reputacija i istaknute stavke */}
      <section className={`px-6 py-20 md:py-24 ${tone.about}`}>
        <div className="mx-auto max-w-5xl">
          <SectionHeading align="left" title={t("about")} />
          <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr]">
            <Reveal className="space-y-5">
              <p className="text-base leading-relaxed text-slate-body md:text-[17px]">
                {europe(`items.${record.id}.about`)}
              </p>
              <p className="text-base leading-relaxed text-slate-body md:text-[17px]">
                {content("reputation")}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="card rounded-2xl p-6">
                <h3 className="mb-4 font-display text-[13px] font-bold uppercase tracking-[0.16em] text-brand-600">
                  {t("reputation")}
                </h3>
                <ul className="space-y-3">
                  {highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-body"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Studijski programi */}
      {hasPrograms && (
        <section className={`px-6 py-20 md:py-24 ${tone.programs}`}>
          <div className="mx-auto max-w-5xl">
            <SectionHeading
              align="left"
              title={t("programs")}
              subtitle={t("programsSubtitle")}
            />
            <div className="grid gap-8 lg:grid-cols-2">
              {uni?.bachelor && uni.bachelor.length > 0 && (
                <Reveal>
                  <h3 className="mb-3 font-display text-[13px] font-bold uppercase tracking-[0.16em] text-brand-600">
                    {detail("bachelor")}
                  </h3>
                  <ProgramList
                    programs={uni.bachelor}
                    yearLabel={common("year")}
                    yearsLabel={common("years")}
                  />
                </Reveal>
              )}
              {uni?.master && uni.master.length > 0 && (
                <Reveal delay={0.08}>
                  <h3 className="mb-3 font-display text-[13px] font-bold uppercase tracking-[0.16em] text-brand-600">
                    {detail("master")}
                  </h3>
                  <ProgramList
                    programs={uni.master}
                    yearLabel={common("year")}
                    yearsLabel={common("years")}
                  />
                </Reveal>
              )}
            </div>
            <Reveal delay={0.14}>
              <p className="mt-6 text-[13px] leading-relaxed text-mist">
                {detail("programsNote")}
              </p>
            </Reveal>
          </div>
        </section>
      )}

      {/* Kampus, smeštaj i ishrana */}
      <section className={`px-6 py-20 md:py-24 ${tone.campus}`}>
        <div className="mx-auto max-w-5xl">
          <SectionHeading align="left" title={t("campus")} />
          <Reveal>
            <p className="text-base leading-relaxed text-slate-body md:text-[17px]">
              {content("campus")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Upisni rokovi, stipendije i dokumentacija */}
      <section className={`px-6 py-20 md:py-24 ${tone.admissions}`}>
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2">
          <Reveal>
            <h2 className="mb-4 font-display text-2xl font-bold text-ink md:text-3xl">
              {t("admissions")}
            </h2>
            <p className="text-base leading-relaxed text-slate-body">{content("admissions")}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mb-4 font-display text-2xl font-bold text-ink md:text-3xl">
              {t("documents")}
            </h2>
            <ul className="space-y-2.5">
              {documents.map((doc) => (
                <li
                  key={doc}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-body"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                  {doc}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Fotografije kampusa */}
      {gallery.length > 0 && (
        <section className={`px-6 py-20 md:py-24 ${tone.gallery}`}>
          <div className="mx-auto max-w-7xl">
            <SectionHeading align="left" title={t("gallery")} />
            <Gallery photos={gallery} />
          </div>
        </section>
      )}

      {/* Letnji / zimski program institucije */}
      {camp && (
        <section id="kamp" className={`scroll-mt-24 px-6 py-20 md:py-24 ${tone.camp}`}>
          <div className="mx-auto max-w-5xl">
            <SectionHeading align="left" title={t("campTitle")} subtitle={t("campLead")} />
            <Reveal className="card rounded-3xl p-6 md:p-8">
              <h3 className="font-display text-xl font-bold text-ink md:text-2xl">
                {camp.name}
              </h3>

              <p className="mt-4 text-base leading-relaxed text-slate-body">
                {camps(`items.${camp.id}.about`)}
              </p>

              <div className="mt-6">
                <FactGrid facts={campFacts} />
              </div>

              <div className="mt-7 space-y-6">
                <div>
                  <h4 className="mb-3 font-display text-[13px] font-bold uppercase tracking-[0.16em] text-brand-600">
                    {t("included")}
                  </h4>
                  <CheckList
                    items={
                      camps.raw(
                        `items.${camp.id}.included`
                      ) as string[]
                    }
                  />
                </div>
                <div>
                  <h4 className="mb-3 font-display text-[13px] font-bold uppercase tracking-[0.16em] text-brand-600">
                    {t("activities")}
                  </h4>
                  <ChipList
                    items={
                      camps.raw(
                        `items.${camp.id}.activities`
                      ) as string[]
                    }
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-line bg-cloud p-4">
                    <h4 className="font-display text-[13px] font-bold uppercase tracking-[0.14em] text-brand-600">
                      {t("accommodation")}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-slate-body">
                      {camps(`items.${camp.id}.accommodation`)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-line bg-cloud p-4">
                    <h4 className="font-display text-[13px] font-bold uppercase tracking-[0.14em] text-brand-600">
                      {t("certificate")}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-slate-body">
                      {camps(`items.${camp.id}.certificate`)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-7">
                <GhostButton href="/summer-camps">{t("backToCamps")}</GhostButton>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Slične institucije */}
      <section className={`px-6 py-20 md:py-24 ${tone.related}`}>
        <div className="mx-auto max-w-7xl">
          <SectionHeading align="left" title={t("related")} subtitle={t("relatedSubtitle")} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map(({ i, u }) => {
              const rName = u.university?.name ?? u.camp?.university ?? "";
              const rCity = u.university?.city ?? u.camp?.city ?? "";
              const rCountry = u.university?.country ?? u.camp?.country ?? "";
              return (
                <Reveal key={i.slug} className="h-full">
                  <article className="card group relative flex h-full flex-col rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_14px_36px_rgba(59,130,196,0.15)]">
                    <div className="mb-4 overflow-hidden rounded-xl border border-line bg-cloud transition-colors duration-300 group-hover:border-brand-200 group-hover:bg-brand-50">
                      <LogoTile
                        src={img(u.university?.logo ?? u.camp?.logo ?? "logo")}
                        alt={detail("logoAlt", { name: rName })}
                      />
                    </div>
                    <p className="flex items-center gap-2 text-[13px] font-medium text-mist">
                      <Flag code={rCountry} className="h-3 w-[1.125rem]" />
                      {rCity}
                    </p>
                    <h3 className="mt-1 font-display text-base font-semibold leading-snug text-ink transition-colors group-hover:text-brand-600">
                      <Link
                        href={{ pathname: "/institutions/[slug]", params: { slug: i.slug } }}
                        className="after:absolute after:inset-0 after:rounded-2xl after:content-['']"
                      >
                        {rName}
                      </Link>
                    </h3>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <CtaSection
        title={t("ctaTitle", { name })}
        text={t("ctaText")}
        buttonLabel={t("ctaButton")}
      />
    </>
  );
}
