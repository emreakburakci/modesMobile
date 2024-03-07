import { useGlobalState } from "../GlobalStateContext";
import { Properties } from "./Properties.js";

/*export const authenticateFace = (photos) => {
  //photos will be sent to the face confirmation service
  return true;
};
*/
import * as FileSystem from "expo-file-system";

export const authenticateFace = async (identityNumber, photos) => {
  //FOR TEST USE ONLY
  //return true;
  console.log("AUTHENTICATE FACE RUNNED");

  //1 FRONT
  //2 LEFT
  //3 RIGHT
  const formData = new FormData();
  formData.append("identityNumber", identityNumber);
  formData.append("frontPhoto", {
    uri: photos[0].uri,
    type: "image/jpeg",
    name: "photo.jpg",
  });
  // FACE LOOKING RIGHT
  formData.append("rightPhoto", {
    uri: photos[1].uri,
    type: "image/jpeg",
    name: "leftPhoto.jpg",
  });
  // FACE LOOKING LEFT
  formData.append("leftPhoto", {
    uri: photos[2].uri,
    type: "image/jpeg",
    name: "rightPhoto.jpg",
  });

  try {
    const response = await fetch(
      "http://" + Properties.restSocket + "/confirmPhoto",
      {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          // add any additional headers if needed
        },
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      // Handle the response from the server
      console.log("RESPONSE FROM CONFIRM FACE API:", responseData);

      return responseData.success; // Adjust this according to your server response
    } else {
      // Handle the error
      console.error("Failed to authenticate face:", response.status);
      return false;
    }
  } catch (error) {
    console.error("Error while sending photo:", error);
    return false;
  }
};
