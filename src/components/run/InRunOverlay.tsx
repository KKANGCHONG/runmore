import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { calcBread } from "./utils/bread";

type RunState = "idle" | "running" | "paused" | "finished";

type Props = {
  distanceKm: number;
  durationSec: number;
  paceSecPerKm?: number | null; // null이면 표시 안함
  onPause: () => void;
  onStop: () => void;
  runState: RunState;
};

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

function formatPace(secPerKm?: number | null) {
  if (secPerKm == null) return "-";
  const m = Math.floor(secPerKm / 60);
  const s = Math.floor(secPerKm % 60);
  return `${m}'${String(s).padStart(2,"0")}"`;
}

export default function InRunOverlay({
  distanceKm, durationSec, paceSecPerKm = null, onPause, onStop, runState,
}: Props) {
  const bread = calcBread(distanceKm);
  const isPaused = runState === "paused";
  return (
    <View pointerEvents="box-none" style={{ position: "absolute", left: 0, right: 0, top: 30, bottom: 0 }}>
      {/* 상단 요약 카드 */}
      <View style={{ marginTop: 18, marginHorizontal: 16, backgroundColor: "white", borderRadius: 12, padding: 12, elevation: 3 }}>
        <Text style={{ fontWeight: "800" }}>달린 시간 {formatTime(durationSec)}</Text>
        <Text style={{ color: "#555", marginTop: 6 }}>
          거리 {distanceKm.toFixed(2)} km · 페이스 {formatPace(paceSecPerKm)}
        </Text>
      </View>

      {/* 빵 뱃지 */}
      <View style={{ position: "absolute", left: 16, bottom: 150, alignItems: "center" }}>
        <View style={{ marginTop: 8, backgroundColor: "#555", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 }}>
          <Text style={{ color: "white" }}>빵 {bread}개</Text>
        </View>
      </View>

            {/* 하단 컨트롤 */}
      <View style={{
        position: "absolute", right: 0, left: 0, bottom: 40,
        flexDirection: "row", justifyContent: "space-evenly"
      }}>
        <Pressable
          onPress={onPause}
          style={{
            width: 96, height: 96, borderRadius: 48,
            backgroundColor: "white", alignItems: "center", justifyContent: "center", elevation: 6
          }}
        >
          <Text style={{ fontWeight: "800" }}>
            {isPaused ? "다시시작" : "일시정지"}   {/* ✅ 토글 */}
          </Text>
        </Pressable>

        <Pressable
          onPress={onStop}
          style={{
            width: 96, height: 96, borderRadius: 48,
            backgroundColor: "white", alignItems: "center", justifyContent: "center", elevation: 6
          }}
        >
          <Text style={{ fontWeight: "800" }}>종료</Text>
        </Pressable>
      </View>
    </View>
  );

}
