import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Alert } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import PreRunOverlay from "../components/run/PreRunOverlay";
import InRunOverlay from "../components/run/InRunOverlay";
import { polylineDistance } from "../components/run/utils/geo";

// ✅ require/정적 import 둘 다 OK (안드 대소문자 경로 주의)
import MarkerImg from "../../assets/Images/marker.png";
import BreadImg from "../../assets/Images/bread.png";

type LatLng = { latitude: number; longitude: number };
type RunState = "idle" | "running" | "paused" | "finished";

// === 규칙 함수 (요청 주신 형태 유지)
export function calcBread(distanceKm: number) {
  const goal = 0.4;
  const progress = distanceKm / goal;
  if (progress < 0.3) return 0;
  if (progress < 0.6) return 1;
  if (progress < 1.0) return 2;
  return 4;
}

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
  const mapRef = useRef<MapView>(null);
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
  }, []);

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

  const startRun = async () => {
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
  };

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
    Alert.alert("러닝 종료", `거리 ${distanceKm.toFixed(2)}km, 시간 ${durationSec}s`);
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
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: here?.latitude ?? 37.5665,
          longitude: here?.longitude ?? 126.9780,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={false}
        followsUserLocation={false}
        showsMyLocationButton={false}
      >
        {/* 경로 선: 마커 아래로 */}
        {state !== "idle" && path.length >= 2 ? (
          <Polyline coordinates={path} strokeWidth={10} strokeColor="#FFD360" zIndex={0} />
        ) : null}

        {/* 🥖 빵 마커들 (image prop 사용) */}
        {breadPoints.map((pt, idx) => (
          <Marker
            key={`bread-${idx}-${pt.latitude}-${pt.longitude}`}
            coordinate={pt}
            image={BreadImg}
            anchor={{ x: 0.5, y: 0.5 }}
            zIndex={9}
          />
        ))}

        {/* 현재 위치 마커 (image prop 사용) */}
        {here ? (
          <Marker
            coordinate={here}
            image={MarkerImg}
            anchor={{ x: 0.5, y: 0.5 }}
            zIndex={10}
          />
        ) : null}
      </MapView>

      {state === "idle" ? <PreRunOverlay onStart={startRun} /> : null}

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
    </View>
  );
}
