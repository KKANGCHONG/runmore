import React, { useMemo, useState } from "react";
import { SafeAreaView, View, Text, FlatList, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../styles/theme"; // 기존 테마 사용 가정
import { g } from "../styles/globalStyles"; // 컨테이너 padding 등 공용
import Card from "../components/ui/Card";    // 기존 Card 컴포넌트
import SectionHeader from "../components/ui/SectionHeader"; // 옵션

type MonthKey = `${number}-${number}`; // e.g., "2025-07"

type Product = {
  id: string;
  title: string;
  costBread: number;
};

type Entry = {
  id: string;
  monthKey: MonthKey;
  title: string;
  appliedAt: string; // ISO
  neededBread: number;
  status: "ongoing" | "win" | "ended";
  resultDate?: string; // 발표일
};

// ---------- 더미 데이터 ----------
const MOCK_PRODUCTS: Product[] = [
  { id: "p1", title: "스타벅스 아메리카노", costBread: 10 },
  { id: "p2", title: "투썸 케이크", costBread: 20 },
  { id: "p3", title: "○○○○○", costBread: 25 },
];

const MOCK_ENTRIES: Entry[] = [
  { id: "e1", monthKey: "2025-07", title: "이벤트 A", appliedAt: "2025-07-05", neededBread: 10, status: "ongoing", resultDate: "2025-07-31" },
  { id: "e2", monthKey: "2025-07", title: "이벤트 B", appliedAt: "2025-07-11", neededBread: 20, status: "ongoing", resultDate: "2025-07-30" },
  { id: "e3", monthKey: "2025-07", title: "이벤트 C", appliedAt: "2025-07-18", neededBread: 15, status: "ongoing", resultDate: "2025-08-01" },
  { id: "e4", monthKey: "2025-07", title: "이벤트 D", appliedAt: "2025-07-03", neededBread: 10, status: "win", resultDate: "2025-07-25" },
  { id: "e5", monthKey: "2025-06", title: "이벤트 E", appliedAt: "2025-06-10", neededBread: 10, status: "ended", resultDate: "2025-06-28" },
];

function ymKey(d: Date): MonthKey {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` as MonthKey;
}
function labelYM(d: Date) {
  return `${d.getMonth() + 1}월`;
}

// ---------- 작은 공용 컴포넌트 ----------
const Row = ({ children, style }: any) => (
  <View style={[{ flexDirection: "row", alignItems: "center" }, style]}>{children}</View>
);

const Divider = () => <View style={{ height: 12 }} />;

const GreyBox: React.FC<{ children: React.ReactNode; style?: any }> = ({ children, style }) => (
  <View style={[{ backgroundColor: "#E5E5E5", borderRadius: 8, padding: 14 }, style]}>{children}</View>
);

// 상품 카드
const ProductCard: React.FC<{ item: Product; onApply: (p: Product) => void }> = ({ item, onApply }) => (
  <Pressable onPress={() => onApply(item)}>
    <GreyBox style={{ marginBottom: 12 }}>
      <Row style={{ justifyContent: "space-between" }}>
        <Text style={{ fontSize: 16, fontWeight: "700" }}>{item.title}</Text>
        <Text style={{ fontWeight: "700" }}>{item.costBread}빵</Text>
      </Row>
      <Row style={{ justifyContent: "flex-end", marginTop: 6 }}>
        <Pressable
          onPress={() => onApply(item)}
          style={{ paddingHorizontal: 14, paddingVertical: 8, backgroundColor: "#444", borderRadius: 8 }}
        >
          <Text style={{ color: "white", fontWeight: "700" }}>응모하기</Text>
        </Pressable>
      </Row>
    </GreyBox>
  </Pressable>
);

// 월 내비게이터
const MonthNavigator: React.FC<{ month: Date; onChange: (d: Date) => void; centerBold?: boolean }> = ({
  month,
  onChange,
  centerBold = true,
}) => (
  <Row style={{ justifyContent: "space-between", marginTop: 8 }}>
    <Pressable onPress={() => onChange(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>
      <Ionicons name="chevron-back" size={20} />
    </Pressable>
    <Text style={{ fontSize: 16, fontWeight: centerBold ? "800" : "600" }}>{labelYM(month)}</Text>
    <Pressable onPress={() => onChange(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>
      <Ionicons name="chevron-forward" size={20} />
    </Pressable>
  </Row>
);

// 세그먼트
const Segmented: React.FC<{ value: string; onChange: (v: "ongoing" | "win" | "ended") => void }> = ({
  value,
  onChange,
}) => {
  const Tab = ({ k, label }: any) => {
    const active = value === k;
    return (
      <Pressable onPress={() => onChange(k)} style={{ marginRight: 22 }}>
        <Text style={{ fontWeight: active ? "800" : "600", color: active ? "#111" : "#777" }}>{label}</Text>
      </Pressable>
    );
  };
  return (
    <Row style={{ marginTop: 12 }}>
      <Tab k="ongoing" label="응모 3" />
      <Tab k="win" label="당첨 1" />
      <Tab k="ended" label="종료 0" />
    </Row>
  );
};

// 응모/당첨/종료 리스트 아이템
const EntryItem: React.FC<{ e: Entry }> = ({ e }) => (
  <GreyBox style={{ marginBottom: 12 }}>
    <Row style={{ justifyContent: "space-between" }}>
      <Text style={{ fontWeight: "700" }}>이벤트 명</Text>
      <Text style={{ fontWeight: "700" }}>응모 날짜</Text>
    </Row>
    <Row style={{ justifyContent: "space-between", marginTop: 6 }}>
      <Text>{e.title}</Text>
      <Text>{e.appliedAt}</Text>
    </Row>

    <Row style={{ justifyContent: "space-between", marginTop: 12 }}>
      <Text style={{ fontWeight: "700" }}>결과 발표 날짜</Text>
      <Text style={{ fontWeight: "700" }}>빵 수</Text>
    </Row>
    <Row style={{ justifyContent: "space-between", marginTop: 6 }}>
      <Text>{e.resultDate ?? "-"}</Text>
      <Text>{e.neededBread}</Text>
    </Row>
  </GreyBox>
);

// 빈 상태
const EmptyState: React.FC<{ text: string }> = ({ text }) => (
  <View style={{ flex: 1, alignItems: "center", paddingTop:80 }}>
    <Text style={{ color: "#888" }}>{text}</Text>
  </View>
);

// ---------- 메인 화면 ----------
export default function ShopTab() {
  // 모드: 'shop'(초기) / 'status'(응모현황 화면)
  const [mode, setMode] = useState<"shop" | "status">("shop");
  const [seg, setSeg] = useState<"ongoing" | "win" | "ended">("ongoing");
  const [month, setMonth] = useState<Date>(new Date(2025, 6, 1)); // 예시로 7월

  const monthKey = ymKey(month);

  const entriesOfMonth = useMemo(
    () => MOCK_ENTRIES.filter((e) => e.monthKey === monthKey),
    [monthKey]
  );
  const counts = useMemo(
    () => ({
      ongoing: entriesOfMonth.filter((e) => e.status === "ongoing").length,
      win: entriesOfMonth.filter((e) => e.status === "win").length,
      ended: entriesOfMonth.filter((e) => e.status === "ended").length,
    }),
    [entriesOfMonth]
  );

  const list = entriesOfMonth.filter((e) => e.status === seg);

  const handleApply = (p: Product) => {
    // TODO: 포인트 차감 + 응모 API 연결
    console.log("apply", p.title);
    alert(`${p.title}에 응모했습니다!`);
  };

  // ---------- 초기 상점 화면 ----------
  if (mode === "shop") {
    return (
      <SafeAreaView style={[g.safe, { flex: 1 }]}>
        <View style={[g.screenContainer, { flex: 1, paddingTop: 50 }]}>
          <Row style={{ justifyContent: "space-between" }}>
            <Text style={{ fontWeight: "800" }}>내 현황</Text>
            <Text style={{ fontWeight: "800" }}>빵 포인트 개수</Text>
          </Row>

          <MonthNavigator month={month} onChange={setMonth} />

          {/* 응모/당첨 현황 카드 */}
          <Pressable onPress={() => { setMode("status"); setSeg("ongoing"); }}>
            <GreyBox style={{ marginTop: 12 }}>
              <Row style={{ justifyContent: "space-between" }}>
                <Text style={{ fontWeight: "800" }}>응모현황</Text>
                <Text style={{ fontWeight: "800" }}>당첨현황</Text>
              </Row>
              <Row style={{ justifyContent: "space-between", marginTop: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: "800" }}>{counts.ongoing}</Text>
                <Text style={{ fontSize: 18, fontWeight: "800" }}>{counts.win}</Text>
              </Row>
            </GreyBox>
          </Pressable>

          <Divider />

          <SectionHeader title="상품목록" />
          <FlatList
            data={MOCK_PRODUCTS}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => <ProductCard item={item} onApply={handleApply} />}
            contentContainerStyle={{ paddingTop: 8, paddingBottom: 32 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  // ---------- 응모 현황 화면 (세그먼트) ----------
  return (
    <SafeAreaView style={[g.safe, { flex: 1 }]}>
      <View style={[g.screenContainer, { flex: 1, paddingTop: 50 }]}>
        <MonthNavigator month={month} onChange={setMonth} />

        <Row style={{ marginTop: 8 }}>
          <Pressable onPress={() => setSeg("ongoing")}>
            <Text style={{ color: seg === "ongoing" ? "#111" : "#888", fontWeight: seg === "ongoing" ? "800" : "600" }}>
              응모 {counts.ongoing}
            </Text>
          </Pressable>
          <Pressable style={{ marginLeft: 22 }} onPress={() => setSeg("win")}>
            <Text style={{ color: seg === "win" ? "#111" : "#888", fontWeight: seg === "win" ? "800" : "600" }}>
              당첨 {counts.win}
            </Text>
          </Pressable>
          <Pressable style={{ marginLeft: 22 }} onPress={() => setSeg("ended")}>
            <Text style={{ color: seg === "ended" ? "#111" : "#888", fontWeight: seg === "ended" ? "800" : "600" }}>
              종료 {counts.ended}
            </Text>
          </Pressable>
        </Row>

        <View style={{ marginTop: 12, flex: 1 }}>
          {list.length === 0 ? (
            <EmptyState
              text={
                seg === "ended"
                  ? "응모한 이벤트 종료 내역이 없습니다"
                  : seg === "win"
                  ? "당첨 내역이 없습니다"
                  : "응모 내역이 없습니다"
              }
            />
          ) : (
            <FlatList
              data={list}
              keyExtractor={(e) => e.id}
              renderItem={({ item }) => <EntryItem e={item} />}
              contentContainerStyle={{ paddingBottom: 24 }}
            />
          )}
        </View>

        <Pressable onPress={() => setMode("shop")} style={{ position: "absolute", top: 8, left: 8, padding: 8 }}>
          <Ionicons name="chevron-back" size={22} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
