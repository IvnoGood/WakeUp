// constants/themes.js
/*
All current themes:
Classic: #ffb86e
DarkBlue: #182732
Forest Green: #27391C
Deep Purple: #2A004E
Muted Magenta: #8C3061
Neutral Gray: #DDDDDD
*/

import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

const fontConfig = {
  fontFamily: "System",
};

// --- Classic Light Theme ---
export const ClassicLightTheme = {
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

export const ClassicDarkTheme = {
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

// --- Theme 1: Based on Dark Blue (#182732) ---
export const DarkBlueLightTheme = {
  ...MD3LightTheme,
  fonts: { ...MD3LightTheme.fonts, ...fontConfig },
  colors: {
    ...MD3LightTheme.colors,
    primary: "#00668a",
    onPrimary: "#ffffff",
    primaryContainer: "#c4e7ff",
    onPrimaryContainer: "#001e2c",
    secondary: "#4e616d",
    onSecondary: "#ffffff",
    secondaryContainer: "#d1e5f4",
    onSecondaryContainer: "#0a1e28",
    tertiary: "#615a7d",
    onTertiary: "#ffffff",
    tertiaryContainer: "#e7deff",
    onTertiaryContainer: "#1d1736",
    background: "#f8f9fc",
    onBackground: "#191c1e",
    surface: "#f8f9fc",
    onSurface: "#191c1e",
    surfaceVariant: "#dde3e9",
    onSurfaceVariant: "#41484d",
    outline: "#71787e",
    elevation: { ...MD3LightTheme.colors.elevation, level2: "#f0f3f7" },
  },
};

export const DarkBlueDarkTheme = {
  ...MD3DarkTheme,
  fonts: { ...MD3DarkTheme.fonts, ...fontConfig },
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#6dd2ff",
    onPrimary: "#003448",
    primaryContainer: "#004c67",
    onPrimaryContainer: "#c4e7ff",
    secondary: "#b5c9d7",
    onSecondary: "#20333e",
    secondaryContainer: "#374955",
    onSecondaryContainer: "#d1e5f4",
    tertiary: "#cac1e5",
    onTertiary: "#322c4c",
    tertiaryContainer: "#494264",
    onTertiaryContainer: "#e7deff",
    background: "#111416",
    onBackground: "#e1e2e4",
    surface: "#111416",
    onSurface: "#e1e2e4",
    surfaceVariant: "#41484d",
    onSurfaceVariant: "#c1c7cd",
    outline: "#8b9298",
    elevation: { ...MD3DarkTheme.colors.elevation, level2: "#232c32" },
  },
};

// --- Theme 2: Based on Forest Green (#27391C) ---
export const ForestGreenLightTheme = {
  ...MD3LightTheme,
  fonts: { ...MD3LightTheme.fonts, ...fontConfig },
  colors: {
    ...MD3LightTheme.colors,
    primary: "#436816",
    onPrimary: "#ffffff",
    primaryContainer: "#c2f18e",
    onPrimaryContainer: "#0e2000",
    secondary: "#586249",
    onSecondary: "#ffffff",
    secondaryContainer: "#dce7c8",
    onSecondaryContainer: "#161e0b",
    tertiary: "#386666",
    onTertiary: "#ffffff",
    tertiaryContainer: "#bbecea",
    onTertiaryContainer: "#002020",
    background: "#fdfcf5",
    onBackground: "#1b1c18",
    surface: "#fdfcf5",
    onSurface: "#1b1c18",
    surfaceVariant: "#e1e4d5",
    onSurfaceVariant: "#44483d",
    outline: "#75796c",
    elevation: { ...MD3LightTheme.colors.elevation, level2: "#f5f7ed" },
  },
};

export const ForestGreenDarkTheme = {
  ...MD3DarkTheme,
  fonts: { ...MD3DarkTheme.fonts, ...fontConfig },
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#a7d475",
    onPrimary: "#1a3700",
    primaryContainer: "#2e4f00",
    onPrimaryContainer: "#c2f18e",
    secondary: "#bfcba2",
    onSecondary: "#2b331e",
    secondaryContainer: "#414a33",
    onSecondaryContainer: "#dce7c8",
    tertiary: "#a0cfd0",
    onTertiary: "#003738",
    tertiaryContainer: "#1e4e4e",
    onTertiaryContainer: "#bbecea",
    background: "#131410",
    onBackground: "#e4e3db",
    surface: "#131410",
    onSurface: "#e4e3db",
    surfaceVariant: "#44483d",
    onSurfaceVariant: "#c5c8ba",
    outline: "#8e9285",
    elevation: { ...MD3DarkTheme.colors.elevation, level2: "#252b21" },
  },
};

// --- Theme 3: Based on Deep Purple (#2A004E) ---
export const DeepPurpleLightTheme = {
  ...MD3LightTheme,
  fonts: { ...MD3LightTheme.fonts, ...fontConfig },
  colors: {
    ...MD3LightTheme.colors,
    primary: "#8e00ce",
    onPrimary: "#ffffff",
    primaryContainer: "#f4d8ff",
    onPrimaryContainer: "#2e0048",
    secondary: "#6a596f",
    onSecondary: "#ffffff",
    secondaryContainer: "#f3dbf6",
    onSecondaryContainer: "#24172a",
    tertiary: "#82524a",
    onTertiary: "#ffffff",
    tertiaryContainer: "#ffd9d1",
    onTertiaryContainer: "#33110c",
    background: "#fff7fa",
    onBackground: "#1f1a1d",
    surface: "#fff7fa",
    onSurface: "#1f1a1d",
    surfaceVariant: "#ecdfeb",
    onSurfaceVariant: "#4e444d",
    outline: "#80747d",
    elevation: { ...MD3LightTheme.colors.elevation, level2: "#fbeffd" },
  },
};

