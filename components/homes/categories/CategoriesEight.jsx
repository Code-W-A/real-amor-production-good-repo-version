"use client";
import Image from "next/image";

import React from "react";
import { topCatagoriesEight } from "../../../data/topCategories";
import Link from "next/link";
import { useRouteLocale } from "@/hooks/useRouteLocale";
import { useTranslate } from "@/hooks/useTranslate";
import { useTranslatedData } from "@/hooks/useTranslatedData";
export default function CategoriesEight() {
  const locale = useRouteLocale();
  const sectionTitle = useTranslate("Top Categories", locale);
  const sectionText = useTranslate(
    "10,000+ unique online course list designs",
    locale
  );
  const coursesSuffix = useTranslate("Courses", locale);
  const translatedCategories = useTranslatedData(topCatagoriesEight, ["title"], locale);

  return (
    <section className="layout-pt-lg layout-pb-md">
      <div className="container">
        <div className="row justify-center text-center">
          <div className="col-auto">
            <div className="sectionTitle ">
              <h2 className="sectionTitle__title ">{sectionTitle}</h2>

              <p className="sectionTitle__text ">{sectionText}</p>
            </div>
          </div>
        </div>

        <div className="row x-gap-40 y-gap-40 justify-between lg:justify-center pt-60 lg:pt-40">
          {translatedCategories.map((elm, i) => (
            <Link
              href={`/courses-list-${elm.id > 8 ? 1 : elm.id}`}
              key={i}
              className="col-lg-auto col-sm-4 col-6 linkCustomTwo"
            >
              <div className="text-center">
                <div className="d-flex justify-center items-center rounded-8 size-90 mx-auto bg-orange-2">
                  <Image width={40} height={40} src={elm.icon} alt="icon" />
                </div>
                <h5 className="text-17 lh-15 fw-500 mt-20">{elm.title}</h5>
                <p className="text-13 lh-1 mt-10">
                  {elm.courses}+ {coursesSuffix}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
