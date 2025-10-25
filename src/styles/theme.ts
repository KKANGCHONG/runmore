export const theme = {
  colors: {
    bg: "#FFFFFF",
    text: "#111827",
    textMuted: "#6B7280",
    textSecondary: "#374151",
    line: "#E5E7EB",
    surface: "#F3F4F6",
    accent: "#6a480eff",
    accentMuted: "#f8cb7dff",
  },
  spacing: {
    xs: 6, sm: 10, md: 14, lg: 20, xl: 24,
  },
  radius: {
    sm: 8, md: 12, lg: 16, xl: 20,
  },
  typography: {
    h1: { fontSize: 22, fontWeight: "700" as const },
    h2: { fontSize: 18, fontWeight: "700" as const },
    body: { fontSize: 15, fontWeight: "400" as const },
    label: { fontSize: 13, fontWeight: "500" as const },
  },
  shadow: {
    card: {
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    },
  },
};
export type Theme = typeof theme;
