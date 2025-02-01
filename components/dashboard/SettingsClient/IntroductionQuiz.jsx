"use client";

import FooterNine from "@/components/layout/footers/FooterNine";
import React from "react";

export default function IntroductionQuiz({ onStart, translatedLinks }) {
  return (
    <div className="dashboard__main pl-0">
      <div className="dashboard__content bg-light-4 pt-20">
        <div className="row y-gap-30">
          <div className="col-xl-12">
            <div className="rounded-16 bg-white -dark-bg-dark-1 shadow-4">
              <div className="py-30 px-30">
                <div className="row pb-20 mb-10">
                  <div className="col-auto">
                    <h1 className="text-30 lh-12 fw-700">
                      {translatedLinks.introductionQuiz1}
                    </h1>
                  </div>
                </div>
                <div className="border-light overflow-hidden rounded-8">
                  <div className="py-40 px-40 bg-dark-5">
                    <p className="text-20 lh-1 text-white">
                      {translatedLinks.introductionQuiz2}
                    </p>
                  </div>
                  <div className="px-40 py-40">
                    <p>{translatedLinks.introductionQuiz3} </p>
                    <p>{translatedLinks.introductionQuiz4} </p>
                    <p>{translatedLinks.introductionQuiz5}</p>
                    <div className="d-flex justify-end">
                      <button
                        className="button -md -dark-1 text-white -dark-button-white mt-40"
                        onClick={onStart}
                      >
                        {translatedLinks.introductionQuiz6}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-between items-center mt-40"></div>
            </div>
          </div>
        </div>
      </div>
      <FooterNine />
    </div>
  );
}
