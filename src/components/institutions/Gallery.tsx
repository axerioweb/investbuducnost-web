import Image from "next/image";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

/**
 * Mreža fotografija kampusa.
 *
 * Sve slike su unapred isečene na 16:10 (`w_1600,h_1000` u
 * `institution-photos.json`), pa `aspect-[16/10]` ovde ne kropuje ništa dodatno
 * — samo drži red mreže ujednačenim dok se slike učitavaju. Prva stavka zauzima
 * dve kolone na širokim ekranima da mreža ne bude ravna tabela kartica.
 */
export function Gallery({
  photos,
}: {
  photos: { src: string; alt: string }[];
}) {
  if (photos.length === 0) return null;

  return (
    <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
      {photos.map((photo, i) => {
        // Prva stavka je široka dve kolone kad ih ima bar tri — `sizes` mora to
        // da prati, inače pregledač bira upola manju sliku nego što je prikazuje.
        const wide = photos.length > 2 && i === 0;
        return (
          <RevealItem key={photo.src} className={wide ? "sm:col-span-2" : undefined}>
            <figure className="group relative aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-cloud shadow-[0_10px_30px_rgba(59,130,196,0.10)]">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes={
                  wide
                    ? "(min-width: 1024px) 66vw, (min-width: 640px) 100vw, 100vw"
                    : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                }
                className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
              />
            </figure>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
