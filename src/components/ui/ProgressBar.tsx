// src/components/ui/ProgressBar.tsx
import React from "react";
import { View } from "react-native";
import { theme } from "../../styles/theme";

type Props = { progress: number }; // 0~1

export default function ProgressBar({ progress }: Props) {
  // 0~100으로 변환 + 클램프
  const pct = Math.max(0, Math.min(100, Math.round(progress * 100)));

  return (
    <View style={{ marginTop: 10, alignSelf: "stretch" }}>
      {/* 트랙 */}
      <View
        style={{
          width: "100%",            // 부모 너비에 맞춰 늘어나게
          height: 12,
          borderRadius: 6,
          backgroundColor: "#E5E7EB",
          overflow: "hidden",       // 둥근 모서리 안에서 채움이 잘리도록
        }}
      >
        {/* 채움 */}
        <View
          style={{
            width: `${pct}%`,       // 70%면 70%만 채움
            height: "100%",         // 트랙 높이에 맞춤(이게 없으면 안 보임)
            backgroundColor: theme.colors.accent,
          }}
        />
      </View>
    </View>
  );
}
