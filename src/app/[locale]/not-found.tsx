import { useTranslations } from "next-intl";
import { BrandButton } from "@/components/ui/Buttons";

export default function NotFoundPage() {
  const t = useTranslations("notFound");

  return (
    <section className="flex min-h-svh flex-col items-center justify-center bg-cloud px-6 text-center">
      <p className="font-display text-8xl font-bold text-brand-gradient">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-ink">{t("title")}</h1>
      <p className="mt-2 max-w-md text-sm text-slate-body">{t("text")}</p>
      <div className="mt-8">
        <BrandButton href="/">{t("button")}</BrandButton>
      </div>
    </section>
  );
}
