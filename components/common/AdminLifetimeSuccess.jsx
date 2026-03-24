"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { withLocalePath } from "@/utils/routeLocale";

export default function AdminLifetimeSuccess({
  title,
  text,
  backText,
  translatedLinks,
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const uid = searchParams?.get("uid");
  const backPath = uid
    ? `${withLocalePath(
        pathname,
        "/informatii-utilizator"
      )}?uid=${encodeURIComponent(uid)}`
    : withLocalePath(pathname, "/lista-utilizatori");

  return (
    <section className="layout-pt-lg pt-10 layout-pb-md">
      <div className="container">
        <div className="row justify-center text-center">
          <div className="col-lg-8 col-md-10">
            <div className="sectionTitle">
              <h2 className="sectionTitle__title">{title}</h2>
              <p className="sectionTitle__text">{text}</p>
            </div>

            <div className="mt-30">
              <Link href={backPath}>
                <button className="button px-40 py-20 fw-500 -purple-1 text-white">
                  {backText}
                </button>
              </Link>
            </div>

            <div className="mt-20 text-14 text-dark-1">
              {translatedLinks.hintText}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
