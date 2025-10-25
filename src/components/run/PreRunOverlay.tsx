import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  onStart: () => void;
  onOpenSearch?: () => void;
};

export default function PreRunOverlay({ onStart, onOpenSearch }: Props) {
  return (
    <View pointerEvents="box-none" style={{ position: "absolute", left: 0, right: 0, top: 30, bottom: 0 }}>
      {/* 상단 바 */}
      <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        <Pressable onPress={onOpenSearch} style={{ backgroundColor: "white", borderRadius: 12, padding: 14, elevation: 2 }}>
          <Text style={{ fontWeight: "700" }}>장소검색</Text>
        </Pressable>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
          <Text style={{ backgroundColor: "white", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, elevation: 2 }}>
            오늘의 약속
          </Text>
          <Text style={{ backgroundColor: "white", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, elevation: 2 }}>
            이번달 목표 진행률
          </Text>
        </View>

        <Pressable style={{ marginTop: 12, backgroundColor: "white", borderRadius: 16, padding: 16, elevation: 2 }}>
          <Text style={{ fontSize: 16, fontWeight: "800" }}>이대로 뛰기 or 수정</Text>
          <Text style={{ marginTop: 4, color: "#666" }}>3km 뛰기 · 오후 7:00</Text>
        </Pressable>

        <Pressable style={{ marginTop: 12, backgroundColor: "white", borderRadius: 12, padding: 14, alignSelf: "flex-start", elevation: 2 }}>
          <Text style={{ fontWeight: "700" }}>새 목표 설정</Text>
        </Pressable>
      </View>

      {/* 하단 큰 시작 버튼 */}
      <View style={{ position: "absolute", left: 0, right: 0, bottom: 40, alignItems: "center" }}>
        <Pressable
          onPress={onStart}
          style={{ width: 92, height: 92, borderRadius: 46, backgroundColor: "white", alignItems: "center", justifyContent: "center", elevation: 6 }}
        >
          <Ionicons name="play" size={42} color="#333" />
        </Pressable>
      </View>
    </View>
  );
}
