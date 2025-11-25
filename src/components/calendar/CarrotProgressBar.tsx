// src/components/calendar/CarrotProgressBar.tsx
import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";

type Props = {
  carrotCount: number; // 0~4
};

const FIGMA_WIDTH = 390;
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const wp = (px: number) => (px / FIGMA_WIDTH) * SCREEN_WIDTH;

export default function CarrotProgressBar({ carrotCount }: Props) {
  return (
    <View style={styles.container}>
      {[0, 1, 2, 3].map((index) => {
        // 아래에서 위로 채우기: index 3이 맨 아래, index 0이 맨 위
        const isFilled = index >= 4 - carrotCount;
        const isTop = index === 0; // 화면상 맨 위
        const isBottom = index === 3; // 화면상 맨 아래
        
        // 맨 위 칸(실제로는 carrotCount가 4일 때)은 초록색, 나머지는 주황색
        const backgroundColor = isFilled 
          ? (carrotCount === 4 && isTop ? "#62D837" : "#FB8800") 
          : "#F6F4F2";
        
        return (
          <View
            key={index}
            style={[
              styles.bar,
              {
                backgroundColor,
                borderTopLeftRadius: isTop ? wp(4) : wp(2),
                borderTopRightRadius: isTop ? wp(4) : wp(2),
                borderBottomLeftRadius: isBottom ? wp(4) : wp(2),
                borderBottomRightRadius: isBottom ? wp(4) : wp(2),
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: wp(2),
    width: wp(45),
  },
  bar: {
    height: wp(10),
    width: "100%",
  },
});

