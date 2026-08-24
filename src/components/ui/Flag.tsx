import type { ReactNode } from "react";

/**
 * Zastave kao SVG — zamena za emodži zastavice (🇷🇸, 🇸🇮, 🇭🇺…).
 *
 * Emodži zastava je par „regional indicator" slova koji font mora da spoji u
 * jedan znak. Windows to NIKAD ne radi (sistemski font nema zastave), pa se
 * 🇷🇸 tamo prikazuje kao slova „RS", a na macOS-u/Androidu kao sličica —
 * isti sajt izgleda potpuno drugačije po platformama. SVG je svuda isti.
 *
 * Crtež je namerno pojednostavljen: na 21×14 px grbovi i heraldika se ionako
 * ne raspoznaju, pa se koriste zvanične boje i osnovna polja zastave.
 * Zaokruživanje ivica radi `overflow-hidden` na omotaču, a ne `clipPath` —
 * `clipPath` traži jedinstven `id`, a isti kôd zastave se na strani ponavlja.
 */

/** Zvanične boje polja — jedno mesto za sve zastave. */
const c = {
  white: "#ffffff",
  rsRed: "#c6363c",
  rsBlue: "#0c4076",
  meRed: "#c40308",
  meGold: "#d3af3b",
  siBlue: "#0c51a0",
  siRed: "#e03c31",
  siStar: "#ffdf00",
  huRed: "#cd2a3e",
  huGreen: "#436f4d",
  trRed: "#e30a17",
  cyCopper: "#d57800",
  cyGreen: "#4e5b31",
  chRed: "#da291c",
  deBlack: "#141414",
  deRed: "#dd0000",
  deGold: "#ffce00",
  esRed: "#aa151b",
  esGold: "#f1bf00",
  nlRed: "#ae1c28",
  nlBlue: "#21468b",
  bgGreen: "#00966e",
  bgRed: "#d62612",
  itGreen: "#008c45",
  itRed: "#cd212a",
  atRed: "#ed2939",
  ruBlue: "#0039a6",
  ruRed: "#d52b1e",
  plRed: "#dc143c",
  gbBlue: "#012169",
  gbRed: "#c8102e",
} as const;

/** Vodoravna trobojka — najčešći oblik, po trećinama visine. */
function Tricolor({ top, mid, bottom }: { top: string; mid: string; bottom: string }) {
  return (
    <>
      <rect width="24" height="5.34" fill={top} />
      <rect y="5.33" width="24" height="5.34" fill={mid} />
      <rect y="10.66" width="24" height="5.34" fill={bottom} />
    </>
  );
}

/** Petokraka zvezdica — turska zastava. */
function Star({ x, y, fill }: { x: number; y: number; fill: string }) {
  return (
    <path
      transform={`translate(${x} ${y})`}
      fill={fill}
      d="M0-1.7.4-.55 1.62-.52.65.21 1 1.38 0 .68-1 1.38l.35-1.17-.97-.73L-.4-.55z"
    />
  );
}

