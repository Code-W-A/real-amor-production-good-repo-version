import React from "react";
import Link from "next/link";
export default function Join() {
  return (
    <section className="layout-pt-md layout-pb-md bg-purple-1">
      <div className="container">
        <div className="row y-gap-20 justify-between items-center">
          <div className="col-xl-4 col-lg-5">
            <h2 className="text-30 lh-15 text-white">
              Alătură-te celor peste
              <span className="text-green-1"> 8 milioane de persoane</span> care
              caută conexiuni autentice
            </h2>
          </div>

          <div className="col-auto">
            <Link href="#" className="button -md -green-1 text-dark-1">
              Începe să cauți parteneri gratuit
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
