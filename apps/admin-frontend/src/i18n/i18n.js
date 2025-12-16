import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "./locales/en/common.json";
import npCommon from "./locales/np/common.json";
import { Cookies } from "react-cookie";

const resources = {
  en: {
    common: enCommon,
  },
  np: {
    common: npCommon,
  },
};
const cookies = new Cookies();

i18n.use(initReactI18next).init({
  resources,
  lng: cookies.get("langauge") || "en",
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },

  defaultNS: "common",
  ns: ["common"],
});

export default i18n;
