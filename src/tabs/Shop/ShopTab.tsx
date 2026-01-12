import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, Platform, Pressable, ScrollView, Image } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

// SVG 이미지 import
import CarrotIcon from "../../../assets/figma/carrot_small.svg";
import ShopRabbitImage from "../../../assets/figma/shop_rabbit_image.svg";
import StarbucksImage from "../../../assets/figma/starbucks_image.svg";

const FIGMA_WIDTH = 390;
const FIGMA_HEIGHT = 844;
const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get("window");

const SCREEN_WIDTH = Platform.OS === 'web' ? Math.min(WINDOW_WIDTH, 480) : WINDOW_WIDTH;
const SCREEN_HEIGHT = WINDOW_HEIGHT;

const wp = (px: number) => (px / FIGMA_WIDTH) * SCREEN_WIDTH;
const hp = (px: number) => (px / FIGMA_HEIGHT) * SCREEN_HEIGHT;

// 더미 데이터
const CATEGORIES = ["전체", "건강", "체중조절", "러닝용품", "전자기기"];
const PRODUCTS = [
  { id: 1, title: "스타벅스 아이스 카페...", price: 10, deadline: "마감 12일 전" },
  { id: 2, title: "스타벅스 아이스 카페...", price: 10, deadline: "마감 12일 전" },
  { id: 3, title: "스타벅스 아이스 카페...", price: 10, deadline: "마감 12일 전" },
  { id: 4, title: "스타벅스 아이스 카페...", price: 10, deadline: "마감 12일 전" },
];

