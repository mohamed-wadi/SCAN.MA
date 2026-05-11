import { colors } from './colors';

// Custom Victory Theme matching the app's design
export const chartTheme = {
    axis: {
        style: {
            axis: {
                fill: "transparent",
                stroke: colors.textSecondary,
                strokeWidth: 1,
            },
            grid: {
                fill: "none",
                stroke: colors.border,
                strokeDasharray: "10, 5",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                pointerEvents: "painted",
            },
            ticks: {
                fill: "transparent",
                size: 5,
                stroke: colors.textSecondary,
                strokeWidth: 1,
                strokeLinecap: "round",
                strokeLinejoin: "round",
            },
            tickLabels: {
                fontFamily: "System",
                fontSize: 10,
                letterSpacing: "normal",
                padding: 8,
                fill: colors.textSecondary,
                stroke: "transparent",
                strokeWidth: 0,
            },
        },
    },
    line: {
        style: {
            data: {
                fill: "transparent",
                opacity: 1,
                stroke: colors.primary,
                strokeWidth: 3,
            },
        },
    },
};
