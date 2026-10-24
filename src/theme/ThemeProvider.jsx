import React, { createContext, useContext } from 'react';
import { theme } from './tokens';
const ThemeContext = createContext(theme);
export const useTheme = () => useContext(ThemeContext);
export function ThemeProvider({ children, value = theme }) {
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
