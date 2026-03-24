import Link from "next/link";
import React from "react";
import { normalizeRouteLocale } from "@/utils/routeLocale";

export default function PageLinks({ translatedLinks, link2 }) {
  if (!translatedLinks) {
    return null;
  }

  const locale = normalizeRouteLocale(translatedLinks.lang, "fr");
  const homePath = `/${locale}`;
  const currentPath = link2 ? `${homePath}/${link2}` : homePath;

  return (
    <section className="breadcrumbs">
      <div className="container">
        <div className="row">
          <div className="col-auto">
            <div className="breadcrumbs__content">
              {/* <div className="breadcrumbs__item">
                <Link href={`/`}>{translatedLinks?.home}</Link>
              </div> */}
              <div className="breadcrumbs__item">
                <Link href={homePath}>{translatedLinks.realAmor}</Link>
              </div>
              {link2 && (
                <div className="breadcrumbs__item">
                  <Link href={currentPath}>{translatedLinks.pricing}</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
