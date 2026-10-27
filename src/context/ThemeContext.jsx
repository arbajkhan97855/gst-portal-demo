import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('gst_theme') || 'light';
  });

  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('gst_fontsize') || 'normal';
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('gst_lang') || 'en';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('gst_theme', theme);
  }, [theme]);

  useEffect(() => {
    if (fontSize === 'large') {
      document.documentElement.style.fontSize = '17px';
    } else if (fontSize === 'small') {
      document.documentElement.style.fontSize = '14px';
    } else {
      document.documentElement.style.fontSize = '15px';
    }
    localStorage.setItem('gst_fontsize', fontSize);
  }, [fontSize]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('gst_lang', lang);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, fontSize, setFontSize, language, changeLanguage }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
