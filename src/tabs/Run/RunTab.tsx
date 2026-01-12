import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { View, Alert, Modal, Text, Pressable, StyleSheet, Dimensions, Platform, TouchableWithoutFeedback } from "react-native";
import * as Location from "expo-location";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import InRunOverlay from "../../components/run/InRunOverlay";
import RunCompleteScreen from "./RunCompleteScreen";
import { polylineDistance } from "../../components/run/utils/geo";
import { calcBread } from "../../components/run/utils/carrot";
import { BlurView } from "expo-blur";
import RunMap, { RunMapRef } from "../../components/run/RunMap";

// 화면 비율 계산
const FIGMA_WIDTH = 390;
const FIGMA_HEIGHT = 844;
const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get("window");

const SCREEN_WIDTH = Platform.OS === 'web' ? Math.min(WINDOW_WIDTH, 480) : WINDOW_WIDTH;
const SCREEN_HEIGHT = WINDOW_HEIGHT;

const wp = (px: number) => (px / FIGMA_WIDTH) * SCREEN_WIDTH;
const hp = (px: number) => (px / FIGMA_HEIGHT) * SCREEN_HEIGHT;

type LatLng = { latitude: number; longitude: number };
type RunState = "idle" | "running" | "paused" | "finished";

type RunTabRouteParams = {
  Run: {
    autoStart?: boolean;
  };
};

// === 유틸: 거리/보간 ===
const toRad = (d: number) => (d * Math.PI) / 180;
const distM = (a: LatLng, b: LatLng) => {
  const R = 6371000;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
};

function pointAtDistance(path: LatLng[], targetKm: number): LatLng | null {
  if (path.length < 2) return null;
  const targetM = targetKm * 1000;
  let cum = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i];
    const b = path[i + 1];
    const seg = distM(a, b);
    if (cum + seg >= targetM) {
      const t = (targetM - cum) / seg;
      return {
        latitude: a.latitude + (b.latitude - a.latitude) * t,
        longitude: a.longitude + (b.longitude - a.longitude) * t,
      };
    }
    cum += seg;
  }
  return path[path.length - 1];
}

function genNextTrio(baseKm: number) {
  return [
    { km: baseKm + 0.3, count: 1 },
    { km: baseKm + 0.6, count: 1 },
    { km: baseKm + 1.0, count: 2 },
  ];
}

