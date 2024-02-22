import { enTranslations } from "../languageResources/en";
import { trTranslations } from "../languageResources/tr";
import { arTranslations } from "../languageResources/ar";

export const getTranslationResource = (selectedLanguage) => {
  if (selectedLanguage === "Arabic") {
    return arTranslations;
  } else if (selectedLanguage === "Turkish") {
    return trTranslations;
  } else if (selectedLanguage === "English") {
    return enTranslations;
  }
  //Default language English
  return enTranslations;
};
