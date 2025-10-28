import React, { useMemo } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

type RunState = "idle" | "running" | "paused" | "finished";

type Props = {
  distanceKm: number;
  durationSec: number;
  paceSecPerKm?: number | null;
  onPause: () => void;
  onStop: () => void;
  runState: RunState;
  goalKm?: number; // 기본 1km
};

const ORANGE = "#FF8A00";
const CARD_BG = "rgba(255,255,255,0.95)";

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
function formatPace(secPerKm?: number | null) {
  if (secPerKm == null) return "-";
  const m = Math.floor(secPerKm / 60);
  const s = Math.floor(secPerKm % 60);
  return `${m}'${String(s).padStart(2, "0")}"`;
}

export default function InRunOverlay({
  distanceKm,
  durationSec,
  paceSecPerKm = null,
  onPause,
  onStop,
  runState,
  goalKm = 1,
}: Props) {
  const isPaused = runState === "paused";

  const progress = useMemo(() => {
    const p = goalKm > 0 ? distanceKm / goalKm : 0;
    return Math.max(0, Math.min(1, p));
  }, [distanceKm, goalKm]);
  const pctText = `${Math.round(progress * 100)}%`;

  return (
    <View
      pointerEvents="box-none"
      style={{ position: "absolute", left: 0, right: 0, top: 30, bottom: 0,
        backgroundColor: "rgba(255,255,255,0.30)"
       }}
    >
      {/* 상단 요약 카드 */}
      <View
        style={{
          marginTop: 15,
          marginHorizontal: 12,
          backgroundColor: CARD_BG,
          borderRadius: 16,
          padding: 18,
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 8,
          elevation: 6,
        }}
      >
        <View style={{ flexDirection: "column"}}>
          <Text style={{ fontSize: 26, fontWeight: "900", marginRight: 6 }}>
            {distanceKm.toFixed(2)}km
          </Text>
          <View style={{ flexDirection: "row", gap: 20, marginBottom: 4 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="time-outline" size={22} color={ORANGE} />
              <Text style={{marginTop: 4, marginLeft: 4, fontSize: 20, fontWeight: "700" }}>
                {formatTime(durationSec)}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons name="local-fire-department" size={20} color={ORANGE} />
              <Text style={{ marginLeft: 4, fontSize: 20, fontWeight: "700" }}>
                {formatPace(paceSecPerKm)}
              </Text>
            </View>
          </View>
        </View>

        {/* 진행률 (목표: 1km) */}
        <Text style={{ marginTop: 8, fontSize: 20, fontWeight: "700" }}>
          {goalKm}km 중 <Text style={{ color: ORANGE }}>{pctText}</Text> 달성!
        </Text>
        <View
          style={{
            height: 8,
            backgroundColor: "rgba(0,0,0,0.08)",
            borderRadius: 8,
            overflow: "hidden",
            marginTop: 8,
          }}
        >
          <View
            style={{
              width: `${progress * 100}%`,
              height: "100%",
              backgroundColor: "#FF8A00",
            }}
          />
        </View>
      </View>

      {/* 하단 컨트롤 (둥근 주황 버튼 2개) */}
      <View
        style={{
          position: "absolute",
          right: 0,
          left: 100,
          bottom: 40,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Pressable
          onPress={onPause}
          style={{
            width: 80,
            height: 80,
            borderRadius: 48,
            backgroundColor: ORANGE,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 25,
            shadowColor: "#000",
            shadowOpacity: 0.25,
            shadowOffset: { width: 0, height: 6 },
            shadowRadius: 12,
            elevation: 10,
          }}
        >
          {/* 일시정지(Ⅱ) / 재시작(▶︎) 아이콘 토글 */}
          {isPaused ? (
            <Ionicons name="play" size={22} color="white" />
          ) : (
            <Ionicons name="pause" size={22} color="white" />
          )}
        </Pressable>

        <Pressable
          onPress={onStop}
          style={{
            width: 80,
            height: 80,
            borderRadius: 48,
            backgroundColor: ORANGE,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOpacity: 0.25,
            shadowOffset: { width: 0, height: 6 },
            shadowRadius: 12,
            elevation: 10,
          }}
        >
          <Ionicons name="stop" size={22} color="white" />
        </Pressable>
      </View>
    </View>
  );
}
