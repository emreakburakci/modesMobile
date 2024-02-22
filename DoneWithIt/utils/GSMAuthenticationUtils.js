import { Properties } from "./Properties.js";
import axios from "axios"; // if using Axios

export const authenticateGSM = async (identityNumber, enteredCode) => {
  /*
  const response = await fetch(
    "http://" +
      Properties.restSocket +
      "/confirmGSM?enteredCode=" +
      enteredCode +
      "&identityNumber=" +
      identityNumber,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  let data = await response.json();
  console.log("ConfirmGSM response: ", data.success);
  return data.success;

*/

  try {
    console.log("authenticateGSM runned");
    const response = await axios.post(
      "http://" + Properties.restSocket + "/confirmGSM",
      null, // No request body
      {
        params: {
          enteredCode: enteredCode,
          identityNumber: identityNumber,
        },
      }
    );

    // Assuming your API returns a boolean value
    return response.data; // This will be true or false based on the authentication
  } catch (error) {
    console.error("Error authenticating credentials:", error);
    return false; // Return false in case of any error
  }
};
export const clearGSMCode = async (identityNumber) => {
  const response = await fetch(
    "http://" +
      Properties.restSocket +
      "/clearGSMCode?identityNumber=" +
      identityNumber,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
