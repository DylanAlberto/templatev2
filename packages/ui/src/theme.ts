import { createSystem, defaultConfig } from "@chakra-ui/react";

// Brand Palette - Primary actions and corporate identity
const brandColors = {
  50: { value: "#e6f1ff" },
  100: { value: "#b3d4ff" },
  200: { value: "#80b7ff" },
  300: { value: "#4d9aff" },
  400: { value: "#1a7dff" },
  500: { value: "#0066ff" }, // Primary brand color
  600: { value: "#0052cc" },
  700: { value: "#003d99" },
  800: { value: "#002966" },
  900: { value: "#001433" },
};

// Semantic Palette - Success, warning, and danger states
const semanticColors = {
  success: {
    50: { value: "#f0fdf4" },
    100: { value: "#dcfce7" },
    200: { value: "#bbf7d0" },
    300: { value: "#86efac" },
    400: { value: "#4ade80" },
    500: { value: "#22c55e" }, // Primary success color
    600: { value: "#16a34a" },
    700: { value: "#15803d" },
    800: { value: "#166534" },
    900: { value: "#14532d" },
  },
  warning: {
    50: { value: "#fffbeb" },
    100: { value: "#fef3c7" },
    200: { value: "#fde68a" },
    300: { value: "#fcd34d" },
    400: { value: "#fbbf24" },
    500: { value: "#f59e0b" }, // Primary warning color
    600: { value: "#d97706" },
    700: { value: "#b45309" },
    800: { value: "#92400e" },
    900: { value: "#78350f" },
  },
  danger: {
    50: { value: "#fef2f2" },
    100: { value: "#fee2e2" },
    200: { value: "#fecaca" },
    300: { value: "#fca5a5" },
    400: { value: "#f87171" },
    500: { value: "#ef4444" }, // Primary danger color
    600: { value: "#dc2626" },
    700: { value: "#b91c1c" },
    800: { value: "#991b1b" },
    900: { value: "#7f1d1d" },
  },
};

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        brand: brandColors,
        success: semanticColors.success,
        warning: semanticColors.warning,
        danger: semanticColors.danger,
        // Keep existing Chakra UI colors for compatibility
        blue: brandColors, // Map blue to brand for backward compatibility
        green: semanticColors.success, // Map green to success
        red: semanticColors.danger, // Map red to danger
        orange: semanticColors.warning, // Map orange to warning
      },
    },
    recipes: {
      button: {
        variants: {
          solid: {
            _hover: {
              transform: "translateY(-1px)",
              boxShadow: "md",
            },
            _active: {
              transform: "translateY(0px)",
            },
          },
        },
        defaultVariants: {
          colorPalette: "brand" as any,
        },
      },
    },
  },
});

// Export as default for backward compatibility
export default system;

