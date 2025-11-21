import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "./locales/en.json";
import esTranslations from "./locales/es.json";

const getInitialLanguage = (): string => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("language-storage");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.state?.language === "en" || parsed?.state?.language === "es") {
          return parsed.state.language;
        }
      } catch {
        // Fallback to localStorage.getItem("i18nextLng") if parsing fails
      }
    }
    const i18nextLng = localStorage.getItem("i18nextLng");
    if (i18nextLng === "en" || i18nextLng === "es") {
      return i18nextLng;
    }
  }
  return "en";
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
      es: {
        translation: esTranslations,
      },
    },
    lng: getInitialLanguage(),
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;

