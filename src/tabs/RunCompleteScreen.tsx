import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const FIGMA_WIDTH = 390;
const FIGMA_HEIGHT = 844;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const wp = (px: number) => (px / FIGMA_WIDTH) * SCREEN_WIDTH;
const hp = (px: number) => (px / FIGMA_HEIGHT) * SCREEN_HEIGHT;

type RunCompleteRouteParams = {
  RunComplete: {
    distanceKm: number;
    durationSec: number;
    paceSecPerKm: number | null;
    carrotCount: number;
  };
};

// 아이콘 이미지
const FireIcon = require("../../../assets/figma/fire_icon.png");
const RunningShoeIcon = require("../../../assets/figma/running_shoe_icon.png");
const ClockIcon = require("../../../assets/figma/clock_icon.png");
const CarrotSmall = require("../../../assets/figma/carrot_small.png");

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  return `${m}분`;
}

function formatPace(secPerKm: number | null) {
  if (secPerKm == null) return "-";
  const m = Math.floor(secPerKm / 60);
  return `${m}'`;
}

function formatDistance(km: number) {
  return `${Math.round(km)}km`;
}

function calculateCalories(distanceKm: number, durationSec: number) {
  // 간단한 칼로리 계산 (예시)
  const avgSpeed = distanceKm / (durationSec / 3600);
  const caloriesPerKm = 60; // 대략적인 값
  return Math.round(distanceKm * caloriesPerKm);
}

