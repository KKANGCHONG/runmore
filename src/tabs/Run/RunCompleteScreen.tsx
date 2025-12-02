import React from "react";
import { View, Text, Pressable, StyleSheet, Dimensions, ScrollView, ImageSourcePropType } from "react-native";
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

// 아이콘 이미지 (SVG)
import FireIcon from "../../../assets/figma/fire_icon.svg";
import RunningShoeIcon from "../../../assets/figma/running_shoe_icon.svg";
import ClockIcon from "../../../assets/figma/clock_icon.svg";
import CarrotSmall from "../../../assets/figma/carrot_small.svg";
import RunCompleteRabbit from "../../../assets/figma/run_complete_rabbit.svg";

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

// 메인 카드 컴포넌트 Props 타입
type MainCardProps = {
  totalDistance: number; // 총 거리 (km)
  avgPace: number | null; // 평균 페이스 (초/km)
  duration: number; // 소요 시간 (초)
  calories: number; // 칼로리
  mapImageSource?: ImageSourcePropType; // 지도 스크린샷 이미지
  goalKm: number; // 목표 거리
  progressPercent: number; // 달성 퍼센트
  carrotCount: number; // 당근 개수
};

// 메인 카드 컴포넌트
function MainCard({
  totalDistance,
  avgPace,
  duration,
  calories,
  mapImageSource,
  goalKm,
  progressPercent,
  carrotCount,
}: MainCardProps) {
  return (
    <View style={mainCardStyles.container}>
      

      {/* 당근 획득 배지 */}
      {carrotCount > 0 && (
        <View style={mainCardStyles.carrotBadge}>
          <CarrotSmall width={wp(8.707)} height={hp(16)} />
          <Text style={mainCardStyles.carrotText}>당근 {carrotCount}개 획득</Text>
        </View>
      )}

      {/* 토끼 캐릭터 이미지 */}
      <View style={mainCardStyles.characterContainer}>
        <RunCompleteRabbit width="100%" height="100%" />
      </View>

      {/* 지도 이미지 영역 */}
      {mapImageSource && (
        <View style={mainCardStyles.mapContainer}>
          <RunCompleteRabbit width="100%" height="100%" />
        </View>
      )}

      {/* 목표 달성 텍스트 */}
      <Text style={mainCardStyles.goalText}>
        <Text style={mainCardStyles.goalLabel}>목표 {goalKm}km 중 </Text>
        <Text style={mainCardStyles.goalPercent}>{progressPercent}%</Text>
        <Text style={mainCardStyles.goalLabel}> 달성!</Text>
      </Text>

      {/* 통계 카드 */}
      <View style={mainCardStyles.statsCard}>
        <View style={mainCardStyles.statRow}>
          <View style={mainCardStyles.statLeft}>
            <RunningShoeIcon width={wp(18)} height={wp(18)} />
            <Text style={mainCardStyles.statLabelText}>거리</Text>
          </View>
          <Text style={mainCardStyles.statValue}>{formatDistance(totalDistance)}</Text>
        </View>

        <View style={mainCardStyles.statDivider} />

        <View style={mainCardStyles.statRow}>
          <View style={mainCardStyles.statLeft}>
            <FireIcon width={wp(18)} height={wp(18)} />
            <Text style={mainCardStyles.statLabelText}>페이스</Text>
          </View>
          <Text style={mainCardStyles.statValue}>{formatPace(avgPace)}</Text>
        </View>

        <View style={mainCardStyles.statDivider} />

        <View style={mainCardStyles.statRow}>
          <View style={mainCardStyles.statLeft}>
            <ClockIcon width={wp(18)} height={wp(18)} />
            <Text style={mainCardStyles.statLabelText}>시간</Text>
          </View>
          <Text style={mainCardStyles.statValue}>{formatTime(duration)}</Text>
        </View>

        <View style={mainCardStyles.statDivider} />

        <View style={mainCardStyles.statRow}>
          <View style={mainCardStyles.statLeft}>
            <Text style={mainCardStyles.sweatIcon}>💧</Text>
            <Text style={mainCardStyles.statLabelText}>칼로리</Text>
          </View>
          <Text style={mainCardStyles.statValue}>{calories}kcal</Text>
        </View>
      </View>

      {/* 공유하기 버튼 */}
      <Pressable style={mainCardStyles.shareButton} onPress={() => {}}>
        <Text style={mainCardStyles.shareButtonText}>공유하기</Text>
      </Pressable>

      {/* 이미지 저장하기 버튼 */}
      <Pressable style={mainCardStyles.saveImageButton} onPress={() => {}}>
        <Text style={mainCardStyles.saveImageButtonText}>이미지 저장하기</Text>
      </Pressable>
    </View>
  );
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

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
        >

          {/* 메인 카드 영역 - Rectangle 33115 - Figma: left-[26px] top-[151px] w-[337px] h-[822px] */}
          <MainCard
            totalDistance={totalDistance}
            avgPace={avgPace}
            duration={duration}
            calories={calories}
            mapImageSource={mapImageSource}
            goalKm={goalKm}
            progressPercent={progressPercent}
            carrotCount={carrotCount}
          />
          {/* 스크롤 가능한 하단 여백 (하단바 높이만큼) */}
          <View style={styles.scrollBottomSpacer} />
        </ScrollView>


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
    paddingBottom: hp(200), // 하단 카드 높이만큼 여백
  },
  scrollBottomSpacer: {
    height: hp(0),
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
});


