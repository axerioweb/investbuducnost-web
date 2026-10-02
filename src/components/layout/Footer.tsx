import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { site } from "@/data/site";
import { asset } from "@/data/assets";
import { Flag } from "@/components/ui/Flag";
import { FacebookIcon, InstagramIcon } from "@/components/ui/icons";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-navy-900 text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-400 via-brand-500 to-navy-800" />
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <Image
                src={asset("logoMark")}
                alt=""
                width={44}
                height={44}
                className="h-11 w-11 rounded-full bg-white object-contain ring-2 ring-brand-400/60"
              />
              <span className="font-display text-sm font-bold tracking-wide text-white">
                INVEST <span className="text-brand-300">BUDUĆNOST</span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/70">{t("tagline")}</p>
            <p className="mt-3 text-xs text-white/50">{t("availability")}</p>
            <div className="mt-5 flex gap-3">
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-brand-300 hover:bg-brand-500 hover:text-white"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-brand-300 hover:bg-brand-500 hover:text-white"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <nav aria-label={t("explore")}>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">
              {t("explore")}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {(
                [
                  ["europe", "/europe"],
                  ["camps", "/summer-camps"],
                  ["china", "/china"],
                  ["about", "/about"],
                  ["faq", "/faq"],
                ] as const
              ).map(([key, href]) => (
                <li key={key}>
                  <Link href={href} className="text-white/70 transition-colors hover:text-brand-300">
                    {nav(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-label={t("services")}>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">
              {t("services")}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {(
                [
                  ["f1", "/student-visa-f1"],
                  ["b1b2", "/tourist-visa-b1-b2"],
                  ["usa", "/usa-employment"],
                  ["contact", "/contact"],
                ] as const
              ).map(([key, href]) => (
                <li key={key}>
                  <Link href={href} className="text-white/70 transition-colors hover:text-brand-300">
                    {nav(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">
              {t("contact")}
            </h3>
            <address className="space-y-1.5 text-sm not-italic text-white/70">
              <p>{site.offices[0].address}</p>
              <p>
                <a href={`tel:${site.offices[0].phones[0].tel}`} className="hover:text-brand-300">
                  {site.offices[0].phones[0].number}
                </a>
              </p>
              <p>
                <a href={`mailto:${site.email}`} className="hover:text-brand-300">
                  {site.email}
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 md:flex-row">
          <p>
            © {year} {site.name}. {t("rights")}
          </p>
          <Link href="/privacy" className="transition-colors hover:text-brand-300">
            {t("privacy")}
          </Link>
          <p className="flex items-center gap-2">
            {site.offices.map((office) => (
              <Flag key={office.id} code={office.countryCode} className="h-3 w-[1.125rem]" />
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
