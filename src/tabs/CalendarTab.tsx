// // src/tabs/CalendarTab.tsx
// import React, { useState, useMemo } from "react";
// import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions } from "react-native";
// import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
// import { Ionicons } from "@expo/vector-icons";
// import dayjs from "dayjs";
// import { useNavigation } from "@react-navigation/native";
// import CalendarDay from "../components/calendar/CalendarDay";
// import AppointmentBottomSheet from "../components/calendar/AppointmentBottomSheet";
// import CarrotIcon from "../../assets/figma/carrot_small.svg";

// const FIGMA_WIDTH = 390;
// const FIGMA_HEIGHT = 844;
// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
// const wp = (px: number) => (px / FIGMA_WIDTH) * SCREEN_WIDTH;
// const hp = (px: number) => (px / FIGMA_HEIGHT) * SCREEN_HEIGHT;

// type DayState = {
//   date: string; // "YYYY-MM-DD"
//   isPast: boolean;
//   carrotCount: number; // 0~4
//   appointmentTime: string | null; // "오후 3시" 형식
//   appointmentDistance?: string; // "3km" 형식
// };

// const DAYS_OF_WEEK = ["월", "화", "수", "목", "금", "토", "일"];

// export default function CalendarTab() {
//   const insets = useSafeAreaInsets();
//   const navigation = useNavigation();
//   const [currentMonth, setCurrentMonth] = useState(dayjs().format("YYYY-MM"));
//   const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
//   const [selectedDateForSheet, setSelectedDateForSheet] = useState<string>("");

//   // 날짜별 상태 관리 (실제로는 AsyncStorage나 API에서 가져올 데이터)
//   const [daysState, setDaysState] = useState<Record<string, DayState>>({
//     "2025-11-01": { date: "2025-11-27", isPast: true, carrotCount: 4, appointmentTime: null },
//     "2025-11-03": { date: "2025-11-28", isPast: true, carrotCount: 2, appointmentTime: null },
//     "2025-11-05": { date: "2025-11-29", isPast: true, carrotCount: 2, appointmentTime: null },
//     "2025-11-06": { date: "2025-11-30", isPast: true, carrotCount: 4, appointmentTime: null },
//     "2025-11-20": { date: "2025-12-01", isPast: true, carrotCount: 3, appointmentTime: null },
//   });

//   const today = dayjs();
//   const monthStart = dayjs(currentMonth).startOf("month");
//   const monthEnd = dayjs(currentMonth).endOf("month");
//   const startDate = monthStart.startOf("week");
//   const endDate = monthEnd.endOf("week");

//   // 월별 통계 계산
//   const monthlyStats = useMemo(() => {
//     const monthDays = Object.values(daysState).filter(
//       (day) => day.date.startsWith(currentMonth) && day.isPast
//     );
//     return {
//       distance: monthDays.reduce((sum, day) => sum + (day.carrotCount > 0 ? 1 : 0), 0),
//       count: monthDays.filter((day) => day.carrotCount > 0).length,
//       time: monthDays.reduce((sum, day) => sum + day.carrotCount, 0),
//       calories: monthDays.reduce((sum, day) => sum + day.carrotCount, 0),
//     };
//   }, [daysState, currentMonth]);

//   // 달력 그리드 생성
//   const calendarDays = useMemo(() => {
//     const days: Array<{ date: dayjs.Dayjs }> = [];
//     let current = startDate;

//     while (current.isBefore(endDate) || current.isSame(endDate)) {
//       days.push({
//         date: current,
//       });
//       current = current.add(1, "day");
//     }

//     return days;
//   }, [startDate, endDate]);

//   const handleDayPress = (date: dayjs.Dayjs) => {
//     const dateStr = date.format("YYYY-MM-DD");
//     const dayState = daysState[dateStr];
//     const isPast = date.isBefore(today, "day");

//     if (!isPast && !dayState?.appointmentTime) {
//       // 미래 날짜이고 약속이 없으면 Bottom Sheet 열기
//       setSelectedDateForSheet(dateStr);
//       setBottomSheetVisible(true);
//     }
//   };

