import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

// You can configure your fonts here.
// For a true MD3 feel, 'Roboto' is standard, but you can configure your custom fonts too.
const fontConfig = {
  fontFamily: "System", // Using the system font is a safe and clean choice.
};

// --- Light Theme ---
export const LightTheme = {
  ...MD3LightTheme,
  fonts: {
    ...MD3LightTheme.fonts,
    ...fontConfig,
  },
  colors: {
    ...MD3LightTheme.colors,
    primary: "#8c5000",
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

// --- Dark Theme ---
export const DarkTheme = {
  ...MD3DarkTheme,
  fonts: {
    ...MD3DarkTheme.fonts,
    ...fontConfig,
  },
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#ffb86e",
    onPrimary: "#4b2800",
    primaryContainer: "#6b3c00",
    onPrimaryContainer: "#ffdcbb",
    secondary: "#e2c1a3",
    onSecondary: "#402c18",
    secondaryContainer: "#59422d",
    onSecondaryContainer: "#feddbd",
    tertiary: "#c2cd9a",
    onTertiary: "#2c3410",
    tertiaryContainer: "#424b25",
    onTertiaryContainer: "#dee9b4",
    error: "#ffb4ab",
    onError: "#690005",
    errorContainer: "#93000a",
    onErrorContainer: "#ffdad6",
    background: "#18120d",
    onBackground: "#ece0d9",
    surface: "#18120d",
    onSurface: "#ece0d9",
    surfaceVariant: "#50453a",
    onSurfaceVariant: "#d5c3b5",
    outline: "#9d8e81",
    elevation: {
      ...MD3DarkTheme.colors.elevation,
      level2: "#342921", // Use for Cards
    },
  },
};
