import { geolocation } from "@vercel/functions";
import { NextRequest, NextResponse } from "next/server";
import countries from "@/utils/countries.json";

const i18n = {
  defaultLocale: "pt",
  locales: ["en", "pt"],
} as const;

export type Locale = (typeof i18n)["locales"][number];

function getLocale(request: NextRequest) {
  const { country } = geolocation(request);
  console.info({ country });
  return countries.find(
    (x) => x.id["ISO-3166-1-ALPHA-2"] === (country ?? "BR")
  )!;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    if (locale.id["ISO-3166-1-ALPHA-2"] === "BR") {
      return NextResponse.rewrite(new URL(`/pt${pathname}`, request.url));
    }
    return NextResponse.redirect(new URL(`/${"en"}/${pathname}`, request.url));
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
