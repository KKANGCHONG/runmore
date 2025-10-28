// 규칙: 1km 중 30% 돌파 시 1개, 60% 돌파 시 1개, 100% 돌파 시 2개 추가
export function calcBread(distanceKm: number) {
  const goal = 1; // 목표 1km
  const progress = distanceKm / goal;

  if (progress < 0.3) return 0; // 0~29%
  if (progress < 0.6) return 1; // 30~59%
  if (progress < 1.0) return 2; // 60~99%
  return 4; // 100% 이상
}