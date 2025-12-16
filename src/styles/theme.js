import { scale } from '../utils/responsive';

export const theme = {
    colors: {
        primary: '#34C759', // Green
        secondary: '#007AFF', // Blue
        background: '#F2F2F7', // iOS Light Gray
        card: '#FFFFFF',
        text: '#000000',
        textSecondary: '#8E8E93',
        border: '#C6C6C8',
        notification: '#FF3B30',
        success: '#34C759',
        danger: '#FF3B30',
        warning: '#FFCC00',
    },
    spacing: {
        xs: scale(4),
        s: scale(8),
        m: scale(16),
        l: scale(24),
        xl: scale(32),
        xxl: scale(48),
    },
    borderRadius: {
        s: scale(8),
        m: scale(12),
        l: scale(16),
        xl: scale(24),
        full: 9999,
    },
    shadows: {
        small: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: scale(2) },
            shadowOpacity: 0.1,
            shadowRadius: scale(4),
            elevation: 2,
        },
        medium: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: scale(4) },
            shadowOpacity: 0.15,
            shadowRadius: scale(8),
            elevation: 4,
        },
        large: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: scale(8) },
            shadowOpacity: 0.2,
            shadowRadius: scale(16),
            elevation: 8,
        },
    },
    typography: {
        h1: { fontSize: scale(32), fontWeight: '700' },
        h2: { fontSize: scale(24), fontWeight: '700' },
        h3: { fontSize: scale(20), fontWeight: '600' },
        body: { fontSize: scale(16), fontWeight: '400' },
        caption: { fontSize: scale(12), fontWeight: '400', color: '#8E8E93' },
        button: { fontSize: scale(16), fontWeight: '600' },
    },
};
