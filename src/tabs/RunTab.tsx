import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Alert } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import PreRunOverlay from "../components/run/PreRunOverlay";
import InRunOverlay from "../components/run/InRunOverlay";
import { polylineDistance } from "../components/run/utils/geo";

type LatLng = { latitude: number; longitude: number };
type RunState = "idle" | "running" | "paused" | "finished";

export default function RunTab() {
  const mapRef = useRef<MapView>(null);
  const [state, setState] = useState<RunState>("idle");
  const [path, setPath] = useState<LatLng[]>([]);
  const [startTs, setStartTs] = useState<number | null>(null);
  const [pausedAccum, setPausedAccum] = useState(0);
  const [pauseStart, setPauseStart] = useState<number | null>(null);
  const [watchSub, setWatchSub] = useState<Location.LocationSubscription | null>(null);
  const [tick, setTick] = useState(0);   // 화면 갱신용 타이머

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

  // --- 러닝 중일 때만 1초마다 tick 증가 ---
useEffect(() => {
  if (state !== "running" || !startTs) return;
  const id = setInterval(() => setTick(t => t + 1), 1000);
  return () => clearInterval(id);        // 일시정지/종료 시 정리
}, [state, startTs]);

// --- durationSec: path.length 대신 tick을 의존성에 사용 ---
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
        mapRef.current?.animateCamera({ center: p });
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
        showsUserLocation
        followsUserLocation={state !== "idle"}
        showsMyLocationButton={false}
      >
        {state !== "idle" && path.length >= 2 ? (
          <Polyline coordinates={path} strokeWidth={6} />
        ) : null}

        {path.length > 0 ? <Marker coordinate={path[0]} /> : null}
      </MapView>

      {state === "idle" ? <PreRunOverlay onStart={startRun} /> : null}

      {state === "running" || state === "paused" ? (
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
