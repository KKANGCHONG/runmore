// src/tabs/HomeTab.tsx
import React from "react";
import { ScrollView, View, Text } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { g } from "../styles/globalStyles";
import { tab } from "../styles/tabStyles";
import { theme } from "../styles/theme";

import TodayAppointment from "../components/home/TodayAppointment";
import MonthlyGoal from "../components/home/MonthlyGoal";
import MonthCalendar from "../components/home/MonthCalendar";

const formatDate = (d = new Date()) =>
  `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, "0")}. ${String(d.getDate()).padStart(2, "0")}`;

export default function HomeTab() {
  const insets = useSafeAreaInsets();
  const breadCount = 0;

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={[g.safe, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={[g.screenContainer]}>
        {/* TopBar */}
        <View style={[tab.topBar, { marginTop: 0 }]}>
          <View style={tab.topBarTitleWrap}>
            <View style={tab.topBarDot} />
            <Text style={tab.topBarTitle}>서비스 이름</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ marginRight: 8, color: "#333", fontWeight: "500" }}>보유 빵 {breadCount}</Text>
            <Ionicons name="notifications-outline" size={22} style={{ marginLeft: 8 }} />
            <Feather name="settings" size={22} style={{ marginLeft: 8 }} />
          </View>
        </View>

        {/* Date & Greeting */}
        <Text style={[g.body, g.muted, { marginTop: 14 }]}>{formatDate()}</Text>
        <Text style={[g.h2, g.muted, { marginTop: 2, fontWeight: "600" }]}>반가워요, 다인님!</Text>

        {/* 이미지 플레이스홀더 */}
        <View
          style={{
            marginTop: theme.spacing.xl,
            width: "100%",
            aspectRatio: 2.0,
            borderRadius: theme.radius.xl,
            backgroundColor: theme.colors.surface,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#9CA3AF" }}>이미지 영역</Text>
        </View>
        <Text style={{ textAlign: "center", color: "#9CA3AF", marginTop: 8 }}>구워지기를 기다리는 중…</Text>

        {/* 섹션들 */}

        <TodayAppointment />

        <MonthlyGoal achievedKm={37.5} /> //우선 예시로 넣어둠

        <MonthCalendar />
        
      </ScrollView>
    </SafeAreaView>
  );
}
