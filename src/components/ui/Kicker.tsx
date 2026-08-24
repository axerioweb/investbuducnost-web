import { Fragment } from "react";
import { Spark } from "./icons";

/**
 * Nadnaslov sekcije („Studije · Vize · Putovanja", „SAD · Karijera").
 *
 * Prevodi razdvajaju pojmove znakom „·". Ta interpunkcijska tačka sedi na
 * sredini malog slova, pa u verzalnom tekstu sa razmakom `0.22em` vizuelno
 * pada prenisko i utapa se u slova. Zato se ovde deli tekst i umesto nje crta
 * `Spark` — mikro-znak brenda koji je stvarno centriran i ima svoj vazduh.
 *
 * Razdvajač ostaje samo grafika: čitač ekrana čita „Studije Vize Putovanja",
 * kao što bi i pročitao tekst sa tačkom.
 */
export function Kicker({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const parts = text
    .split("·")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length < 2) return <>{text}</>;

  return (
    <span
      className={`inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 align-middle ${className}`}
    >
      {parts.map((part, i) => (
        <Fragment key={i}>
          {i > 0 && <Spark className="h-1.5 w-1.5 shrink-0 opacity-70" />}
          <span>{part}</span>
        </Fragment>
      ))}
    </span>
  );
}
