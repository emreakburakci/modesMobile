// GlobalStateContext.js: To keep global variables
import React, { createContext, useContext, useState } from "react";

const GlobalStateContext = createContext();

export const useGlobalState = () => useContext(GlobalStateContext);

export const GlobalStateProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState({
    language: "English",
    identityNumberGlobal: "",
    buttonColor: "#0d5989",
    isFaceConfirmedGlobal: false,
    isGSMConfirmedGlobal: false,
    isLocationConfirmedGlobal: false,
    notificationInterval: 10000,
    // Add more global variables here
  });

  const setIsFaceConfirmedGlobal = (isFaceConfirmedGlobal) => {
    setGlobalState((prevState) => ({
      ...prevState,
      isFaceConfirmedGlobal,
    }));
  };

  const setIsGSMConfirmedGlobal = (isGSMConfirmedGlobal) => {
    setGlobalState((prevState) => ({
      ...prevState,
      isGSMConfirmedGlobal,
    }));
  };

  const setIsLocationConfirmedGlobal = (isLocationConfirmedGlobal) => {
    setGlobalState((prevState) => ({
      ...prevState,
      isLocationConfirmedGlobal,
    }));
  };

  const setLanguage = (language) => {
    setGlobalState((prevState) => ({
      ...prevState,
      language,
    }));
  };

  const setGlobalIdentityNumber = (identityNumber) => {
    setGlobalState((prevState) => ({
      ...prevState,
      setGlobalIdentityNumber: identityNumber,
    }));
  };

  const setNotificationInterval = (notificationInterval) => {
    setGlobalState((prevState) => ({
      ...prevState,
      setNotificationInterval: notificationInterval,
    }));
  };

  return (
    <GlobalStateContext.Provider
      value={{
        globalState,
        setLanguage,
        setGlobalIdentityNumber,
        setIsFaceConfirmedGlobal,
        setIsGSMConfirmedGlobal,
        setIsLocationConfirmedGlobal,
        setNotificationInterval,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};
