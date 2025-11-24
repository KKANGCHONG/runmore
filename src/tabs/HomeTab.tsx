// src/tabs/HomeTab.tsx
import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, Dimensions, Image } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

// Figma 기준 화면 크기
const FIGMA_WIDTH = 390;
const FIGMA_HEIGHT = 844;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// 화면 비율 계산
const wp = (px: number) => (px / FIGMA_WIDTH) * SCREEN_WIDTH;
const hp = (px: number) => (px / FIGMA_HEIGHT) * SCREEN_HEIGHT;

// 사용되는 이미지들
const GiftIcon = require("../../assets/figma/gift_icon.png");
const CalendarIcon = require("../../assets/figma/calendar_icon.png");
const BellIcon = require("../../assets/figma/bell_icon.png");
const GearIcon = require("../../assets/figma/gear_icon.png");
const CoinIcon = require("../../assets/figma/coin_icon.png");
const ProgressBar = require("../../assets/figma/progress_bar.png");
const CarrotSmall = require("../../assets/figma/carrot_small.png");
const SpeakerIcon = require("../../assets/figma/speaker_icon.png");

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
  const userName = "등재";
  const appointmentMessage = `${userName}님, 오늘 오후 3시에 3km 뛰기로 했어요!`;

  // 약속 수정 핸들러 (실제로는 모달이나 다른 화면으로 이동)
  const handleEditAppointment = () => {
    // TODO: 약속 수정 로직
    console.log("약속 수정");
  };

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
        locations={hasAppointment ? [0, 0.8125] : [0, 0.83153]}
        style={styles.backgroundGradient}
      />
      
      {/* 구분선 - Figma: bg-[#ceb79a] h-[0.3px] top-[529px] */}
      <View style={[styles.divider, { top: hp(529) }]} />

      <SafeAreaView edges={["top", "left", "right"]} style={[styles.content, { paddingTop: insets.top }]}>
        
        {/* 코인 아이콘 + 온도 - Figma: left-[27px] top-[58px] */}
        <View style={[styles.coinTempContainer, { left: wp(27), top: hp(58) }]}>
          <Image source={CoinIcon} style={{ width: wp(16), height: wp(16) }} resizeMode="contain" />
          <Text style={styles.temperatureText}>{temperature}℃</Text>
        </View>

        {/* 알림 아이콘 - Figma: left-[calc(75%+17.5px)] size-[24px] top-[56px] */}
        <Pressable style={[styles.bellIconContainer, { 
          left: SCREEN_WIDTH * 0.75 + wp(17.5), 
          top: hp(56), 
          width: wp(24), 
          height: wp(24) 
        }]}>
          <Image source={BellIcon} style={{ width: wp(24), height: wp(24) }} resizeMode="contain" />
        </Pressable>

        {/* 설정 아이콘 - Figma: left-[calc(75%+49.5px)] size-[24px] top-[56px] */}
        <Pressable style={[styles.gearIconContainer, { 
          left: SCREEN_WIDTH * 0.75 + wp(49.5), 
          top: hp(56), 
          width: wp(24), 
          height: wp(24) 
        }]}>
          <Image source={GearIcon} style={{ width: wp(24), height: wp(24) }} resizeMode="contain" />
        </Pressable>

        {/* 선물 아이콘 + 텍스트 - Figma: left-[24px] top-[94px] w-[60px] */}
        <Pressable
          style={[styles.giftSection, { left: wp(24), top: hp(94), width: wp(60) }]}
          onPress={() => navigation.navigate("Shop" as never)}
        >
          <Image source={GiftIcon} style={{ width: wp(60), height: wp(60) }} resizeMode="contain" />
          <Text style={styles.iconLabel}>상점</Text>
        </Pressable>

        {/* 캘린더 아이콘 + 텍스트 - Figma: left-[calc(75%+13.5px)] top-[94px] w-[60px] */}
        <Pressable
          style={[styles.calendarSection, { 
            left: SCREEN_WIDTH * 0.75 + wp(13.5), 
            top: hp(94), 
            width: wp(60) 
          }]}
          onPress={() => navigation.navigate("Calendar" as never)}
        >
          <View style={styles.calendarIconWrapper}>
            <Image source={CalendarIcon} style={{ width: wp(60), height: wp(60) }} resizeMode="contain" />
          </View>
          <Text style={styles.iconLabel}>캘린더</Text>
        </Pressable>

        {/* 약속 알림 배너 - 약속 설정한 경우만 표시 - Figma: left-[calc(50%+4px)] top-[244px] */}
        {hasAppointment && (
          <View style={[styles.appointmentBanner, { 
            left: SCREEN_WIDTH / 2 + wp(4), 
            top: hp(244) 
          }]}>
            <Image source={SpeakerIcon} style={{ width: wp(16), height: wp(16) }} resizeMode="contain" />
            <Text style={styles.appointmentBannerText}>{appointmentMessage}</Text>
          </View>
        )}

        {/* 레벨 카드 - Figma: left-[24px] top-[601px] w-[342px] h-[105px] */}
        <View style={[styles.levelCard, { 
          left: wp(24), 
          top: hp(601), 
          width: wp(342), 
          height: hp(105) 
        }]}>
          {/* 레벨 텍스트 - Figma: left-[100.5px] top-[625px] */}
          <Text style={[styles.levelText, { left: wp(100.5), top: hp(625 - 601) }]}>
            Lv {level}. {characterName}
          </Text>

          {/* 진행 바 - Figma: left-[48px] top-[682px] w-[255.844px] */}
          <View style={[styles.progressBarContainer, { 
            left: wp(48), 
            top: hp(682 - 601), 
            width: wp(255.844) 
          }]}>
            <Image source={ProgressBar} style={styles.progressBarImage} resizeMode="stretch" />
          </View>

          {/* 당근 배지 - Figma: left-[calc(75%+8.5px)] top-[621px] */}
          <View style={[styles.carrotBadge, { 
            left: SCREEN_WIDTH * 0.75 + wp(8.5), 
            top: hp(621 - 601) 
          }]}>
            <Image source={CarrotSmall} style={{ width: wp(8.707), height: hp(16) }} resizeMode="contain" />
            <Text style={styles.carrotCount}>{carrotCount}</Text>
          </View>
        </View>

        {/* 하단 버튼 영역 - 약속 설정 여부에 따라 분기 */}
        {hasAppointment ? (
          // 약속 설정한 경우: "약속 수정" + "바로 시작" 두 개 버튼
          <View style={styles.buttonRow}>
            {/* 약속 수정 버튼 - Figma: left-[24px] top-[742px] w-[165px] h-[60px] */}
            <Pressable
              style={[styles.editButton, { 
                left: wp(24), 
                top: hp(742), 
                width: wp(165), 
                height: hp(60) 
              }]}
              onPress={handleEditAppointment}
            >
              <Text style={styles.editButtonText}>약속 수정</Text>
            </Pressable>

            {/* 바로 시작 버튼 - Figma: left-[calc(50%+6px)] top-[742px] w-[165px] h-[60px] */}
            <Pressable
              style={[styles.startButton, { 
                left: SCREEN_WIDTH / 2 + wp(6), 
                top: hp(742), 
                width: wp(165), 
                height: hp(60) 
              }]}
              onPress={() => navigation.navigate("Run" as never, { autoStart: true } as never)}
            >
              <Text style={styles.startButtonText}>바로 시작</Text>
            </Pressable>
          </View>
        ) : (
          // 약속 설정하지 않은 경우: "약속 설정" 하나의 버튼
          <Pressable
            style={[styles.setAppointmentButton, { 
              left: wp(24), 
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
    height: hp(0.3),
    backgroundColor: "#CEB79A",
    shadowColor: "rgba(129, 101, 66, 0.1)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: wp(20),
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
    fontSize: wp(14),
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
    borderColor: "#FBFAF9", // Figma: gray/1
    borderRadius: wp(999),
    paddingHorizontal: wp(18),
    paddingVertical: hp(12),
    transform: [{ translateX: -wp(171) }], // 중앙 정렬을 위한 보정
  },

  appointmentBannerText: {
    fontSize: wp(14),
    fontWeight: "600",
    color: "#685B4E", // Figma: gray/8
    fontFamily: "Pretendard-SemiBold",
  },

  levelCard: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    borderRadius: wp(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: hp(1) },
    shadowOpacity: 0.08,
    shadowRadius: wp(3),
    elevation: 2,
  },

  levelText: {
    position: "absolute",
    fontSize: wp(18),
    fontWeight: "700",
    color: "#817D7A",
    fontFamily: "Pretendard-Bold",
  },

  progressBarContainer: {
    position: "absolute",
    height: hp(20),
  },

  progressBarImage: {
    width: "100%",
    height: "100%",
  },

  carrotBadge: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(6),
    backgroundColor: "#FFF3E0",
    borderWidth: wp(0.5),
    borderColor: "#F6F4F2", // Figma: gray/2
    borderRadius: wp(999),
    paddingHorizontal: wp(10),
    paddingVertical: hp(4),
  },

  carrotCount: {
    fontSize: wp(14),
    fontWeight: "700",
    color: "#F57800", // Figma: orange/8
    fontFamily: "Pretendard-Bold",
  },

  buttonRow: {
    position: "absolute",
    flexDirection: "row",
  },

  editButton: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    borderRadius: wp(16),
    alignItems: "center",
    justifyContent: "center",
  },

  editButtonText: {
    fontSize: wp(18),
    fontWeight: "600",
    color: "#FB8800", // Figma: orange/7
    fontFamily: "Pretendard-SemiBold",
  },

  startButton: {
    position: "absolute",
    backgroundColor: "#FB8800", // Figma: orange/7
    borderRadius: wp(16),
    alignItems: "center",
    justifyContent: "center",
  },

  startButtonText: {
    fontSize: wp(18),
    fontWeight: "600",
    color: "#FBFAF9", // Figma: gray/1
    fontFamily: "Pretendard-SemiBold",
  },

  setAppointmentButton: {
    position: "absolute",
    backgroundColor: "#FB8800", // Figma: orange/7
    borderRadius: wp(16),
    alignItems: "center",
    justifyContent: "center",
  },

  setAppointmentButtonText: {
    fontSize: wp(18),
    fontWeight: "600",
    color: "#FBFAF9", // Figma: gray/1
    fontFamily: "Pretendard-SemiBold",
  },
});
