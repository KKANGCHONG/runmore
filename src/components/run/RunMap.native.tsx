import React, { forwardRef, useImperativeHandle } from "react";
import { View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import type { LatLng } from "./utils/geo";

export type RunMapRef = {
  animateCamera: (options: { center: LatLng; zoom: number }) => void;
};

export type RunMapProps = {
  path: LatLng[];
  breadPoints: LatLng[];
  here: LatLng | null;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  style?: any;
};

const RunMap = forwardRef<RunMapRef, RunMapProps>(
  ({ path, breadPoints, here, initialRegion, style }, ref) => {
    const mapRef = React.useRef<MapView>(null);

    useImperativeHandle(ref, () => ({
      animateCamera: (options: { center: LatLng; zoom: number }) => {
        mapRef.current?.animateCamera({ center: options.center, zoom: options.zoom });
      },
    }));

    const defaultRegion = {
      latitude: here?.latitude ?? 37.5665,
      longitude: here?.longitude ?? 126.9780,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    return (
      <MapView
        ref={mapRef}
        style={style || { flex: 1 }}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion || defaultRegion}
        showsUserLocation={false}
        followsUserLocation={false}
        showsMyLocationButton={false}
      >
        {/* 경로 선: 마커 아래로 */}
        {path.length >= 2 ? (
          <Polyline coordinates={path} strokeWidth={10} strokeColor="#FFD360" zIndex={0} />
        ) : null}

        {/* 🥖 빵 마커들 */}
        {breadPoints.map((pt, idx) => (
          <Marker
            key={`bread-${idx}-${pt.latitude}-${pt.longitude}`}
            coordinate={pt}
            anchor={{ x: 0.5, y: 0.5 }}
            zIndex={9}
          >
            <View style={{ width: 20, height: 20, backgroundColor: "#FFD360", borderRadius: 10 }} />
          </Marker>
        ))}

        {/* 현재 위치 마커 */}
        {here ? (
          <Marker
            coordinate={here}
            anchor={{ x: 0.5, y: 0.5 }}
            zIndex={10}
          >
            <View style={{ width: 24, height: 24, backgroundColor: "#FF8A00", borderRadius: 12 }} />
          </Marker>
        ) : null}
      </MapView>
    );
  }
);

RunMap.displayName = "RunMap";

export default RunMap;
