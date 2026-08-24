import { Reveal } from "./Reveal";
import { Kicker } from "./Kicker";

/** Standardizovan naslov sekcije: kicker + naslov + opcioni podnaslov. */
export function SectionHeading({
  kicker,
  title,
  subtitle,
  align = "center",
  tone = "light",
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  tone?: "light" | "dark";
}) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";
  const titleColor = tone === "dark" ? "text-white" : "text-ink";
  const subColor = tone === "dark" ? "text-white/90" : "text-slate-body";
  const kickerColor = tone === "dark" ? "text-white" : "text-brand-600";
  return (
    <Reveal className={`max-w-3xl ${align === "center" ? "mx-auto" : ""} mb-12 md:mb-16`}>
      {kicker && (
        <p
          className={`mb-3 text-[13px] font-semibold uppercase tracking-[0.22em] ${kickerColor} ${alignCls}`}
        >
          <Kicker text={kicker} />
        </p>
      )}
      <h2
        className={`font-display text-3xl font-bold leading-tight md:text-[2.6rem] ${titleColor} ${alignCls}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-base leading-relaxed md:text-lg ${subColor} ${alignCls}`}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
