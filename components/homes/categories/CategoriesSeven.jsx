"use client";
import React from "react";
import { topCatagoriesSeven } from "@/data/topCategories";
import Link from "next/link";
import { useRouteLocale } from "@/hooks/useRouteLocale";
import { useTranslate } from "@/hooks/useTranslate";
import { useTranslatedData } from "@/hooks/useTranslatedData";
export default function CategoriesSeven() {
  const locale = useRouteLocale();
  const sectionTitle = useTranslate("Top Categories", locale);
  const sectionText = useTranslate(
    "10,000+ unique online course list designs",
    locale
  );
  const moreText = useTranslate("More", locale);
  const translatedCategories = useTranslatedData(
    topCatagoriesSeven,
    ["title"],
    locale
  );

  return (
    <section className="layout-pt-lg layout-pb-lg">
      <div className="container">
        <div className="row justify-center text-center">
          <div className="col-auto">
            <div className="sectionTitle ">
              <h2 className="sectionTitle__title ">{sectionTitle}</h2>

              <p className="sectionTitle__text ">{sectionText}</p>
            </div>
          </div>
        </div>

        <div className="row x-gap-50 y-gap-30 justify-between pt-60 lg:pt-40">
          {translatedCategories.map((elm, i) => (
            <Link
              href={`/courses-list-${elm.id > 8 ? 1 : elm.id}`}
              className="col-lg-2 linkCustomTwo"
              key={i}
            >
              <h4 className="text-17 fw-500">{elm.title}</h4>
              <div className="y-gap-5 pt-15">
                {elm.items.map((itm, index) => (
                  <div key={index} className="">
                    {itm.title}
                  </div>
                ))}
              </div>
              <div className="d-block underline text-purple-1 fw-500 mt-15 cursor">
                {moreText}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
