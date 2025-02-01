import { NextRequest, NextResponse } from "next/server";

export function middleware(req) {
  const { pathname, searchParams } = req.nextUrl;

  // Excludem rutele care nu trebuie redirecționate, cum ar fi resursele statice și fișierele specifice
  if (
    pathname.startsWith("/_next/static") || // Exclude resursele Next.js generate automat
    pathname.startsWith("/favicon.ico") || // Exclude favicon
    pathname.includes(".") || // Exclude orice fișier ce conține o extensie (ex. .css, .js, .png)
    pathname.startsWith("/api") // Exclude orice API endpoint
  ) {
    return NextResponse.next(); // Permite continuarea fără redirecționare
  }

  // Verificăm dacă există query-ul "lang" în URL și utilizăm valoarea acestuia dacă este prezent
  const langParam = searchParams.get("lang");
  let locale = langParam || req.cookies.get("NEXT_LOCALE")?.value || "fr";

  const url = req.nextUrl.clone();

  if (langParam) {
    // Eliminăm parametrul "lang" din query string
    url.searchParams.delete("lang");

    // Setăm cookie-ul pentru limba selectată
    const response = NextResponse.redirect(url);
    response.cookies.set("NEXT_LOCALE", langParam, {
      path: "/",
      httpOnly: true, // pentru securitate (cookie-ul este accesibil doar serverului)
      secure: process.env.NODE_ENV === "production", // doar prin HTTPS în producție
    });

    return response;
  }

  // Dacă calea nu începe cu limba selectată, facem redirecționarea
  if (!pathname.match(/^\/(en|ro|fr|nl)(\/|$)/)) {
    url.pathname = `/${locale}${pathname}`.replace(/\/\//g, "/");
    return NextResponse.redirect(url);
  }

  return NextResponse.next(); // Permite continuarea dacă ruta începe cu limba corectă
}

// Configurăm middleware-ul pentru a se aplica la toate rutele
export const config = {
  matcher: ["/:path*"], // Aplicăm middleware-ul la toate rutele
};