export const DeepPurpleDarkTheme = {
  ...MD3DarkTheme,
  fonts: { ...MD3DarkTheme.fonts, ...fontConfig },
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#e4b3ff",
    onPrimary: "#4c0074",
    primaryContainer: "#6e00a2",
    onPrimaryContainer: "#f4d8ff",
    secondary: "#d6bfda",
    onSecondary: "#3a2b3f",
    secondaryContainer: "#524156",
    onSecondaryContainer: "#f3dbf6",
    tertiary: "#f6b8ac",
    onTertiary: "#4c251f",
    tertiaryContainer: "#673b34",
    onTertiaryContainer: "#ffd9d1",
    background: "#181216",
    onBackground: "#e9e0e4",
    surface: "#181216",
    onSurface: "#e9e0e4",
    surfaceVariant: "#4e444d",
    onSurfaceVariant: "#d0c3ce",
    outline: "#998d97",
    elevation: { ...MD3DarkTheme.colors.elevation, level2: "#2a2328" },
  },
};

// --- Theme 4: Based on Muted Magenta (#8C3061) ---
export const MutedMagentaLightTheme = {
  ...MD3LightTheme,
  fonts: { ...MD3LightTheme.fonts, ...fontConfig },
  colors: {
    ...MD3LightTheme.colors,
    primary: "#993f70",
    onPrimary: "#ffffff",
    primaryContainer: "#ffd8e8",
    onPrimaryContainer: "#3e0028",
    secondary: "#745663",
    onSecondary: "#ffffff",
    secondaryContainer: "#ffd9e6",
    onSecondaryContainer: "#2b151f",
    tertiary: "#7e5538",
    onTertiary: "#ffffff",
    tertiaryContainer: "#ffdcc2",
    onTertiaryContainer: "#301400",
    background: "#fff7f8",
    onBackground: "#201a1c",
    surface: "#fff7f8",
    onSurface: "#201a1c",
    surfaceVariant: "#f2dde3",
    onSurfaceVariant: "#504348",
    outline: "#837378",
    elevation: { ...MD3LightTheme.colors.elevation, level2: "#fbf0f2" },
  },
};

export const MutedMagentaDarkTheme = {
  ...MD3DarkTheme,
  fonts: { ...MD3DarkTheme.fonts, ...fontConfig },
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#ffafd2",
    onPrimary: "#5f0d40",
    primaryContainer: "#7c2657",
    onPrimaryContainer: "#ffd8e8",
    secondary: "#e2bdcb",
    onSecondary: "#422934",
    secondaryContainer: "#5b3f4a",
    onSecondaryContainer: "#ffd9e6",
    tertiary: "#f1be9b",
    onTertiary: "#4a280f",
    tertiaryContainer: "#633e23",
    onTertiaryContainer: "#ffdcc2",
    background: "#181214",
    onBackground: "#ece0e2",
    surface: "#181214",
    onSurface: "#ece0e2",
    surfaceVariant: "#504348",
    onSurfaceVariant: "#d5c2c7",
    outline: "#9d8c91",
    elevation: { ...MD3DarkTheme.colors.elevation, level2: "#2a2226" },
  },
};

// --- Theme 5: Based on Neutral Gray (#DDDDDD) ---
export const NeutralGrayLightTheme = {
  ...MD3LightTheme,
  fonts: { ...MD3LightTheme.fonts, ...fontConfig },
  colors: {
    ...MD3LightTheme.colors,
    primary: "#606061",
    onPrimary: "#ffffff",
    primaryContainer: "#e6e0e7",
    onPrimaryContainer: "#1d1b1e",
    secondary: "#615d6c",
    onSecondary: "#ffffff",
    secondaryContainer: "#e7e0f2",
    onSecondaryContainer: "#1d1b26",
    tertiary: "#7d5260",
    onTertiary: "#ffffff",
    tertiaryContainer: "#ffd8e2",
    onTertiaryContainer: "#31111d",
    background: "#fef7ff",
    onBackground: "#1d1b1e",
    surface: "#fef7ff",
    onSurface: "#1d1b1e",
    surfaceVariant: "#e7e0eb",
    onSurfaceVariant: "#49454e",
    outline: "#7a757e",
    elevation: { ...MD3LightTheme.colors.elevation, level2: "#f6eff9" },
  },
};

export const NeutralGrayDarkTheme = {
  ...MD3DarkTheme,
  fonts: { ...MD3DarkTheme.fonts, ...fontConfig },
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#cac4d0",
    onPrimary: "#323033",
    primaryContainer: "#49464a",
    onPrimaryContainer: "#e6e0e7",
    secondary: "#cac3dc",
    onSecondary: "#322f3b",
    secondaryContainer: "#494553",
    onSecondaryContainer: "#e7e0f2",
    tertiary: "#efb8c8",
    onTertiary: "#492532",
    tertiaryContainer: "#633b48",
    onTertiaryContainer: "#ffd8e2",
    background: "#151316",
    onBackground: "#e6e1e6",
    surface: "#151316",
    onSurface: "#e6e1e6",
    surfaceVariant: "#49454e",
    onSurfaceVariant: "#cac4cf",
    outline: "#948f99",
    elevation: { ...MD3DarkTheme.colors.elevation, level2: "#262429" },
  },
};
