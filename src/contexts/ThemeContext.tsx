import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as _useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LightColors, DarkColors, ThemeColors } from '../theme/Colors';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextData {
  themeMode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
}

const THEME_STORAGE_KEY = '@pawcare:themeMode';

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = _useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadStoredTheme() {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          setThemeModeState(stored);
        }
      } catch (e) {
        console.error('Erro ao carregar tema:', e);
      } finally {
        setIsLoaded(true);
      }
    }
    loadStoredTheme();
  }, []);

  const isDark =
    themeMode === 'system' ? systemScheme === 'dark' : themeMode === 'dark';

  const colors = isDark ? DarkColors : LightColors;

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (e) {
      console.error('Erro ao salvar tema:', e);
    }
  };

  const toggleTheme = async () => {
    const nextMode = isDark ? 'light' : 'dark';
    await setThemeMode(nextMode);
  };

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        isDark,
        colors,
        setThemeMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextData {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser utilizado dentro de um ThemeProvider');
  }
  return context;
}
