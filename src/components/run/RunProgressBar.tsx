import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const FIGMA_WIDTH = 390;
const FIGMA_HEIGHT = 844;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const wp = (px: number) => (px / FIGMA_WIDTH) * SCREEN_WIDTH;
const hp = (px: number) => (px / FIGMA_HEIGHT) * SCREEN_HEIGHT;

const MAX_CARROT_PER_RUN = 4;

type Props = {
  carrotCount: number; // 0~4
};

export default function RunProgressBar({ carrotCount }: Props) {
  const progressRatio = carrotCount / MAX_CARROT_PER_RUN;
  const progressWidth = SCREEN_WIDTH * progressRatio;
  const progressPercent = Math.round(progressRatio * 100);

  return (
    <View style={styles.container}>
      <View style={styles.progressBackground}>
        <LinearGradient
          colors={["#FFA234", "#FFCE5B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressFill, { width: progressWidth }]}
        />
      </View>
      {progressPercent >= 70 && (
        <View style={styles.achievementBadge}>
          <Text style={styles.achievementText}>{progressPercent}% 달성!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: hp(62),
    left: wp(24),
    right: wp(24),
    height: hp(8),
  },
  progressBackground: {
    width: "100%",
    height: hp(8),
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: wp(4),
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: wp(4),
  },
  achievementBadge: {
    position: "absolute",
    top: hp(38),
    left: wp(33.5),
    backgroundColor: "#FB8800",
    borderRadius: wp(24),
    paddingHorizontal: wp(16),
    paddingVertical: hp(8),
    shadowColor: "#FB8800",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: wp(10),
    elevation: 4,
  },
  achievementText: {
    fontSize: wp(16),
    fontWeight: "700",
    color: "#FBFAF9",
    fontFamily: "Pretendard-Bold",
    letterSpacing: wp(-0.4),
  },
});

