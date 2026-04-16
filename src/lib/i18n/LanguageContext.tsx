"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import sv from "./sv";
import en from "./en";
import type { Translations } from "./sv";

type Lang = "sv" | "en";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translations;
}

const translations: Record<Lang, Translations> = { sv, en };

const LanguageContext = createContext<LanguageContextType>({
  lang: "sv",
  setLang: () => {},
  t: sv,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("sv");

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
