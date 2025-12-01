// src/tabs/CalendarTab.tsx
import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/native";
import CalendarDay from "../components/calendar/CalendarDay";
import AppointmentBottomSheet from "../components/calendar/AppointmentBottomSheet";
import CarrotIcon from "../../assets/figma/carrot_small.svg";

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
    "2025-11-01": { date: "2025-11-27", isPast: true, carrotCount: 4, appointmentTime: null },
    "2025-11-03": { date: "2025-11-28", isPast: true, carrotCount: 2, appointmentTime: null },
    "2025-11-05": { date: "2025-11-29", isPast: true, carrotCount: 2, appointmentTime: null },
    "2025-11-06": { date: "2025-11-30", isPast: true, carrotCount: 4, appointmentTime: null },
    "2025-11-20": { date: "2025-12-01", isPast: true, carrotCount: 3, appointmentTime: null },
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
    const days: Array<{ date: dayjs.Dayjs }> = [];
    let current = startDate;

    while (current.isBefore(endDate) || current.isSame(endDate)) {
      days.push({
        date: current,
      });
      current = current.add(1, "day");
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
  {/* 1줄: 뒤로가기 + "캘린더" 타이틀 (같은 x축) */}
  <View style={styles.headerTopRow}>
    <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
      <Ionicons name="chevron-back" size={wp(20)} color="#A1968B" />
    </Pressable>

    <View style={styles.titleSection}>
      <Text style={styles.title}>캘린더</Text>
    </View>
  </View>

  {/* 2줄: 월 텍스트 + 당근 배지 (같은 x축) */}
  <View style={styles.headerBottomRow}>
    <View style={styles.monthNavigator}>
      <Pressable
        onPress={() => {
          const prevMonth = dayjs(currentMonth).subtract(1, "month");
          setCurrentMonth(prevMonth.format("YYYY-MM"));
        }}
      >
        <Ionicons name="chevron-back" size={wp(18)} color="#A1968B" />
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
        <Ionicons name="chevron-forward" size={wp(18)} color="#A1968B" />
      </Pressable>
    </View>
      <View style={styles.carrotBadge}>
        <CarrotIcon width={wp(8.707)} height={hp(16)} />
        <Text style={styles.carrotCount}>34</Text>
      </View>
    </View>
</View>


    

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 월별 통계 카드 */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>
            {dayjs(currentMonth).format("M월")}의 기록
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
        </View>

        {/* 요일 헤더 */}
        <View style={styles.weekdayHeader}>
          {DAYS_OF_WEEK.map((day, index) => (
            <View key={index} style={styles.weekdayHeaderItem}>
              <Text style={styles.weekdayHeaderText}>{day}</Text>
            </View>
          ))}
        </View>

        {/* 달력 그리드 */}
        <View style={styles.calendarGrid}>
          {calendarDays.map(({ date }, index) => {
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
    paddingHorizontal: wp(18)
  },
  
  // 1. chevron-back 아이콘 + "캘린더"를 같은 x축에
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center", // 세로 가운데 정렬 → 같은 높이
  },

  backButton: {
    width: wp(44),
    height: wp(44),
    alignItems: "flex-start",
    justifyContent: "center",
  },

  titleSection: {
    position: "absolute",
    left: "45%",
    alignItems: "center",   // 가운데 정렬
    justifyContent: "center",
  },
  title: {
    fontSize: wp(16),
    fontWeight: "500",
    color: "#685B4E",
    marginBottom: hp(4),
    fontFamily: "Pretendard-Medium",
  },

  // 2. "YYYY년 M월" + carrotBadge를 같은 x축에
headerBottomRow: {
  marginTop: hp(6),
  flexDirection: "row",
  alignItems: "center",         // 세로 가운데 → 같은 높이
  justifyContent: "space-between", // 왼쪽: 월 네비, 오른쪽: 당근 배지
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
    marginTop: hp(16),
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
  weekdayHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: SCREEN_WIDTH - wp(42), // padding 제외
    marginBottom: hp(8),
  },
  weekdayHeaderItem: {
    width: wp(45),
    marginRight: wp(4),
    alignItems: "center",
  },
  weekdayHeaderText: {
    fontSize: wp(14),
    color: "#DBD6D1",
    fontFamily: "Pretendard-Regular",
    textAlign: "center",
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