export default function ShopTab() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState("전체");

  return (
    <View style={styles.webWrapper}>
      <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
        
        {/* 헤더 */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={wp(24)} color="#49393A" />
          </Pressable>
          <Text style={styles.headerTitle}>상점</Text>
          <View style={{ width: wp(24) }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* 상단 히어로 섹션 */}
          <View style={styles.heroSection}>
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroLabel}>모든 당근 수</Text>
              <View style={styles.carrotCountRow}>
                <CarrotIcon width={wp(18)} height={hp(24)} style={{marginBottom: hp(4)}}/> 
                <Text style={styles.carrotCountText}>78개</Text>
              </View>
            </View>
            <ShopRabbitImage width={wp(140)} height={wp(140)} style={styles.rabbitImage} />
          </View>

          {/* 사용 가능/완료 박스 */}
          <View style={styles.statsBox}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>사용 가능</Text>
              <Text style={styles.statValue}>7</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>사용 완료</Text>
              <Text style={styles.statValue}>7</Text>
            </View>
          </View>

          {/* 상품 목록 섹션 */}
          <View style={styles.productSection}>
            {/* 섹션 헤더 */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>상품목록</Text>
              <Pressable style={styles.sortButton}>
                <Text style={styles.sortText}>추천순</Text>
                <Ionicons name="chevron-down" size={wp(14)} color="#BDBDBD" />
              </Pressable>
            </View>

            {/* 카테고리 탭 (가로 스크롤) */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.categoryScroll}
              contentContainerStyle={styles.categoryContent}
            >
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <Pressable 
                    key={cat} 
                    style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text style={[styles.categoryText, isSelected && styles.categoryTextSelected]}>
                      {cat}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* 상품 그리드 */}
            <View style={styles.gridContainer}>
              {PRODUCTS.map((item) => (
                <View key={item.id} style={styles.productCard}>
                  {/* 상품 이미지 영역 */}
                  <View style={styles.imageContainer}>
                    <StarbucksImage width={wp(80)} height={hp(120)} />
                  </View>
                  
                  {/* 가격 뱃지 */}
                  <View style={styles.priceBadge}>
                    <CarrotIcon width={wp(10)} height={wp(10)} />
                    <Text style={styles.priceText}>{item.price}</Text>
                  </View>

                  {/* 텍스트 정보 */}
                  <Text style={styles.productTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.productDeadline}>{item.deadline}</Text>
                </View>
              ))}
            </View>

          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  webWrapper: { flex: 1, backgroundColor: Platform.OS === 'web' ? '#f0f0f0' : '#FFFFFF', alignItems: 'center' },
  container: { flex: 1, width: '100%', maxWidth: 480, backgroundColor: "#FFFBF6" }, // 전체 배경색
  
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(20),
    paddingVertical: hp(16),
  },
  backButton: { padding: wp(4) },
  headerTitle: { fontSize: wp(18), fontWeight: "600", color: "#49393A", fontFamily: "Pretendard-SemiBold" },

  scrollContent: { paddingBottom: hp(40) },

  // 히어로 섹션
  heroSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(30),
    paddingTop: hp(20),
    paddingBottom: hp(40), // 박스가 겹치도록 공간 확보
  },
  heroTextContainer: {
    justifyContent: "center",
  },
  heroLabel: {
    fontSize: wp(14),
    color: "#817D7A",
    marginBottom: hp(8),
    fontFamily: "Pretendard-Medium",
  },
  carrotCountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(6),
  },
  carrotCountText: {
    fontSize: wp(28),
    fontWeight: "700",
    color: "#FB8800",
    fontFamily: "Pretendard-Bold",
  },
  rabbitImage: {
    // SVG 컴포넌트 스타일 (필요시 조정)
  },

  // 통계 박스
  statsBox: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: wp(20),
    borderRadius: wp(16),
    paddingVertical: hp(20),
    marginTop: -hp(20), // 히어로 섹션과 겹치게 위로 올림
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statLabel: {
    fontSize: wp(14),
    color: "#817D7A",
    marginBottom: hp(4),
    fontFamily: "Pretendard-Medium",
  },
  statValue: {
    fontSize: wp(18),
    fontWeight: "600",
    color: "#49393A",
    fontFamily: "Pretendard-SemiBold",
  },
  statDivider: {
    width: 1,
    height: hp(24),
    backgroundColor: "#EBEBEB",
  },

  // 상품 섹션
  productSection: {
    marginTop: hp(32),
    backgroundColor: "#FFFFFF", // 하단부는 흰색 배경인듯 함 (이미지 참고)
    borderTopLeftRadius: wp(24),
    borderTopRightRadius: wp(24),
    paddingTop: hp(24),
    paddingHorizontal: wp(20),
    minHeight: hp(500),
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(16),
  },
  sectionTitle: {
    fontSize: wp(16),
    fontWeight: "600",
    color: "#282119",
    fontFamily: "Pretendard-SemiBold",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
  },
  sortText: {
    fontSize: wp(12),
    color: "#BDBDBD",
    fontFamily: "Pretendard-Medium",
  },

  // 카테고리 탭
  categoryScroll: {
    marginBottom: hp(20),
  },
  categoryContent: {
    gap: wp(8),
    paddingRight: wp(20),
  },
  categoryChip: {
    paddingHorizontal: wp(16),
    paddingVertical: hp(8),
    borderRadius: wp(20),
    backgroundColor: "#F7F7F7",
  },
  categoryChipSelected: {
    backgroundColor: "#FFF3E0",
  },
  categoryText: {
    fontSize: wp(14),
    color: "#817D7A",
    fontFamily: "Pretendard-Medium",
  },
  categoryTextSelected: {
    color: "#FB8800",
    fontWeight: "600",
    fontFamily: "Pretendard-SemiBold",
  },

  // 그리드
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: hp(16),
  },
  productCard: {
    width: (SCREEN_WIDTH - wp(55)) / 2, // 2열 그리드 계산 (패딩 고려)
    marginBottom: hp(10),
  },
  imageContainer: {
    width: "100%",
    height: (SCREEN_WIDTH - wp(55)) / 2, // 정사각형 비율
    backgroundColor: "#D0F0EF", // 스타벅스 배경색과 유사한 민트색
    borderRadius: wp(16),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(12),
    overflow: "hidden",
  },
  priceBadge: {
    position: "absolute",
    top: hp(10),
    left: wp(10),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: wp(8),
    paddingVertical: hp(4),
    borderRadius: wp(12),
    gap: wp(4),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  priceText: {
    fontSize: wp(12),
    fontWeight: "700",
    color: "#FB8800",
    fontFamily: "Pretendard-Bold",
  },
  productTitle: {
    fontSize: wp(16),
    fontWeight: "600",
    color: "#282119",
    marginBottom: hp(4),
    fontFamily: "Pretendard-SemiBold",
  },
  productDeadline: {
    fontSize: wp(12),
    color: "#9E9E9E",
    fontFamily: "Pretendard-Medium",
  },
});