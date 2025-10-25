// src/components/home/MonthCalendar.tsx
import React, { useState } from "react";
import { View, Text } from "react-native";
import SectionHeader from "../../components/ui/SectionHeader";
import Card from "../../components/ui/Card";
import { theme } from "../../styles/theme";
import { Calendar, LocaleConfig } from "react-native-calendars";
import dayjs from "dayjs";

// 한글화(앱 전역에서 한 번만 호출해도 됨)
LocaleConfig.locales["ko"] = {
  monthNames: ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
  monthNamesShort: ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
  dayNames: ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"],
  dayNamesShort: ["일","월","화","수","목","금","토"],
  today: "오늘",
};
LocaleConfig.defaultLocale = "ko";

export default function MonthCalendar() {
  const today = dayjs().format("YYYY-MM-DD");
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({
    [today]: { selected: true, selectedColor: theme.colors.primary },
  });

  const onSelectDay = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    setMarkedDates((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (next[k]?.selected) {
          const { selected, selectedColor, ...rest } = next[k];
          next[k] = { ...rest };
        }
      });
      next[day.dateString] = {
        ...(next[day.dateString] || {}),
        selected: true,
        selectedColor: theme.colors.primary,
      };
      return next;
    });
  };

  return (
    <>
      <SectionHeader title="이달의 달력" onPress={() => {}} />
      <Card>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
          <Text style={{ fontWeight: "700" }}>{dayjs(selectedDate).format("M월")}</Text>
          <Text style={{ color: theme.colors.textMuted }}>이번달 빵 개수</Text>
        </View>

        <Calendar
          current={selectedDate}
          onMonthChange={() => {}}
          onDayPress={onSelectDay}
          markedDates={markedDates}
          theme={{
            calendarBackground: "transparent",
            textSectionTitleColor: theme.colors.textMuted,
            monthTextColor: theme.colors.text,
            dayTextColor: theme.colors.text,
            todayTextColor: theme.colors.text,
            textDisabledColor: "#D1D5DB",
            selectedDayBackgroundColor: theme.colors.accent,
            selectedDayTextColor: theme.colors.text,
            arrowColor: theme.colors.text,
          }}
          style={{ borderRadius: 12, paddingVertical: 4 }}
          firstDay={0}
          enableSwipeMonths
        />
      </Card>
    </>
  );
}
