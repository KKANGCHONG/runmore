// src/components/calendar/AppointmentBottomSheet.tsx
import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, Dimensions, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const FIGMA_WIDTH = 390;
const FIGMA_HEIGHT = 844;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const wp = (px: number) => (px / FIGMA_WIDTH) * SCREEN_WIDTH;
const hp = (px: number) => (px / FIGMA_HEIGHT) * SCREEN_HEIGHT;

type Props = {
  visible: boolean;
  selectedDate: string; // "2025-12-22"
  onClose: () => void;
  onSave: (data: {
    time: string; // "오후 4시 26분"
    distance: number; // 3
    alarmBefore: string; // "4시간 26분 전"
  }) => void;
};

export default function AppointmentBottomSheet({
  visible,
  selectedDate,
  onClose,
  onSave,
}: Props) {
  const [selectedTime, setSelectedTime] = useState({ ampm: "오후", hour: 4, minute: 26 });
  const [selectedDistance, setSelectedDistance] = useState(3);
  const [selectedAlarm, setSelectedAlarm] = useState({ hour: 4, minute: 26 });

  const handleSave = () => {
    const timeStr = `${selectedTime.ampm} ${selectedTime.hour}시 ${selectedTime.minute}분`;
    const alarmStr = `${selectedAlarm.hour}시간 ${selectedAlarm.minute}분 전`;
    
    onSave({
      time: timeStr,
      distance: selectedDistance,
      alarmBefore: alarmStr,
    });
    
    onClose();
  };

  const dateStr = selectedDate
    ? new Date(selectedDate).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "short",
      })
    : "";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay} pointerEvents="box-none">
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
        <View style={styles.handle} />
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.dateTitle}>{dateStr}</Text>

          {/* 시간 선택 */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>시간</Text>
            <View style={styles.timePicker}>
              <Pressable
                style={styles.timeRow}
                onPress={() => setSelectedTime({ ampm: "오전", hour: 3, minute: 25 })}
              >
                <Text style={styles.timeOption}>오전</Text>
                <Text style={styles.timeOption}>3</Text>
                <Text style={styles.timeOption}>25</Text>
              </Pressable>
              <View style={[styles.timeRow, styles.timeRowSelected]}>
                <Text style={styles.timeOptionSelected}>{selectedTime.ampm}</Text>
                <Text style={styles.timeOptionSelected}>{selectedTime.hour}시</Text>
                <Text style={styles.timeOptionSelected}>{selectedTime.minute}분</Text>
              </View>
              <Pressable
                style={styles.timeRow}
                onPress={() => setSelectedTime({ ampm: "오후", hour: 5, minute: 27 })}
              >
                <Text style={styles.timeOption}>5</Text>
                <Text style={styles.timeOption}>27</Text>
              </Pressable>
            </View>
          </View>

          {/* 거리 선택 */}
          <View style={styles.section}>
            <View style={styles.distanceRow}>
              <Text style={styles.sectionLabel}>거리</Text>
              <Text style={styles.distanceUnit}>km</Text>
            </View>
          </View>

          {/* 알림 설정 */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>알림설정</Text>
            <View style={styles.alarmPicker}>
              <Pressable
                style={styles.alarmRow}
                onPress={() => setSelectedAlarm({ hour: 3, minute: 25 })}
              >
                <Text style={styles.alarmOption}>3</Text>
                <Text style={styles.alarmOption}>25</Text>
              </Pressable>
              <View style={[styles.alarmRow, styles.alarmRowSelected]}>
                <Text style={styles.alarmOptionSelected}>
                  {selectedAlarm.hour}시간
                </Text>
                <Text style={styles.alarmOptionSelected}>
                  {selectedAlarm.minute}분
                </Text>
                <Text style={styles.alarmOptionSelected}>전</Text>
              </View>
              <Pressable
                style={styles.alarmRow}
                onPress={() => setSelectedAlarm({ hour: 5, minute: 27 })}
              >
                <Text style={styles.alarmOption}>5</Text>
                <Text style={styles.alarmOption}>27</Text>
              </Pressable>
            </View>
          </View>

          {/* 저장 버튼 */}
          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>저장</Text>
          </Pressable>
        </ScrollView>
      </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: wp(32),
    borderTopRightRadius: wp(32),
    height: SCREEN_HEIGHT * 0.7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: wp(12),
    elevation: 10,
  },
  handle: {
    width: wp(56),
    height: hp(5),
    backgroundColor: "#DBD6D1",
    borderRadius: wp(2.5),
    alignSelf: "center",
    marginTop: hp(8),
    marginBottom: hp(16),
  },
  content: {
    flex: 1,
    paddingHorizontal: wp(24),
  },
  dateTitle: {
    fontSize: wp(20),
    fontWeight: "600",
    color: "#000000",
    textAlign: "center",
    marginBottom: hp(24),
    fontFamily: "Pretendard-SemiBold",
  },
  section: {
    marginBottom: hp(24),
  },
  sectionLabel: {
    fontSize: wp(16),
    color: "#000000",
    marginBottom: hp(12),
    fontFamily: "Pretendard-Regular",
  },
  timePicker: {
    backgroundColor: "#F3F3F3",
    borderRadius: wp(12),
    paddingVertical: hp(4),
    paddingHorizontal: wp(68),
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: hp(10),
    gap: wp(48),
  },
  timeRowSelected: {
    backgroundColor: "#F9F8F6",
    borderRadius: wp(12),
    paddingHorizontal: wp(70),
    marginVertical: hp(5),
  },
  timeOption: {
    fontSize: wp(20),
    color: "#000000",
    fontFamily: "Pretendard-Regular",
  },
  timeOptionSelected: {
    fontSize: wp(20),
    color: "#F57800",
    fontWeight: "600",
    fontFamily: "Pretendard-SemiBold",
  },
  distanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  distanceUnit: {
    fontSize: wp(20),
    color: "#F57800",
    fontWeight: "600",
    fontFamily: "Pretendard-SemiBold",
  },
  alarmPicker: {
    gap: hp(10),
  },
  alarmRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: hp(10),
    width: wp(304),
  },
  alarmRowSelected: {
    backgroundColor: "#F9F8F6",
    borderRadius: wp(12),
    paddingHorizontal: wp(70),
  },
  alarmOption: {
    fontSize: wp(20),
    color: "#000000",
    fontFamily: "Pretendard-Regular",
  },
  alarmOptionSelected: {
    fontSize: wp(20),
    color: "#F57800",
    fontWeight: "600",
    fontFamily: "Pretendard-SemiBold",
  },
  saveButton: {
    backgroundColor: "#FB8800",
    borderRadius: wp(16),
    paddingVertical: hp(16),
    alignItems: "center",
    marginTop: hp(24),
    marginBottom: hp(40),
  },
  saveButtonText: {
    fontSize: wp(18),
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "Pretendard-SemiBold",
  },
});

