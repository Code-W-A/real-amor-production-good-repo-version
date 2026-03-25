"use client";
import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { withLocalePath } from "@/utils/routeLocale";

export default function CourseCardTwoDash({
  data,
  translatedTexts,
  unreadCount = 0,
}) {
  const pathname = usePathname();
  const compatibilHref = `${withLocalePath(
    pathname,
    "/client-compatibil"
  )}?uid=${encodeURIComponent(data.id)}`;
  // Verifică dacă `data.images` este definit și este un array
  const mainImage =
    Array.isArray(data.images) && data.images.length > 0
      ? data.images.find((image) => image.isMain)?.fileUri ||
        data.images[0]?.fileUri
      : null; // Dacă nu există imagini, setăm la `null`
  const translatedGender =
    data.gender === "male"
      ? translatedTexts.hommeText
      : data.gender === "female"
      ? translatedTexts.femmeText
      : data.gender;

  return (
    <div className="col-xl-3">
      <a
        href={compatibilHref}
        className="relative d-block rounded-8 px-10 py-10 border-light"
        aria-label={
          unreadCount > 0
            ? `${translatedTexts.compatibilityListUnreadBadgeAriaLabel}: ${unreadCount}`
            : undefined
        }
      >
        {unreadCount > 0 && (
          <span
            className="d-flex items-center justify-center text-11 fw-700 text-white rounded-full shrink-0 position-absolute z-2"
            style={{
              top: "8px",
              right: "8px",
              minWidth: "24px",
              height: "24px",
              padding: "0 6px",
              backgroundColor: "#1a1a1a",
            }}
            aria-hidden
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
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
                  alt={translatedTexts.profileImageAltText}
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
              {data.username || translatedTexts.genericUserText}
            </h3>
            <p>
              {data.gender
                ? `${translatedTexts.getText}: ${translatedGender}`
                : ""}
            </p>
          </div>
        </div>
      </a>
    </div>
  );
}
