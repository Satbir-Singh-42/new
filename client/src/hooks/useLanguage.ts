import { useState, useEffect, createContext, useContext } from 'react';
import { Language, getTranslations, Translation } from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translation;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const useLanguageState = () => {
  // Get initial language from localStorage or default to English
  const getInitialLanguage = (): Language => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('face2finance_language');
      if (stored && ['en', 'hi', 'pa'].includes(stored)) {
        return stored as Language;
      }
    }
    return 'en';
  };

  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const [t, setTranslations] = useState<Translation>(getTranslations(language));

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    
    // Store in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('face2finance_language', lang);
    }
  };

  // Update translations when language changes
  useEffect(() => {
    setTranslations(getTranslations(language));
  }, [language]);

  return {
    language,
    setLanguage,
    t
  };
};