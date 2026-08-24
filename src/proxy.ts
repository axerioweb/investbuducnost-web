import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Preskoči API rute, Next interne fajlove i statičke resurse
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
