import { urlToBlob } from "./urlToBlob";

export const getBlobFromUri = async (uri) => {
  try {
    // const fetchResponse = await urlToBlob(uri);
    const theBlob = await urlToBlob(uri);
    // const theBlob = await fetchResponse.blob();

    return theBlob;
  } catch (error) {
    // Handle any other errors that occurred while reading the image file
    console.error(`Error reading image file: ${uri}. Error: ${error.message}`);
  }
};
