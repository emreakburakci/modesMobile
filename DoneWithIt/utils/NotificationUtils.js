import { Properties } from "./Properties.js";
import axios from "axios";

export const getNotifications = async (identityNumber) => {
  const response = await fetch(
    "http://" +
      Properties.restSocket +
      "/getUserNotifications?identityNumber=" +
      identityNumber,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Notification Utils Failed get user");
  }

  let responseJson = await response.json();
  console.log("NOT. UTILS:", responseJson);
  return responseJson;
};

export const getUnreadNotifications = async (identityNumber) => {
  const response = await fetch(
    "http://" +
      Properties.restSocket +
      "/getUnreadUserNotifications?identityNumber=" +
      identityNumber,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed get user");
  }

  let responseJson = await response.json();
  console.log("NOT. UTILS:", responseJson);
  return responseJson;
};

export const getReadNotifications = async (identityNumber) => {
  const response = await fetch(
    "http://" +
      Properties.restSocket +
      "/getReadUserNotifications?identityNumber=" +
      identityNumber,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed get user");
  }

  let responseJson = await response.json();
  console.log("NOT. UTILS:", responseJson);
  return responseJson;
};

export const setNotificationRead = async (identityNumber, notificationId) => {
  const response = await fetch(
    "http://" +
      Properties.restSocket +
      "/setNotificationRead?identityNumber=" +
      identityNumber +
      "&notificationId=" +
      notificationId,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed get user");
  }

  let responseJson = await response.json();
  console.log("NOT. UTILS:", responseJson);
  return responseJson;
};

export const getUnreadNotificationsCount = async (identityNumber) => {
  console.log("Identity number:", identityNumber);

  const response = await fetch(
    "http://" +
      Properties.restSocket +
      "/getUnreadNotificationsCount?identityNumber=" +
      identityNumber,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed get count");
  }

  let responseJson = await response.json();
  console.log("NOT. UTILS:", responseJson);
  return responseJson;
};
