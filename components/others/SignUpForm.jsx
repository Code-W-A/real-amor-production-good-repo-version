"use client";

import { useState } from "react";
import { authentication, db } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid";

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "@/firebase"; // Asigură-te că importul storage este corect
import Link from "next/link";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid"; // Pentru a genera ID-uri unice pentru imagini
import AlertBox from "../uiElements/AlertBox";
import { useRouter } from "next/navigation";
import { useTranslate } from "@/hooks/useTranslate";
import { useAuth } from "@/context/AuthContext";

const SignUpForm = ({
  signUpText,
  alreadyHaveAccountText,
  conectText,
  registerText,
  emailPlaceholder,
  emailAdresaPlaceholder,
  usernamePlaceholder,
  passwordPlaceholder,
  confirmPasswordPlaceholder,
  phonePlaceholder,
  aboutMePlaceholder,
  videoPlaceholder,
  pozePlaceholder,
  translatedLinks,
  targetLanguage,
  termsAndConditionsText,
  mentionsLegalesText,
  politiqueConfidentialiteText,
  politiqueCookiesText,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    phone: "",
    aboutMe: "",
    address: "",
    gender: "", // Pentru a selecta "homme" sau "femme"
    purpose: "", // Pentru a selecta "amour", "sex", sau "amitie"
  });
  const [tempImages, setTempImages] = useState([]); // Stocăm imaginile temporar înainte de upload
  const [tempVideo, setTempVideo] = useState(null); // Stocăm videoclipul temporar înainte de upload
  const [mainImageId, setMainImageId] = useState(null); // Stocăm ID-ul imaginii principale
  const [formErrors, setFormErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState({
    type: "",
    content: "",
    showAlert: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false); // Stare pentru checkbox-ul de acceptare

  const router = useRouter();

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!formData.email) {
      errors.email = "Email is required";
      isValid = false;
    }

    if (!formData.username) {
      errors.username = translatedLinks.userNameRequired;
      isValid = false;
    }

    if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = translatedLinks.passLength;
      isValid = false;
    }

    if (!formData.phone) {
      errors.phone = translatedLinks.phoneRequired;
      isValid = false;
    }

    if (!formData.address) {
      errors.address = translatedLinks.addressRequired;
      isValid = false;
    }

    if (!formData.gender) {
      errors.gender = translatedLinks.getNecesarText;
      isValid = false;
    }

    if (!formData.purpose) {
      errors.purpose = translatedLinks.scopNecesarText;
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageId = uuidv4(); // Generăm un ID unic pentru imagine
      const tempImage = {
        fileName: imageId,
        file,
        previewUrl: URL.createObjectURL(file), // URL pentru previzualizare locală
        isMain: tempImages.length === 0, // Setăm isMain la true doar pentru prima imagine
      };
      setTempImages((prev) => [...prev, tempImage]);
      // setAlertMessage({
      //   type: "success",
      //   content: "Imagine adăugată cu succes!",
      //   showAlert: true,
      // });

      if (tempImages.length === 0) {
        setMainImageId(imageId); // Setăm imaginea ca principală dacă este prima adăugată
      }
    }
  };

  const handleImageDelete = (imageId) => {
    setTempImages((prev) => prev.filter((image) => image.fileName !== imageId));
    if (mainImageId === imageId) {
      setMainImageId(null); // Resetăm imaginea principală dacă a fost ștearsă
    }
    // setAlertMessage({
    //   type: "success",
    //   content: "Imagine ștearsă cu succes!",
    //   showAlert: true,
    // });
  };

  const handleMainImageSelect = (imageId) => {
    setTempImages((prevImages) => {
      const updatedImages = prevImages.map((image) =>
        image.fileName === imageId
          ? { ...image, isMain: true }
          : { ...image, isMain: false }
      );

      // Reordonăm imaginile, astfel încât imaginea principală să fie prima
      const sortedImages = [
        ...updatedImages.filter((image) => image.isMain),
        ...updatedImages.filter((image) => !image.isMain),
      ];

      return sortedImages;
    });
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const videoId = uuidv4(); // Generăm un ID unic pentru videoclip
      const tempVid = {
        videoName: videoId,
        file,
        previewUrl: URL.createObjectURL(file), // URL pentru previzualizare locală
      };
      setTempVideo(tempVid);
      // setAlertMessage({
      //   type: "success",
      //   content: "Videoclip adăugat cu succes!",
      //   showAlert: true,
      // });
    }
  };

  const handleVideoDelete = () => {
    setTempVideo(null);
    // setAlertMessage({
    //   type: "success",
    //   content: "Videoclip șters cu succes!",
    //   showAlert: true,
    // });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setAlertMessage({
        type: "danger",
        content: translatedLinks.completeazaCampuri,
        showAlert: true,
      });
      return;
    }

    setIsLoading(true); // Setează isLoading pe true la începutul procesului

    try {
      const userCredential = await createUserWithEmailAndPassword(
        authentication,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      const uploadedImages = await Promise.all(
        tempImages.map(async (image) => {
          const storageRef = ref(storage, `images/${image.fileName}`);
          const uploadTask = await uploadBytesResumable(storageRef, image.file);
          const fileUrl = await getDownloadURL(uploadTask.ref);

          return {
            fileName: image.fileName,
            fileUri: fileUrl,
            isMain: image.isMain,
          };
        })
      );

      let uploadedVideo = null;
      if (tempVideo) {
        const storageRef = ref(storage, `videos/${tempVideo.videoName}`);
        const uploadTask = await uploadBytesResumable(
          storageRef,
          tempVideo.file
        );
        const videoUrl = await getDownloadURL(uploadTask.ref);

        uploadedVideo = {
          videoName: tempVideo.videoName,
          videoUri: videoUrl,
        };
      }

      // Mutăm imaginea principală în fața array-ului
      const sortedImages = [
        ...uploadedImages.filter((image) => image.fileName === mainImageId),
        ...uploadedImages.filter((image) => image.fileName !== mainImageId),
      ];

      // Obține data curentă în formatul dd-mm-yyyy
      const today = new Date();
      const formattedDate = `${today.getDate().toString().padStart(2, "0")}-${(
        today.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${today.getFullYear()}`;

      // Adaugă data înscrierii în Firestore
      await setDoc(doc(db, "Users", user.uid), {
        uid: user.uid,
        email: formData.email,
        username: formData.username,
        phone: formData.phone,
        aboutMe: formData.aboutMe,
        images: sortedImages,
        video: uploadedVideo,
        address: formData.address,
        isActivated: false,
        reservation: { hasReserved: false },
        targetLanguage,
        registrationDate: formattedDate, // Adaugăm data înscrierii
        registrationDateNoFormat: today, // Adaugăm data înscrierii
        gender: formData.gender,
        purpose: formData.purpose,
      });

      setAlertMessage({
        type: "success",
        content: translatedLinks.utilizatorInregistrat,
        showAlert: true,
      });
      router.push("/login");
    } catch (err) {
      setAlertMessage({
        type: "danger",
        content: err.message,
        showAlert: true,
      });
    } finally {
      setIsLoading(false); // Setează isLoading pe false la finalul procesului
    }
  };

  // const handleGoogleSignIn = async () => {
  //   try {
  //     const result = await signInWithPopup(authentication, googleProvider);
  //     const user = result.user;

  //     await setDoc(
  //       doc(db, "Users", user.uid),
  //       {
  //         uid: user.uid,
  //         email: user.email,
  //         username: user.displayName,
  //         phone: "",
  //         aboutMe: "",
  //         images: [],
  //         video: null,
  //       },
  //       { merge: true }
  //     );

  //     setAlertMessage({
  //       type: "success",
  //       content: "Utilizator înregistrat cu succes cu Google!",
  //       showAlert: true,
  //     });
  //   } catch (err) {
  //     setAlertMessage({
  //       type: "danger",
  //       content: err.message,
  //       showAlert: true,
  //     });
  //   }
  // };

  return (
    <div className="form-page__content lg:py-50 sm:py-25 relative">
      <div className="container">
        <div className="row justify-center items-center">
          <div className="col-xl-11 col-lg-11">
            <div
              style={{
                maxHeight: "90vh",
                overflowY: "scroll",
                overflowX: "hidden",
              }}
              className="px-30 py-20 mt-50 md:px-25 md:py-25 bg-white shadow-1 rounded-16"
            >
              <h3 className="text-30 lh-13">{signUpText}</h3>
              <p className="mt-10">
                {alreadyHaveAccountText}
                <Link href="/login" className="text-purple-1">
                  {conectText}
                </Link>
              </p>

              <form
                className="contact-form respondForm__form row y-gap-20 pt-30"
                onSubmit={handleSubmit}
              >
                {/* Câmp pentru încărcarea imaginii */}
                {true ? null : (
                  <div
                    className="row y-gap-10 x-gap-10 items-center"
                    style={{ flexWrap: "wrap" }}
                  >
                    <label className="text-16 lh-1 fw-500 text-dark-1">
                      {pozePlaceholder} *
                    </label>
                    {tempImages.map((image, index) => (
                      <div
                        key={image.fileName}
                        className="position-relative"
                        style={{
                          backgroundColor: "#f2f3f4",
                          width: 100,
                          height: 100,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          cursor: "pointer",
                          borderRadius: "4px",
                          border: image.isMain
                            ? "2px solid #c13365"
                            : "1px solid #ddd", // Border diferit pentru imaginea principală
                          marginRight: 10, // Elimină margin-right la prima imagine de pe fiecare rând
                          marginTop: tempImages.length >= 4 ? 10 : 0, // Adaugă margin-top pentru imaginile de pe al doilea rând
                          position: "relative", // Poziționare relativă pentru iconul bin
                        }}
                        onClick={() => handleMainImageSelect(image.fileName)}
                      >
                        <Image
                          width={100}
                          height={100}
                          className="rounded-md size-100"
                          src={image.previewUrl}
                          alt="uploaded image"
                          style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                          }}
                        />
                        {/* Icon Bin pentru ștergerea imaginii */}
                        <i
                          className="icon-bin top-0 right-0 m-1 p-1 text-red-500"
                          style={{
                            cursor: "pointer",
                            position: "absolute",
                            top: 5,
                            right: 5,
                          }}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevenim selectarea imaginii principale la ștergere
                            handleImageDelete(image.fileName);
                          }}
                        ></i>
                      </div>
                    ))}

                    {/* Label pentru adăugarea unei noi imagini */}
                    <label
                      className={`col-auto position-relative ${
                        tempImages.length > 0 ? "ml-10" : ""
                      }`}
                      htmlFor="imageUpload"
                      style={{
                        backgroundColor: "#f2f3f4",
                        width: 100,
                        height: 100,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                        marginTop: tempImages.length >= 4 ? 10 : 0, // Adaugă margin-top pentru rândurile următoare
                      }}
                    >
                      <div className="icon icon-cloud text-16"></div>
                      <input
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: "none" }}
                      />
                    </label>
                  </div>
                )}

                {/* Câmp pentru încărcarea videoclipului */}
                {false && (
                  <div className="row y-gap-10 x-gap-10 items-center mt-10">
                    <label className="text-16 lh-1 fw-500 text-dark-1">
                      {videoPlaceholder} *
                    </label>
                    {tempVideo ? (
                      <div
                        className="position-relative"
                        style={{
                          backgroundColor: "#f2f3f4",
                          width: 200, // Dimensiune mai mare pentru video
                          height: 200, // Dimensiune mai mare pentru video
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          cursor: "pointer",
                          borderRadius: "4px",
                          border: "1px solid #ddd",
                          marginRight: 10,
                          position: "relative", // Asigură poziționarea relativă pentru iconul bin
                        }}
                      >
                        <video
                          width={200}
                          height={200}
                          src={tempVideo.previewUrl}
                          controls
                          style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                          }}
                        />

                        <i
                          className="icon-bin top-0 right-0 m-1 p-1 text-red-500"
                          style={{
                            cursor: "pointer",
                            position: "absolute",
                            top: 5,
                            right: 5,
                          }}
                          onClick={handleVideoDelete}
                        ></i>
                      </div>
                    ) : (
                      <label
                        className="col-auto position-relative"
                        htmlFor="videoUpload"
                        style={{
                          backgroundColor: "#f2f3f4",
                          width: 100,
                          height: 100,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          cursor: "pointer",
                          borderRadius: "4px",
                          border: "1px solid #ddd",
                        }}
                      >
                        <div className="icon icon-cloud text-16"></div>
                        <input
                          id="videoUpload"
                          type="file"
                          accept="video/*"
                          onChange={handleVideoUpload}
                          style={{ display: "none" }}
                        />
                      </label>
                    )}
                  </div>
                )}

                <div className="col-lg-6">
                  <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                    {emailAdresaPlaceholder} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder={emailPlaceholder}
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-control ${
                      formErrors.email ? "border-danger-red" : ""
                    }`}
                  />
                </div>

                <div className="col-lg-6">
                  <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                    {usernamePlaceholder} *
                  </label>
                  <input
                    type="text"
                    name="username"
                    placeholder={usernamePlaceholder}
                    value={formData.username}
                    onChange={handleChange}
                    className={`form-control ${
                      formErrors.username ? "border-danger-red" : ""
                    }`}
                  />
                </div>

                <div className="col-lg-6">
                  <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                    {passwordPlaceholder} *
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder={passwordPlaceholder}
                    value={formData.password}
                    onChange={handleChange}
                    className={`form-control ${
                      formErrors.password ? "border-danger-red" : ""
                    }`}
                  />
                </div>

                <div className="col-lg-6">
                  <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                    {confirmPasswordPlaceholder} *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder={confirmPasswordPlaceholder}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`form-control ${
                      formErrors.confirmPassword ? "border-danger-red" : ""
                    }`}
                  />
                </div>

                <div className="col-lg-6">
                  <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                    {translatedLinks.genText} *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`form-control ${
                      formErrors.gender ? "border-danger-red" : ""
                    }`}
                  >
                    <option value="">{translatedLinks.selecteazaText}</option>
                    <option value="male">{translatedLinks.hommeText}</option>
                    <option value="female">{translatedLinks.femmeText}</option>
                  </select>
                </div>

                <div className="col-lg-6">
                  <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                    {translatedLinks.scopText} *
                  </label>
                  <select
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    className={`form-control ${
                      formErrors.purpose ? "border-danger-red" : ""
                    }`}
                  >
                    <option value="">{translatedLinks.selecteazaText}</option>
                    <option value="love">{translatedLinks.amourText}</option>
                    <option value="casual">{translatedLinks.sexText}</option>
                    <option value="friendship">
                      {translatedLinks.amitieText}
                    </option>
                  </select>
                </div>

                <div className="col-lg-6">
                  <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                    {phonePlaceholder} *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    placeholder={phonePlaceholder}
                    value={formData.phone}
                    onChange={handleChange}
                    className={`form-control ${
                      formErrors.phone ? "border-danger-red" : ""
                    }`}
                  />
                </div>

                <div className="col-lg-12">
                  <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                    {aboutMePlaceholder} *
                  </label>
                  <textarea
                    name="address"
                    placeholder={aboutMePlaceholder}
                    value={formData.address}
                    onChange={handleChange}
                    className={`form-control ${
                      formErrors.address ? "border-danger-red" : ""
                    }`}
                  />
                </div>

                <div className="col-12">
                  <label className="text-14">
                    <input
                      type="checkbox"
                      checked={isAccepted}
                      onChange={() => setIsAccepted(!isAccepted)}
                      className="text-purple-1"
                    />
                    <span className="ml-10">
                      {translatedLinks.termsAndConditions.prefix}
                      <Link
                        className="text-purple-1"
                        href="https://real-amor.com/mentions-legales"
                      >
                        {
                          translatedLinks.termsAndConditions
                            .mentionsLegalesLinkText
                        }
                      </Link>
                      {translatedLinks.termsAndConditions.mentionsLegalesSuffix}
                      <Link
                        className="text-purple-1"
                        href="https://real-amor.com/politique-de-confidentialite"
                      >
                        {
                          translatedLinks.termsAndConditions
                            .politiqueConfidentialiteLinkText
                        }
                      </Link>
                      {
                        translatedLinks.termsAndConditions
                          .politiqueConfidentialiteSuffix
                      }
                      <Link
                        className="text-purple-1"
                        href="https://real-amor.com/politique-de-cookies"
                      >
                        {
                          translatedLinks.termsAndConditions
                            .politiqueCookiesLinkText
                        }
                      </Link>
                      {translatedLinks.termsAndConditions.suffix}
                    </span>
                  </label>
                </div>

                <div className="col-12">
                  {isLoading ? (
                    <div className="spinner">
                      {" "}
                      {/* Spinner component */}
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className={
                        isAccepted
                          ? "button -md -purple-1 fw-500 w-1/1"
                          : "button -md fw-500 w-1/1"
                      }
                      disabled={!isAccepted}
                    >
                      {registerText}
                    </button>
                  )}
                </div>
              </form>

              {/* <div className="lh-12 text-dark-1 fw-500 text-center mt-20">
                Sau conectează-te folosind
              </div>

              <div className="d-flex x-gap-20 items-center justify-between pt-20">
                <div>
                  <button
                    onClick={handleGoogleSignIn}
                    className="button -sm px-24 py-20 -outline-red-3 text-red-3 text-14"
                  >
                    Conectează-te cu Google+
                  </button>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Afișare componentă AlertBox */}
        <AlertBox
          type={alertMessage.type}
          message={alertMessage.content}
          showAlert={alertMessage.showAlert}
          onClose={() => setAlertMessage({ ...alertMessage, showAlert: false })}
        />
      </div>
    </div>
  );
};

export default SignUpForm;
