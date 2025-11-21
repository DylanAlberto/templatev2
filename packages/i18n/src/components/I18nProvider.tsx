"use client";

import { useEffect, type ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import { useLanguageStore } from "@templatev2/config";
import i18n from "../i18n";

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const { language } = useLanguageStore();

  useEffect(() => {
    if (typeof window !== "undefined" && i18n.language !== language) {
      i18n.changeLanguage(language);
      localStorage.setItem("i18nextLng", language);
    }
  }, [language]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

