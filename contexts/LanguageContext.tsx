import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';

type Language = 'en' | 'hi';
type Translations = Record<string, string>;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, variables?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('hi');
  const [translations, setTranslations] = useState<Record<Language, Translations>>({ en: {}, hi: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTranslations = async () => {
      setLoading(true);
      try {
        const [enResponse, hiResponse] = await Promise.all([
          fetch('/locales/en.json'),
          fetch('/locales/hi.json')
        ]);

        if (!enResponse.ok || !hiResponse.ok) {
            throw new Error('Failed to fetch translation files');
        }

        const [enData, hiData] = await Promise.all([
            enResponse.json(),
            hiResponse.json()
        ]);
        
        setTranslations({ en: enData, hi: hiData });
      } catch (error) {
        console.error("Failed to load translations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTranslations();
  }, []);

  const t = useCallback((key: string, variables: { [key: string]: string | number } = {}): string => {
    if (loading) return key; // Return key if translations are not loaded yet
    
    const langTranslations = translations[language];
    if (!langTranslations) {
        return key;
    }
    
    let translation = langTranslations[key] || key;
    
    Object.keys(variables).forEach(varKey => {
        const regex = new RegExp(`{${varKey}}`, 'g');
        translation = translation.replace(regex, String(variables[varKey]));
    });
    return translation;
  }, [language, translations, loading]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