//   const handleSaveAppointment = (data: {
//     time: string;
//     distance: number;
//     alarmBefore: string;
//   }) => {
//     const timeMatch = data.time.match(/(오전|오후)\s*(\d+)시/);
//     const timeStr = timeMatch ? `${timeMatch[1]} ${timeMatch[2]}시` : data.time;
    
//     setDaysState((prev) => ({
//       ...prev,
//       [selectedDateForSheet]: {
//         date: selectedDateForSheet,
//         isPast: false,
//         carrotCount: 0,
//         appointmentTime: timeStr,
//         appointmentDistance: `${data.distance}km`,
//       },
//     }));
//   };

//   return (
//     <SafeAreaView edges={["top", "left", "right"]} style={[styles.container, { paddingTop: insets.top }]}>
//       {/* 상단 헤더 */}
// <View style={styles.header}>
//   {/* 1줄: 뒤로가기 + "캘린더" 타이틀 (같은 x축) */}
//   <View style={styles.headerTopRow}>
//     <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
//       <Ionicons name="chevron-back" size={wp(20)} color="#A1968B" />
//     </Pressable>

//     <View style={styles.titleSection}>
//       <Text style={styles.title}>캘린더</Text>
//     </View>
//   </View>

//   {/* 2줄: 월 텍스트 + 당근 배지 (같은 x축) */}
//   <View style={styles.headerBottomRow}>
//     <View style={styles.monthNavigator}>
//       <Pressable
//         onPress={() => {
//           const prevMonth = dayjs(currentMonth).subtract(1, "month");
//           setCurrentMonth(prevMonth.format("YYYY-MM"));
//         }}
//       >
//         <Ionicons name="chevron-back" size={wp(18)} color="#A1968B" />
//       </Pressable>

//       <Text style={styles.monthText}>
//         {dayjs(currentMonth).format("YYYY년 M월")}
//       </Text>

//       <Pressable
//         onPress={() => {
//           const nextMonth = dayjs(currentMonth).add(1, "month");
//           setCurrentMonth(nextMonth.format("YYYY-MM"));
//         }}
//       >
//         <Ionicons name="chevron-forward" size={wp(18)} color="#A1968B" />
//       </Pressable>
//     </View>
//       <View style={styles.carrotBadge}>
//         <CarrotIcon width={wp(8.707)} height={hp(16)} />
//         <Text style={styles.carrotCount}>34</Text>
//       </View>
//     </View>
// </View>


    

//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         {/* 월별 통계 카드 */}
//         <View style={styles.statsCard}>
//           <Text style={styles.statsTitle}>
//             {dayjs(currentMonth).format("M월")}의 기록
//           </Text>
//           <View style={styles.statsRow}>
//             <Text style={styles.statText}>
//               <Text style={styles.statLabel}>거리</Text>{" "}
//               <Text style={styles.statValue}>{monthlyStats.distance}km</Text>
//             </Text>
//             <Text style={styles.statText}>
//               <Text style={styles.statLabel}>횟수</Text>{" "}
//               <Text style={styles.statValue}>{monthlyStats.count}회</Text>
//             </Text>
//             <Text style={styles.statText}>
//               <Text style={styles.statLabel}>시간</Text>{" "}
//               <Text style={styles.statValue}>{monthlyStats.time}분</Text>
//             </Text>
//             <Text style={styles.statText}>
//               <Text style={styles.statLabel}>칼로리</Text>{" "}
//               <Text style={styles.statValue}>{monthlyStats.calories}kcal</Text>
//             </Text>
//           </View>
//         </View>

//         {/* 요일 헤더 */}
//         <View style={styles.weekdayHeader}>
//           {DAYS_OF_WEEK.map((day, index) => (
//             <View key={index} style={styles.weekdayHeaderItem}>
//               <Text style={styles.weekdayHeaderText}>{day}</Text>
//             </View>
//           ))}
//         </View>

