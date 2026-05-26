export function evaluateOps(readiness: number, sasbinpuan: number) {
  const pass = readiness >= sasbinpuan;

  return {
    sasbinpuan,
    readiness,
    status: pass ? "CAPABLE" : "FAIL",
    severity: pass ? "GREEN" : "RED"
  };
}

// ✅ INI WAJIB ADA
export function generateStaggerPlan(aogFleet: any[]) {
  return aogFleet.map((a, i) => ({
    aircraft: a.Aircraft,
    priority: i + 1,
    suggestedWindow: `D+${i * 2}`,
  }));
}