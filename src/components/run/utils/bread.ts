// 규칙: 기본 3km 달성 시 빵 4개, 이후 1km 당 +1개
export function calcBread(distanceKm: number) {
  if (distanceKm < 3) return 0;
  return 4 + Math.floor(distanceKm - 3);
}
