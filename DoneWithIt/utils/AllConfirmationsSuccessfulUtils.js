import axios from "axios";
import { Properties } from "./Properties.js";

export const saveConfirmationInfo = async (identityNumber) => {
  try {
    const response = await axios.post(
      "http://" + Properties.restSocket + "/saveConfirmationInfo",
      null, // No request body
      {
        params: {
          identityNumber: identityNumber,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error sending data:", error);
    return false;
  }
};
