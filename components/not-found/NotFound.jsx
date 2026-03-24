import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="no-page layout-pt-lg layout-pb-lg bg-beige-1">
      <div className="container">
        <div className="row y-gap-50 justify-between items-center">
          <div className="col-lg-6">
            <div className="no-page__img">
              <Image
                width={630}
                height={480}
                src="/assets/img/404/1.svg"
                alt="image"
              />
            </div>
          </div>

          <div className="col-xl-5 col-lg-6">
            <div className="no-page__content">
              <h1 className="no-page__main text-dark-1">
                40<span className="text-purple-1">4</span>
              </h1>
              <h2 className="text-35 lh-12 mt-5">
                Oups ! On dirait que vous êtes perdu.
              </h2>
              <div className="mt-10">
                La page que vous cherchez n'est pas disponible. Essayez de
                rechercher à nouveau
                <br /> ou utilisez le bouton pour y aller.
              </div>
              <Link
                href="/signup"
                className="button -md -purple-1 text-white mt-20"
              >
                Retourner à la page d'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
