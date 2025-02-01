"use client";
import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

export default function CourseCardTwoDash({ data, translatedTexts }) {
  // Verifică dacă `data.images` este definit și este un array
  const mainImage =
    Array.isArray(data.images) && data.images.length > 0
      ? data.images.find((image) => image.isMain)?.fileUri ||
        data.images[0]?.fileUri
      : null; // Dacă nu există imagini, setăm la `null`

  return (
    <div className="col-xl-3">
      <a
        href={`/client-compatibil?uid=${data.id}`}
        className="relative d-block rounded-8 px-10 py-10 border-light"
      >
        <div className="row g-3 align-items-center">
          {/* Container pentru imagine sau emoticon */}
          <div className="col-12 col-md-12">
            <div
              className="overflow-hidden rounded-8 w-100 d-flex justify-center align-items-center bg-light"
              style={{
                position: "relative",
                aspectRatio: "16/9",
              }}
            >
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt="image"
                  fill
                  className="rounded-8"
                  style={{
                    objectFit: "cover",
                  }}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faUserCircle}
                  size="4x"
                  className="text-muted"
                />
              )}
            </div>
          </div>

          {/* Container pentru text */}
          <div className="col-12 col-md-12">
            <h3 className="text-17 lh-16 fw-500 mt-10 pr-40 xl:pr-0">
              {data.username || "Utilizator"}
            </h3>
            <p>
              {data.gender ? `${translatedTexts.getText}: ${data.gender}` : ""}
            </p>
          </div>
        </div>
      </a>
    </div>
  );
}