export default function RunTab() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RunTabRouteParams, "Run">>();
  
  const mapRef = useRef<RunMapRef>(null);
  const [state, setState] = useState<RunState>("idle");
  const [path, setPath] = useState<LatLng[]>([]);
  const [startTs, setStartTs] = useState<number | null>(null);
  const [pausedAccum, setPausedAccum] = useState(0);
  const [pauseStart, setPauseStart] = useState<number | null>(null);
  const [watchSub, setWatchSub] = useState<Location.LocationSubscription | null>(null);
  const [tick, setTick] = useState(0);

  // 모달 표시 여부
  const [showStartModal, setShowStartModal] = useState(true);
  
  // 모달 UI용 선택 상태
  const [selectedMode, setSelectedMode] = useState<'immediate' | 'route' | null>(null);

  // 실제 실행 중인 모드 ('immediate'면 빵 생성 안 함)
  const [activeMode, setActiveMode] = useState<'immediate' | 'route' | null>(null);

  const [breadPoints, setBreadPoints] = useState<LatLng[]>([]);
  const [targets, setTargets] = useState<{ km: number; count: number }[]>(genNextTrio(0));
  const [fired, setFired] = useState<Record<string, number>>({});

  const startRun = useCallback(async () => {
    setState("running");
    setStartTs(Date.now());
    const sub = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.Highest, distanceInterval: 2, timeInterval: 1000 },
      (loc) => {
        const p = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
        setPath((prev) => (prev.length ? [...prev, p] : [p]));
      }
    );
    setWatchSub(sub);
  }, []);

  const handleOptionPress = (mode: 'immediate' | 'route') => {
    setSelectedMode(mode);

    if (mode === 'immediate') {
      // '지금 위치에서 바로 시작'
      setTimeout(() => {
        setShowStartModal(false);
        setActiveMode('immediate'); // 모드 설정 (빵 생성 방지용)
        startRun();
        setTimeout(() => setSelectedMode(null), 500); 
      }, 300);
    } else {
      // '루트 설정'
      setTimeout(() => {
        setShowStartModal(false);
        setActiveMode('route');    // 모드 설정 (빵 생성 됨)
        startRun();
        setTimeout(() => setSelectedMode(null), 500); 
      }, 300);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("위치 권한 필요", "러닝 기록을 위해 위치 권한이 필요합니다.");
        return;
      }
      const cur = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const here: LatLng = { latitude: cur.coords.latitude, longitude: cur.coords.longitude };
      mapRef.current?.animateCamera({ center: here, zoom: 16 });
      setPath([here]);
    })();
    return () => { watchSub?.remove(); };
  }, [startRun]);

  useEffect(() => {
    if (state !== "running" || !startTs) return;
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [state, startTs]);

  const durationSec = useMemo(() => {
    if (!startTs) return 0;
    const now = Date.now();
    const paused = pauseStart ? (now - pauseStart) : 0;
    return Math.max(0, Math.floor((now - startTs - pausedAccum - paused) / 1000));
  }, [startTs, pausedAccum, pauseStart, state, tick]);

  const distanceKm = useMemo(() => polylineDistance(path), [path]);

  const paceSecPerKm = useMemo(() => {
    if (distanceKm < 0.05 || durationSec === 0) return null;
    return Math.round(durationSec / distanceKm);
  }, [distanceKm, durationSec]);

  const pauseRun = () => {
    if (state === "running") {
      setState("paused");
      setPauseStart(Date.now());
    } else if (state === "paused") {
      setState("running");
      if (pauseStart) setPausedAccum((acc) => acc + (Date.now() - pauseStart));
      setPauseStart(null);
    }
  };

  const stopRun = () => {
    watchSub?.remove();
    setState("finished");
    setPauseStart(null);
  };

  const here = path[path.length - 1];

  // 빵 생성 로직 (useEffect)
  useEffect(() => {
    // 1. 기본 조건 체크
    if (state === "idle" || path.length < 2) return;
    if (targets.length === 0) return;

    // 2. activeMode가 'route'가 아니면 빵을 만들지 않음
    if (activeMode !== 'route') return; 

    let updated = false;
    let newBread: LatLng[] = [];
    let newFired = { ...fired };
    let newTargets = [...targets];

    while (newTargets.length > 0 && distanceKm >= newTargets[0].km) {
      const { km, count } = newTargets.shift()!;
      const key = km.toFixed(3);
      const already = newFired[key] ?? 0;

      const pt = pointAtDistance(path, km);
      if (pt) {
        const need = Math.max(0, count - already);
        for (let i = 0; i < need; i++) newBread.push(pt);
        newFired[key] = already + need;
      }

      if (!newTargets.some(t => Math.floor(t.km - 0.0001) === Math.floor(km))) {
        const nextBase = Math.floor(km + 0.0001);
        const nextTrio = genNextTrio(nextBase);
        for (const t of nextTrio) {
          if (!newTargets.find(x => Math.abs(x.km - t.km) < 1e-6)) {
            newTargets.push(t);
          }
        }
        newTargets.sort((a, b) => a.km - b.km);
      }

      updated = true;
    }

    if (updated) {
      if (newBread.length) setBreadPoints(prev => [...prev, ...newBread]);
      setTargets(newTargets);
      setFired(newFired);
    }
  }, [distanceKm, path, state, targets, fired, activeMode]);

  return (
    <View style={{ flex: 1 }}>
      <RunMap
        ref={mapRef}
        path={state !== "idle" ? path : []}
        breadPoints={breadPoints}
        here={here}
        initialRegion={{
          latitude: here?.latitude ?? 37.5665,
          longitude: here?.longitude ?? 126.9780,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={showStartModal && state === "idle"}
        onRequestClose={() => setShowStartModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              
              <Text style={styles.modalTitle}>어떤 방식으로 시작할까요?</Text>
              
              {/* 옵션 1: 지금 위치에서 바로 시작 */}
              <Pressable 
                style={[
                  styles.modalOptionBox,
                  selectedMode === 'immediate' && styles.selectedOptionBox
                ]}
                onPress={() => handleOptionPress('immediate')}
              >
                <View style={[
                  styles.radioCircle,
                  selectedMode === 'immediate' && styles.selectedRadioCircle
                ]}>
                  {selectedMode === 'immediate' && <View style={styles.radioInnerCircle} />}
                </View>
                <Text style={[
                  styles.optionTitle,
                  selectedMode === 'immediate' && styles.selectedOptionText
                ]}>지금 위치에서 바로 시작</Text>
              </Pressable>

              {/* 옵션 2: 루트 설정 */}
              <Pressable 
                style={[
                  styles.modalOptionBox, 
                  { marginTop: hp(12) },
                  selectedMode === 'route' && styles.selectedOptionBox
                ]}
                onPress={() => handleOptionPress('route')}
              >
                <View style={[
                  styles.radioCircle,
                  selectedMode === 'route' && styles.selectedRadioCircle
                ]}>
                  {selectedMode === 'route' && <View style={styles.radioInnerCircle} />}
                </View>
                <View>
                  <Text style={[
                    styles.optionTitle,
                    selectedMode === 'route' && styles.selectedOptionText
                  ]}>루트 설정</Text>
                  <Text style={styles.optionSubtitle}>출발지와 도착지를 미리 설정</Text>
                </View>
              </Pressable>

            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* 오버레이: immediate 모드면 프로그레스 바 숨김 (showProgressBar={false}) */}
      {(state === "running" || state === "paused") ? (
        <InRunOverlay
          distanceKm={distanceKm}
          durationSec={durationSec}
          paceSecPerKm={paceSecPerKm}
          onPause={pauseRun}
          onStop={stopRun}
          runState={state}
          // [수정] activeMode가 'route'일 때만 바 표시
          showProgressBar={activeMode === 'route'}
        />
      ) : null}

      {state === "finished" ? (
        <>
          <BlurView
            tint="dark"
            intensity={20}
            style={StyleSheet.absoluteFill}
          >
            <View style={{flex:1, backgroundColor: "rgba(17, 17, 17, 0.5)"}} />
          </BlurView>
          <RunCompleteScreen
            distanceKm={distanceKm}
            durationSec={durationSec}
            paceSecPerKm={paceSecPerKm}
            carrotCount={calcBread(distanceKm)}
            onClose={() => {
              setState("idle");
              setShowStartModal(true);
              setActiveMode(null);
              (navigation as any).navigate("Home");
            }}
          />
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(24),
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center', // 왼쪽 정렬에서 중앙 정렬로 변경 (박스 중앙 배치)
  },
  modalTitle: {
    width: '100%', // 제목 영역 확보
    fontSize: wp(20),
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Pretendard-Bold",
    marginBottom: hp(20),
    marginLeft: wp(4), // 박스와 라인 맞춤
    alignSelf: 'flex-start', // 제목은 왼쪽 정렬 유지
  },
  modalOptionBox: {
    // [수정] 크기 고정 및 중앙 정렬
    width: wp(342),
    height: hp(177),
    backgroundColor: "#FFFFFF",
    borderRadius: wp(16),
    paddingHorizontal: wp(20),
    flexDirection: "row",
    alignItems: "center", // 세로 중앙 정렬
    gap: wp(16),
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  
  selectedOptionBox: {
    backgroundColor: "#FFF3E0", 
    borderColor: "#FB8800",
  },

  radioCircle: {
    width: wp(24),
    height: wp(24),
    borderRadius: wp(12),
    borderWidth: 1.5,
    borderColor: "#E5E5E5",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  selectedRadioCircle: {
    borderColor: "#FB8800",
  },

  radioInnerCircle: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: "#FB8800",
  },

  optionTitle: {
    fontSize: wp(16),
    fontWeight: "600",
    color: "#333333",
    fontFamily: "Pretendard-SemiBold",
  },

  selectedOptionText: {
    color: "#FB8800",
  },

  optionSubtitle: {
    fontSize: wp(13),
    fontWeight: "400",
    color: "#999999",
    fontFamily: "Pretendard-Regular",
    marginTop: hp(4),
  },
});