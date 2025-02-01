import React from "react";
import Image from "next/image";
import { teamMembers } from "../../data/instractors";
import Link from "next/link";

export default function Instructors({ backgroundColor }) {
  return (
    <section
      className={`layout-pt-lg layout-pb-lg ${
        backgroundColor ? backgroundColor : ""
      }`}
    >
      <div className="container">
        <div className="row y-gap-20 justify-between items-center">
          <div className="col-lg-6">
            <div className="sectionTitle ">
              <h2 className="sectionTitle__title " data-aos="fade-left">
                Descoperă persoane deschise și pasionate de noi experiențe
              </h2>

              <p className="sectionTitle__text " data-aos="fade-left">
                Ești în căutarea unei conexiuni intense, fără obligații? Alătură-te acum și găsește persoane atrăgătoare, gata pentru aventuri memorabile.
              </p>
            </div>
          </div>

          <div className="col-auto" data-aos="fade-left">
            <Link
              href="/instructors-list-1"
              className="button -icon -purple-3 text-purple-1"
            >
              Vezi toate persoanele disponibile
              <i className="icon-arrow-top-right text-13 ml-10"></i>
            </Link>
          </div>
        </div>

        <div className="row y-gap-30 pt-50">
          {teamMembers.slice(0, 4).map((elm, i) => (
            <div
              key={i}
              className="col-lg-3 col-sm-6"
              data-aos="fade-left"
              data-aos-duration={(i + 1) * 500}
            >
              <div className="teamCard -type-1 -teamCard-hover">
                <div className="teamCard__image">
                  {/* Aplică clasa 'blurred-image' pe imagine */}
                  <Image
                    className="blurred-image"
                    width={600}
                    height={700}
                    style={{ height: "100%", width: "100%" }}
                    src={elm.image}
                    alt="image"
                  />
                  {/* <div className="teamCard__socials">
                    <div className="d-flex x-gap-20 y-gap-10 justify-center items-center h-100">
                      {elm.socialProfile?.map((itm, i) => (
                        <Link key={i} href={itm.url ? itm.url : "#"}>
                          <i className={`${itm.icon} text-white`}></i>
                        </Link>
                      ))}
                    </div>
                  </div> */}
                </div>
                <div className="teamCard__content">
                  <h4 className="teamCard__title">
                    <Link
                      className="linkCustom"
                      href={`/instructors/${elm.id}`}
                    >
                      {elm.name}
                    </Link>
                  </h4>
                  {/* <p className="teamCard__text">
                    {elm.role === "instructor" ? "Aventurier/a" : elm.role}
                  </p> */}

                  <div className="row items-center y-gap-10 x-gap-10 pt-10">
                    <div className="col-auto">
                      <div className="d-flex items-center">
                        <div className="icon-heart text-red-1 text-11 mr-5"></div>
                        <div className="text-14 lh-12 text-red-1 fw-500">
                          {elm.rating} Preferat de membri
                        </div>
                      </div>
                    </div>

                    <div className="col-auto">
                      <div className="d-flex items-center">
                        <div className="icon-fire text-light-1 text-11 mr-5"></div>
                        <div className="text-14 lh-12">
                          {elm.students} Conexiuni stabilite
                        </div>
                      </div>
                    </div>

                    <div className="col-auto">
                      <div className="d-flex items-center">
                        <div className="icon-smile text-light-1 text-11 mr-5"></div>
                        <div className="text-14 lh-12">
                          {elm.courses} Experiențe împărtășite
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row justify-center text-center pt-60 lg:pt-40">
          <div className="col-auto">
            <p className="lh-1">
              Ești gata să explorezi noi experiențe și să întâlnești persoane
              dornice de aventură?{" "}
              <Link
                className="text-purple-1 underline"
                href="/instructor-become"
              >
                Alătură-te acum
              </Link>
              {" "}și lasă-te purtat/ă de pasiune!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
