// src/tabs/CalendarTab.tsx
import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/native";
import CalendarDay from "../components/calendar/CalendarDay";
import AppointmentBottomSheet from "../components/calendar/AppointmentBottomSheet";

const FIGMA_WIDTH = 390;
const FIGMA_HEIGHT = 844;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const wp = (px: number) => (px / FIGMA_WIDTH) * SCREEN_WIDTH;
const hp = (px: number) => (px / FIGMA_HEIGHT) * SCREEN_HEIGHT;

type DayState = {
  date: string; // "YYYY-MM-DD"
  isPast: boolean;
  carrotCount: number; // 0~4
  appointmentTime: string | null; // "오후 3시" 형식
  appointmentDistance?: string; // "3km" 형식
};

const DAYS_OF_WEEK = ["월", "화", "수", "목", "금", "토", "일"];

export default function CalendarTab() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [currentMonth, setCurrentMonth] = useState(dayjs().format("YYYY-MM"));
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [selectedDateForSheet, setSelectedDateForSheet] = useState<string>("");

  // 날짜별 상태 관리 (실제로는 AsyncStorage나 API에서 가져올 데이터)
  const [daysState, setDaysState] = useState<Record<string, DayState>>({
    "2025-11-27": { date: "2025-11-27", isPast: true, carrotCount: 4, appointmentTime: null },
    "2025-11-28": { date: "2025-11-28", isPast: true, carrotCount: 2, appointmentTime: null },
    "2025-11-29": { date: "2025-11-29", isPast: true, carrotCount: 2, appointmentTime: null },
    "2025-11-30": { date: "2025-11-30", isPast: true, carrotCount: 4, appointmentTime: null },
    "2025-12-01": { date: "2025-12-01", isPast: true, carrotCount: 0, appointmentTime: null },
    "2025-12-02": { date: "2025-12-02", isPast: true, carrotCount: 2, appointmentTime: null },
    "2025-12-03": { date: "2025-12-03", isPast: true, carrotCount: 0, appointmentTime: null },
    "2025-12-06": { date: "2025-12-06", isPast: true, carrotCount: 4, appointmentTime: null },
    "2025-12-07": { date: "2025-12-07", isPast: true, carrotCount: 1, appointmentTime: null },
    "2025-12-10": { date: "2025-12-10", isPast: true, carrotCount: 4, appointmentTime: null },
    "2025-12-11": { date: "2025-12-11", isPast: true, carrotCount: 2, appointmentTime: null },
    "2025-12-13": { date: "2025-12-13", isPast: true, carrotCount: 1, appointmentTime: null },
    "2025-12-15": { date: "2025-12-15", isPast: true, carrotCount: 4, appointmentTime: null },
    "2025-12-17": { date: "2025-12-17", isPast: true, carrotCount: 1, appointmentTime: null },
    "2025-12-19": { date: "2025-12-19", isPast: true, carrotCount: 1, appointmentTime: null },
    "2025-12-21": { date: "2025-12-21", isPast: true, carrotCount: 1, appointmentTime: null },
    "2025-12-22": { date: "2025-12-22", isPast: false, carrotCount: 0, appointmentTime: "오후 3시", appointmentDistance: "3km" },
    "2025-12-23": { date: "2025-12-23", isPast: false, carrotCount: 0, appointmentTime: "오후 3시", appointmentDistance: "3km" },
  });

  const today = dayjs();
  const monthStart = dayjs(currentMonth).startOf("month");
  const monthEnd = dayjs(currentMonth).endOf("month");
  const startDate = monthStart.startOf("week");
  const endDate = monthEnd.endOf("week");

  // 월별 통계 계산
  const monthlyStats = useMemo(() => {
    const monthDays = Object.values(daysState).filter(
      (day) => day.date.startsWith(currentMonth) && day.isPast
    );
    return {
      distance: monthDays.reduce((sum, day) => sum + (day.carrotCount > 0 ? 1 : 0), 0),
      count: monthDays.filter((day) => day.carrotCount > 0).length,
      time: monthDays.reduce((sum, day) => sum + day.carrotCount, 0),
      calories: monthDays.reduce((sum, day) => sum + day.carrotCount, 0),
    };
  }, [daysState, currentMonth]);

  // 달력 그리드 생성
  const calendarDays = useMemo(() => {
    const days: Array<{ date: dayjs.Dayjs; dayOfWeek?: string }> = [];
    let current = startDate;
    let isFirstRow = true;

    while (current.isBefore(endDate) || current.isSame(endDate)) {
      const dayIndex = current.day() === 0 ? 6 : current.day() - 1;
      days.push({
        date: current,
        dayOfWeek: isFirstRow ? DAYS_OF_WEEK[dayIndex] : undefined,
      });
      current = current.add(1, "day");
      if (current.day() === 1) isFirstRow = false;
    }

    return days;
  }, [startDate, endDate]);

  const handleDayPress = (date: dayjs.Dayjs) => {
    const dateStr = date.format("YYYY-MM-DD");
    const dayState = daysState[dateStr];
    const isPast = date.isBefore(today, "day");

    if (!isPast && !dayState?.appointmentTime) {
      // 미래 날짜이고 약속이 없으면 Bottom Sheet 열기
      setSelectedDateForSheet(dateStr);
      setBottomSheetVisible(true);
    }
  };

  const handleSaveAppointment = (data: {
    time: string;
    distance: number;
    alarmBefore: string;
  }) => {
    const timeMatch = data.time.match(/(오전|오후)\s*(\d+)시/);
    const timeStr = timeMatch ? `${timeMatch[1]} ${timeMatch[2]}시` : data.time;
    
    setDaysState((prev) => ({
      ...prev,
      [selectedDateForSheet]: {
        date: selectedDateForSheet,
        isPast: false,
        carrotCount: 0,
        appointmentTime: timeStr,
        appointmentDistance: `${data.distance}km`,
      },
    }));
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={[styles.container, { paddingTop: insets.top }]}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={wp(20)} color="#000000" />
        </Pressable>
        <View style={styles.titleSection}>
          <Text style={styles.title}>캘린더</Text>
          <View style={styles.monthNavigator}>
            <Pressable
              onPress={() => {
                const prevMonth = dayjs(currentMonth).subtract(1, "month");
                setCurrentMonth(prevMonth.format("YYYY-MM"));
              }}
            >
              <Ionicons name="chevron-back" size={wp(18)} color="#000000" />
            </Pressable>
            <Text style={styles.monthText}>
              {dayjs(currentMonth).format("YYYY년 M월")}
            </Text>
            <Pressable
              onPress={() => {
                const nextMonth = dayjs(currentMonth).add(1, "month");
                setCurrentMonth(nextMonth.format("YYYY-MM"));
              }}
            >
              <Ionicons name="chevron-forward" size={wp(18)} color="#000000" />
            </Pressable>
          </View>
        </View>
        <View style={styles.carrotBadge}>
          <Text style={styles.carrotIcon}>🥕</Text>
          <Text style={styles.carrotCount}>34</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 월별 통계 카드 */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>
            {dayjs(currentMonth).format("M월")} 등재의 기록
          </Text>
          <View style={styles.statsRow}>
            <Text style={styles.statText}>
              <Text style={styles.statLabel}>거리</Text>{" "}
              <Text style={styles.statValue}>{monthlyStats.distance}km</Text>
            </Text>
            <Text style={styles.statText}>
              <Text style={styles.statLabel}>횟수</Text>{" "}
              <Text style={styles.statValue}>{monthlyStats.count}회</Text>
            </Text>
            <Text style={styles.statText}>
              <Text style={styles.statLabel}>시간</Text>{" "}
              <Text style={styles.statValue}>{monthlyStats.time}분</Text>
            </Text>
            <Text style={styles.statText}>
              <Text style={styles.statLabel}>칼로리</Text>{" "}
              <Text style={styles.statValue}>{monthlyStats.calories}kcal</Text>
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={wp(16)}
            color="#A1968B"
            style={styles.statsArrow}
          />
        </View>

        {/* 달력 그리드 */}
        <View style={styles.calendarGrid}>
          {calendarDays.map(({ date, dayOfWeek }, index) => {
            const dateStr = date.format("YYYY-MM-DD");
            const dayState = daysState[dateStr] || {
              date: dateStr,
              isPast: date.isBefore(today, "day"),
              carrotCount: 0,
              appointmentTime: null,
            };
            const isToday = date.isSame(today, "day");

            return (
              <View key={index} style={styles.calendarDayWrapper}>
                <CalendarDay
                  date={date.date()}
                  dayOfWeek={dayOfWeek}
                  isPast={dayState.isPast}
                  hasAppointment={!!dayState.appointmentTime}
                  carrotCount={dayState.carrotCount}
                  appointmentTime={dayState.appointmentTime}
                  appointmentDistance={dayState.appointmentDistance}
                  isToday={isToday}
                  onPress={() => handleDayPress(date)}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Sheet */}
      <AppointmentBottomSheet
        visible={bottomSheetVisible}
        selectedDate={selectedDateForSheet}
        onClose={() => setBottomSheetVisible(false)}
        onSave={handleSaveAppointment}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBF6",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(21),
    paddingVertical: hp(12),
  },
  backButton: {
    width: wp(44),
    height: wp(44),
    alignItems: "center",
    justifyContent: "center",
  },
  titleSection: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: wp(16),
    fontWeight: "500",
    color: "#685B4E",
    marginBottom: hp(4),
    fontFamily: "Pretendard-Medium",
  },
  monthNavigator: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(8),
  },
  monthText: {
    fontSize: wp(16),
    color: "#4B3E33",
    fontFamily: "Pretendard-Medium",
  },
  carrotBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    borderWidth: wp(0.5),
    borderColor: "#EBE7E5",
    borderRadius: wp(999),
    paddingHorizontal: wp(10),
    paddingVertical: hp(4),
    gap: wp(6),
  },
  carrotIcon: {
    fontSize: wp(8.707),
    width: wp(8.707),
    height: hp(16),
  },
  carrotCount: {
    fontSize: wp(14),
    fontWeight: "700",
    color: "#F57800",
    fontFamily: "Pretendard-Bold",
  },
  scrollContent: {
    paddingHorizontal: wp(21),
    paddingBottom: hp(40),
  },
  statsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: wp(12),
    padding: wp(16),
    marginTop: hp(8),
    marginBottom: hp(24),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: wp(4) },
    shadowOpacity: 0.1,
    shadowRadius: wp(20),
    elevation: 4,
  },
  statsTitle: {
    fontSize: wp(14),
    fontWeight: "500",
    color: "#282119",
    marginBottom: hp(8),
    textAlign: "center",
    fontFamily: "Pretendard-Medium",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statText: {
    fontSize: wp(14),
    color: "#49393A",
    fontFamily: "Pretendard-Medium",
  },
  statLabel: {
    color: "#84776B",
  },
  statValue: {
    fontWeight: "700",
    color: "#F57800",
    fontFamily: "Pretendard-Bold",
  },
  statsArrow: {
    position: "absolute",
    right: wp(16),
    top: "50%",
    marginTop: -wp(8),
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    width: SCREEN_WIDTH - wp(42), // padding 제외
  },
  calendarDayWrapper: {
    width: wp(45),
    marginRight: wp(4),
    marginBottom: hp(8),
  },
});
