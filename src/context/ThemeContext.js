import { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { colors } from '../styles/colors';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const systemScheme = useColorScheme();
    const [isDark, setIsDark] = useState(systemScheme === 'dark');

    useEffect(() => {
        setIsDark(systemScheme === 'dark');
    }, [systemScheme]);

    const toggleTheme = () => {
        setIsDark(prev => !prev);
    };

    const themeColors = isDark ? { ...colors, ...colors.dark } : colors;

    const theme = {
        colors: themeColors,
        isDark,
        toggleTheme,
        // Re-export other theme values if needed, or just let components import static theme and override colors
        spacing: { xs: 4, s: 8, m: 16, l: 24, xl: 32, xxl: 48 },
        borderRadius: { s: 8, m: 12, l: 16, xl: 24, round: 9999 },
        shadows: isDark ? {} : { // No shadows in dark mode usually, or different ones
            small: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
            medium: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
            large: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 8 },
        },
        typography: {
            h1: { fontSize: 32, fontWeight: '700', color: themeColors.text },
            h2: { fontSize: 24, fontWeight: '700', color: themeColors.text },
            h3: { fontSize: 20, fontWeight: '600', color: themeColors.text },
            body: { fontSize: 16, fontWeight: '400', color: themeColors.text },
            caption: { fontSize: 12, fontWeight: '400', color: themeColors.textSecondary },
        }
    };

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};
