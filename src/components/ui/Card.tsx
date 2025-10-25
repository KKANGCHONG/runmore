// src/components/ui/Card.tsx
import React, { PropsWithChildren } from "react";
import { View, ViewStyle } from "react-native";
import { tab } from "../../styles/tabStyles";
import { theme } from "../../styles/theme";

export default function Card({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return <View style={[tab.card, theme.shadow.card, style]}>{children}</View>;
}
