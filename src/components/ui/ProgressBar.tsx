// src/components/ui/ProgressBar.tsx
import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const FIGMA_WIDTH = 390;
const FIGMA_HEIGHT = 844;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const wp = (px: number) => (px / FIGMA_WIDTH) * SCREEN_WIDTH;
const hp = (px: number) => (px / FIGMA_HEIGHT) * SCREEN_HEIGHT;

type Props = { progress: number }; // 0~1

export default function ProgressBar({ progress }: Props) {
  // 0~100으로 변환 + 클램프
  const pct = Math.max(0, Math.min(100, progress * 100));

  return (
    <View style={styles.container}>
      {/* 트랙 */}
      <View style={styles.track}>
        {/* 채움 - 그라데이션 적용 */}
        {pct > 0 && (
          <LinearGradient
            colors={["#FB8800", "#FFD360"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.fill, { width: `${pct}%` }]}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: hp(20),
  },
  track: {
    width: "100%",
    height: "100%",
    borderRadius: wp(999), // 완전히 둥근 모서리
    backgroundColor: "#F6F4F2",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: wp(999),
  },
});
