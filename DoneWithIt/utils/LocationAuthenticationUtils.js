//addressResponse will be used to confirm location
import { Properties } from "./Properties.js";
import axios from "axios";
import publicIP from "react-native-public-ip";
import * as Location from "expo-location";

export const confirmLocation = async (
  identityNumberGlobal,
  location,
  addressResponse
) => {
  try {
    console.log(
      "ADDRESS RESPONSE: ",
      addressResponse,
      "SUBREGION: ",
      addressResponse[0].subregion
    );
    const response = await fetch(
      "http://" +
        Properties.restSocket +
        "/confirmLocation?country=" +
        addressResponse[0].country +
        "&region=" +
        addressResponse[0].region +
        "&subregion=" +
        addressResponse[0].subregion +
        "&district=" +
        addressResponse[0].district +
        "&postalCode=" +
        addressResponse[0].postalCode +
        "&identityNumber=" +
        identityNumberGlobal,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.log(response);
      throw new Error("Failed to confirm location");
    }

    const data = await response.json();
    console.log("Location confirmed:", data);
    return data.success;
    // Handle success response
  } catch (error) {
    console.error("Error confirming location:", error.message);
    // Handle error
  }
};
