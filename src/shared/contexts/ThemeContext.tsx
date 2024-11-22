import { createContext, useCallback, useState, useMemo, useContext } from "react";
import { Box, ThemeProvider } from "@mui/material";
import { DarkTheme, LightTheme } from "./../themes";

interface iThemeContextData {
  themeName: 'light' | 'dark';
  toggleTheme: () => void;
}

interface AppThemeProviderProps {
  children: React.ReactNode; 
}

const ThemeContext = createContext( { } as iThemeContextData ); 

export const useAppThemeContext = () => {
  return useContext(ThemeContext);
}

export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({children}) => {
  const [themeName, setThemeName] = useState <'light' | 'dark'>('light');

  const toggleTheme = useCallback(() => {
    setThemeName(oldThemeName => oldThemeName === 'light' ? 'dark' : 'light');
  }, [])

  const theme = useMemo(() => {
    if (themeName === 'light') return LightTheme;
  
    return DarkTheme;
  }, [themeName]);

  return (
    
    <ThemeContext.Provider value={{themeName, toggleTheme}} >
      <ThemeProvider theme={theme}>
        <Box width="100%" height="100vh" bgcolor={theme.palette.background.default}>
         {children}
        </Box>
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}