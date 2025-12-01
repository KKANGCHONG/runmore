import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

const FIGMA_WIDTH = 390;
const FIGMA_HEIGHT = 844;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const wp = (px: number) => (px / FIGMA_WIDTH) * SCREEN_WIDTH;
const hp = (px: number) => (px / FIGMA_HEIGHT) * SCREEN_HEIGHT;

// 아이콘 이미지 (SVG)
import FireIcon from "../../../assets/figma/fire_icon.svg";
import RunningShoeIcon from "../../../assets/figma/running_shoe_icon.svg";
import ClockIcon from "../../../assets/figma/clock_icon.svg";

type Props = {
  pace: string; // "15:00" 형식
  distance: string; // "0.96km" 형식
  time: string; // "7' 6\"" 형식
};

export default function RunMetrics({ pace, distance, time }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.metricsRow}>
        {/* 페이스 */}
        <View style={styles.metricItem}>
          <FireIcon width={wp(32)} height={wp(32)} />
          <Text style={styles.label}>페이스</Text>
          <Text style={styles.value}>{pace}</Text>
        </View>

        {/* 거리 */}
        <View style={styles.metricItem}>
          <RunningShoeIcon width={wp(32)} height={wp(32)} />
          <Text style={styles.label}>거리</Text>
          <Text style={styles.value}>{distance}</Text>
        </View>

        {/* 시간 */}
        <View style={styles.metricItem}>
          <ClockIcon width={wp(32)} height={wp(32)} />
          <Text style={styles.label}>시간</Text>
          <Text style={styles.value}>{time}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: hp(213),
    left: wp(24),
    right: wp(24),
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: wp(10.712),
    padding: wp(13.932),
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    gap: wp(20),
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
    gap: hp(4),
  },
  icon: {
    width: wp(32),
    height: wp(32),
  },
  label: {
    fontSize: wp(16),
    fontWeight: "600",
    color: "#A0958C",
    fontFamily: "Pretendard-SemiBold",
    letterSpacing: wp(-0.4),
  },
  value: {
    fontSize: wp(22),
    fontWeight: "700",
    color: "#332A27",
    fontFamily: "Pretendard-Bold",
    letterSpacing: wp(-0.55),
  },
});

