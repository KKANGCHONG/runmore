import React from "react";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";

const FIGMA_WIDTH = 390;
const FIGMA_HEIGHT = 844;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const wp = (px: number) => (px / FIGMA_WIDTH) * SCREEN_WIDTH;
const hp = (px: number) => (px / FIGMA_HEIGHT) * SCREEN_HEIGHT;

type Props = {
  isPaused: boolean;
  onPause: () => void;
  onEnd: () => void;
};

export default function RunControls({ isPaused, onPause, onEnd }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.handleBar} />
      <View style={styles.buttonsRow}>
        <Pressable style={styles.endButton} onPress={onEnd}>
          <Text style={styles.endButtonText}>종료</Text>
        </Pressable>
        <Pressable style={styles.pauseButton} onPress={onPause}>
          <Text style={styles.pauseButtonText}>
            {isPaused ? "재개" : "일시정지"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: wp(24),
    borderTopRightRadius: wp(24),
    paddingTop: hp(16),
    paddingBottom: hp(34),
    paddingHorizontal: wp(24),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: hp(-2) },
    shadowOpacity: 0.08,
    shadowRadius: wp(12),
    elevation: 5,
  },
  handleBar: {
    width: wp(56),
    height: hp(5),
    backgroundColor: "#EBE8E5",
    borderRadius: hp(2.5),
    alignSelf: "center",
    marginBottom: hp(16),
  },
  buttonsRow: {
    flexDirection: "row",
    gap: wp(12),
    justifyContent: "space-between",
  },
  endButton: {
    flex: 1,
    height: hp(60),
    backgroundColor: "#F6F4F2",
    borderRadius: wp(16),
    alignItems: "center",
    justifyContent: "center",
  },
  endButtonText: {
    fontSize: wp(18),
    fontWeight: "600",
    color: "#A1968B",
    fontFamily: "Pretendard-SemiBold",
    letterSpacing: wp(-0.45),
  },
  pauseButton: {
    flex: 1,
    height: hp(60),
    backgroundColor: "#EBEBEB",
    borderRadius: wp(16),
    alignItems: "center",
    justifyContent: "center",
  },
  pauseButtonText: {
    fontSize: wp(18),
    fontWeight: "600",
    color: "#A1968B",
    fontFamily: "Pretendard-SemiBold",
    letterSpacing: wp(-0.45),
  },
});

