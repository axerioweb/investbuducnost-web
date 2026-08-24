import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import { Hero } from "@/components/home/Hero";
import { Services } from "@/components/home/Services";
import { Stats } from "@/components/home/Stats";
import { SuccessStories } from "@/components/home/SuccessStories";
import { Testimonial } from "@/components/home/Testimonial";
import { Partners } from "@/components/home/Partners";
import { CtaSection } from "@/components/ui/CtaSection";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "home", "/");
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home.cta");

  return (
    <>
      <Hero />
      <Services />
      <Stats />
      <SuccessStories />
      <Testimonial />
      <Partners />
      <CtaSection title={t("title")} text={t("text")} buttonLabel={t("button")} />
    </>
  );
}
