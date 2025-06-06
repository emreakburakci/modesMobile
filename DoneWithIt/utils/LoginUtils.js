import CryptoJS from "crypto-js";
import axios from "axios";
import { Properties } from "./Properties.js";
export const authenticateCredentials = async (identityNumber, password) => {
  const hashedPassword = CryptoJS.MD5(password).toString();

  //let url = `http://192.168.1.33:8080/authenticateCredentials?identityNumber=${identityNumber}&password=${hashedPassword}`;

  try {
    const response = await axios.post(
      "http://" + Properties.restSocket + "/authenticateCredentials",
      null, // No request body
      {
        params: {
          identityNumber: identityNumber,
          password: hashedPassword,
        },
      }
    );

    return response.data; // This will be true or false based on the authentication
  } catch (error) {
    console.error("Error authenticating credentials:", error);
    return false; // Return false in case of any error
  }
};
