"use client";

import { useId, useState } from "react";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Modal } from "@/components/ui/Modal";
import { BrandButton, GhostButton } from "@/components/ui/Buttons";
import { Flag } from "@/components/ui/Flag";
import { ArrowRight } from "@/components/ui/icons";
import {
  ChipList,
  CheckList,
  DialogHeader,
  DialogSection,
  FactGrid,
  LogoTile,
  Pill,
  type Fact,
} from "./parts";

/** Kamp sa već prevedenim tekstovima — server komponenta razrešava `t()` pozive. */
export type CampView = {
  id: string;
  name: string;
  university: string;
  city: string;
  /** ISO 3166-1 alpha-2 — crta se preko `ui/Flag`. */
  countryCode: string;
  logo: string;
  price?: string;
  ects?: string;
  age?: string;
  tagline: string;
  about: string;
  duration: string;
  dates: string;
  language: string;
  included: string[];
  activities: string[];
  accommodation: string;
  certificate: string;
};

export type CampLabels = {
  duration: string;
  dates: string;
  price: string;
  onRequest: string;
  age: string;
  language: string;
  ects: string;
  about: string;
  included: string;
  activities: string;
  accommodation: string;
  certificate: string;
  more: string;
  close: string;
  cta: string;
  studies: string;
  logoAlt: string;
  discount: string;
};

/** `logoAlt` je šablon sa `{name}` — popunjava se nazivom institucije. */
function logoAlt(labels: CampLabels, name: string) {
  return labels.logoAlt.replace("{name}", name);
}

export function CampGrid({
  camps,
  labels,
}: {
  camps: CampView[];
  labels: CampLabels;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const uid = useId();
  const active = camps.find((c) => c.id === openId) ?? null;
  const titleId = `${uid}-title`;

  return (
    <>
      <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
        {camps.map((camp) => (
          <RevealItem key={camp.id} className="h-full">
            {/* Kartica je članak sa naslovom; dugme preko `::after` pokriva celu
                površinu — tako je ceo blok (i logo) klikabilan, a pristupačno
                ime dugmeta ostaje samo naziv programa. */}
            <article className="card group relative flex h-full flex-col rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_14px_36px_rgba(59,130,196,0.15)]">
              <div className="relative mb-4 overflow-hidden rounded-xl border border-line bg-cloud transition-colors duration-300 group-hover:border-brand-200 group-hover:bg-brand-50">
                <LogoTile src={camp.logo} alt={logoAlt(labels, camp.university)} />
                <span className="absolute right-2 top-2 rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                  {labels.discount}
                </span>
              </div>

              <p className="flex items-center gap-2 text-[13px] font-medium text-mist">
                <Flag code={camp.countryCode} className="h-3 w-[1.125rem]" />
                {camp.city}
              </p>
              <h3 className="mt-1 font-display text-base font-semibold leading-snug text-ink transition-colors group-hover:text-brand-600">
                <button
                  type="button"
                  onClick={() => setOpenId(camp.id)}
                  aria-haspopup="dialog"
                  className="text-left after:absolute after:inset-0 after:rounded-2xl after:content-['']"
                >
                  {camp.name}
                </button>
              </h3>
              <p className="mt-0.5 text-[13px] text-slate-body">{camp.university}</p>
              <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-slate-body">
                {camp.tagline}
              </p>

              <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
                <Pill>{camp.duration}</Pill>
                {camp.ects && <Pill>{camp.ects}</Pill>}
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
        {active && <CampDetails camp={active} labels={labels} titleId={titleId} />}
      </Modal>
    </>
  );
}

function CampDetails({
  camp,
  labels,
  titleId,
}: {
  camp: CampView;
  labels: CampLabels;
  titleId: string;
}) {
  const facts: Fact[] = [
    { label: labels.duration, value: camp.duration },
    { label: labels.dates, value: camp.dates },
    { label: labels.price, value: camp.price ?? labels.onRequest },
    { label: labels.language, value: camp.language },
  ];
  if (camp.age) facts.push({ label: labels.age, value: camp.age });
  if (camp.ects) facts.push({ label: labels.ects, value: camp.ects });

  return (
    <>
      <DialogHeader
        logo={camp.logo}
        logoAlt={logoAlt(labels, camp.university)}
        titleId={titleId}
        title={camp.name}
        subtitle={camp.university}
        location={
          <>
            <Flag code={camp.countryCode} className="h-3 w-[1.125rem]" />
            {camp.city}
          </>
        }
      />

      <div className="space-y-7 overflow-y-auto px-5 py-6 md:px-7 md:py-7">
        <FactGrid facts={facts} />

        <DialogSection title={labels.about}>
          <p className="text-sm leading-relaxed text-slate-body md:text-[15px]">{camp.about}</p>
        </DialogSection>

        <DialogSection title={labels.included}>
          <CheckList items={camp.included} />
        </DialogSection>

        <DialogSection title={labels.activities}>
          <ChipList items={camp.activities} />
        </DialogSection>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-line bg-cloud p-4">
            <h3 className="font-display text-[13px] font-bold uppercase tracking-[0.14em] text-brand-600">
              {labels.accommodation}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-body">{camp.accommodation}</p>
          </div>
          <div className="rounded-2xl border border-line bg-cloud p-4">
            <h3 className="font-display text-[13px] font-bold uppercase tracking-[0.14em] text-brand-600">
              {labels.certificate}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-body">{camp.certificate}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-line bg-white px-5 py-4 md:px-7">
        <GhostButton href="/europe">{labels.studies}</GhostButton>
        <BrandButton href="/contact">{labels.cta}</BrandButton>
      </div>
    </>
  );
}
