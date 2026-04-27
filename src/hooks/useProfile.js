import useAppStore, { getTodayCompletedDoses, getTodaySchedule } from "../store/useAppStore";

export function useProfile() {
  const userProfile       = useAppStore((s) => s.userProfile);
  const updateUserProfile = useAppStore((s) => s.updateUserProfile);

  const items          = useAppStore((s) => s.items);
  const waterIntake    = useAppStore((s) => s.waterIntake);
  const dailyWaterGoal = useAppStore((s) => s.dailyWaterGoal);
  const resetAll       = useAppStore((s) => s.resetAll);

  const handleUpdateProfile = (patch) => updateUserProfile(patch);

  // ── Bugünkü özet ─────────────────────────────────────────────────────────
  const medicineCount   = items.filter((i) => i.type === "İlaç").length;
  const supplementCount = items.filter((i) => i.type === "Takviye").length;

  let totalDoses    = 0;
  let completedDoses = 0;

  for (const item of items) {
    if (item.frequency === "İhtiyaç Halinde") continue;
    const { doseCount, isActiveDay } = getTodaySchedule(item);
    if (!isActiveDay) continue;
    const done = getTodayCompletedDoses(item.completedDoses).length;
    totalDoses     += doseCount;
    completedDoses += Math.min(done, doseCount);
  }

  return {
    userProfile,
    handleUpdateProfile,
    medicineCount,
    supplementCount,
    totalDoses,
    completedDoses,
    waterIntake,
    dailyWaterGoal,
    resetAll,
  };
}
