import type { AppPathname } from "@/i18n/routing";

/**
 * Tok chata — teme, tipična pitanja uz svaku temu i stranica na koju vodi
 * „Saznaj više". Tekstovi su u messages fajlovima pod `chat.flow.topics.<id>`
 * (`label`, `info` i `faq.<pitanje>.q` / `.a`).
 *
 * Nova tema ili pitanje: dodaj stavku ovde + iste ključeve u sr/en/es.json.
 */
export type ChatTopic = {
  id: string;
  href: AppPathname;
  faqs: readonly string[];
};

export const chatTopics = [
  { id: "europe", href: "/europe", faqs: ["cost", "language", "intake", "choice"] },
  { id: "camps", href: "/summer-camps", faqs: ["discount", "age", "accommodation", "certificate"] },
  { id: "china", href: "/china", faqs: ["scholarship", "language", "timeline", "programs"] },
  { id: "f1", href: "/student-visa-f1", faqs: ["scholarship", "sports", "timeline", "i20"] },
  { id: "b1b2", href: "/tourist-visa-b1-b2", faqs: ["timeline", "documents", "family", "interview"] },
  { id: "usa", href: "/usa-employment", faqs: ["salary", "experience", "jobs", "support"] },
  { id: "other", href: "/faq", faqs: ["start", "experience", "timeline", "offices"] },
] as const satisfies readonly ChatTopic[];

export type ChatTopicId = (typeof chatTopics)[number]["id"];

export function findTopic(id: string | undefined): ChatTopic | undefined {
  return chatTopics.find((topic) => topic.id === id);
}

/** Stranica na kojoj je posetilac → tema koju chat nudi prvu. */
export function topicForPathname(pathname: string): ChatTopicId | undefined {
  return chatTopics.find((topic) => topic.id !== "other" && topic.href === pathname)?.id;
}
