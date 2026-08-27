import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  /**
   * Prozni tekstovi 20 institucija su duži od celog ostatka sajta, pa žive u
   * zasebnom fajlu i spajaju se ovde pod `institutions`. Da su u `<locale>.json`,
   * taj fajl bi bio nepregledan i svaka izmena teksta jedne institucije bi
   * dirala isti fajl kao i navigacija.
   */
  const [messages, institutions] = await Promise.all([
    import(`../messages/${locale}.json`).then((m) => m.default),
    import(`../messages/institutions/${locale}.json`).then((m) => m.default),
  ]);

  return { locale, messages: { ...messages, institutions } };
});
