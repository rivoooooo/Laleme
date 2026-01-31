
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ThemeMode, AppSettings } from '../types';
import { DEFAULT_PRIMARY } from '../constants';

interface ThemeContextType extends AppSettings {
  isDark: boolean;
  setPrimaryColor: (color: string) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setGlobalShared: (shared: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('laleme-settings');
    return saved ? JSON.parse(saved) : { 
      primaryColor: DEFAULT_PRIMARY, 
      themeMode: 'system',
      isGlobalShared: true 
    };
  });

  const [systemIsDark, setSystemIsDark] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  const isDark = settings.themeMode === 'dark' || (settings.themeMode === 'system' && systemIsDark);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    localStorage.setItem('laleme-settings', JSON.stringify(settings));
    
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    root.style.setProperty('--md-sys-color-primary', settings.primaryColor);
  }, [settings, isDark]);

  const setPrimaryColor = useCallback((primaryColor: string) => 
    setSettings(s => ({ ...s, primaryColor })), []);
    
  const setThemeMode = useCallback((themeMode: ThemeMode) => 
    setSettings(s => ({ ...s, themeMode })), []);

  const setGlobalShared = useCallback((isGlobalShared: boolean) =>
    setSettings(s => ({ ...s, isGlobalShared })), []);

  return (
    <ThemeContext.Provider value={{ ...settings, isDark, setPrimaryColor, setThemeMode, setGlobalShared }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useAppTheme must be used within ThemeProvider');
  return context;
};
