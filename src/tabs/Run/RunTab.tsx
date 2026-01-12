import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { View, Alert } from "react-native";
import * as Location from "expo-location";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import InRunOverlay from "../../components/run/InRunOverlay";
import RunCompleteScreen from "./RunCompleteScreen";
import { polylineDistance } from "../../components/run/utils/geo";
import { calcBread } from "../../components/run/utils/carrot";
import { BlurView } from "expo-blur";
import RunMap, { RunMapRef } from "../../components/run/RunMap";

// 마커 이미지는 나중에 추가 예정
// import MarkerImg from "../../../assets/Images/marker.png";
// import BreadImg from "../../../assets/Images/bread.png";

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
  const autoStart = route.params?.autoStart ?? false;

  const mapRef = useRef<RunMapRef>(null);
  const [state, setState] = useState<RunState>("idle");
  const [path, setPath] = useState<LatLng[]>([]);
  const [startTs, setStartTs] = useState<number | null>(null);
  const [pausedAccum, setPausedAccum] = useState(0);
  const [pauseStart, setPauseStart] = useState<number | null>(null);
  const [watchSub, setWatchSub] = useState<Location.LocationSubscription | null>(null);
  const [tick, setTick] = useState(0);

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

      // autoStart가 true이면 즉시 러닝 시작
      if (autoStart) {
        setTimeout(() => {
          startRun();
        }, 500); // 약간의 딜레이를 두어 지도가 로드된 후 시작
      }
    })();
    return () => { watchSub?.remove(); };
  }, [autoStart, startRun]);

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

  // 빵 생성 로직
  useEffect(() => {
    if (state === "idle" || path.length < 2) return;
    if (targets.length === 0) return;

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
  }, [distanceKm, path, state, targets, fired]);

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

      {(state === "running" || state === "paused") ? (
        <InRunOverlay
          distanceKm={distanceKm}
          durationSec={durationSec}
          paceSecPerKm={paceSecPerKm}
          onPause={pauseRun}
          onStop={stopRun}
          runState={state}
        />
      ) : null}

      {/* 완료 화면 모달 - RunTab 위에 겹쳐서 표시 */}
      {state === "finished" ? (
        <>
          {/* 블러 + 약한 디밍 오버레이 */}
          <BlurView
            tint="dark"
            intensity={20}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1000,
              backgroundColor: "rgba(17, 17, 17, 0.5)", // 배경색 추가
            }}
          />
          {/* RunCompleteScreen 모달 */}
          <RunCompleteScreen
            distanceKm={distanceKm}
            durationSec={durationSec}
            paceSecPerKm={paceSecPerKm}
            carrotCount={calcBread(distanceKm)}
            onClose={() => {
              setState("idle");
              (navigation as any).navigate("Home");
            }}
          />
        </>
      ) : null}
    </View>
  );
}
