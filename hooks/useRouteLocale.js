"use client";

import { usePathname } from "next/navigation";
import { getLocaleFromPathname } from "@/utils/routeLocale";

export function useRouteLocale(fallback = "fr") {
  const pathname = usePathname();
  return getLocaleFromPathname(pathname, fallback);
}
