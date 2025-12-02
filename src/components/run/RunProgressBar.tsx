import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";

import ProgressEmpty from "../../../assets/figma/progress_empty.svg";
import ProgressFull from "../../../assets/figma/progress_full.svg";
import CarrotIcon from "../../../assets/figma/run_carrot.svg";

const FIGMA_WIDTH = 390;
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const wp = (px: number) => (px / FIGMA_WIDTH) * SCREEN_WIDTH;

type Props = {
  distanceKm: number;
  goalKm: number;
};

export default function RunProgressBar({ distanceKm, goalKm }: Props) {
  /** 카드 사이즈 — Figma: 342 × 60 */
  const CARD_WIDTH = wp(342);
  const CARD_HEIGHT = wp(60);

  /** 트랙 사이즈 — Figma: 267.79 × 13.03 */
  const TRACK_WIDTH = wp(288.95);
  const TRACK_HEIGHT = wp(13.03);

  /** 게이지 fill width 계산 */
  const progressRatio = Math.min(distanceKm / goalKm, 1);
  const progressFillWidth = TRACK_WIDTH * progressRatio;

  /** milestones */
  const milestones = [
    { ratio: 0.3, km: goalKm * 0.3, carrots: 1 },
    { ratio: 0.6, km: goalKm * 0.6, carrots: 1 },
    { ratio: 1.0, km: goalKm * 1.0, carrots: 2 },
  ];

  return (
    <View style={styles.wrapper}>
      <View style={[styles.card, { width: CARD_WIDTH, height: CARD_HEIGHT }]}>
        {/* === Progress Track === */}
        <View
          style={[
            styles.track,
            { width: TRACK_WIDTH, height: TRACK_HEIGHT },
          ]}
        >
          {/* Fill bar — 오렌지 채우기 */}
          <View
            style={[
              styles.fill,
              { width: progressFillWidth, height: TRACK_HEIGHT },
            ]}
          />

          {/* Progress Head — 움직이는 아이콘 */}
          <View style={[styles.progressHead, { left: progressFillWidth - wp(7) }]}>
            <ProgressFull width={wp(14)} height={wp(14)} />
          </View>

          {/* Milestones: 당근 or 빈점 */}
          {milestones.map((m, idx) => {
            const left = TRACK_WIDTH * m.ratio; // milestone 컨테이너의 left를 각 milestone 지점으로 설정
            const reached = distanceKm >= m.km;

            return (
              <View
                key={idx}
                style={[styles.milestoneContainer, { left }]}
              >
                {!reached ? (
                  <View
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    {[...Array(m.carrots)].map((_, i) => {
                      let iconMarginLeft = 0;
                      if (m.carrots === 1) {
                        
                        iconMarginLeft = -wp(24);
                      } else {
                        
                        if (i === 0) {
                          // 첫번째 당근
                          iconMarginLeft = -wp(45); 
                        } else {
                          // 두번째 당근
                          iconMarginLeft = -wp(35); 
                        }
                      }

                      return (
                        <View key={i} style={{ zIndex: m.carrots - i }}>
                          <CarrotIcon
                            width={wp(48)}
                            height={wp(48)}
                            style={{ marginLeft: iconMarginLeft }}
                          />
                        </View>
                      );
                    })}
                  </View>
                ) : (
                  <ProgressEmpty
                    width={wp(11.9)}
                    height={wp(11.9)}
                  />
                )}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: wp(60),
    left: wp(24),
  },

  /* 카드: Figma 스타일 그대로 */
  card: {
    backgroundColor: "rgba(255,255,255,0.6)", // Figma 반투명 카드
    borderRadius: wp(10.71),
    paddingHorizontal: wp(24),
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: wp(3),
    elevation: 3,
  },

  /* 트랙 */
  track: {
    backgroundColor: "#C2C2C2",
    borderRadius: wp(999),
    position: "relative",
  },

  /* 오렌지 게이지 (단색 #FE9800) */
  fill: {
    backgroundColor: "#FE9800",
    borderRadius: wp(999),
  },

  /* Progress Head */
  progressHead: {
    position: "absolute",
    top: (wp(13.03) - wp(14)) / 2, // Center vertically
    justifyContent: "center",
    alignItems: "center",
  },

  /* milestone container */
  milestoneContainer: {
    position: "absolute",
    top: wp(-17.5),
    justifyContent: "center",
    alignItems: "center",
  },
});
