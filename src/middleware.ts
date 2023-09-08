import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextRequest, NextResponse } from "next/server";

const i18n = {
  defaultLocale: "pt",
  locales: ["en", "pt"],
} as const;

export type Locale = (typeof i18n)["locales"][number];

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  // @ts-ignore locales
  const locales: string[] = i18n.locales;
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  );
  const userLocale = matchLocale(languages, locales, i18n.defaultLocale);

  if (userLocale !== i18n.defaultLocale) {
    return "en";
  }
  return "pt";
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    if (locale === "pt") {
      return NextResponse.rewrite(
        new URL(`/${locale}${pathname}`, request.url)
      );
    }
    return NextResponse.redirect(new URL(`/${"en"}/${pathname}`, request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
