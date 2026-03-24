"use client";
import React from "react";
import { topCatagoriesFive } from "../../../data/topCategories";
import Link from "next/link";
import { useRouteLocale } from "@/hooks/useRouteLocale";
import { useTranslate } from "@/hooks/useTranslate";
import { useTranslatedData } from "@/hooks/useTranslatedData";
export default function CategoriesFive() {
  const locale = useRouteLocale();
  const sectionTitle = useTranslate("Top Categories", locale);
  const sectionText = useTranslate(
    "10,000+ unique online course list designs",
    locale
  );
  const allCategoriesText = useTranslate("All Categories", locale);
  const translatedCategories = useTranslatedData(
    topCatagoriesFive,
    ["title", "courses"],
    locale
  );

  return (
    <section className="layout-pt-md layout-pb-lg">
      <div className="container">
        <div className="row y-gap-20 justify-between items-end">
          <div className="col-auto">
            <div className="sectionTitle ">
              <h2 className="sectionTitle__title ">{sectionTitle}</h2>

              <p className="sectionTitle__text ">{sectionText}</p>
            </div>
          </div>

          <div className="col-auto">
            <a href="#" className="button -icon -purple-3 text-purple-1">
              {allCategoriesText}
              <i className="icon-arrow-top-right text-13 ml-10"></i>
            </a>
          </div>
        </div>

        <div className="row y-gap-30 pt-50">
          {translatedCategories.map((elm, i) => (
            <Link
              href={`/courses-list-${elm.id > 8 ? 1 : elm.id}`}
              className="col-xl-3 col-md-6 linkCustomTwo"
              key={i}
              data-aos="zoom-in"
              data-aos-duration={(i + 1) * 300}
            >
              <div className="categoryCard -type-4">
                <div className="categoryCard__icon bg-light-3">
                  <i className={elm.icon}></i>
                </div>
                <div className="categoryCard__content mt-10">
                  <h4 className="categoryCard__title text-17 fw-500">
                    {elm.title}
                  </h4>
                  <div className="categoryCard__text text-13 text-light-1 lh-1 mt-5">
                    {elm.courses}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
