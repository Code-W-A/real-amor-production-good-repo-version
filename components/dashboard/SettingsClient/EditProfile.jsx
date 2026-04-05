import { useState, useEffect, useMemo } from "react";
import { db, storage } from "@/firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import AlertBox from "@/components/uiElements/AlertBox";
import { v4 as uuidv4 } from "uuid"; // Pentru a genera ID-uri unice pentru imagini
import { PDFDownloadLink } from "@react-pdf/renderer";
import { QuizResultsDocument } from "../InformatiiUtilizator/QuizResultsDocument";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { withLocalePath } from "@/utils/routeLocale";
import { useClientChatUnreadValue } from "@/components/dashboard/ClientChatUnreadContext";
import {
  getCountryPhoneOptions,
  getPhoneDisplayForUi,
  normalizePhone,
} from "@/utils/phoneUtils";

/** MIME + extensii: wildcard + tipuri explicite (unele OS necesită extensii). */
const PROFILE_IMAGE_ACCEPT = [
  "image/*",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/bmp",
  "image/tiff",
  "image/svg+xml",
  "image/heic",
  "image/heif",
  "image/avif",
  "image/x-icon",
  "image/vnd.microsoft.icon",
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".bmp",
  ".tif",
  ".tiff",
  ".svg",
  ".heic",
  ".heif",
  ".avif",
  ".ico",
].join(",");

const PROFILE_VIDEO_ACCEPT = [
  "video/*",
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/ogg",
  "video/x-msvideo",
  "video/3gpp",
  "video/mpeg",
  "video/x-matroska",
  ".mp4",
  ".mov",
  ".m4v",
  ".webm",
  ".avi",
  ".mkv",
  ".3gp",
  ".ogv",
  ".mpeg",
  ".mpg",
].join(",");

function guessMimeTypeFromFileName(fileName, kind) {
  const ext = (fileName.split(".").pop() || "").toLowerCase();
  const imageMap = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    bmp: "image/bmp",
    tif: "image/tiff",
    tiff: "image/tiff",
    svg: "image/svg+xml",
    heic: "image/heic",
    heif: "image/heif",
    avif: "image/avif",
    ico: "image/x-icon",
  };
  const videoMap = {
    mp4: "video/mp4",
    mov: "video/quicktime",
    m4v: "video/x-m4v",
    webm: "video/webm",
    avi: "video/x-msvideo",
    mkv: "video/x-matroska",
    "3gp": "video/3gpp",
    ogv: "video/ogg",
    mpeg: "video/mpeg",
    mpg: "video/mpeg",
  };
  if (kind === "image") {
    return imageMap[ext] || "application/octet-stream";
  }
  return videoMap[ext] || "application/octet-stream";
}

function storageMetadataForUpload(file, kind) {
  const contentType = file.type || guessMimeTypeFromFileName(file.name, kind);
  return { contentType };
}