//         {/* 달력 그리드 */}
//         <View style={styles.calendarGrid}>
//           {calendarDays.map(({ date }, index) => {
//             const dateStr = date.format("YYYY-MM-DD");
//             const dayState = daysState[dateStr] || {
//               date: dateStr,
//               isPast: date.isBefore(today, "day"),
//               carrotCount: 0,
//               appointmentTime: null,
//             };
//             const isToday = date.isSame(today, "day");

//             return (
//               <View key={index} style={styles.calendarDayWrapper}>
//                 <CalendarDay
//                   date={date.date()}
//                   isPast={dayState.isPast}
//                   hasAppointment={!!dayState.appointmentTime}
//                   carrotCount={dayState.carrotCount}
//                   appointmentTime={dayState.appointmentTime}
//                   appointmentDistance={dayState.appointmentDistance}
//                   isToday={isToday}
//                   onPress={() => handleDayPress(date)}
//                 />
//               </View>
//             );
//           })}
//         </View>
//       </ScrollView>

//       {/* Bottom Sheet */}
//       <AppointmentBottomSheet
//         visible={bottomSheetVisible}
//         selectedDate={selectedDateForSheet}
//         onClose={() => setBottomSheetVisible(false)}
//         onSave={handleSaveAppointment}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFFBF6",
//   },
//   header: {
//     paddingHorizontal: wp(18)
//   },
  
//   // 1. chevron-back 아이콘 + "캘린더"를 같은 x축에
//   headerTopRow: {
//     flexDirection: "row",
//     alignItems: "center", // 세로 가운데 정렬 → 같은 높이
//   },

//   backButton: {
//     width: wp(44),
//     height: wp(44),
//     alignItems: "flex-start",
//     justifyContent: "center",
//   },

//   titleSection: {
//     position: "absolute",
//     left: "45%",
//     alignItems: "center",   // 가운데 정렬
//     justifyContent: "center",
//   },
//   title: {
//     fontSize: wp(16),
//     fontWeight: "500",
//     color: "#685B4E",
//     marginBottom: hp(4),
//     fontFamily: "Pretendard-Medium",
//   },

//   // 2. "YYYY년 M월" + carrotBadge를 같은 x축에
// headerBottomRow: {
//   marginTop: hp(6),
//   flexDirection: "row",
//   alignItems: "center",         // 세로 가운데 → 같은 높이
//   justifyContent: "space-between", // 왼쪽: 월 네비, 오른쪽: 당근 배지
// },

//   monthNavigator: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: wp(8),
//   },
//   monthText: {
//     fontSize: wp(16),
//     color: "#4B3E33",
//     fontFamily: "Pretendard-Medium",
//   },
//   carrotBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FFF3E0",
//     borderWidth: wp(0.5),
//     borderColor: "#EBE7E5",
//     borderRadius: wp(999),
//     paddingHorizontal: wp(10),
//     paddingVertical: hp(4),
//     gap: wp(6),
//   },
//   carrotIcon: {
//     width: wp(8.707),
//     height: hp(16),
//   },
//   carrotCount: {
//     fontSize: wp(14),
//     fontWeight: "700",
//     color: "#F57800",
//     fontFamily: "Pretendard-Bold",
//   },
//   scrollContent: {
//     paddingHorizontal: wp(21),
//     paddingBottom: hp(40),
//   },
//   statsCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: wp(12),
//     padding: wp(16),
//     marginTop: hp(16),
//     marginBottom: hp(24),
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: wp(4) },
//     shadowOpacity: 0.1,
//     shadowRadius: wp(20),
//     elevation: 4,
//   },
//   statsTitle: {
//     fontSize: wp(14),
//     fontWeight: "500",
//     color: "#282119",
//     marginBottom: hp(8),
//     textAlign: "center",
//     fontFamily: "Pretendard-Medium",
//   },
//   statsRow: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//   },
//   statText: {
//     fontSize: wp(14),
//     color: "#49393A",
//     fontFamily: "Pretendard-Medium",
//   },
//   statLabel: {
//     color: "#84776B",
//   },
//   statValue: {
//     fontWeight: "700",
//     color: "#F57800",
//     fontFamily: "Pretendard-Bold",
//   },
//   statsArrow: {
//     position: "absolute",
//     right: wp(16),
//     top: "50%",
//     marginTop: -wp(8),
//   },
//   weekdayHeader: {
//     flexDirection: "row",
//     justifyContent: "flex-start",
//     width: SCREEN_WIDTH - wp(42), // padding 제외
//     marginBottom: hp(8),
//   },
//   weekdayHeaderItem: {
//     width: wp(45),
//     marginRight: wp(4),
//     alignItems: "center",
//   },
//   weekdayHeaderText: {
//     fontSize: wp(14),
//     color: "#DBD6D1",
//     fontFamily: "Pretendard-Regular",
//     textAlign: "center",
//   },
//   calendarGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "flex-start",
//     width: SCREEN_WIDTH - wp(42), // padding 제외
//   },
//   calendarDayWrapper: {
//     width: wp(45),
//     marginRight: wp(4),
//     marginBottom: hp(8),
//   },
// });
// src/tabs/CalendarTab.tsx
import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions, Platform, Image } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/native";

