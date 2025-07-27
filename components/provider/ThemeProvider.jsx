import * as AllThemes from '@/constants/theme';
import React, { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext(null);

function ThemeProvider({ children }) {
    const [themeName, setThemeName] = useState('DarkBlue');
    const colorScheme = useColorScheme();

    const theme = useMemo(() => {
        const themeKey = `${themeName}${colorScheme === 'dark' ? 'DarkTheme' : 'LightTheme'}`;
        return AllThemes[themeKey] || AllThemes.ClassicDarkTheme;
    }, [themeName, colorScheme]);

    const value = { theme, themeName, setThemeName };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useAppTheme = () => {
    const context = useContext(ThemeContext);
    return context;
};

export default ThemeProvider;