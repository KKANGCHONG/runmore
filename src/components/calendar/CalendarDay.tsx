// src/components/calendar/CalendarDay.tsx
import React from "react";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CarrotProgressBar from "./CarrotProgressBar";

const FIGMA_WIDTH = 390;
const FIGMA_HEIGHT = 844;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const wp = (px: number) => (px / FIGMA_WIDTH) * SCREEN_WIDTH;
const hp = (px: number) => (px / FIGMA_HEIGHT) * SCREEN_HEIGHT;

type Props = {
  date: number;
  isPast: boolean;
  hasAppointment: boolean;
  carrotCount: number; // 0~4
  appointmentTime: string | null; // "오후 3시" 형식
  appointmentDistance?: string; // "3km" 형식
  isToday?: boolean;
  onPress: () => void;
};

export default function CalendarDay({
  date,
  isPast,
  hasAppointment,
  carrotCount,
  appointmentTime,
  appointmentDistance,
  isToday = false,
  onPress,
}: Props) {
  const showPlus = !isPast && !hasAppointment;
  const showAppointment = !isPast && hasAppointment;
  const showProgress = isPast;

  // 오늘 약속 텍스트 색상: 주황색, 다른 날짜: 회색
  const appointmentTimeStyle = isToday 
    ? styles.appointmentTimeToday 
    : styles.appointmentTimeNormal;
  const appointmentDistanceStyle = isToday 
    ? styles.appointmentDistanceToday 
    : styles.appointmentDistanceNormal;

  return (
    <Pressable style={styles.container} onPress={onPress}>
      {/* 날짜 텍스트 */}
      <View style={styles.dateContainer}>
        {/* 오늘 날짜 표시 (초록 원) - 날짜 텍스트 뒤에 */}
        {isToday && <View style={styles.todayIndicator} />}
        <Text style={[styles.dateText, isToday && styles.todayDateText]}>
          {date}
        </Text>
      </View>

      {/* 하단 영역 */}
      <View style={styles.bottomArea}>
        {showPlus && (
          <View style={styles.plusContainer}>
            <Ionicons name="add-circle" size={wp(28)} color="#EBE8E5" />
          </View>
        )}

        {showAppointment && appointmentTime && (
          <View style={styles.appointmentContainer}>
            <Text style={appointmentTimeStyle}>{appointmentTime}</Text>
            {appointmentDistance && (
              <Text style={appointmentDistanceStyle}>{appointmentDistance}</Text>
            )}
          </View>
        )}

        {showProgress && (
          <CarrotProgressBar carrotCount={carrotCount} />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: wp(45),
    alignItems: "center",
    gap: hp(8),
    position: "relative",
  },
  dateContainer: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: hp(32),
    position: "relative",
    width: "100%",
  },
  dateText: {
    fontSize: wp(14),
    color: "#A1968B",
    fontFamily: "Pretendard-Medium",
    textAlign: "center",
    position: "relative",
    zIndex: 2,
  },
  todayDateText: {
    color: "#FBFAF9",
    fontFamily: "Pretendard-Bold",
  },
  todayIndicator: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -wp(12.5) }, { translateY: -wp(12.5) }],
    width: wp(25),
    height: wp(25),
    borderRadius: wp(12.5),
    backgroundColor: "#62D837",
    zIndex: 0,
  },
  bottomArea: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    minHeight: hp(46),
  },
  plusContainer: {
    width: wp(45),
    height: hp(46),
    alignItems: "center",
    justifyContent: "center",
  },
  appointmentContainer: {
    width: wp(45),
    height: hp(46),
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    borderRadius: wp(4),
  },
  appointmentTimeToday: {
    fontSize: wp(12),
    fontWeight: "700",
    color: "#F57800",
    fontFamily: "Pretendard-Bold",
    lineHeight: hp(14.4),
    textAlign: "center",
  },
  appointmentTimeNormal: {
    fontSize: wp(12),
    fontWeight: "700",
    color: "#84776B",
    fontFamily: "Pretendard-Bold",
    lineHeight: hp(14.4),
    textAlign: "center",
  },
  appointmentDistanceToday: {
    fontSize: wp(12),
    fontWeight: "500",
    color: "#FE9800",
    fontFamily: "Pretendard-Medium",
    lineHeight: hp(14.4),
    textAlign: "center",
  },
  appointmentDistanceNormal: {
    fontSize: wp(12),
    fontWeight: "500",
    color: "#A1968B",
    fontFamily: "Pretendard-Medium",
    lineHeight: hp(14.4),
    textAlign: "center",
  },
});

