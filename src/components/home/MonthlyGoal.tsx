// src/components/home/MonthlyGoal.tsx
import React, { useMemo, useState } from "react";
import {
  View, Text, Modal, Pressable, TextInput,
  KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Platform
} from "react-native";

import SectionHeader from "../../components/ui/SectionHeader";
import Card from "../../components/ui/Card";
import ProgressBar from "../../components/ui/ProgressBar";
import { theme } from "../../styles/theme";
import dayjs from "dayjs";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  achievedKm?: number;           // 이번 달 현재 달성 km
  initialGoalKm?: number | null; // 초기 목표 (없으면 null)
  onChangeGoalKm?: (goalKm: number | null) => void; // 외부 저장용 콜백(선택)
};

export default function MonthlyGoal({
  achievedKm = 0,
  initialGoalKm = null,
  onChangeGoalKm,
}: Props) {
  const [goalKm, setGoalKm] = useState<number | null>(initialGoalKm);
  const [isModalOpen, setModalOpen] = useState(false);
  const [tmpGoal, setTmpGoal] = useState(goalKm ? String(goalKm) : "");

  const monthLabel = useMemo(() => dayjs().format("YYYY년 M월"), []);
  const progress = useMemo(() => {
    if (!goalKm || goalKm <= 0) return 0;
    return Math.max(0, Math.min(1, achievedKm / goalKm));
  }, [achievedKm, goalKm]);

  const percent = Math.round(progress * 100);

  const openEdit = () => {
    setTmpGoal(goalKm ? String(goalKm) : "");
    setModalOpen(true);
  };

  const save = () => {
    Keyboard.dismiss(); // 저장 한 번만 눌러도되게
    const n = Number(tmpGoal);
    if (Number.isNaN(n) || n <= 0) {
      alert("목표 거리를 올바른 숫자로 입력해 주세요.");
      return;
    }
    setGoalKm(n);
    onChangeGoalKm?.(n);
    Keyboard.dismiss();
    setModalOpen(false);
  };

  const clear = () => {
    setGoalKm(null);
    onChangeGoalKm?.(null);
    setModalOpen(false);
  };

  return (
    <>
      {/* 섹션 헤더 */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
          paddingHorizontal: 4,
          marginTop: 16,
        }}
      >
        <Text style={{ ...theme.typography.h2, color: theme.colors.text }}>
          이달의 목표 달성률
        </Text>

        {goalKm ? (
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

      {/* 카드 영역 */}
      <Card>
        {goalKm === null ? (
          // 목표가 없을 때: CTA
          <Pressable
            onPress={openEdit}
            style={{ paddingVertical: 18, alignItems: "center" }}
          >
            <Text style={{ ...theme.typography.h2, color: theme.colors.text }}>
              목표를 설정해보세요!
            </Text>
            <Text style={{ color: theme.colors.textMuted, marginTop: 6 }}>
              이번 달 달성 목표 거리를 입력합니다.
            </Text>
          </Pressable>
        ) : (
          // 목표가 있을 때: 진행률 표시
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View>
                <Text style={{ color: theme.colors.textMuted }}>
                  이번 달의 목표는
                </Text>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "800",
                    color: theme.colors.textSecondary,
                    marginTop: 4,
                  }}
                >
                  {goalKm}km 뛰기
                </Text>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text style={{ color: theme.colors.textMuted }}>
                  지금까지
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: theme.colors.text,
                    marginTop: 4,
                  }}
                >
                  {achievedKm}km
                </Text>
              </View>
            </View>

            {/* 진행바 */}
            <ProgressBar progress={progress} />

            {/* 퍼센트 라벨 */}
            <Text
              style={{
                color: theme.colors.textSecondary,
                fontWeight: "700",
                fontSize: 15,
                textAlign: "center",
                marginTop: 6,
              }}
            >
              {percent}%
            </Text>
          </View>
        )}
      </Card>

      {/* 목표 입력 모달 */}
      <Modal
        visible={isModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setModalOpen(false)} // Android Back 대응
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.35)",
                justifyContent: "flex-end",
              }}
            >
              <View
                style={{
                  backgroundColor: "#fff",
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  padding: 16,
                  paddingBottom: 24,
                  gap: 16,
                }}
              >
                {/* 상단 바 + 월 라벨 */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Pressable
                    onPress={() => setModalOpen(false)}
                    hitSlop={10}
                    style={{ paddingRight: 8 }}
                  >
                    <Ionicons name="chevron-back" size={20} />
                  </Pressable>
                  <Text style={{ fontWeight: "700" }}>{monthLabel}</Text>
                </View>

                <Text style={{ ...theme.typography.h2 }}>
                  이달의 목표를 설정해주세요!
                </Text>

                {/* 거리 입력 */}
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text style={{ width: 56 }}>거리</Text>
                  <TextInput
                    value={tmpGoal}
                    onChangeText={setTmpGoal}
                    keyboardType="numeric"
                    returnKeyType="done"
                    onSubmitEditing={save}
                    blurOnSubmit={false}
                    placeholder="예: 50"
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

                {/* 버튼들 */}
                <View style={{ flexDirection: "row", gap: 10 }}>
                  {goalKm !== null && (
                    <Pressable
                      onPress={clear}
                      style={{
                        paddingVertical: 12,
                        borderRadius: 10,
                        backgroundColor: "#FEE2E2",
                        flex: 1,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: "#991B1B" }}>삭제</Text>
                    </Pressable>
                  )}
                  <Pressable
                    onPress={() => setModalOpen(false)}
                    style={{
                      paddingVertical: 12,
                      borderRadius: 10,
                      backgroundColor: "#E5E7EB",
                      flex: 1,
                      alignItems: "center",
                    }}
                  >
                    <Text>취소</Text>
                  </Pressable>
                  <Pressable
                    onPress={save}
                    style={{
                      paddingVertical: 12,
                      borderRadius: 10,
                      backgroundColor: theme.colors.accent,
                      flex: 1.2,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "white", fontWeight: "600" }}>저장</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}
