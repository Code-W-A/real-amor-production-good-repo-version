import Link from "next/link";
import React from "react";

export default function PageLinks({ translatedLinks, link2 }) {
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
                <Link href={`/`}>{translatedLinks?.realAmor}</Link>
              </div>
              <div className="breadcrumbs__item">
                <Link href={`/${link2}`}>{translatedLinks?.pricing}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
