// src/styles/globalStyles.ts
import { StyleSheet } from "react-native";
import { theme } from "./theme";

export const g = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  screenContainer: { paddingHorizontal: theme.spacing.lg, paddingBottom: 40 },
  muted: { color: theme.colors.textMuted },
  h1: { ...theme.typography.h1, color: theme.colors.text },
  h2: { ...theme.typography.h2, color: theme.colors.text },
  body: { ...theme.typography.body, color: theme.colors.textSecondary },
});
