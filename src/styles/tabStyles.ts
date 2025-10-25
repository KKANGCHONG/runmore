// src/styles/tabStyles.ts
import { StyleSheet } from "react-native";
import { theme } from "./theme";

export const tab = StyleSheet.create({
  topBar: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4,
  },
  topBarTitleWrap: { flexDirection: "row", alignItems: "center" },
  topBarDot: { width: 18, height: 18, borderRadius: 4, backgroundColor: "#D9D9D9", marginRight: 8 },
  topBarTitle: { ...theme.typography.h1, color: "#333" },

  sectionHeader: {
    marginTop: theme.spacing.xl, marginBottom: theme.spacing.sm,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
  },
  sectionTitle: { ...theme.typography.h2, color: theme.colors.text },
  sectionAction: { ...theme.typography.body, color: theme.colors.textMuted },

  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
  },

  progressTrack: {
    marginTop: theme.spacing.md,
    height: 10,
    borderRadius: 6,
    backgroundColor: theme.colors.line,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 6,
    backgroundColor: "#9CA3AF",
  },
});
