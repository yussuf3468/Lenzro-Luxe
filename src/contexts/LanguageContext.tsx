import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { translations } from "../utils/translations";

export type Language = "en" | "so";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("lenzro-language");
    if (saved === "en" || saved === "so") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("lenzro-language", lang);
  };

  // Helper: split "English / Somali" based on current language
  const mapTranslations = (lang: Language) => {
    const pick = (value: string) => {
      const parts = value.split("/");
      if (parts.length < 2) return value;
      return lang === "en" ? parts[0].trim() : parts[1].trim();
    };

    const walk = (obj: any): any => {
      if (typeof obj === "string") return pick(obj);
      if (Array.isArray(obj)) return obj.map(walk);
      if (obj && typeof obj === "object") {
        const result: any = {};
        for (const key of Object.keys(obj)) {
          result[key] = walk(obj[key]);
        }
        return result;
      }
      return obj;
    };

    return walk(translations) as typeof translations;
  };

  const value: LanguageContextValue = {
    language,
    setLanguage,
    t: mapTranslations(language),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
