import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Language = "en" | "es";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const getInitialLanguage = (): Language => {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("language-storage");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.state?.language === "en" || parsed?.state?.language === "es") {
          return parsed.state.language;
        }
      }
      const i18nextLng = localStorage.getItem("i18nextLng");
      if (i18nextLng === "en" || i18nextLng === "es") {
        return i18nextLng;
      }
    } catch {
      // Fallback to "en" if parsing fails
    }
  }
  return "en";
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: getInitialLanguage(),
      setLanguage: (lang: Language) => {
        set({ language: lang });
        if (typeof window !== "undefined") {
          localStorage.setItem("i18nextLng", lang);
        }
      },
    }),
    {
      name: "language-storage",
      storage: createJSONStorage(() => 
        typeof window !== "undefined" ? localStorage : {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
          clear: () => {},
          get length() {
            return 0;
          },
          key: () => null,
        } satisfies Storage
      ),
      skipHydration: true,
    }
  )
);

