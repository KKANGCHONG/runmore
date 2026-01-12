// import React, { useMemo } from "react";
// import { View, StyleSheet, Dimensions } from "react-native";
// import RunProgressBar from "./RunProgressBar";
// import RunControls from "./RunControls";
// import { calcBread } from "./utils/carrot";

// const FIGMA_WIDTH = 390;
// const FIGMA_HEIGHT = 844;
// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
// const wp = (px: number) => (px / FIGMA_WIDTH) * SCREEN_WIDTH;
// const hp = (px: number) => (px / FIGMA_HEIGHT) * SCREEN_HEIGHT;

// type RunState = "idle" | "running" | "paused" | "finished";

// type Props = {
//   distanceKm: number;
//   durationSec: number;
//   paceSecPerKm?: number | null;
//   onPause: () => void;
//   onStop: () => void;
//   runState: RunState;
//   goalKm?: number; // 기본 1km
// };

// function formatTime(sec: number) {
//   const m = Math.floor(sec / 60);
//   const s = Math.floor(sec % 60);
//   return `${m}' ${String(s).padStart(2, "0")}"`;
// }

// function formatPace(secPerKm?: number | null) {
//   if (secPerKm == null) return "00:00";
//   const m = Math.floor(secPerKm / 60);
//   const s = Math.floor(secPerKm % 60);
//   return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
// }

// function formatDistance(km: number) {
//   return `${km.toFixed(2)}km`;
// }

// export default function InRunOverlay({
//   distanceKm,
//   durationSec,
//   paceSecPerKm = null,
//   onPause,
//   onStop,
//   runState,
//   goalKm = 1,
// }: Props) {
//   const isPaused = runState === "paused";

//   // carrotCount 계산 (carrot.ts의 calcBread 함수 사용)
//   const carrotCount = useMemo(() => {
//     return calcBread(distanceKm);
//   }, [distanceKm]);

//   // 포맷된 값들
//   const paceFormatted = formatPace(paceSecPerKm);
//   const distanceFormatted = formatDistance(distanceKm);
//   const timeFormatted = formatTime(durationSec);

//   return (
//     <View pointerEvents="box-none" style={styles.container}>
//       {/* 상단 Progress Bar */}
//       <RunProgressBar distanceKm={distanceKm} goalKm={goalKm} />


//       {/* 하단 컨트롤 버튼 */}
//       <RunControls
//         isPaused={isPaused}
//         onPause={onPause}
//         onEnd={onStop}
//         pace={paceFormatted}
//         distance={distanceFormatted}
//         time={timeFormatted}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     top: 0,
//     bottom: 0,
//     pointerEvents: "box-none",
//   },
// });
import React, { useMemo } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import RunProgressBar from "./RunProgressBar";
import RunControls from "./RunControls";
import { calcBread } from "./utils/carrot";

const FIGMA_WIDTH = 390;
const FIGMA_HEIGHT = 844;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

type RunState = "idle" | "running" | "paused" | "finished";

type Props = {
  distanceKm: number;
  durationSec: number;
  paceSecPerKm?: number | null;
  onPause: () => void;
  onStop: () => void;
  runState: RunState;
  goalKm?: number;
  // [추가] 프로그레스 바 표시 여부 (기본값 true)
  showProgressBar?: boolean;
};

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}' ${String(s).padStart(2, "0")}"`;
}

function formatPace(secPerKm?: number | null) {
  if (secPerKm == null) return "00:00";
  const m = Math.floor(secPerKm / 60);
  const s = Math.floor(secPerKm % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatDistance(km: number) {
  return `${km.toFixed(2)}km`;
}

export default function InRunOverlay({
  distanceKm,
  durationSec,
  paceSecPerKm = null,
  onPause,
  onStop,
  runState,
  goalKm = 1,
  // [추가] showProgressBar prop 받기 (기본값 true)
  showProgressBar = true,
}: Props) {
  const isPaused = runState === "paused";

  const carrotCount = useMemo(() => {
    return calcBread(distanceKm);
  }, [distanceKm]);

  const paceFormatted = formatPace(paceSecPerKm);
  const distanceFormatted = formatDistance(distanceKm);
  const timeFormatted = formatTime(durationSec);

  return (
    <View pointerEvents="box-none" style={styles.container}>
      {/* [수정] showProgressBar가 true일 때만 RunProgressBar 렌더링 */}
      {showProgressBar && (
        <RunProgressBar distanceKm={distanceKm} goalKm={goalKm} />
      )}

      {/* 하단 컨트롤 버튼 */}
      <RunControls
        isPaused={isPaused}
        onPause={onPause}
        onEnd={onStop}
        pace={paceFormatted}
        distance={distanceFormatted}
        time={timeFormatted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    pointerEvents: "box-none",
  },
});