import CarrotIcon from "../../assets/figma/carrot_small.svg";
const CalendarRabbitPng = require ("../../assets/figma/calendar_rabbit.png");

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
    const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;
    const startDate = startOfMonth.subtract(adjustedStartDay, "day");
    const days = [];
    let day = startDate;
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
      {/* [수정] 배경색을 Hero 색상과 맞춤 */}
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
          
          {/* [수정] 히어로 섹션 배경색 적용 */}
          <View style={styles.heroSection}>
            <View style={styles.heroTextArea}>
              <Text style={styles.heroTitle}>
                이번 달은 {achievementCount}번이나{"\n"}목표를 달성했어요!
              </Text>
              <Pressable style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>전체 기록 보러가기</Text>
                <Ionicons name="chevron-forward" size={wp(12)} color="#817D7A" />
              </Pressable>
            </View>
            <Image source={CalendarRabbitPng} style={styles.rabbitImage} resizeMode="contain" />
          </View>

          {/* [수정] 하단 캘린더 영역 (배경 흰색 + 상단 테두리) */}
          <View style={styles.calendarContainer}>
            {/* 요일 헤더 */}
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

            {/* 캘린더 그리드 */}
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

        <Pressable style={styles.floatingButton}>
          <Ionicons name="add" size={wp(32)} color="#FFFFFF" />
        </Pressable>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  webWrapper: { flex: 1, backgroundColor: Platform.OS === 'web' ? '#f0f0f0' : '#FFFFFF', alignItems: 'center' },
  // [수정] 전체 배경을 히어로 섹션과 동일하게 설정 (상단 노치 영역 때문)
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

  // [수정] 히어로 섹션 배경색 적용
  heroSection: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    paddingHorizontal: wp(24), 
    marginBottom: 0, // 아래 여백 제거 (캘린더 컨테이너와 붙이기 위해)
    backgroundColor: "#FDFAF2CC", 
    paddingBottom: hp(30) 
  },
  heroTextArea: { flex: 1 },
  heroTitle: { fontSize: wp(16), fontWeight: "700", color: "#282119", lineHeight: hp(24), marginBottom: hp(8), fontFamily: "Pretendard-Bold" },
  viewAllButton: { flexDirection: "row", alignItems: "center", gap: wp(2) },
  viewAllText: { fontSize: wp(12), color: "#817D7A", fontFamily: "Pretendard-Medium" },
  rabbitImage: { width: wp(100), height: wp(100), marginRight: wp(10) },

  // [수정] 캘린더 컨테이너 (흰색 배경 + 테두리)
  calendarContainer: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    paddingTop: hp(20),
    minHeight: hp(500), // 남은 공간을 채우도록 넉넉하게
  },
  weekdayHeader: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: wp(20), marginBottom: hp(10) },
  weekdayText: { width: (SCREEN_WIDTH - wp(40)) / 7, textAlign: "center", fontSize: wp(14), color: "#BDBDBD", fontFamily: "Pretendard-Medium" },
  calendarGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: wp(20) },
  dayCell: { width: (SCREEN_WIDTH - wp(40)) / 7, height: hp(70), alignItems: "center", marginBottom: hp(4) },
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