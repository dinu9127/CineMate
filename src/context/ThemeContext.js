import React, { createContext, useState, useMemo, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { light, dark } from '../theme/theme';

export const ThemeContext = createContext({ theme: light, toggle: () => {}, darkMode: false });

const STORAGE_KEY = 'CINEMATE_DARK_MODE';

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // load persisted preference
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw !== null) {
          setDarkMode(raw === '1');
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const toggle = async () => {
    try {
      setDarkMode(v => {
        const next = !v;
        AsyncStorage.setItem(STORAGE_KEY, next ? '1' : '0').catch(() => {});
        return next;
      });
    } catch (e) {
      // ignore
    }
  };

  const value = useMemo(() => ({ theme: darkMode ? dark : light, darkMode, toggle }), [darkMode]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
