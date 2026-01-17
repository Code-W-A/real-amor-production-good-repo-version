"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function AdminLifetimeSuccess({
  title = "Paiement finalisé",
  text = "Paiement effectué. L'accès à vie sera activé automatiquement (webhook Stripe).",
  backText = "Retour à l'utilisateur",
}) {
  const searchParams = useSearchParams();
  const uid = searchParams?.get("uid");

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
              <Link
                href={uid ? `/informatii-utilizator?uid=${encodeURIComponent(uid)}` : "/lista-utilizatori"}
              >
                <button className="button px-40 py-20 fw-500 -purple-1 text-white">
                  {backText}
                </button>
              </Link>
            </div>

            <div className="mt-20 text-14 text-dark-1">
              Dacă nu vezi imediat statusul “lifetime” în profil, reîncarcă pagina
              după 2-5 secunde (depinde de webhook).
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

