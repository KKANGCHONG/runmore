import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, Platform, Pressable, ScrollView } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import CarrotIcon from "../../../assets/figma/carrot_small.svg";

const FIGMA_WIDTH = 390;
const FIGMA_HEIGHT = 844;
const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get("window");

const SCREEN_WIDTH = Platform.OS === 'web' ? Math.min(WINDOW_WIDTH, 480) : WINDOW_WIDTH;
const SCREEN_HEIGHT = WINDOW_HEIGHT;

const wp = (px: number) => (px / FIGMA_WIDTH) * SCREEN_WIDTH;
const hp = (px: number) => (px / FIGMA_HEIGHT) * SCREEN_HEIGHT;

// 차트 데이터 (랜덤 더미)
const WEEK_DATA = [
  { day: "월", value: 5, colorType: 3 }, // 3단 (초/주/진주)
  { day: "화", value: 0, colorType: 0 },
  { day: "수", value: 3, colorType: 2 }, // 2단 (주/진주)
  { day: "목", value: 4, colorType: 3 },
  { day: "금", value: 0, colorType: 0 },
  { day: "토", value: 6, colorType: 3 },
  { day: "일", value: 6, colorType: 3 },
];

const TABS = ["주", "월", "년", "전체"];

export default function TotalRecordScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("주");

  return (
    <View style={styles.webWrapper}>
      <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
        
        {/* 헤더 */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={wp(24)} color="#49393A" />
          </Pressable>
          <Pressable onPress={() => navigation.navigate("Home" as never)}>
            <Text style={styles.headerRightText}>홈으로</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* 탭 메뉴 */}
          <View style={styles.tabContainer}>
            {TABS.map((tab) => (
              <Pressable 
                key={tab} 
                style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
              </Pressable>
            ))}
          </View>

          {/* 드롭다운 (Mock) */}
          <Pressable style={styles.dropdown}>
            <Text style={styles.dropdownText}>이번 주</Text>
            <Ionicons name="chevron-down" size={wp(16)} color="#49393A" />
          </Pressable>

          {/* 차트 영역 */}
          <View style={styles.chartContainer}>
            {/* Y축 레이블 (가로선 포함) */}
            <View style={styles.yAxisContainer}>
              {[15, 11, 9, 7, 5, 3, "1km"].map((label, idx) => (
                <View key={idx} style={styles.yAxisRow}>
                  <Text style={styles.yAxisText}>{label}</Text>
                  <View style={styles.gridLine} />
                </View>
              ))}
            </View>

            {/* 바 차트 */}
            <View style={styles.barsContainer}>
              {WEEK_DATA.map((item, index) => (
                <View key={index} style={styles.barWrapper}>
                  {/* 그래프 바 (높이는 값에 비례) */}
                  <View style={[styles.barBody, { height: hp(item.value * 12) }]}>
                    {item.value > 0 && (
                      <>
                        {/* 아래쪽 진한 주황 */}
                        <View style={[styles.barSegment, { flex: 1, backgroundColor: "#FB8800" }]} />
                        {/* 중간 주황 */}
                        {item.colorType >= 2 && <View style={[styles.barSegment, { flex: 1, backgroundColor: "#FFB040" }]} />}
                        {/* 위쪽 연두 */}
                        {item.colorType >= 3 && <View style={[styles.barSegment, { flex: 0.6, backgroundColor: "#A8D768", borderTopLeftRadius: wp(4), borderTopRightRadius: wp(4) }]} />}
                      </>
                    )}
                  </View>
                  <Text style={styles.xAxisText}>{item.day}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 요약 정보 */}
          <View style={styles.summarySection}>
            <Text style={styles.totalDistanceTitle}>총 22km</Text>
            
            <View style={styles.carrotBadge}>
              <CarrotIcon width={wp(12)} height={wp(12)} />
              <Text style={styles.carrotText}>당근 14개 획득</Text>
            </View>

            {/* 통계 그리드 */}
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Ionicons name="timer-outline" size={wp(20)} color="#817D7A" style={styles.statIcon} />
                <Text style={styles.statLabel}>횟수</Text>
                <Text style={styles.statValue}>5회</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="flame-outline" size={wp(20)} color="#FB8800" style={styles.statIcon} />
                <Text style={styles.statLabel}>페이스</Text>
                <Text style={styles.statValue}>6’ 15”</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={wp(20)} color="#FFB040" style={styles.statIcon} />
                <Text style={styles.statLabel}>시간</Text>
                <Text style={styles.statValue}>33분</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="water-outline" size={wp(20)} color="#70A6F7" style={styles.statIcon} />
                <Text style={styles.statLabel}>칼로리</Text>
                <Text style={styles.statValue}>700kcal</Text>
              </View>
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  webWrapper: { flex: 1, backgroundColor: Platform.OS === 'web' ? '#f0f0f0' : '#FFFFFF', alignItems: 'center' },
  container: { flex: 1, width: '100%', maxWidth: 480, backgroundColor: "#FFFFFF" },
  
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(20),
    paddingVertical: hp(16),
  },
  backButton: { padding: wp(4) },
  headerRightText: { fontSize: wp(14), fontWeight: "600", color: "#817D7A", fontFamily: "Pretendard-SemiBold" },

  content: { paddingHorizontal: wp(20), paddingBottom: hp(40) },

  // 탭 메뉴
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F7F7F7",
    borderRadius: wp(12),
    padding: wp(4),
    marginTop: hp(10),
    marginBottom: hp(24),
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(8),
    borderRadius: wp(8),
  },
  activeTabItem: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: { fontSize: wp(14), color: "#BDBDBD", fontFamily: "Pretendard-Medium" },
  activeTabText: { fontSize: wp(14), fontWeight: "700", color: "#282119", fontFamily: "Pretendard-Bold" },

  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(4),
    marginBottom: hp(20),
  },
  dropdownText: { fontSize: wp(16), fontWeight: "600", color: "#282119", fontFamily: "Pretendard-SemiBold" },

  // 차트
  chartContainer: {
    height: hp(250),
    marginBottom: hp(30),
    flexDirection: "row",
  },
  yAxisContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "space-between",
    zIndex: -1,
  },
  yAxisRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  yAxisText: {
    width: wp(30),
    fontSize: wp(10),
    color: "#D9D9D9",
    textAlign: "right",
    marginRight: wp(10),
    fontFamily: "Pretendard-Regular",
  },
  gridLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#F7F7F7",
  },
  barsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    paddingLeft: wp(40), // Y축 공간 확보
    paddingBottom: hp(20), // X축 텍스트 공간
  },
  barWrapper: {
    alignItems: "center",
    justifyContent: "flex-end",
    width: wp(24),
    height: "100%",
  },
  barBody: {
    width: "100%",
    borderRadius: wp(4),
    overflow: "hidden", // 내부 세그먼트 잘리기 위해
    justifyContent: "flex-end", // 아래부터 쌓임
  },
  barSegment: {
    width: "100%",
  },
  xAxisText: {
    marginTop: hp(8),
    fontSize: wp(12),
    color: "#BDBDBD",
    fontFamily: "Pretendard-Medium",
  },

  // 요약 섹션
  summarySection: {
    marginTop: hp(10),
  },
  totalDistanceTitle: {
    fontSize: wp(28),
    fontWeight: "700",
    color: "#49393A",
    marginBottom: hp(12),
    fontFamily: "Pretendard-Bold",
  },
  carrotBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#FFF3E0",
    paddingHorizontal: wp(12),
    paddingVertical: hp(6),
    borderRadius: wp(20),
    marginBottom: hp(32),
    gap: wp(6),
  },
  carrotText: {
    fontSize: wp(14),
    fontWeight: "700",
    color: "#F57800",
    fontFamily: "Pretendard-Bold",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
    width: (SCREEN_WIDTH - wp(40)) / 4,
  },
  statIcon: {
    marginBottom: hp(8),
  },
  statLabel: {
    fontSize: wp(12),
    color: "#817D7A",
    marginBottom: hp(4),
    fontFamily: "Pretendard-Medium",
  },
  statValue: {
    fontSize: wp(16),
    fontWeight: "700",
    color: "#282119",
    fontFamily: "Pretendard-Bold",
  },
});