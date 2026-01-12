import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions, Platform, Image } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/native";

import CarrotIcon from "../../assets/figma/carrot_small.svg";
// 이미지 경로 확인 필요 (파일이 실제로 있는지 확인해주세요)
const CalendarRabbitPng = require("../../assets/figma/calendar_rabbit.png");

const FIGMA_WIDTH = 390;
const FIGMA_HEIGHT = 844;
const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get("window");

const SCREEN_WIDTH = Platform.OS === 'web' ? Math.min(WINDOW_WIDTH, 480) : WINDOW_WIDTH;
const SCREEN_HEIGHT = WINDOW_HEIGHT;

const wp = (px: number) => (px / FIGMA_WIDTH) * SCREEN_WIDTH;
const hp = (px: number) => (px / FIGMA_HEIGHT) * SCREEN_HEIGHT;

const DAYS_OF_WEEK = ["월", "화", "수", "목", "금", "토", "일"];

type DayData = { carrotCount: number; };

export default function CalendarTab() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const today = dayjs();

  const mockData = useMemo(() => {
    const data: Record<string, DayData> = {};
    let cursor = today.subtract(3, 'month');
    const yesterday = today.subtract(1, 'day');
    while (cursor.isBefore(yesterday) || cursor.isSame(yesterday, 'day')) {
      if (Math.random() < 0.6) {
        const rand = Math.random();
        let count = 1;
        if (rand > 0.8) count = 3;
        else if (rand > 0.5) count = 2;
        data[cursor.format("YYYY-MM-DD")] = { carrotCount: count };
      }
      cursor = cursor.add(1, 'day');
    }
    return data;
  }, []);

  const calendarDays = useMemo(() => {
    const startOfMonth = currentMonth.startOf("month");
    let startDay = startOfMonth.day(); 
    // 일(0) -> 6, 월(1) -> 0 ...
    const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;
    const startDate = startOfMonth.subtract(adjustedStartDay, "day");
    const days = [];
    let day = startDate;
    // 6주 (42일)
    for (let i = 0; i < 42; i++) {
      days.push(day);
      day = day.add(1, "day");
    }
    return days;
  }, [currentMonth]);

  const achievementCount = useMemo(() => {
    return Object.keys(mockData).filter(key => 
      key.startsWith(currentMonth.format("YYYY-MM"))
    ).length;
  }, [mockData, currentMonth]);

  return (
    <View style={styles.webWrapper}>
      <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
        
        {/* 헤더 */}
        <View style={styles.header}>
          <View style={styles.navRow}>
            <Pressable onPress={() => navigation.navigate("Home" as never)} style={styles.backButton} hitSlop={10}>
              <Ionicons name="chevron-back" size={wp(24)} color="#49393A" />
            </Pressable>
            <Text style={styles.headerTitle}>캘린더</Text>
            <View style={{ width: wp(24) }} />
          </View>

          <View style={styles.monthRow}>
            <View style={styles.monthController}>
              <Pressable onPress={() => setCurrentMonth(currentMonth.subtract(1, "month"))}>
                <Ionicons name="caret-back" size={wp(16)} color="#D9D9D9" />
              </Pressable>
              <Text style={styles.monthText}>{currentMonth.format("YYYY년 M월")}</Text>
              <Pressable onPress={() => setCurrentMonth(currentMonth.add(1, "month"))}>
                <Ionicons name="caret-forward" size={wp(16)} color="#D9D9D9" />
              </Pressable>
            </View>
            <View style={styles.carrotBadge}>
              <CarrotIcon width={wp(12)} height={wp(12)} />
              <Text style={styles.carrotCountText}>{achievementCount * 3 + 12}</Text>
            </View>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.heroSection}>
            <View style={styles.heroTextArea}>
              <Text style={styles.heroTitle}>
                이번 달은 {achievementCount}번이나{"\n"}목표를 달성했어요!
              </Text>
              {/* <Pressable style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>전체 기록 보러가기</Text>
                <Ionicons name="chevron-forward" size={wp(12)} color="#817D7A" />
              </Pressable> */}
              <Pressable style={styles.viewAllButton}
                onPress={() => (navigation as any).navigate("TotalRecord")} >
                <Text style={styles.viewAllText}>전체 기록 보러가기</Text>
                <Ionicons name="chevron-forward" size={wp(12)} color="#817D7A" />
              </Pressable>
            </View>
            <Image source={CalendarRabbitPng} style={styles.rabbitImage} resizeMode="contain" />
          </View>

          <View style={styles.calendarContainer}>
            <View style={styles.weekdayHeader}>
              {DAYS_OF_WEEK.map((day, idx) => (
                <Text 
                  key={day} 
                  style={[
                    styles.weekdayText,
                    idx === 6 && { color: "#FB8800" }, 
                    idx === 5 && { color: "#70A6F7" }
                  ]}
                >
                  {day}
                </Text>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {calendarDays.map((date, index) => {
                const dateStr = date.format("YYYY-MM-DD");
                const isCurrentMonth = date.month() === currentMonth.month();
                const isToday = date.isSame(today, 'day');
                const data = mockData[dateStr];
                
                return (
                  <Pressable key={index} style={styles.dayCell}>
                    <View style={[styles.dateNumContainer, isToday && styles.todayCircle]}>
                      <Text style={[styles.dateNum, !isCurrentMonth && { color: "#E0E0E0" }, isToday && { color: "#FFFFFF", fontWeight: "700" }]}>
                        {date.date()}
                      </Text>
                    </View>
                    {isCurrentMonth && data && (
                      <View style={styles.barContainer}>
                        <View style={[styles.bar, styles.barGreen]} />
                        {data.carrotCount >= 2 && <View style={[styles.bar, styles.barOrange]} />}
                        {data.carrotCount >= 3 && <View style={[styles.bar, styles.barDarkOrange]} />}
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        
        </ScrollView>

        <Pressable 
          style={styles.floatingButton}
          // [수정] 날짜 데이터 전달
          onPress={() => (navigation as any).navigate("AppointmentCreate", { 
            selectedDate: today.format("YYYY-MM-DD") 
          })}
        >
          <Ionicons name="add" size={wp(32)} color="#FFFFFF" />
        </Pressable>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  webWrapper: { flex: 1, backgroundColor: Platform.OS === 'web' ? '#f0f0f0' : '#FFFFFF', alignItems: 'center' },
  container: { flex: 1, width: '100%', maxWidth: 480, backgroundColor: "#FDFAF2CC" }, 
  scrollContent: { paddingBottom: hp(100) },

  header: { paddingHorizontal: wp(20), paddingBottom: hp(20), backgroundColor: "#FDFAF2CC" },
  navRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: hp(20), marginTop: hp(10) },
  backButton: { padding: wp(4) },
  headerTitle: { fontSize: wp(18), fontWeight: "600", color: "#49393A", fontFamily: "Pretendard-SemiBold" },
  monthRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  monthController: { flexDirection: "row", alignItems: "center", gap: wp(12) },
  monthText: { fontSize: wp(20), fontWeight: "700", color: "#49393A", fontFamily: "Pretendard-Bold" },
  carrotBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF3E0", paddingHorizontal: wp(12), paddingVertical: hp(6), borderRadius: wp(20), gap: wp(6) },
  carrotCountText: { fontSize: wp(14), fontWeight: "700", color: "#F57800", fontFamily: "Pretendard-Bold" },

  heroSection: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    paddingHorizontal: wp(24), 
    marginBottom: 0,
    backgroundColor: "#FDFAF2CC", 
    paddingBottom: hp(30) 
  },
  heroTextArea: { flex: 1 },
  heroTitle: { fontSize: wp(16), fontWeight: "700", color: "#282119", lineHeight: hp(24), marginBottom: hp(8), fontFamily: "Pretendard-Bold" },
  viewAllButton: { flexDirection: "row", alignItems: "center", gap: wp(2) },
  viewAllText: { fontSize: wp(12), color: "#817D7A", fontFamily: "Pretendard-Medium" },
  rabbitImage: { width: wp(110), height: wp(110), marginRight: wp(10) },

  calendarContainer: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    paddingTop: hp(20),
    minHeight: hp(500),
  },
  weekdayHeader: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: wp(20), marginBottom: hp(10) },
  // [수정] 픽셀 계산 대신 %로 변경하여 밀림 방지
  weekdayText: { width: '14.28%', textAlign: "center", fontSize: wp(14), color: "#BDBDBD", fontFamily: "Pretendard-Medium" },
  calendarGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: wp(20) },
  // [수정] 픽셀 계산 대신 %로 변경하여 밀림 방지
  dayCell: { width: '14.28%', height: hp(70), alignItems: "center", marginBottom: hp(4) },
  dateNumContainer: { width: wp(28), height: wp(28), alignItems: "center", justifyContent: "center", borderRadius: wp(14), marginBottom: hp(4) },
  todayCircle: { backgroundColor: "#FB8800" },
  dateNum: { fontSize: wp(14), color: "#49393A", fontFamily: "Pretendard-Medium" },
  barContainer: { width: wp(36), gap: hp(2) },
  bar: { width: "100%", height: hp(8), borderRadius: wp(2) },
  barGreen: { backgroundColor: "#A8D768" },
  barOrange: { backgroundColor: "#FFB040" },
  barDarkOrange: { backgroundColor: "#F57800" },
  floatingButton: { position: "absolute", bottom: hp(30), right: wp(20), width: wp(56), height: wp(56), borderRadius: wp(28), backgroundColor: "#FB8800", alignItems: "center", justifyContent: "center", shadowColor: "#FB8800", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
});