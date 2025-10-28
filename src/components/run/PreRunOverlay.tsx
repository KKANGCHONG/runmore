import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

type Props = {
  onStart: () => void;
  onOpenSearch?: () => void;
};

export default function PreRunOverlay({ onStart, onOpenSearch }: Props) {
  return (
      <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 40,
        bottom: 0,
        // 1) 전체 반투명 배경
        backgroundColor: "rgba(255,255,255,0.30)",
      }}
    >
      {/* 상단 바 */}
      <View style={{ paddingHorizontal: 24, paddingTop: 16 }}>
        <Pressable onPress={onOpenSearch} style={{ backgroundColor: "white", borderRadius: 26, padding: 16, elevation: 2 }}>
          <Text style={{ fontWeight: "700" }}>원하는 장소를 입력해주세요</Text>
        </Pressable>
        </View>

       {/* 목표 카드 */}
      <View
        style={{
          marginTop: 300,
          alignSelf: "center",
          width: 306,
          height: 136,
          borderRadius: 20,
          backgroundColor: "rgba(255,255,255,0.8)",
          padding: 16,
          shadowColor: "#000",
          shadowOpacity: 0.5,
          shadowRadius: 10
        }}
      >
        <Text style={{ color: "#333", fontWeight: "600", marginBottom: 8 }}>
          10월의 목표는 <Text style={{ fontWeight: "800" }}>50km 달리기</Text>
        </Text>

        {/* Progress bar */}
        <View
          style={{
            height: 8,
            borderRadius: 4,
            backgroundColor: "rgba(255,138,0,0.3)",
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: "75%",
              height: "100%",
              backgroundColor: "#FF8A00",
            }}
          />
        </View>

        <Text
          style={{
            textAlign: "right",
            marginTop: 4,
            color: "#FF8A00",
            fontWeight: "700",
          }}
        >
          75%
        </Text>

        {/* 구분선 */}
        <View
          style={{
            height: 1,
            backgroundColor: "rgba(0,0,0,0.1)",
            marginVertical: 8,
          }}
        />

        <Text style={{ color: "#333" }}>
          오늘의 약속 <Ionicons name="time-outline" size={14} color="#555" />{" "}
          오후 7:00 · <Text style={{ fontWeight: "700" }}>3km 달리기</Text>
        </Text>
      </View>


      <View
        style={{
          position: "absolute",
          left: 60,
          right: 0,
          bottom: 40,
          flexDirection: "row",         
          justifyContent: "center",    
          alignItems: "flex-end",
        }}
      >
        {/* ▶ 시작 버튼 */}
        <Pressable
          onPress={onStart}
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "#FF8A00",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 4, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 6,
          }}
        >
          <Ionicons name="play" size={30} color="white" />
        </Pressable>

        {/* + 버튼 (비활성화) */}
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: "#FF8A00",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 15,  // ▶ 버튼과 간격
            shadowColor: "#000",
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 4,
          }}
        >
          <Ionicons name="add" size={24} color="white" />
        </View>
      </View>
    </View>
  );
}
