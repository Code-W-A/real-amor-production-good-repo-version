import { authentication, storage } from "../firebase";
import imageCompression from "browser-image-compression";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
  updateMetadata, // Import this module
} from "firebase/storage";
import { getBlobFromUri } from "./getBlobFromUri";
// import { writeImg } from "./realtimeUtils";

export const uploadImage = async (
  image,
  newImage,
  firstLocation,
  deletedLogo
) => {
  const imageUpload = image[0];
  const authInstance = authentication;
  const currentUser = authInstance.currentUser;
  let finalUri;
  const fileName = new Date().getTime();
  try {
    if (newImage && deletedLogo) {
      console.log("is new image...started delete");
      // Create a reference to the file to delete
      const deletedRef = ref(
        storage,
        `imagesJobs/${firstLocation}/${deletedLogo}`
      );

      // Delete the file
      deleteObject(deletedRef)
        .then(() => {
          // File deleted successfully
          console.log("File deleted successfully");
        })
        .catch((error) => {
          console.log(
            "Uh-oh, an error occurred! AT uploadImage DELETE...",
            error
          );
          // Uh-oh, an error occurred!
        });
    }

    if (!imageUpload) {
      console.log("Please select an image");
      return;
    }

    if (imageUpload instanceof File) {
      console.log("TEst....");

      // Options for image compression
      const options = {
        maxSizeMB: 0.2, // (Max file size in MB)
        maxWidthOrHeight: 1920, // (Compressed files are scaled to these dimensions)
        useWebWorker: true, // (Use a web worker to perform the compression in a separate thread)
      };

      // Compress the image file
      const compressedFile = await imageCompression(imageUpload, options);

      const imageRef = ref(storage, `imagesJobs/${firstLocation}/${fileName}`);

      // Set the content type to image/jpeg
      const metadata = {
        contentType: "image/jpeg",
      };

      // Upload the image with metadata
      const snapshot = await uploadBytes(imageRef, compressedFile, metadata);

      // Get the download URL for the uploaded image
      finalUri = await getDownloadURL(snapshot.ref);

      console.log("Image uploaded successfully. Download URL:", finalUri);
    } else {
      return imageUpload;
    }
  } catch (error) {
    console.log("Error uploading image to storage:", error.message);
  }
  return { finalUri, fileName };
};

export const deleteImage = async (firstLocation, oldFileName) => {
  try {
    console.log("started delete...");
    // Create a reference to the file to delete
    const deletedRef = ref(
      storage,
      `imagesJobs/${firstLocation}/${oldFileName}`
    );

    // Delete the file
    deleteObject(deletedRef)
      .then(() => {
        // File deleted successfully
        console.log("File deleted successfully");
      })
      .catch((error) => {
        console.log("Uh-oh, an error occurred! AT image... DELETE...", error);
        // Uh-oh, an error occurred!
      });

    console.log("Image delete successfully...");
  } catch (error) {
    console.log("Error delete image from storage:");
  }
};