/** Crteži po ISO 3166-1 alpha-2 kôdu, u okviru 24×16. */
const FLAGS: Record<string, ReactNode> = {
  RS: <Tricolor top={c.rsRed} mid={c.rsBlue} bottom={c.white} />,

  ME: (
    <>
      <rect width="24" height="16" fill={c.meRed} />
      <rect
        x="0.85"
        y="0.85"
        width="22.3"
        height="14.3"
        fill="none"
        stroke={c.meGold}
        strokeWidth="1.5"
      />
      <g fill={c.meGold}>
        {/* Dvoglavi orao — silueta: krila, dve glave, telo */}
        <path d="M5.4 8.4 12 6.1l6.6 2.3-6.6 2.1z" />
        <circle cx="10.4" cy="5.2" r=".95" />
        <circle cx="13.6" cy="5.2" r=".95" />
        <path d="M11 10.3h2l-.35 2.9h-1.3z" />
      </g>
    </>
  ),

  SI: (
    <>
      <Tricolor top={c.white} mid={c.siBlue} bottom={c.siRed} />
      {/* Grb: plavi štit sa Triglavom i tri zvezde */}
      <path
        d="M3.4 1.5h4.7v3.7c0 1.7-1.3 2.9-2.35 3.4C4.7 8.1 3.4 6.9 3.4 5.2z"
        fill={c.siBlue}
        stroke={c.siRed}
        strokeWidth=".55"
      />
      <path d="M5.75 4 7.3 6.5H4.2z" fill={c.white} />
      <path d="M4.2 7.05h3.1v.5H4.2z" fill={c.white} />
      <circle cx="4.6" cy="2.6" r=".38" fill={c.siStar} />
      <circle cx="6.9" cy="2.6" r=".38" fill={c.siStar} />
      <circle cx="5.75" cy="3.5" r=".38" fill={c.siStar} />
    </>
  ),

  HU: <Tricolor top={c.huRed} mid={c.white} bottom={c.huGreen} />,

  TR: (
    <>
      <rect width="24" height="16" fill={c.trRed} />
      {/* Polumesec: beli krug iz koga crveni krug „izgriza" srp */}
      <circle cx="9.6" cy="8" r="3.4" fill={c.white} />
      <circle cx="10.9" cy="8" r="2.7" fill={c.trRed} />
      <Star x={14.6} y={8} fill={c.white} />
    </>
  ),

  CY: (
    <>
      <rect width="24" height="16" fill={c.white} />
      {/* Silueta ostrva */}
      <path
        d="m7.6 5.6 2.8-.6 2.1.6 2.6-.35 1.5.85-1.3 1.2-2.5.6-2.7-.2-1.7.95-.8-1.15z"
        fill={c.cyCopper}
      />
      {/* Dve maslinove grančice */}
      <g fill="none" stroke={c.cyGreen} strokeWidth=".7" strokeLinecap="round">
        <path d="M11.3 9.6c-1.1.9-1.6 2-1.5 3.2" />
        <path d="M12.7 9.6c1.1.9 1.6 2 1.5 3.2" />
      </g>
      <g fill={c.cyGreen}>
        <circle cx="10.3" cy="10.9" r=".42" />
        <circle cx="9.8" cy="12.1" r=".42" />
        <circle cx="13.7" cy="10.9" r=".42" />
        <circle cx="14.2" cy="12.1" r=".42" />
      </g>
    </>
  ),

  CH: (
    <>
      <rect width="24" height="16" fill={c.chRed} />
      <rect x="10.4" y="3.2" width="3.2" height="9.6" fill={c.white} />
      <rect x="7.2" y="6.4" width="9.6" height="3.2" fill={c.white} />
    </>
  ),

  DE: <Tricolor top={c.deBlack} mid={c.deRed} bottom={c.deGold} />,

  ES: (
    <>
      <rect width="24" height="16" fill={c.esRed} />
      <rect y="4" width="24" height="8" fill={c.esGold} />
    </>
  ),

  NL: <Tricolor top={c.nlRed} mid={c.white} bottom={c.nlBlue} />,

  BG: <Tricolor top={c.white} mid={c.bgGreen} bottom={c.bgRed} />,

  IT: (
    <>
      <rect width="8" height="16" fill={c.itGreen} />
      <rect x="8" width="8" height="16" fill={c.white} />
      <rect x="16" width="8" height="16" fill={c.itRed} />
    </>
  ),

  AT: <Tricolor top={c.atRed} mid={c.white} bottom={c.atRed} />,

  RU: <Tricolor top={c.white} mid={c.ruBlue} bottom={c.ruRed} />,

  PL: (
    <>
      <rect width="24" height="8" fill={c.white} />
      <rect y="8" width="24" height="8" fill={c.plRed} />
    </>
  ),

  GB: (
    <>
      <rect width="24" height="16" fill={c.gbBlue} />
      <g fill="none">
        <path d="M0 0 24 16M24 0 0 16" stroke={c.white} strokeWidth="3.4" />
        <path d="M0 0 24 16M24 0 0 16" stroke={c.gbRed} strokeWidth="1.7" />
        <path d="M12 0v16M0 8h24" stroke={c.white} strokeWidth="5.4" />
        <path d="M12 0v16M0 8h24" stroke={c.gbRed} strokeWidth="3.2" />
      </g>
    </>
  ),
};

/**
 * Zastava zemlje po ISO 3166-1 alpha-2 kôdu.
 *
 * Dekorativna je (`aria-hidden`) — uz nju uvek stoji ime grada ili zemlje,
 * pa čitač ekrana ne bi imao šta novo da saopšti.
 */
export function Flag({
  code,
  className = "h-4 w-6",
}: {
  code: string;
  className?: string;
}) {
  const art = FLAGS[code.toUpperCase()];

  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 overflow-hidden rounded-[3px] bg-brand-100 shadow-[inset_0_0_0_1px_rgba(22,39,61,0.12)] ${className}`}
    >
      {art && (
        <svg
          viewBox="0 0 24 16"
          className="h-full w-full"
          preserveAspectRatio="xMidYMid slice"
          role="presentation"
        >
          {art}
        </svg>
      )}
    </span>
  );
}
