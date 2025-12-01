// src/tabs/HomeTab.tsx
import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, Dimensions, Image } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import ProgressBar from "../../components/ui/ProgressBar";

// Figma 기준 화면 크기
const FIGMA_WIDTH = 390;
const FIGMA_HEIGHT = 844;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// 화면 비율 계산
const wp = (px: number) => (px / FIGMA_WIDTH) * SCREEN_WIDTH;
const hp = (px: number) => (px / FIGMA_HEIGHT) * SCREEN_HEIGHT;

// 사용되는 이미지들 (SVG)
import GiftIcon from "../../../assets/figma/gift_icon.svg";
import CalendarIcon from "../../../assets/figma/calendar_icon.svg";
import BellIcon from "../../../assets/figma/bell_icon.svg";
import GearIcon from "../../../assets/figma/gear_icon.svg";
import CoinIcon from "../../../assets/figma/coin_icon.svg";
import CarrotSmall from "../../../assets/figma/carrot_small.svg";
import SpeakerIcon from "../../../assets/figma/speaker_icon.svg";
import RabbitCharacter from "../../../assets/figma/rabbit_character.svg";

export default function HomeTab() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  
  // 약속 설정 여부 state (실제로는 상태 관리나 API에서 가져올 데이터)
  const [hasAppointment, setHasAppointment] = useState(true);

  // 예시 데이터
  const temperature = 19;
  const level = 1;
  const characterName = "뚱띠토끼";
  const carrotCount = 78;
  const userName = "다인";
  const appointmentMessage = `${userName}님, 오늘 오후 3시에 3km 뛰기로 했어요!`;
  
  // 레벨 진행률 계산 (예시: 75%)
  const levelProgress = 0.75; // 0~1 사이 값


  // 약속 설정 핸들러
  const handleSetAppointment = () => {
    // TODO: 약속 설정 로직
    setHasAppointment(true);
  };

  return (
    <View style={styles.container}>
      {/* 배경 그라데이션 - 약속 설정 여부에 따라 다름 */}
      <LinearGradient
        colors={["#FFFFFF", "#FFF2E0"]}
        locations={ [0, 0.8125]}
        style={styles.backgroundGradient}
      />
      
      {/* 구분선 - Figma: bg-[#ceb79a] h-[0.3px] top-[529px] */}
      <View style={[styles.divider, { top: hp(529) }]} />

      <SafeAreaView edges={["top", "left", "right"]} style={[styles.content, { paddingTop: insets.top }]}>
        
        {/* 코인 아이콘 + 온도 - Figma: left-[27px] top-[58px] */}
        <View style={[styles.coinTempContainer, { left: wp(27), top: hp(58) }]}>
          <CoinIcon width={wp(16)} height={wp(16)} />
          <Text style={styles.temperatureText}>{temperature}℃</Text>
        </View>

        {/* 알림 아이콘 - Figma: left-[calc(75%+17.5px)] size-[24px] top-[56px] */}
        <Pressable
          style={[
            styles.bellIconContainer,
            {
              left: SCREEN_WIDTH * 0.75 + wp(17.5),
              top: hp(56),
              width: wp(24),
              height: wp(24),
            },
          ]}
        >
          <BellIcon width={wp(22)} height={wp(22)} />
        </Pressable>

        {/* 설정 아이콘 - Figma: left-[calc(75%+49.5px)] size-[24px] top-[56px] */}
        <Pressable
          style={[
            styles.gearIconContainer,
            {
              left: SCREEN_WIDTH * 0.75 + wp(49.5),
              top: hp(56),
              width: wp(24),
              height: wp(24),
            },
          ]}
        >
          <GearIcon width={wp(22)} height={wp(22)} />
        </Pressable>

        {/* 선물 아이콘 + 텍스트 - Figma: left-[24px] top-[94px] w-[60px] */}
        <Pressable
          style={[styles.giftSection, { left: wp(24), top: hp(94), width: wp(60) }]}
          onPress={() => navigation.navigate("Shop" as never)}
        >
          <GiftIcon width={wp(56)} height={wp(56)} />
          <Text style={styles.iconLabel}>상점</Text>
        </Pressable>

        {/* 캘린더 아이콘 + 텍스트 - Figma: left-[calc(75%+13.5px)] top-[94px] w-[60px] */}
        <Pressable
          style={[
            styles.calendarSection,
            {
              left: SCREEN_WIDTH * 0.75 + wp(13.5),
              top: hp(94),
              width: wp(60),
            },
          ]}
          onPress={() => navigation.navigate("Calendar" as never)}
        >
          <View style={styles.calendarIconWrapper}>
            <CalendarIcon width={wp(56)} height={wp(56)} />
          </View>
          <Text style={styles.iconLabel}>캘린더</Text>
        </Pressable>

        {/* 약속 알림 배너 - 약속 설정한 경우만 표시 - Figma: top-[258px] */}
        {hasAppointment && (
          <View
            style={[
              styles.appointmentBanner,
              {
                left: SCREEN_WIDTH / 2,
                top: hp(258),
              },
            ]}
          >
            <SpeakerIcon width={wp(16)} height={wp(16)} />
            <Text style={styles.appointmentBannerText}>{appointmentMessage}</Text>
            <Ionicons name="chevron-forward" size={wp(12)} color="#A1968B" />
          </View>
        )}

        {/* 캐릭터 이미지 - Figma: top-[338px], size-[238px] */}
        {hasAppointment && (
          <View style={[styles.characterContainer, { 
            left: SCREEN_WIDTH / 2,
            top: hp(338) 
          }]}>
            <RabbitCharacter style={styles.characterImage} />
          </View>
        )}

        {/* 레벨 카드 - Figma: top-[602px] w-[342px] h-[108px] */}
        <View style={[styles.levelCard, { 
          left: SCREEN_WIDTH / 2,
          top: hp(602), 
          width: wp(342), 
          height: hp(108) 
        }]}>
          {/* 레벨 텍스트와 당근 배지 - 같은 줄 */}
          <View style={styles.levelRow}>
            <Text style={styles.levelText}>
              Lv {level}. {characterName}
            </Text>
            <View style={styles.carrotBadge}>
              <CarrotSmall width={wp(8.707)} height={hp(16)} />
              <Text style={styles.carrotCount}>{carrotCount}</Text>
            </View>
          </View>

          {/* 진행 바 영역 - Figma: gap-[32px] */}
          <View style={styles.progressSection}>
            {/* 진행 바와 텍스트 */}
            <View style={styles.progressBarRow}>
              <View style={styles.progressBarWrapper}>
                <ProgressBar progress={levelProgress} />
              </View>
            </View>
          </View>
        </View>

        {/* 하단 버튼 영역 - 약속 설정 여부에 따라 분기 */}
        {hasAppointment ? (
          // 약속 설정한 경우: "바로 시작" 버튼만 - Figma: top-[742px] w-[342px] h-[60px]
          <Pressable
            style={[styles.startButton, { 
              left: SCREEN_WIDTH / 2,
              top: hp(742), 
              width: wp(342), 
              height: hp(60) 
            }]}
            onPress={() => (navigation as any).navigate("Run", { autoStart: true })}
          >
            <Text style={styles.startButtonText}>바로 시작</Text>
          </Pressable>
        ) : (
          // 약속 설정하지 않은 경우: "약속 설정" 하나의 버튼
          <Pressable
            style={[styles.setAppointmentButton, { 
              left: SCREEN_WIDTH / 2,
              top: hp(742), 
              width: wp(342), 
              height: hp(60) 
            }]}
            onPress={handleSetAppointment}
          >
            <Text style={styles.setAppointmentButtonText}>약속 설정</Text>
          </Pressable>
        )}

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#FFFFFF" 
  },

  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  divider: {
    position: "absolute",
    left: 0,
    right: 0,
    width: SCREEN_WIDTH,
    height: hp(0.4),
    backgroundColor: "#CEB79A",
    shadowColor: "rgba(129, 101, 66, 0.1)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: wp(4),
    elevation: 4,
  },

  content: { 
    flex: 1, 
    position: "relative" 
  },

  coinTempContainer: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    gap: wp(8),
  },

  temperatureText: {
    fontSize: wp(16),
    fontWeight: "600",
    color: "#49393A",
    fontFamily: "Pretendard-SemiBold",
  },

  bellIconContainer: { 
    position: "absolute" 
  },
  
  gearIconContainer: { 
    position: "absolute" 
  },

  giftSection: {
    position: "absolute",
    flexDirection: "column",
    alignItems: "center",
    gap: hp(4),
  },

  calendarSection: {
    position: "absolute",
    flexDirection: "column",
    alignItems: "center",
    gap: hp(4),
  },

  calendarIconWrapper: {
    position: "relative",
    width: wp(60),
    height: wp(60),
  },

  calendarDate: {
    position: "absolute",
    left: wp(30),
    top: hp(17),
    fontSize: wp(28),
    fontWeight: "700",
    color: "#70A6F7",
    fontFamily: "Pretendard-Bold",
    transform: [{ translateX: -wp(14) }],
  },

  iconLabel: {
    fontSize: wp(16),
    fontWeight: "600",
    color: "#84776B", // Figma: gray/7
    fontFamily: "Pretendard-SemiBold",
    textAlign: "center",
  },

  appointmentBanner: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    gap: wp(6),
    backgroundColor: "#FFFFFF",
    borderWidth: wp(1),
    borderColor: "#F9F9F9", // Figma: gray/1
    borderRadius: wp(999),
    paddingHorizontal: wp(22),
    paddingVertical: hp(12),
    transform: [{ translateX: -wp(150) }], // 중앙 정렬을 위한 보정
     shadowColor: "#000",
    shadowOffset: { width: 0, height: wp(1) },
    shadowOpacity: 0.08,
    shadowRadius: wp(3),
    elevation: wp(10),
  },

  appointmentBannerText: {
    fontSize: wp(14),
    fontWeight: "600",
    color: "#4D4D4D", // Figma: gray/8
    fontFamily: "Pretendard-SemiBold",
    lineHeight: hp(19.6),
  },

  characterContainer: {
    position: "absolute",
    width: wp(238),
    height: wp(238),
    transform: [{ translateX: -wp(119) }], // 중앙 정렬
  },

  characterImage: {
    width: "100%",
    height: "100%",
  },

  levelCard: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    borderRadius: wp(16),
    paddingHorizontal: wp(24),
    paddingTop: hp(24),
    paddingBottom: hp(2),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: wp(1) },
    shadowOpacity: 0.08,
    shadowRadius: wp(3),
    elevation: 2,
    transform: [{ translateX: -wp(171) }], // 중앙 정렬
  },

  levelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hp(16), // Lv 1 텍스트와 progress bar 사이 간격 (기존: hp(32))
  },

  levelText: {
    fontSize: wp(18),
    fontWeight: "600",
    color: "#817D7A",
    fontFamily: "Pretendard-SemiBold",
    lineHeight: hp(25.2),
  },

  progressSection: {
    gap: hp(10),
  },

  progressBarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(8),
  },


  progressBarWrapper: {
    flex: 1,
    height: hp(20),
  },

  progressDistance: {
    fontSize: wp(14),
    fontWeight: "600",
    color: "#817D7A",
    fontFamily: "Pretendard-SemiBold",
    lineHeight: hp(16.8),
  },

  rewardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(6),
  },

  rewardCarrotIcon: {
    width: wp(12),
    height: hp(12),
  },

  rewardText: {
    fontSize: wp(14),
    fontWeight: "600",
    color: "#FB8800",
    fontFamily: "Pretendard-SemiBold",
    lineHeight: hp(16.8),
  },

  carrotBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(6),
    backgroundColor: "#FFF3E0",
    borderWidth: wp(0.5),
    borderColor: "#EBEBEB", // Figma: gray/2
    borderRadius: wp(999),
    paddingHorizontal: wp(10),
    paddingVertical: hp(4),
  },

  carrotCount: {
    fontSize: wp(14),
    fontWeight: "600",
    color: "#F57800", // Figma: orange/8
    fontFamily: "Pretendard-Bold",
  },


  startButton: {
    position: "absolute",
    backgroundColor: "#FB8800", // Figma: orange/7
    borderRadius: wp(16),
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateX: -wp(171) }], // 중앙 정렬
  },

  startButtonText: {
    fontSize: wp(18),
    fontWeight: "600",
    color: "#F9F9F9", // Figma: gray/1
    fontFamily: "Pretendard-SemiBold",
    lineHeight: hp(25.2),
  },

  setAppointmentButton: {
    position: "absolute",
    backgroundColor: "#FB8800", // Figma: orange/7
    borderRadius: wp(16),
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateX: -wp(171) }], // 중앙 정렬
  },

  setAppointmentButtonText: {
    fontSize: wp(16),
    fontWeight: "600",
    color: "#FBFAF9", // Figma: gray/1
    fontFamily: "Pretendard-SemiBold",
  },
});
