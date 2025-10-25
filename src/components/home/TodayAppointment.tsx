// src/components/home/TodayAppointment.tsx
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard 
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Card from "../../components/ui/Card";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { useNavigation } from "@react-navigation/native";
 

type Appointment = {
  date: Date;            // 오늘 자정 고정
  time: Date;            // 시/분만 사용 (24h Date로 저장)
  distanceKm: number;
  remindMinutes: number; // 0=안 함
};

const pad2 = (n: number) => String(n).padStart(2, "0");
const formatKoreanDate = (d: Date) =>
  `${d.getFullYear()}.${pad2(d.getMonth() + 1)}.${pad2(d.getDate())}`;
const formatKoreanTime = (d: Date) => {
  let h = d.getHours();
  const m = pad2(d.getMinutes());
  const ampm = h >= 12 ? "오후" : "오전";
  h = h % 12 || 12;
  return `${ampm} ${h}:${m}`;
};
const todayMidnight = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
};

export default function TodayAppointment() {
  const navigation = useNavigation();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  // 입력 상태
  const [tmpHour, setTmpHour] = useState("6");        // 1~12
  const [tmpMinute, setTmpMinute] = useState("00");   // 00~59
  const [tmpAmPm, setTmpAmPm] = useState<"오전" | "오후">("오전");
  const [tmpDistance, setTmpDistance] = useState("");
  const [tmpRemind, setTmpRemind] = useState<number>(10);

  const scheduledAt = useMemo(() => {
    if (!appointment) return null;
    const base = todayMidnight();
    return new Date(
      base.getFullYear(),
      base.getMonth(),
      base.getDate(),
      appointment.time.getHours(),
      appointment.time.getMinutes(),
      0,
      0
    );
  }, [appointment]);

  const openCreate = () => {
    const now = new Date();
    const defaultHour24 = Math.max(now.getHours(), 6);
    const isPm = defaultHour24 >= 12;
    const hour12 = defaultHour24 % 12 || 12;

    setTmpHour(String(hour12));
    setTmpMinute("00");
    setTmpAmPm(isPm ? "오후" : "오전");
    setTmpDistance(appointment ? String(appointment.distanceKm) : "");
    setTmpRemind(appointment ? appointment.remindMinutes : 10);
    setModalOpen(true);
  };

  const openEdit = () => {
    if (!appointment) return;
    const h24 = appointment.time.getHours();
    const m = appointment.time.getMinutes();
    const isPm = h24 >= 12;
    const h12 = h24 % 12 || 12;

    setTmpHour(String(h12));
    setTmpMinute(pad2(m));
    setTmpAmPm(isPm ? "오후" : "오전");
    setTmpDistance(String(appointment.distanceKm));
    setTmpRemind(appointment.remindMinutes);
    setModalOpen(true);
  };

  const toNumberSafe = (s: string) => {
    const n = parseInt((s || "").replace(/[^\d]/g, ""), 10);
    return Number.isFinite(n) ? n : 0;
  };

  const save = () => {
    // 거리 검증
    Keyboard.dismiss(); // 저장 한 번만 눌러도되게
    const dist = Number(tmpDistance);
    if (Number.isNaN(dist) || dist <= 0) {
      alert("거리(km)를 올바르게 입력하세요.");
      return;
    }
    // 시간 검증
    let h12 = toNumberSafe(tmpHour);
    let mm = toNumberSafe(tmpMinute);
    if (h12 < 1 || h12 > 12) {
      alert("시(hour)는 1~12 사이로 입력하세요.");
      return;
    }
    if (mm < 0 || mm > 59) {
      alert("분(minute)은 0~59 사이로 입력하세요.");
      return;
    }

    // 24시간 변환
    let h24 = h12 % 12;           // 12 -> 0
    if (tmpAmPm === "오후") h24 += 12;

    const time = new Date(0, 0, 0, h24, mm, 0, 0);
    const today = todayMidnight();

    setAppointment({
      date: today,
      time,
      distanceKm: Math.round(dist * 100) / 100,
      remindMinutes: tmpRemind,
    });
    setModalOpen(false);
  };

  const clear = () => {
    setAppointment(null);
    setModalOpen(false);
  };

  const today = todayMidnight();

  // 🔹 깔끔한 오전/오후 칩
  const Chip = ({
    label,
    active,
    onPress,
  }: {
    label: string;
    active: boolean;
    onPress: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: active ? theme.colors.primary : "#E5E7EB",
        backgroundColor: active ? theme.colors.primary : "#F9FAFB",
        shadowColor: "#000",
        shadowOpacity: active ? 0.08 : 0,
        shadowRadius: active ? 4 : 0,
        elevation: active ? 2 : 0,
      }}
    >
      <Text style={{ fontWeight: "600", color: active ? "#fff" : theme.colors.text, fontSize: 15 }}>
        {label}
      </Text>
    </Pressable>
  );

  return (
    <>
      {/* 🔹 상단 타이틀 + 수정/버튼 */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
          paddingHorizontal: 4,
        }}
      >
        <Text style={{ ...theme.typography.h2, color: theme.colors.text }}>오늘의 약속</Text>

        {appointment ? (
          <Pressable
            onPress={openEdit}
            style={{
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 8,
              backgroundColor: theme.colors.accent,
            }}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>수정</Text>
          </Pressable>
        ) : null}
      </View>

      {/* 🔹 카드 */}
      <Card>
        {appointment && scheduledAt ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: theme.radius.md,
                backgroundColor: "#E5E7EB",
                alignItems: "center",
                justifyContent: "center",
                marginRight: theme.spacing.md,
              }}
            >
              <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>오늘</Text>
              <Text style={{ fontSize: 22, fontWeight: "800", color: theme.colors.textSecondary }}>
                {today.getDate()}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
                <Pressable onPress={() => navigation.navigate("Run")}>
                <Text style={{ ...theme.typography.h2, color: theme.colors.primary, fontWeight: "800" }}>
                  뛰러가기
                </Text>
              </Pressable>
              <View
                style={{
                  marginTop: 6,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text numberOfLines={1} style={{ color: theme.colors.textMuted }}>
                  {appointment.distanceKm}km 뛰기
                  
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="time-outline" size={14} style={{ marginRight: 4 }} />
                  <Text style={{ color: theme.colors.textMuted, fontSize: 13 }}>
                    {formatKoreanDate(today)} {formatKoreanTime(scheduledAt)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <Pressable onPress={openCreate} style={{ paddingVertical: 18, alignItems: "center" }}>
            <Text style={{ ...theme.typography.h2, color: theme.colors.text }}>약속을 정해보세요!</Text>
            <Text style={{ color: theme.colors.textMuted, marginTop: 6 }}>
              약속 시간·거리·알림을 설정해요.
            </Text>
          </Pressable>
        )}
      </Card>

      {/* 🔹 모달 */}
      <Modal visible={isModalOpen} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "flex-end" }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 24 : 0}
            style={{ width: "100%" }}
          >
            <View
              style={{
                maxHeight: "88%",
                backgroundColor: "#fff",
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                overflow: "hidden",
              }}
            >
              <View style={{ alignItems: "center", paddingTop: 8 }}>
                <View style={{ width: 48, height: 5, backgroundColor: "#E5E7EB", borderRadius: 3 }} />
              </View>

              <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
                keyboardShouldPersistTaps="handled"
                <Text style={{ ...theme.typography.h2, marginBottom: 8 }}>약속 설정</Text>

                {/* 날짜 (표시만) */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                  <Text style={{ width: 64 }}>날짜</Text>
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: "#F3F4F6",
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      borderRadius: 10,
                    }}
                  >
                    <Text>{formatKoreanDate(today)} (오늘)</Text>
                  </View>
                </View>

                {/* 시간: 오전/오후 칩 + 시/분 입력 */}
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <Text style={{ width: 64 }}>시간</Text>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <Chip label="오전" active={tmpAmPm === "오전"} onPress={() => setTmpAmPm("오전")} />
                    <Chip label="오후" active={tmpAmPm === "오후"} onPress={() => setTmpAmPm("오후")} />
                  </View>
                  <TextInput
                    value={tmpHour}
                    onChangeText={(t) => setTmpHour(t.replace(/[^\d]/g, "").slice(0, 2))}
                    onBlur={() => {
                      let v = Math.min(12, Math.max(1, toNumberSafe(tmpHour)));
                      setTmpHour(String(v));
                    }}
                    keyboardType="number-pad"
                    placeholder="시"
                    maxLength={2}
                    style={{
                      width: 56,
                      textAlign: "center",
                      backgroundColor: "#F3F4F6",
                      paddingVertical: 10,
                      borderRadius: 10,
                    }}
                  />
                  <Text style={{ color: theme.colors.textMuted, marginHorizontal: 2 }}>:</Text>
                  <TextInput
                    value={tmpMinute}
                    onChangeText={(t) => setTmpMinute(t.replace(/[^\d]/g, "").slice(0, 2))}
                    onBlur={() => {
                      let v = Math.min(59, Math.max(0, toNumberSafe(tmpMinute)));
                      setTmpMinute(pad2(v));
                    }}
                    keyboardType="number-pad"
                    placeholder="분"
                    maxLength={2}
                    style={{
                      width: 56,
                      textAlign: "center",
                      backgroundColor: "#F3F4F6",
                      paddingVertical: 10,
                      borderRadius: 10,
                    }}
                  />
                </View>
                <Text style={{ color: theme.colors.textMuted, marginLeft: 64, marginBottom: 12 }}>
                  시(1~12), 분(00~59)
                </Text>

                {/* 거리 */}
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginVertical: 12 }}>
                  <Text style={{ width: 64 }}>거리</Text>
                  <TextInput
                    value={tmpDistance}
                    onChangeText={setTmpDistance}
                    keyboardType="decimal-pad"
                    placeholder="예: 3"
                    style={{
                      flex: 1,
                      backgroundColor: "#F3F4F6",
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      borderRadius: 10,
                    }}
                  />
                  <Text style={{ color: theme.colors.textMuted }}>km</Text>
                </View>

                {/* 알림 Picker */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ width: 64 }}>알림</Text>
                  <View style={{ flex: 1, backgroundColor: "#F3F4F6", borderRadius: 10 }}>
                    <Picker selectedValue={tmpRemind} onValueChange={(v) => setTmpRemind(Number(v))}>
                      <Picker.Item label="안 함" value={0} />
                      <Picker.Item label="5분 전" value={5} />
                      <Picker.Item label="10분 전" value={10} />
                      <Picker.Item label="15분 전" value={15} />
                      <Picker.Item label="30분 전" value={30} />
                      <Picker.Item label="60분 전" value={60} />
                    </Picker>
                  </View>
                </View>
              </ScrollView>

              {/* 하단 버튼바 */}
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  padding: 16,
                  borderTopWidth: 1,
                  borderTopColor: "#E5E7EB",
                  backgroundColor: "#fff",
                }}
              >
                {appointment && (
                  <Pressable
                    onPress={clear}
                    style={{
                      paddingVertical: 14,
                      borderRadius: 10,
                      backgroundColor: "#FEE2E2",
                      flex: 1,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#991B1B", fontWeight: "600" }}>삭제</Text>
                  </Pressable>
                )}
                <Pressable
                  onPress={() => setModalOpen(false)}
                  style={{
                    paddingVertical: 14,
                    borderRadius: 10,
                    backgroundColor: "#E5E7EB",
                    flex: 1,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontWeight: "600" }}>취소</Text>
                </Pressable>
                <Pressable
                  onPress={save}
                  style={{
                    paddingVertical: 14,
                    borderRadius: 10,
                    backgroundColor: theme.colors.accent,
                    flex: 1.2,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "700" }}>저장</Text>
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </>
  );
}
