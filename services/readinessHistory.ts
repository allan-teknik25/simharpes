export function generateMockTimeline(baseReadiness: number) {
  return Array.from({ length: 7 }).map((_, i) => ({
    date: `D-${6 - i}`,
    readiness: Math.max(50, baseReadiness - (6 - i) * 2),
  }));
}