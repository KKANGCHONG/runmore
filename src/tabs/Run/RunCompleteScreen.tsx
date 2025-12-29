import React from "react";
import { View, Text, Pressable, StyleSheet, Dimensions, ScrollView, Image, ImageSourcePropType } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";


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

// 아이콘 이미지 (SVG)
import FireIcon from "../../../assets/figma/fire_icon.svg";
import RunningShoeIcon from "../../../assets/figma/running_shoe_icon.svg";
import ClockIcon from "../../../assets/figma/clock_icon.svg";
import SweatIcon from "../../../assets/figma/Sweat Droplets.svg";
import CarrotSmall from "../../../assets/figma/carrot_small.svg";
import RunCompleteRabbit from "../../../assets/figma/run_complete_rabbit.png";

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



type RunCompleteScreenProps = {
  distanceKm?: number;
  durationSec?: number;
  paceSecPerKm?: number | null;
  carrotCount?: number;
  onClose?: () => void;
};

export default function RunCompleteScreen(props?: RunCompleteScreenProps) {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RunCompleteRouteParams, "RunComplete">>();
  const insets = useSafeAreaInsets();

  // Props가 있으면 props 사용, 없으면 route params 사용 (기존 네비게이션 방식 지원)
  const routeParams = route.params;
  const distanceKm = props?.distanceKm ?? routeParams?.distanceKm ?? 0;
  const durationSec = props?.durationSec ?? routeParams?.durationSec ?? 0;
  const paceSecPerKm = props?.paceSecPerKm ?? routeParams?.paceSecPerKm ?? null;
  const carrotCount = props?.carrotCount ?? routeParams?.carrotCount ?? 0;

  const goalKm = 3; // 목표 거리 (예시)
  const progressPercent = Math.round((distanceKm / goalKm) * 100);
  const calories = calculateCalories(distanceKm, durationSec);

  // 실제 측정 데이터
  const totalDistance = distanceKm;
  const avgPace = paceSecPerKm;
  const duration = durationSec;
  // mapImageSource는 나중에 state로 주입할 예정이므로 optional로 처리
  const mapImageSource: ImageSourcePropType | undefined = undefined;

  const handleNewAppointment = () => {
    navigation.navigate("Calendar" as never);
  };

  const handleClose = () => {
    if (props?.onClose) {
      props.onClose();
    } else {
      navigation.navigate("Home" as never);
    }
  };

  return (
    <View style={[styles.container, props ? styles.modalContainer : undefined]}>
  <SafeAreaView edges={["top", "bottom"]} style={[styles.content, { paddingTop: insets.top }]}>

    {/* 상단 헤더 */}
    <View style={styles.header}>
      <Pressable onPress={handleClose} style={styles.backButton}>
        <Ionicons name="chevron-back" size={wp(20)} color="#A1968B" />
      </Pressable>
    </View>

    {/* 스크롤/배경 영역 */}
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      style={styles.scrollView}
    >
      <View style={styles.scrollBottomSpacer} />
    </ScrollView>

    {/* ✅ 오버레이 레이어 (ScrollView 밖)
    <View style={styles.overlayLayer} pointerEvents="box-none">
      <View style={styles.carrotToast} pointerEvents="none">
        <CarrotSmall width={wp(16)} height={wp(16)} />
        <Text style={styles.carrotToastText}>당근 {carrotCount}개 획득</Text>
      </View>

      <Image source={RunCompleteRabbit} style={styles.runCompleteRabbit} resizeMode="contain" />

      <Text style={styles.progressText}>목표 3km 중 {progressPercent}% 달성!</Text>
    </View> */}

    <BlurView
  intensity={35}
  tint="dark"
  style={styles.overlayLayer}
>
  <View style={styles.carrotToast} pointerEvents="none">
    <CarrotSmall width={wp(16)} height={wp(16)} />
    <Text style={styles.carrotToastText}>당근 {carrotCount}개 획득</Text>
  </View>

  <Image
    source={RunCompleteRabbit}
    style={styles.runCompleteRabbit}
    resizeMode="contain"
  />

  <Text style={styles.progressText}>
    목표 3Km 중 {progressPercent}% 달성!
  </Text>
</BlurView>


    <View style={styles.resultCard}>
  <View style={styles.resultRow}>
    <RunningShoeIcon width={wp(18)} height={wp(18)} />
    <Text style={styles.resultLabel}>거리</Text>
    <Text style={styles.resultValue}>{distanceKm.toFixed(2)}km</Text>
  </View>

  <View style={styles.resultRow}>
    <FireIcon width={wp(18)} height={wp(18)} />
    <Text style={styles.resultLabel}>페이스</Text>
    <Text style={styles.resultValue}>
      {paceSecPerKm ? `${Math.floor(paceSecPerKm / 60)}' ${paceSecPerKm % 60}"` : "-"}
    </Text>
  </View>

  <View style={styles.resultRow}>
    <ClockIcon width={wp(18)} height={wp(18)} />
    <Text style={styles.resultLabel}>시간</Text>
    <Text style={styles.resultValue}>{formatTime(durationSec)}</Text>
  </View>

  <View style={styles.resultRow}>
    <SweatIcon width={wp(18)} height={wp(18)} />
    <Text style={styles.resultLabel}>칼로리</Text>
    <Text style={styles.resultValue}>{calories}kcal</Text>
  </View>
</View>


        {/* 하단 고정 바 (ScrollView 위에 overlay) */}
        {/* Render bottomBar only if props is undefined (not in modal mode) */}
        {!props && (
          <View style={styles.bottomBar} pointerEvents="box-none">
            {/* 하단 그라데이션 배경 */}
            <LinearGradient
              colors={["rgba(255,248,239,0)", "#FFF8EF"]}
              locations={[0, 0.211]}
              style={styles.bottomGradient}
              pointerEvents="none"
            />
            
            {/* 하단 섹션 컨텐츠 */}
            <View style={styles.bottomContentContainer}>
              {/* 추천 메시지 */}
              <Text style={styles.recommendationText}>다음에는 2km만 뛰어볼까요?</Text>

              {/* 새 약속 잡기 버튼 */}
              <Pressable style={styles.newAppointmentButton} onPress={handleNewAppointment}>
                <Text style={styles.newAppointmentButtonText}>새 약속 잡기</Text>
              </Pressable>

              {/* 종료하기 버튼 */}
              <Pressable style={styles.closeButton} onPress={handleClose}>
                <Text style={styles.closeButtonText}>종료하기</Text>
                <Ionicons name="chevron-forward" size={wp(16)} color="#FB8800" style={{ marginLeft: wp(8) }} />
              </Pressable>
            </View>
          </View>
        )}

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1001,
    backgroundColor: "transparent",
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(10),
    paddingTop: hp(0),
    paddingBottom: hp(0),
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    // paddingBottom: hp(200), // 하단 카드 높이만큼 여백
  },
  scrollBottomSpacer: {
    // height: hp(0),
  },

  subtitle: {
    fontSize: wp(16),
    fontWeight: "500",
    color: "#FB8800",
    fontFamily: "Pretendard-Medium",
    textAlign: "center",
    marginTop: hp(0),
    letterSpacing: wp(-0.4),
    lineHeight: hp(22.4),
  },
  title: {
    fontSize: wp(22),
    fontWeight: "600",
    color: "#FB8800",
    fontFamily: "Pretendard-SemiBold",
    textAlign: "center",
    marginTop: hp(4),
    letterSpacing: wp(-0.55),
    lineHeight: hp(30.8),
  },

  // 하단 고정 바 스타일
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    width: SCREEN_WIDTH,
    zIndex: 5, // ScrollView 위에 overlay
    overflow: "hidden",
  },
  bottomGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: SCREEN_WIDTH,
    height: "100%",
    pointerEvents: "none",
  },
  bottomContentContainer: {
    paddingTop: hp(31),
    paddingBottom: hp(34),
    paddingHorizontal: wp(0),
    backgroundColor: "transparent",
  },
  recommendationText: {
    fontSize: wp(16),
    fontWeight: "600",
    color: "#765D4B",
    fontFamily: "Pretendard-SemiBold",
    textAlign: "left",
    marginLeft: wp(22),
    marginBottom: hp(14),
    letterSpacing: wp(-0.4),
    lineHeight: hp(19.2),
  },
  newAppointmentButton: {
    backgroundColor: "#FB8800",
    borderRadius: wp(16),
    paddingVertical: hp(20.5),
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(0),
    marginHorizontal: wp(27),
    height: hp(61),
  },
  newAppointmentButtonText: {
    fontSize: wp(18),
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "Pretendard-SemiBold",
    letterSpacing: wp(-0.45),
    lineHeight: hp(25.2),
  },
  closeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(16),
    alignSelf: "center",
  },
  closeButtonText: {
    fontSize: wp(16),
    fontWeight: "600",
    color: "#FB8800",
    fontFamily: "Pretendard-SemiBold",
    letterSpacing: wp(-0.4),
    lineHeight: hp(22.4),
  },
  carrotToast: {
  position: "absolute",
  left: wp(134),
  top: hp(104), // 필요하면 + insets.top
  width: wp(122.71),
  height: hp(34),

  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: wp(6),

  backgroundColor: "#FFF2D9",
  borderRadius: hp(17),
  zIndex: 9999,
},
carrotToastText: {
  fontSize: wp(14),
  fontWeight: "600",
  fontFamily: "Pretendard-SemiBold",
  color: "#FB8800",
  letterSpacing: wp(-0.3),
},
runCompleteRabbit: {
  position: "absolute",
  top: hp(104 + 10),
  left: 78,
  right: 0,
  alignSelf: "center",
  width: wp(250),
  height: wp(250),
  zIndex: 9998,
},

progressText: {
  position: "absolute",
  top: hp(104) + wp(250),
  left: 0,
  right: 0,

  textAlign: "center",
  fontSize: wp(24),
  fontFamily: "Pretendard-SemiBold",
  fontWeight: "600",
  color: "#FFFFFF",

  zIndex: 10000,
},
overlayLayer: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  // 화면 전체를 덮는 오버레이
  zIndex: 999,
},

resultCard: {
  position: "absolute",
  top: hp(104 + 10) + wp(250) + hp(12) + hp(44), 
  // = 토끼 + 퍼센트 텍스트 아래

  left: wp(24),
  right: wp(24),

  backgroundColor: "#9E9E9E",
  borderRadius: wp(16),

  paddingVertical: hp(18),
  paddingBottom: hp(10), 
  paddingHorizontal: wp(18),

  zIndex: 10000,
},

resultRow: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: hp(13),
},

resultLabel: {
  marginLeft: wp(8),
  fontSize: wp(18),
  color: "#E5E5E5",
  fontFamily: "Pretendard-Medium",
},

resultValue: {
  marginLeft: "auto",
  fontSize: wp(18),
  color: "#FFFFFF",
  fontFamily: "Pretendard-SemiBold",
},


});