const EditProfile = ({
  activeTab,
  usernameLabel,
  phoneLabel,
  aboutMeLabel,
  updateProfileText,
  successMessage,
  imageAddedMessage,
  videoAddedMessage,
  errorMessage,
  usernameRequired,
  phoneRequired,
  aboutMeRequired,
  completeFieldsError,
  addressLabel,
  addressRequired,
  translatedTexts,
}) => {
  const { userData } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    aboutMe: "",
    address: "",
    gender: "", // Pentru a selecta "homme" sau "femme"
    purpose: "", // Pentru a selecta "amour", "sex", sau "amitie"
  });
  const [tempImages, setTempImages] = useState([]);
  const [tempVideo, setTempVideo] = useState(null);
  const [mainImageId, setMainImageId] = useState(null); // Imaginea principală
  const [formErrors, setFormErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState({
    type: "",
    content: "",
    showAlert: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [phoneCountry, setPhoneCountry] = useState("BE");
  const phoneCountryOptions = useMemo(
    () => getCountryPhoneOptions(userData?.targetLanguage || "fr"),
    [userData?.targetLanguage]
  );
  const router = useRouter();
  const pathname = usePathname();
  const { totalUnread } = useClientChatUnreadValue();
  const chatHref = withLocalePath(pathname, "/chat");

  useEffect(() => {
    if (userData) {
      const fetchUserData = async () => {
        const userDocRef = doc(db, "Users", userData.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userInfo = userDoc.data();
          setFormData({
            username: userInfo.username || "",
            phone: getPhoneDisplayForUi(userInfo),
            aboutMe: userInfo.aboutMe || "",
            address: userInfo.address || "",
            gender: userInfo.gender,
            purpose: userInfo.purpose,
          });
          setPhoneCountry(
            userInfo.phoneCountry || (userInfo?.targetLanguage === "nl" ? "NL" : "BE")
          );
          setTempImages(userInfo.images || []);
          setMainImageId(
            userInfo.images?.find((image) => image.isMain)?.fileName || null
          );
          setTempVideo(userInfo.video || null);
        }
      };
      fetchUserData();
    }
  }, [userData]);

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
        previewUrl: URL.createObjectURL(file),
        isMain: tempImages.length === 0, // Setăm isMain la true doar pentru prima imagine
      };
      setTempImages([...tempImages, tempImage]);
      setAlertMessage({
        type: "success",
        content: imageAddedMessage,
        showAlert: true,
      });

      if (tempImages.length === 0) {
        setMainImageId(imageId); // Setăm prima imagine ca principală
      }
    }
  };

  const handleImageDelete = (imageId) => {
    setTempImages((prev) => prev.filter((image) => image.fileName !== imageId));
    if (mainImageId === imageId) {
      setMainImageId(null); // Resetăm imaginea principală dacă a fost ștearsă
    }
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

      setMainImageId(imageId); // Setăm ID-ul imaginii principale
      return sortedImages;
    });
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const tempVid = {
        videoName: uuidv4(),
        file,
        previewUrl: URL.createObjectURL(file),
      };
      setTempVideo(tempVid);
      setAlertMessage({
        type: "success",
        content: videoAddedMessage,
        showAlert: true,
      });
    }
  };

  const handleVideoDelete = () => {
    setTempVideo(null);
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!formData.username) {
      errors.username = usernameRequired;
      isValid = false;
    }

    if (!formData.phone) {
      errors.phone = phoneRequired;
      isValid = false;
    } else {
      const phoneCheck = normalizePhone({
        phone: formData.phone,
        selectedCountry: phoneCountry,
        targetLanguage: userData?.targetLanguage,
        strict: true,
      });
      if (!phoneCheck.isValid) {
        errors.phone = translatedTexts.phoneInvalidText;
        isValid = false;
      }
    }

    if (!formData.address) {
      errors.address = addressRequired;
      isValid = false;
    }

    if (!formData.gender) {
      errors.gender = translatedTexts.getNecesarText;
      isValid = false;
    }

    if (!formData.purpose) {
      errors.purpose = translatedTexts.scopNecesarText;
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateForm()) {
      setAlertMessage({
        type: "danger",
        content: completeFieldsError,
        showAlert: true,
      });
      setIsLoading(false);
      return;
    }

    const normalizedPhone = normalizePhone({
      phone: formData.phone,
      selectedCountry: phoneCountry,
      targetLanguage: userData?.targetLanguage,
      strict: true,
    });
    if (!normalizedPhone.isValid) {
      setFormErrors((prev) => ({
        ...prev,
        phone: translatedTexts.phoneInvalidText,
      }));
      setAlertMessage({
        type: "danger",
        content: translatedTexts.phoneInvalidText,
        showAlert: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      // **Păstrează fișierele originale**
      const initialImages = userData.images || [];
      const initialVideo = userData.video || null;

      // Actualizează imaginile și încarcă-le dacă sunt noi
      const updatedImages = await Promise.all(
        tempImages.map(async (image) => {
          if (image.file) {
            const storageRef = ref(storage, `images/${image.fileName}`);
            const uploadTask = await uploadBytesResumable(
              storageRef,
              image.file,
              storageMetadataForUpload(image.file, "image")
            );
            const fileUrl = await getDownloadURL(uploadTask.ref);
            return {
              fileName: image.fileName,
              fileUri: fileUrl,
              isMain: image.fileName === mainImageId,
            };
          }
          return image;
        })
      );

      // Încarcă videoclipul dacă este nou
      let uploadedVideoUrl = null;
      if (tempVideo && tempVideo.file) {
        const storageRef = ref(storage, `videos/${tempVideo.videoName}`);
        const uploadTask = await uploadBytesResumable(
          storageRef,
          tempVideo.file,
          storageMetadataForUpload(tempVideo.file, "video")
        );
        const videoUrl = await getDownloadURL(uploadTask.ref);

        uploadedVideoUrl = {
          videoName: tempVideo.videoName,
          videoUri: videoUrl,
        };
      }

      // **Șterge fișierele eliminate**
      const imagesToDelete = initialImages.filter(
        (initialImage) =>
          !updatedImages.some(
            (updatedImage) => updatedImage.fileName === initialImage.fileName
          )
      );
      imagesToDelete.forEach(async (image) => {
        const storageRef = ref(storage, `images/${image.fileName}`);
        await deleteObject(storageRef);
      });
      if (uploadedVideoUrl?.videoName) {
        if (
          initialVideo &&
          uploadedVideoUrl.videoName !== initialVideo.videoName
        ) {
          // Dacă videoclipul inițial a fost eliminat
          const storageRef = ref(storage, `videos/${initialVideo.videoName}`);
          await deleteObject(storageRef);
        }
      }

      // Actualizează documentul utilizatorului în Firestore
      const userDocRef = doc(db, "Users", userData.uid);
      await updateDoc(userDocRef, {
        username: formData.username,
        phone: normalizedPhone.phone,
        phoneRaw: normalizedPhone.phoneRaw,
        phoneDisplay: normalizedPhone.phoneDisplay,
        phoneE164: normalizedPhone.phoneE164,
        phoneCountry: normalizedPhone.phoneCountry,
        phoneDialCode: normalizedPhone.phoneDialCode,
        phoneFlag: normalizedPhone.phoneFlag,
        aboutMe: formData.aboutMe,
        images: updatedImages,
        video: uploadedVideoUrl ? uploadedVideoUrl : tempVideo,
        address: formData.address,
        gender: formData.gender, // Stochează "male" sau "female"
        purpose: formData.purpose, // Stochează "love", "casual" sau "friendship"
      });

      setAlertMessage({
        type: "success",
        content: successMessage,
        showAlert: true,
      });
    } catch (error) {
      console.error(errorMessage, error);
      setAlertMessage({
        type: "danger",
        content: errorMessage,
        showAlert: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const translatedGender =
    formData.gender === "male"
      ? translatedTexts.hommeText
      : formData.gender === "female"
      ? translatedTexts.femmeText
      : translatedTexts.selecteazaText;

  const translatedPurpose =
    formData.purpose === "love"
      ? translatedTexts.amourText
      : formData.purpose === "casual"
      ? translatedTexts.sexText
      : formData.purpose === "friendship"
      ? translatedTexts.amitieText
      : translatedTexts.selecteazaText;

  return (
    <div
      className={`tabs__pane -tab-item-1 ${activeTab == 1 ? "is-active" : ""}`}
    >
      <div className="row justify-center items-center">
        <div className="col-xl-12 col-lg-12">
          <div className="px-30 py-10 mt-0 md:px-25 md:py-25">
            {totalUnread > 0 && (
              <div
                className="mb-20 py-15 px-20 rounded-8 border border-purple-1 bg-light-7 -dark-bg-dark-2"
                role="status"
              >
                <Link
                  href={chatHref}
                  className="text-15 lh-13 fw-500 text-purple-1 underline"
                >
                  {translatedTexts.profileUnreadChatBannerText}
                </Link>
              </div>
            )}
            <form
              className="contact-form respondForm__form row y-gap-20 pt-10"
              onSubmit={handleSubmit}
            >
              {/* Câmp pentru încărcarea imaginii */}
              <div
                className="row y-gap-10 x-gap-10 items-center"
                style={{ flexWrap: "wrap" }}
              >
                <label className="text-16 lh-1 fw-500 text-dark-1 mb-5">
                  {translatedTexts.pozePlaceholder} *
                </label>
                {tempImages.map((image) => (
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
                        : "1px solid #ddd",
                      marginRight: 10,
                      marginTop: tempImages.length >= 4 ? 10 : 0,
                      position: "relative",
                    }}
                    onClick={() => handleMainImageSelect(image.fileName)}
                  >
                    <Image
                      width={100}
                      height={100}
                      className="rounded-md size-100"
                      src={image.fileUri || image.previewUrl}
                      alt={translatedTexts.uploadedImageAltText}
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
                      onClick={() => handleImageDelete(image.fileName)}
                    ></i>
                  </div>
                ))}
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
                    marginTop: tempImages.length >= 4 ? 10 : 0,
                  }}
                >
                  <div className="icon icon-cloud text-16"></div>
                  <input
                    id="imageUpload"
                    type="file"
                    accept={PROFILE_IMAGE_ACCEPT}
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />
                </label>
              </div>

              {/* Câmp pentru încărcarea videoclipului */}
              <div className="row y-gap-10 x-gap-10 items-center mt-5 mb-10">
                <label className="text-16 lh-1 fw-500 text-dark-1 mb-5">
                  {translatedTexts.videoPlaceholder} *
                </label>
                {tempVideo ? (
                  <div
                    className="position-relative"
                    style={{
                      backgroundColor: "#f2f3f4",
                      width: 200,
                      height: 200,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                      marginRight: 10,
                      position: "relative",
                    }}
                  >
                    <video
                      width={200}
                      height={200}
                      src={tempVideo.videoUri || tempVideo.previewUrl}
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
                      accept={PROFILE_VIDEO_ACCEPT}
                      onChange={handleVideoUpload}
                      style={{ display: "none" }}
                    />
                  </label>
                )}
              </div>

              {/* Inputuri pentru informații utilizator */}
              <div className="col-lg-6">
                <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                  {usernameLabel} *
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`form-control ${
                    formErrors.username ? "border-danger-red" : ""
                  }`}
                />
              </div>

              <div className="col-lg-6">
                <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                  {translatedTexts.genText} *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`form-control ${
                    formErrors.gender ? "border-danger-red" : ""
                  }`}
                >
                  <option value="">{translatedTexts.selecteazaText}</option>
                  <option value="male">{translatedTexts.hommeText}</option>
                  <option value="female">{translatedTexts.femmeText}</option>
                </select>
              </div>

              <div className="col-lg-6">
                <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                  {translatedTexts.scopText} *
                </label>
                <select
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  className={`form-control ${
                    formErrors.purpose ? "border-danger-red" : ""
                  }`}
                >
                  <option value="">{translatedTexts.selecteazaText}</option>
                  <option value="love">{translatedTexts.amourText}</option>
                  <option value="casual">{translatedTexts.sexText}</option>
                  <option value="friendship">
                    {translatedTexts.amitieText}
                  </option>
                </select>
              </div>

              <div className="col-lg-6">
                <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                  {phoneLabel} *
                </label>
                <div style={{ marginBottom: 8 }}>
                  <select
                    value={phoneCountry}
                    onChange={(e) => setPhoneCountry(e.target.value)}
                    className="form-control"
                  >
                    {phoneCountryOptions.map((opt) => (
                      <option key={opt.country} value={opt.country}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`form-control ${
                    formErrors.phone ? "border-danger-red" : ""
                  }`}
                />
              </div>

              <div className="col-lg-12">
                <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                  {addressLabel}
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`form-control`}
                />
              </div>

              <div className="col-lg-12">
                <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                  {aboutMeLabel}
                </label>
                <textarea
                  name="aboutMe"
                  value={formData.aboutMe}
                  onChange={handleChange}
                  className={`form-control`}
                />
              </div>

              <div className="col-12">
                {isLoading ? (
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">
                      {translatedTexts.loadingText}
                    </span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="button -md -purple-1 text-white"
                  >
                    {updateProfileText}
                  </button>
                )}
              </div>

              <div className="col-lg-12 mt-20">
                <label className="text-30 lh-1 fw-500 text-dark-1 mb-10">
                  {translatedTexts.quizText}
                </label>
              </div>
              <div className="col-lg-6">
                <PDFDownloadLink
                  document={
                    <QuizResultsDocument
                      userData={userData}
                      noShowPersonalitateQuestions={true}
                    />
                  }
                  fileName={`${translatedTexts.quizResultsFileNamePrefix}_${
                    userData?.username || translatedTexts.genericUserText
                  }.pdf`}
                  className="button -md -purple-1 text-white"
                >
                  {({ loading }) =>
                    loading
                      ? translatedTexts.generatingPdfText
                      : `${translatedTexts.downloadQuizText}`
                  }
                </PDFDownloadLink>
              </div>
              <div className="col-lg-6">
                <button
                  className="button -md -purple-1 text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/quiz?editQuiz=true");
                  }}
                >
                  {translatedTexts.retakeQuizText}
                </button>
              </div>
            </form>
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
  );
};

export default EditProfile;
