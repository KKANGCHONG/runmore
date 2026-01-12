import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, Platform, Pressable, TextInput, ScrollView } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import "dayjs/locale/ko"; 
dayjs.locale("ko"); // 한국어 날짜 표시를 위한 설정

const FIGMA_WIDTH = 390;
const FIGMA_HEIGHT = 844;
const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get("window");

const SCREEN_WIDTH = Platform.OS === 'web' ? Math.min(WINDOW_WIDTH, 480) : WINDOW_WIDTH;
const SCREEN_HEIGHT = WINDOW_HEIGHT;

const wp = (px: number) => (px / FIGMA_WIDTH) * SCREEN_WIDTH;
const hp = (px: number) => (px / FIGMA_HEIGHT) * SCREEN_HEIGHT;

type ParamList = {
  AppointmentCreate: {
    selectedDate?: string;
  };
};

export default function AppointmentCreateScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  
  // 파라미터로 날짜 받기
  const route = useRoute<RouteProp<ParamList, "AppointmentCreate">>();
  const dateString = route.params?.selectedDate || dayjs().format("YYYY-MM-DD");
  const displayDate = dayjs(dateString).format("YYYY년 M월 D일 (ddd)");

  const [distance, setDistance] = useState("3");

  return (
    <View style={styles.webWrapper}>
      <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
        
        {/* 헤더 */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={wp(24)} color="#49393A" />
          </Pressable>
          <Text style={styles.headerTitle}>오늘의 약속</Text>
          <View style={{ width: wp(24) }} /> 
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          
          {/* 날짜 선택 섹션 */}
          <Pressable style={styles.dateSelector}>
            <Text style={styles.dateText}>{displayDate}</Text>
            <Ionicons name="chevron-down" size={wp(20)} color="#49393A" />
          </Pressable>

          {/* 시간 설정 섹션 (커스텀 휠 피커 UI) */}
          <View style={styles.section}>
            <Text style={styles.label}>시간</Text>
            
            <View style={styles.pickerContainer}>
              {/* 선택된 행 하이라이트 배경 */}
              <View style={styles.highlightRow} />

              <View style={styles.pickerColumn}>
                <Text style={styles.pickerItemText}>오전</Text>
                <Text style={styles.pickerItemTextSelected}>오후</Text>
                <Text style={styles.pickerItemText}> </Text>
              </View>

              <View style={styles.pickerColumn}>
                <Text style={styles.pickerItemText}>2</Text>
                <Text style={styles.pickerItemTextSelected}>3시</Text>
                <Text style={styles.pickerItemText}>4</Text>
              </View>

              <View style={styles.pickerColumn}>
                <Text style={styles.pickerItemText}> </Text>
                <Text style={styles.pickerItemTextSelected}>00분</Text>
                <Text style={styles.pickerItemText}>01</Text>
              </View>
            </View>
          </View>

          {/* 거리 입력 섹션 */}
          <View style={styles.section}>
            <View style={styles.inputRow}>
              <Text style={styles.label}>거리</Text>
              <View style={styles.distanceInputContainer}>
                <TextInput 
                  style={styles.distanceInput}
                  value={distance}
                  onChangeText={setDistance}
                  keyboardType="numeric"
                />
                <Text style={styles.unitText}>km</Text>
              </View>
            </View>
            <View style={styles.underline} />
          </View>

          {/* 알림 설정 섹션 */}
          <View style={styles.section}>
            <Text style={styles.label}>알림설정</Text>
            
            <View style={styles.pickerContainer}>
              <View style={styles.highlightRow} />

              <View style={styles.pickerColumn}>
                <Text style={styles.pickerItemText}>3</Text>
                <Text style={styles.pickerItemTextSelected}>4시간</Text>
                <Text style={styles.pickerItemText}>5</Text>
              </View>

              <View style={styles.pickerColumn}>
                <Text style={styles.pickerItemText}>25</Text>
                <Text style={styles.pickerItemTextSelected}>26분</Text>
                <Text style={styles.pickerItemText}>27</Text>
              </View>

              <View style={styles.pickerColumn}>
                <Text style={styles.pickerItemText}> </Text>
                <Text style={styles.pickerItemTextSelectedText}>전</Text>
                <Text style={styles.pickerItemText}> </Text>
              </View>
            </View>
          </View>

        </ScrollView>

        {/* 하단 완료 버튼 */}
        <View style={styles.footer}>
          <Pressable 
            style={styles.completeButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.completeButtonText}>완료</Text>
          </Pressable>
        </View>

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
  headerTitle: { fontSize: wp(16), fontWeight: "600", color: "#49393A", fontFamily: "Pretendard-SemiBold" },

  content: {
    paddingHorizontal: wp(20),
    paddingTop: hp(20),
  },

  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(8),
    marginBottom: hp(32),
  },
  dateText: {
    fontSize: wp(18),
    fontWeight: "700",
    color: "#282119",
    fontFamily: "Pretendard-Bold",
  },

  section: {
    marginBottom: hp(40),
  },
  label: {
    fontSize: wp(14),
    fontWeight: "500",
    color: "#282119",
    fontFamily: "Pretendard-Medium",
    marginBottom: hp(16),
  },

  pickerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: hp(120),
    position: "relative",
  },
  highlightRow: {
    position: "absolute",
    top: hp(40),
    left: 0,
    right: 0,
    height: hp(40),
    backgroundColor: "#F7F7F7",
    borderRadius: wp(8),
  },
  pickerColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
    paddingVertical: hp(8),
  },
  pickerItemText: {
    fontSize: wp(16),
    color: "#282119",
    fontFamily: "Pretendard-Regular",
    lineHeight: hp(30),
  },
  pickerItemTextSelected: {
    fontSize: wp(18),
    fontWeight: "700",
    color: "#F57800",
    fontFamily: "Pretendard-Bold",
    lineHeight: hp(30),
  },
  pickerItemTextSelectedText: {
    fontSize: wp(16),
    fontWeight: "500",
    color: "#282119",
    fontFamily: "Pretendard-Medium",
    lineHeight: hp(30),
  },

  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  distanceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(8),
  },
  distanceInput: {
    fontSize: wp(20),
    fontWeight: "700",
    color: "#F57800",
    fontFamily: "Pretendard-Bold",
    textAlign: "right",
    minWidth: wp(40),
  },
  unitText: {
    fontSize: wp(18),
    fontWeight: "500",
    color: "#282119",
    fontFamily: "Pretendard-Medium",
  },
  underline: {
    height: 1,
    backgroundColor: "#EBEBEB",
    marginTop: hp(8),
  },

  footer: {
    paddingHorizontal: wp(20),
    paddingBottom: hp(20),
  },
  completeButton: {
    backgroundColor: "#FB8800",
    borderRadius: wp(16),
    height: hp(56),
    alignItems: "center",
    justifyContent: "center",
  },
  completeButtonText: {
    fontSize: wp(16),
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Pretendard-Bold",
  },
});