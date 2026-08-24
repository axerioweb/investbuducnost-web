"use client";

import { useId, useState } from "react";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Modal } from "@/components/ui/Modal";
import { BrandButton, GhostButton } from "@/components/ui/Buttons";
import { Flag } from "@/components/ui/Flag";
import { ArrowRight } from "@/components/ui/icons";
import {
  DialogHeader,
  DialogSection,
  FactGrid,
  LogoTile,
  Pill,
  ProgramList,
  type Fact,
} from "./parts";

/** Univerzitet sa već prevedenim tekstovima — server razrešava `t()` pozive. */
export type UniversityView = {
  id: string;
  name: string;
  city: string;
  /** ISO 3166-1 alpha-2 — crta se preko `ui/Flag`. */
  countryCode: string;
  logo: string;
  tagline: string;
  about: string;
  founded?: string;
  students?: string;
  campuses?: string;
  tuitionBachelor?: string;
  tuitionMaster?: string;
  living?: string;
  bachelor?: readonly { name: string; years: number }[];
  master?: readonly { name: string; years: number }[];
  hasCamp: boolean;
};

export type UniversityLabels = {
  founded: string;
  students: string;
  campuses: string;
  tuitionBachelor: string;
  tuitionMaster: string;
  living: string;
  about: string;
  bachelor: string;
  master: string;
  programsNote: string;
  year: string;
  years: string;
  more: string;
  close: string;
  cta: string;
  camp: string;
  campBadge: string;
  logoAlt: string;
};

/** `logoAlt` je šablon sa `{name}` — popunjava se nazivom institucije. */
function logoAlt(labels: UniversityLabels, name: string) {
  return labels.logoAlt.replace("{name}", name);
}

export function UniversityGrid({
  universities,
  labels,
}: {
  universities: UniversityView[];
  labels: UniversityLabels;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const uid = useId();
  const active = universities.find((u) => u.id === openId) ?? null;
  const titleId = `${uid}-title`;

  return (
    <>
      <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.04}>
        {universities.map((uni) => (
          <RevealItem key={uni.id} className="h-full">
            {/* Naslov nosi dugme koje se preko `::after` razvlači na celu karticu
                — ceo blok (i logo) je klikabilan, a pristupačno ime dugmeta
                ostaje samo naziv institucije. */}
            <article className="card group relative flex h-full flex-col rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_14px_36px_rgba(59,130,196,0.15)]">
              <div className="relative mb-4 overflow-hidden rounded-xl border border-line bg-cloud transition-colors duration-300 group-hover:border-brand-200 group-hover:bg-brand-50">
                <LogoTile src={uni.logo} alt={logoAlt(labels, uni.name)} />
                {uni.hasCamp && (
                  <span className="absolute right-2 top-2 rounded-full border border-brand-200 bg-white/95 px-2 py-0.5 text-[10px] font-bold text-brand-600 shadow-sm">
                    {labels.campBadge}
                  </span>
                )}
              </div>

              <p className="flex items-center gap-2 text-[13px] font-medium text-mist">
                <Flag code={uni.countryCode} className="h-3 w-[1.125rem]" />
                {uni.city}
              </p>
              <h3 className="mt-1 font-display text-base font-semibold leading-snug text-ink transition-colors group-hover:text-brand-600">
                <button
                  type="button"
                  onClick={() => setOpenId(uni.id)}
                  aria-haspopup="dialog"
                  className="text-left after:absolute after:inset-0 after:rounded-2xl after:content-['']"
                >
                  {uni.name}
                </button>
              </h3>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-body">
                {uni.tagline}
              </p>

              <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
                {uni.founded && <Pill>{uni.founded}</Pill>}
                {uni.students && <Pill>{uni.students}</Pill>}
                <span className="ml-auto inline-flex items-center gap-1 text-[13px] font-semibold text-brand-600">
                  {labels.more}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>

      <Modal
        open={active !== null}
        onClose={() => setOpenId(null)}
        labelledBy={titleId}
        closeLabel={labels.close}
      >
        {active && <UniversityDetails uni={active} labels={labels} titleId={titleId} />}
      </Modal>
    </>
  );
}

function UniversityDetails({
  uni,
  labels,
  titleId,
}: {
  uni: UniversityView;
  labels: UniversityLabels;
  titleId: string;
}) {
  const facts: Fact[] = [];
  if (uni.founded) facts.push({ label: labels.founded, value: uni.founded });
  if (uni.students) facts.push({ label: labels.students, value: uni.students });
  if (uni.campuses) facts.push({ label: labels.campuses, value: uni.campuses });
  if (uni.tuitionBachelor)
    facts.push({ label: labels.tuitionBachelor, value: uni.tuitionBachelor });
  if (uni.tuitionMaster) facts.push({ label: labels.tuitionMaster, value: uni.tuitionMaster });
  if (uni.living) facts.push({ label: labels.living, value: uni.living });

  return (
    <>
      <DialogHeader
        logo={uni.logo}
        logoAlt={logoAlt(labels, uni.name)}
        titleId={titleId}
        title={uni.name}
        location={
          <>
            <Flag code={uni.countryCode} className="h-3 w-[1.125rem]" />
            {uni.city}
          </>
        }
      />

      <div className="space-y-7 overflow-y-auto px-5 py-6 md:px-7 md:py-7">
        <FactGrid facts={facts} />

        <DialogSection title={labels.about}>
          <p className="text-sm leading-relaxed text-slate-body md:text-[15px]">{uni.about}</p>
        </DialogSection>

        {uni.bachelor && uni.bachelor.length > 0 && (
          <DialogSection title={labels.bachelor}>
            <ProgramList
              programs={uni.bachelor}
              yearLabel={labels.year}
              yearsLabel={labels.years}
            />
          </DialogSection>
        )}

        {uni.master && uni.master.length > 0 && (
          <DialogSection title={labels.master}>
            <ProgramList programs={uni.master} yearLabel={labels.year} yearsLabel={labels.years} />
          </DialogSection>
        )}

        {(uni.bachelor || uni.master) && (
          <p className="text-[13px] leading-relaxed text-mist">{labels.programsNote}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-line bg-white px-5 py-4 md:px-7">
        {uni.hasCamp && <GhostButton href="/summer-camps">{labels.camp}</GhostButton>}
        <BrandButton href="/contact">{labels.cta}</BrandButton>
      </div>
    </>
  );
}
