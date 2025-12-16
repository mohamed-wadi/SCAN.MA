import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Based on standard iPhone 11/12/13 width (approx 375-390)
const SCALE_BASE_WIDTH = 375;

export const scale = (size) => {
    const newSize = size * (SCREEN_WIDTH / SCALE_BASE_WIDTH);
    if (PixelRatio.get() >= 3.5) {
        // Catch-all for very large densities (optional)
        return newSize - 2;
    }
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export const widthPct = (percentage) => {
    const value = (percentage * SCREEN_WIDTH) / 100;
    return Math.round(value);
};

export const heightPct = (percentage) => {
    const value = (percentage * SCREEN_HEIGHT) / 100;
    return Math.round(value);
};
