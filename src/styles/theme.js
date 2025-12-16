import { colors } from './colors';

export const theme = {
    colors,
    spacing: {
        xs: 4,
        s: 8,
        m: 16,
        l: 24,
        xl: 32,
        xxl: 48,
    },
    borderRadius: {
        s: 8,
        m: 12,
        l: 16,
        xl: 24,
        round: 9999,
    },
    shadows: {
        small: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        },
        medium: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 4,
        },
        large: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 16,
            elevation: 8,
        },
    },
    typography: {
        h1: { fontSize: 32, fontWeight: '700' },
        h2: { fontSize: 24, fontWeight: '700' },
        h3: { fontSize: 20, fontWeight: '600' },
        body: { fontSize: 16, fontWeight: '400' },
        caption: { fontSize: 12, fontWeight: '400' },
    },
};
