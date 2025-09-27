// --- Classic Light Theme ---

const fontConfig = {
    fontFamily: "System",
};

export const ClassicLightTheme = {
    ...MD3LightTheme,
    fonts: {
        ...MD3LightTheme.fonts,
        ...fontConfig,
    },
    colors: {
        ...MD3LightTheme.colors,
        primary: "#6a553aff",
        onPrimary: "#ffffff",
        primaryContainer: "#ffdcbb",
        onPrimaryContainer: "#2d1600",
        secondary: "#735a42",
        onSecondary: "#ffffff",
        secondaryContainer: "#feddbd",
        onSecondaryContainer: "#291806",
        tertiary: "#5a633a",
        onTertiary: "#ffffff",
        tertiaryContainer: "#dee9b4",
        onTertiaryContainer: "#181e01",
        error: "#ba1a1a",
        onError: "#ffffff",
        errorContainer: "#ffdad6",
        onErrorContainer: "#410002",
        background: "#fff8f4",
        onBackground: "#201a15",
        surface: "#fff8f4",
        onSurface: "#201a15",
        surfaceVariant: "#f2dfd0",
        onSurfaceVariant: "#50453a",
        outline: "#837468",
        elevation: {
            ...MD3LightTheme.colors.elevation,
            level2: "#fcf2e9", // Use for Cards
        },
    },
};