// 메인 카드 스타일 (Figma 디자인 기준)
const mainCardStyles = StyleSheet.create({
  container: {
    width: wp(337),
    minHeight: hp(822),
    alignSelf: "center",
    marginTop: hp(24),
    backgroundColor: "#FFFFFF",
    borderRadius: wp(16),
    borderWidth: wp(1),
    borderColor: "#EAE5E3",
    paddingHorizontal: wp(20),
    paddingTop: hp(24),
    paddingBottom: hp(20),
    // 그림자 효과 (Figma 기준)
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: wp(2),
    },
    shadowOpacity: 0.1,
    shadowRadius: wp(8),
    elevation: 4, // Android
  },
  goalText: {
    fontSize: wp(24),
    fontWeight: "700",
    color: "#49393A",
    fontFamily: "Pretendard-Bold",
    textAlign: "center",
    letterSpacing: wp(-0.6),
    lineHeight: hp(33.6),
  },
  goalLabel: {
    fontWeight: "600",
    color: "#7F6236",
    fontFamily: "Pretendard-SemiBold",
  },
  goalPercent: {
    color: "#FE9800",
    fontWeight: "600",
    fontFamily: "Pretendard-Bold",
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
    marginTop: hp(16),
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
    lineHeight: hp(22.4),
  },
  characterContainer: {
    width: wp(280), // width만 지정
    aspectRatio: 150 / 128, // 원본 비율 유지 (150:128)
    alignSelf: "center",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  characterImage: {
    width: "100%",
    height: "100%",
  },
  mapContainer: {
    width: "100%",
    height: hp(200),
    marginTop: hp(20),
    borderRadius: wp(12),
    overflow: "hidden",
    backgroundColor: "#F5F5F5",
  },
  mapImage: {
    width: "100%",
    height: "100%",
    borderRadius: wp(12),
  },
  statsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: wp(16),
    paddingHorizontal: wp(18),
    paddingVertical: hp(20),
    marginTop: hp(-15),
    width: "100%",
    alignSelf: "center",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: hp(32),
    paddingVertical: hp(4),
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
    fontSize: wp(18),
    width: wp(18),
    height: wp(18),
    textAlign: "center",
  },
  statLabelText: {
    fontSize: wp(18),
    fontWeight: "600",
    color: "#767676",
    fontFamily: "Pretendard-Medium",
    letterSpacing: wp(-0.45),
    lineHeight: hp(25.2),
  },
  statValue: {
    fontSize: wp(18),
    fontWeight: "600",
    color: "#F57800",
    fontFamily: "Pretendard-Bold",
    letterSpacing: wp(-0.45),
    lineHeight: hp(25.2),
  },
  statDivider: {
    height: hp(1),
    backgroundColor: "#EAE5E3",
    marginVertical: hp(8),
    marginHorizontal: wp(-18),
  },
  shareButton: {
    alignSelf: "center",
    marginTop: hp(20),
    alignItems: "center",
  },
  shareButtonText: {
    fontSize: wp(16),
    fontWeight: "600",
    color: "#C1B9B0",
    fontFamily: "Pretendard-SemiBold",
    letterSpacing: wp(-0.4),
    lineHeight: hp(22.4),
    textDecorationLine: "underline",
  },
  saveImageButton: {
    alignSelf: "center",
    marginTop: hp(8),
    alignItems: "center",
  },
  saveImageButtonText: {
    fontSize: wp(16),
    fontWeight: "600",
    color: "#C1B9B0",
    fontFamily: "Pretendard-SemiBold",
    letterSpacing: wp(-0.4),
    lineHeight: hp(22.4),
    textDecorationLine: "underline",
    
    
  },
});