export default function RunCompleteScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RunCompleteRouteParams, "RunComplete">>();
  const insets = useSafeAreaInsets();

  const { distanceKm, durationSec, paceSecPerKm, carrotCount } = route.params;

  const goalKm = 3; // 목표 거리 (예시)
  const progressPercent = Math.round((distanceKm / goalKm) * 100);
  const calories = calculateCalories(distanceKm, durationSec);

  const handleNewAppointment = () => {
    navigation.navigate("Calendar" as never);
  };

  const handleClose = () => {
    navigation.navigate("Home" as never);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#FFF8EF", "#FFF8EF"]}
        style={styles.backgroundGradient}
      />

      <SafeAreaView edges={["top"]} style={[styles.content, { paddingTop: insets.top }]}>
        {/* 상단 헤더 */}
        <View style={styles.header}>
          <Pressable onPress={handleClose} style={styles.backButton}>
            <Ionicons name="chevron-back" size={wp(20)} color="#000000" />
          </Pressable>
          <Text style={styles.timeText}>9:41</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 제목 */}
          <Text style={styles.subtitle}>뚱띠토끼와 함께한</Text>
          <Text style={styles.title}>오늘의 리포트</Text>

          {/* 당근 획득 배지 */}
          {carrotCount > 0 && (
            <View style={styles.carrotBadge}>
              <Image source={CarrotSmall} style={styles.carrotIcon} resizeMode="contain" />
              <Text style={styles.carrotText}>당근 {carrotCount}개 획득</Text>
            </View>
          )}

          {/* 목표 달성 텍스트 */}
          <Text style={styles.goalText}>
            <Text style={styles.goalLabel}>목표 {goalKm}km 중 </Text>
            <Text style={styles.goalPercent}>{progressPercent}%</Text>
            <Text style={styles.goalLabel}> 달성!</Text>
          </Text>

          {/* 캐릭터 이미지 영역 */}
          <View style={styles.characterContainer}>
            {/* 캐릭터 이미지는 실제 이미지로 교체 필요 */}
            <View style={styles.characterPlaceholder} />
          </View>

          {/* 통계 카드 */}
          <View style={styles.statsCard}>
            <View style={styles.statRow}>
              <View style={styles.statLeft}>
                <Image source={RunningShoeIcon} style={styles.statIcon} resizeMode="contain" />
                <Text style={styles.statLabel}>
                  <Text style={styles.statLabelText}>총 거리</Text>
                </Text>
              </View>
              <Text style={styles.statValue}>{formatDistance(distanceKm)}</Text>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statLeft}>
                <Image source={FireIcon} style={styles.statIcon} resizeMode="contain" />
                <Text style={styles.statLabel}>
                  <Text style={styles.statLabelText}>페이스</Text>
                </Text>
              </View>
              <Text style={styles.statValue}>{formatPace(paceSecPerKm)}</Text>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statLeft}>
                <Image source={ClockIcon} style={styles.statIcon} resizeMode="contain" />
                <Text style={styles.statLabel}>
                  <Text style={styles.statLabelText}>소요 시간</Text>
                </Text>
              </View>
              <Text style={styles.statValue}>{formatTime(durationSec)}</Text>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statLeft}>
                <Text style={styles.sweatIcon}>💧</Text>
                <Text style={styles.statLabel}>
                  <Text style={styles.statLabelText}>소모 칼로리</Text>
                </Text>
              </View>
              <Text style={styles.statValue}>{calories}kcal</Text>
            </View>
          </View>

          {/* 추천 메시지 */}
          <Text style={styles.recommendationText}>다음에는 2km만 뛰어볼까요?</Text>

          {/* 새 약속 잡기 버튼 */}
          <Pressable style={styles.newAppointmentButton} onPress={handleNewAppointment}>
            <Text style={styles.newAppointmentButtonText}>새 약속 잡기</Text>
          </Pressable>

          {/* 종료하기 버튼 */}
          <Pressable style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>종료하기</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8EF",
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(24),
    paddingTop: hp(12),
    paddingBottom: hp(12),
  },
  backButton: {
    width: wp(44),
    height: wp(44),
    justifyContent: "center",
    alignItems: "center",
  },
  timeText: {
    fontSize: wp(15),
    fontWeight: "600",
    color: "#111111",
    fontFamily: "Pretendard-SemiBold",
    letterSpacing: wp(-0.5),
  },
  scrollContent: {
    paddingHorizontal: wp(26),
    paddingBottom: hp(100),
  },
  subtitle: {
    fontSize: wp(16),
    fontWeight: "500",
    color: "#AE927A",
    fontFamily: "Pretendard-Medium",
    textAlign: "center",
    marginTop: hp(32),
    letterSpacing: wp(-0.4),
  },
  title: {
    fontSize: wp(22),
    fontWeight: "600",
    color: "#9D7B5E",
    fontFamily: "Pretendard-SemiBold",
    textAlign: "center",
    marginTop: hp(4),
    letterSpacing: wp(-0.55),
  },
  carrotBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF3E0",
    borderRadius: wp(999),
    paddingHorizontal: wp(12),
    paddingVertical: hp(6),
    gap: wp(6),
    alignSelf: "center",
    marginTop: hp(24),
  },
  carrotIcon: {
    width: wp(8.707),
    height: hp(16),
  },
  carrotText: {
    fontSize: wp(16),
    fontWeight: "700",
    color: "#FFA927",
    fontFamily: "Pretendard-Bold",
    letterSpacing: wp(-0.4),
  },
  goalText: {
    fontSize: wp(24),
    fontWeight: "700",
    color: "#49393A",
    fontFamily: "Pretendard-Bold",
    textAlign: "center",
    marginTop: hp(24),
    letterSpacing: wp(-0.6),
  },
  goalLabel: {
    fontWeight: "600",
    color: "#7F6236",
    fontFamily: "Pretendard-SemiBold",
  },
  goalPercent: {
    color: "#FE9800",
  },
  characterContainer: {
    width: wp(337),
    height: hp(822),
    alignSelf: "center",
    marginTop: hp(24),
    marginBottom: hp(24),
    backgroundColor: "#FFFFFF",
    borderRadius: wp(16),
    borderWidth: wp(1),
    borderColor: "#EAE5E3",
    overflow: "hidden",
  },
  characterPlaceholder: {
    flex: 1,
    backgroundColor: "#F6F4F2",
  },
  statsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: wp(16),
    padding: wp(18),
    marginTop: hp(24),
    gap: hp(10),
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(8),
  },
  statIcon: {
    width: wp(18),
    height: wp(18),
  },
  sweatIcon: {
    fontSize: wp(16),
  },
  statLabel: {
    fontSize: wp(18),
    fontWeight: "600",
    color: "#49393A",
    fontFamily: "Pretendard-SemiBold",
    letterSpacing: wp(-0.45),
  },
  statLabelText: {
    fontWeight: "500",
    color: "#767676",
    fontFamily: "Pretendard-Medium",
  },
  statValue: {
    fontSize: wp(18),
    fontWeight: "700",
    color: "#F57800",
    fontFamily: "Pretendard-Bold",
    letterSpacing: wp(-0.45),
  },
  recommendationText: {
    fontSize: wp(16),
    fontWeight: "600",
    color: "#765D4B",
    fontFamily: "Pretendard-SemiBold",
    textAlign: "left",
    marginTop: hp(24),
    letterSpacing: wp(-0.4),
  },
  newAppointmentButton: {
    backgroundColor: "#FB8800",
    borderRadius: wp(16),
    paddingVertical: hp(18),
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(24),
  },
  newAppointmentButtonText: {
    fontSize: wp(18),
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "Pretendard-SemiBold",
    letterSpacing: wp(-0.45),
  },
  closeButton: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(12),
  },
  closeButtonText: {
    fontSize: wp(16),
    fontWeight: "600",
    color: "#FB8800",
    fontFamily: "Pretendard-SemiBold",
    letterSpacing: wp(-0.4),
  },
});

