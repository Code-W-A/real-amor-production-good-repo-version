"use client";

import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

export default function FinishedQuizComp({ translatedLinks }) {
  const router = useRouter();

  return (
    <section className="layout-pt-lg pt-120 layout-pb-md">
      <div className="container">
        <div className="row justify-center text-center">
          <div className="col-lg-6 col-md-8 col-sm-10">
            <div className="sectionTitle">
              <h2 className="sectionTitle__title">
                {translatedLinks.chestionarFinalizatText}
              </h2>
              <p className="sectionTitle__text">
                {translatedLinks.chestionarFinalizatMultiText}
              </p>
            </div>

            <div className="priceCard -type-1 rounded-16 bg-white shadow-2 mt-40">
              <div className="priceCard__content py-45 px-60 xl:px-40 text-center">
                <Image
                  width={150}
                  height={150}
                  className="mt-30"
                  src="/assets/img/confirmare-plata.png" // Poti schimba iconița dacă e necesar
                  alt="success-icon"
                />
                <div className="priceCard__text text-center pr-15 mt-40">
                  {translatedLinks.chestionarFinalizatSuccesText}
                </div>

                <div className="col-auto mt-40">
                  <div className="row x-gap-10 y-gap-10 justify-center">
                    <div className="col-auto">
                      <button
                        className="button px-40 py-20 fw-500 -purple-1 text-white"
                        onClick={() => router.push("/pricing")}
                      >
                        {
                          translatedLinks.chestionarFinalizatPaginaPrincipalaText
                        }
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
