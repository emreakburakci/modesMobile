import { Properties } from "./Properties.js";

export const getUserInformation = async (identityNumber) => {
  const response = await fetch(
    "http://" +
      Properties.restSocket +
      "/getUser?identityNumber=" +
      identityNumber,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    console.log(response);
    throw new Error("Failed get user");
  }
  let responseJson = await response.json();

  return responseJson;
};
