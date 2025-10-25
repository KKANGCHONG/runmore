// src/components/ui/SectionHeader.tsx
import React from "react";
import { View, Text, Pressable } from "react-native";
import { tab } from "../../styles/tabStyles";

export default function SectionHeader({ title, actionText="수정", onPress }:{
  title: string; actionText?: string; onPress?: () => void;
}) {
  return (
    <View style={tab.sectionHeader}>
      <Text style={tab.sectionTitle}>{title}</Text>
      {onPress ? (
        <Pressable onPress={onPress} hitSlop={8}>
          <Text style={tab.sectionAction}>{actionText}</Text>
        </Pressable>
      ) : <View />}
    </View>
  );
}
