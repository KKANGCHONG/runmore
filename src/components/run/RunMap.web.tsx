import React, { forwardRef, useImperativeHandle, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Polyline, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLng } from "./utils/geo";

// Leaflet 마커 아이콘 설정 (기본 아이콘 경로 문제 해결)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

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

// 지도 중심 이동을 위한 내부 컴포넌트
const MapController = ({ center, zoom }: { center: LatLng | null; zoom: number }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView([center.latitude, center.longitude], zoom, { animate: true });
    }
  }, [center, zoom, map]);

  return null;
};

const RunMap = forwardRef<RunMapRef, RunMapProps>(
  ({ path, breadPoints, here, initialRegion, style }, ref) => {
    const mapRef = useRef<L.Map | null>(null);

    useImperativeHandle(ref, () => ({
      animateCamera: (options: { center: LatLng; zoom: number }) => {
        if (mapRef.current) {
          mapRef.current.setView([options.center.latitude, options.center.longitude], options.zoom, {
            animate: true,
          });
        }
      },
    }));

    const defaultCenter: [number, number] = here
      ? [here.latitude, here.longitude]
      : [37.5665, 126.9780];
    const defaultZoom = 16;

    // LatLng를 Leaflet의 [lat, lng] 형식으로 변환
    const pathPositions: [number, number][] = path.map((p) => [p.latitude, p.longitude]);

    return (
      <div style={styles}>
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          style={{ height: "100%", width: "100%" }}
          whenCreated={(map) => {
            mapRef.current = map;
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapController center={here} zoom={defaultZoom} />

          {/* 경로 선 */}
          {path.length >= 2 && (
            <Polyline
              positions={pathPositions}
              pathOptions={{
                color: "#FFD360",
                weight: 10,
              }}
            />
          )}

          {/* 🥖 빵 마커들 */}
          {breadPoints.map((pt, idx) => (
            <Marker
              key={`bread-${idx}-${pt.latitude}-${pt.longitude}`}
              position={[pt.latitude, pt.longitude]}
              icon={L.divIcon({
                className: "custom-bread-marker",
                html: `<div style="width: 20px; height: 20px; background-color: #FFD360; border-radius: 10px; border: 2px solid white;"></div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 10],
              })}
            />
          ))}

          {/* 현재 위치 마커 */}
          {here && (
            <Marker
              position={[here.latitude, here.longitude]}
              icon={L.divIcon({
                className: "custom-here-marker",
                html: `<div style="width: 24px; height: 24px; background-color: #FF8A00; border-radius: 12px; border: 2px solid white;"></div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12],
              })}
            />
          )}
        </MapContainer>
      </div>
    );
  }
);

RunMap.displayName = "RunMap";

const styles: React.CSSProperties = {
  flex: 1,
  height: "100%",
  width: "100%",
} as const;

export default RunMap;