export const uploadMultipleImages = async (
  images, // Acesta va fi acum un array de imagini
  newImage,
  firstLocation,
  deletedImages
) => {
  const authInstance = authentication;
  const currentUser = authInstance.currentUser;
  let imgs = [];

  try {
    if (!images.length) {
      console.log("Please select an image");
      return;
    }

    if (newImage && deletedImages.length > 0) {
      console.log("is new image...started delete");
      // Presupunem că `imagesJobs.fileNames` este un array cu numele fișierelor pe care vrei să le ștergi
      // și că `firstLocation` este un string care reprezintă locația inițială a acestor fișiere în Firebase Storage

      for (let i = 0; i < deletedImages.length; i++) {
        const fileName = deletedImages[i].fileName; // Obținem fiecare nume de fișier din array
        const deletedRef = ref(
          storage,
          `imagesJobs/${firstLocation}/${fileName}`
        ); // Creăm referința la fișier

        try {
          await deleteObject(deletedRef); // Încercăm să ștergem fișierul
          console.log(`${fileName} deleted successfully`); // Logăm succesul dacă fișierul a fost șters
        } catch (error) {
          console.error(`Error deleting ${fileName}:`, error); // Logăm eroarea în caz de eșec
        }
      }
    }

    for (const imageUpload of images) {
      if (imageUpload instanceof File) {
        console.log("file...");
        const fileName =
          new Date().getTime() + "_" + images.indexOf(imageUpload); // Asigură unicitate
        const imageRef = ref(
          storage,
          `imagesJobs/${firstLocation}/${fileName}`
        );
        const metadata = {
          contentType: "image/jpeg",
        };

        // Options for image compression
        const options = {
          maxSizeMB: 0.2, // (Max file size in MB)
          maxWidthOrHeight: 1920, // (Compressed files are scaled to these dimensions)
          useWebWorker: true, // (Use a web worker to perform the compression in a separate thread)
        };

        // Compress the image file
        const compressedFile = await imageCompression(imageUpload, options);

        const snapshot = await uploadBytes(imageRef, compressedFile, metadata);
        const finalUri = await getDownloadURL(snapshot.ref);
        console.log("Image uploaded successfully. Download URL:", finalUri);

        imgs.push({ finalUri, fileName });
      } else {
        imgs.push({
          finalUri: imageUpload.finalUri,
          fileName: imageUpload.fileName,
        });
      }
    }
  } catch (error) {
    console.log("Error uploading image to storage:", error.message);
  }
  console.log("imgs...", imgs);
  return { imgs }; // Returnează array-uri cu URI-urile și numele fișierelor
};

export const deleteMultipleImages = async (
  firstLocation,
  oldFileNames // Acesta va fi acum un array de nume de fișiere
) => {
  try {
    console.log("Started delete...");
    for (const fileName of oldFileNames) {
      const deletedRef = ref(
        storage,
        `imagesJobs/${firstLocation}/${fileName}`
      );
      await deleteObject(deletedRef);
      console.log("File deleted successfully:", fileName);
    }
    console.log("All images delete successfully...");
  } catch (error) {
    console.log("Error delete image from storage:", error);
  }
};

// export async function getUrlImageApi() {
//   const imageRef = ref(storage, `imagesJobs/PozaApi/apiimage.jpeg`);
//   try {
//     const url = await getDownloadURL(imageRef);
//     writeImg(url);
//     return url;
//   } catch (error) {
//     console.error(error);
//     return null; // sau gestionează eroarea după cum consideri necesar
//   }
// }

//UPLOAD DOCUMENTE

export const handleUploadDocs = async (files, deletedFiles = []) => {
  const docsUrls = [];

  // Gestionarea fișierelor de șters
  if (deletedFiles.length > 0) {
    console.log("Start....delete.....", deletedFiles);
    for (const file of deletedFiles) {
      const deleteRef = ref(storage, `Documente/${file}`);
      try {
        await deleteObject(deleteRef);
        console.log(`${file} deleted successfully`);
      } catch (error) {
        console.error(`Error deleting file ${file}:`, error);
      }
    }
  }
  // Gestionarea fișierelor de încărcat
  for (const [index, file] of files.entries()) {
    if (file.docUrl) {
      // Dacă fișierul are deja un docUrl, îl adăugăm direct în lista docsUrls
      docsUrls.push({
        docUrl: file.docUrl,
        docName: file.docName,
        fileName: file.fileName,
      });
    } else {
      // Procesăm și încărcăm fișierele noi
      const timestamp = new Date().getTime();
      const fileExtension = file.name.split(".").pop();
      const docName = `${timestamp}_${index}.${fileExtension}`;
      const fileName = file.name;
      const storageRef = ref(storage, `Documente/${docName}`);

      try {
        const snapshot = await uploadBytes(storageRef, file);
        const docUrl = await getDownloadURL(snapshot.ref);
        console.log("File uploaded successfully. Download URL:", docUrl);

        // Adaugă URL-ul și numele fișierului în array-ul docsUrls
        docsUrls.push({
          docUrl,
          docName,
          fileName,
        });

        console.log(`Document ${fileName} uploaded and URL stored.`);
      } catch (error) {
        console.error("Error uploading document:", error);
      }
    }
  }

  return docsUrls;
};
