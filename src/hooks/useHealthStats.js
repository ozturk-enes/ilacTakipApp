/**
 * useHealthStats.js
 *
 * Tüm sağlık istatistiklerini (ilaç uyumu, su, kalori, kilo) tek bir
 * hook üzerinden hesaplayarak sunar. Period (hafta / ay) hook içinde
 * yönetilir; dışarıdan sadece { period, setPeriod } kullanılır.
 */

import { useMemo, useState } from "react";
import useAppStore from "../store/useAppStore";

// ─── Tarih yardımcıları ────────────────────────────────────────────────────
const toKey = (d) => d.toISOString().split("T")[0];

const getAppDay = (date) => {
  const j = date.getDay();
  return j === 0 ? 6 : j - 1; // Pzt=0 … Paz=6
};

// Kısa gün etiketleri (Pzt=0 … Paz=6)
const DAY_SHORT = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

// Son `n` günün Date dizisini (eskiden yeniye) üretir
function buildDateRange(n) {
  const today = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (n - 1 - i));
    return d;
  });
}

// ─── Tek ilaç için tek gün beklenen doz sayısını döndürür ─────────────────
function expectedForDay(item, date) {
  const appDay = getAppDay(date);
  if (item.frequency === "İhtiyaç Halinde") return 0;
  if (item.dailySchedule) return item.dailySchedule[appDay]?.doseCount ?? 0;
  if (item.frequency === "Her Gün") return item.doseCount ?? 1;
  if (item.frequency === "Belirli Günler" && item.selectedDays?.includes(appDay))
    return item.doseCount ?? 1;
  return 0;
}

// ─── İlaç uyumu hesaplama (dönem geneli, ilaç başına) ─────────────────────
function computeMedicineStats(items, dates) {
  return items
    .filter((item) => item.frequency !== "İhtiyaç Halinde")
    .map((item) => {
      let totalExpected = 0;
      let totalTaken = 0;

      for (const date of dates) {
        const key = toKey(date);
        const exp = expectedForDay(item, date);
        if (exp === 0) continue;
        const taken = (item.completedDoses?.[key] ?? []).length;
        totalExpected += exp;
        totalTaken += Math.min(taken, exp);
      }

      const rate = totalExpected > 0 ? totalTaken / totalExpected : 0;
      return {
        id: item.id,
        name: item.name,
        type: item.type,
        rate,
        taken: totalTaken,
        expected: totalExpected,
        isUnused: totalTaken === 0 && totalExpected > 0,
      };
    });
}

// ─── Günlük genel uyum verisi (BarChart için) ──────────────────────────────
function computeDailyAdherence(items, dates, period) {
  const scheduled = items.filter((i) => i.frequency !== "İhtiyaç Halinde");

  return dates.map((date) => {
    const key = toKey(date);
    let exp = 0;
    let tkn = 0;
    for (const item of scheduled) {
      const e = expectedForDay(item, date);
      if (e === 0) continue;
      const t = (item.completedDoses?.[key] ?? []).length;
      exp += e;
      tkn += Math.min(t, e);
    }
    // Gelecek günler için exp=0 → değer gösterme (null)
    const today = toKey(new Date());
    const isFuture = key > today;
    const rate = exp > 0 && !isFuture ? tkn / exp : 0;
    return {
      date: key,
      label:
        period === "week"
          ? DAY_SHORT[getAppDay(date)]
          : String(date.getDate()),
      // 0-100 ölçeğinde göster
      value: exp > 0 && !isFuture ? Math.round(rate * 100) : 0,
      isToday: key === toKey(new Date()),
      hasData: exp > 0 && !isFuture,
    };
  });
}

// ─── Hook ─────────────────────────────────────────────────────────────────
export function useHealthStats() {
  const [period, setPeriod] = useState("week"); // 'week' | 'month'

  const items         = useAppStore((s) => s.items);
  const waterIntake   = useAppStore((s) => s.waterIntake);
  const waterHistory  = useAppStore((s) => s.waterHistory);
  const dailyWaterGoal= useAppStore((s) => s.dailyWaterGoal);
  const calorieLog    = useAppStore((s) => s.calorieLog);
  const calorieGoal   = useAppStore((s) => s.calorieGoal);
  const weightLog     = useAppStore((s) => s.weightLog);

  const n = period === "week" ? 7 : 30;
  const dates = useMemo(() => buildDateRange(n), [n]);
  const todayKey = toKey(new Date());

  // Bugünün su değerini geçici olarak history'e yaz (henüz persist olmamış olabilir)
  const fullWaterHistory = useMemo(
    () => ({ ...waterHistory, [todayKey]: waterIntake }),
    [waterHistory, waterIntake, todayKey]
  );

  // ── Su verisi ────────────────────────────────────────────────────────────
  const waterData = useMemo(
    () =>
      dates.map((d) => {
        const key = toKey(d);
        return {
          date: key,
          label: period === "week"
            ? DAY_SHORT[getAppDay(d)]
            : String(d.getDate()),
          value: fullWaterHistory[key] ?? 0,
          goal: dailyWaterGoal,
          isToday: key === todayKey,
        };
      }),
    [dates, fullWaterHistory, dailyWaterGoal, todayKey, period]
  );

  const waterAvg = useMemo(() => {
    const entries = waterData.filter((d) => d.value > 0);
    if (!entries.length) return 0;
    return Math.round(entries.reduce((s, d) => s + d.value, 0) / entries.length);
  }, [waterData]);

  const waterGoalDays = useMemo(
    () => waterData.filter((d) => d.value >= dailyWaterGoal).length,
    [waterData, dailyWaterGoal]
  );

  // ── Kalori verisi ────────────────────────────────────────────────────────
  const calorieData = useMemo(
    () =>
      dates.map((d) => {
        const key = toKey(d);
        return {
          date: key,
          label: period === "week"
            ? DAY_SHORT[getAppDay(d)]
            : String(d.getDate()),
          consumed: calorieLog[key]?.consumed ?? 0,
          goal: calorieLog[key]?.goal ?? calorieGoal,
          isToday: key === todayKey,
        };
      }),
    [dates, calorieLog, calorieGoal, todayKey, period]
  );

  const calorieAvg = useMemo(() => {
    const entries = calorieData.filter((d) => d.consumed > 0);
    if (!entries.length) return 0;
    return Math.round(entries.reduce((s, d) => s + d.consumed, 0) / entries.length);
  }, [calorieData]);

  const todayCalories = calorieLog[todayKey]?.consumed ?? 0;

  // ── İlaç uyumu ───────────────────────────────────────────────────────────
  const medicineStats = useMemo(
    () => computeMedicineStats(items, dates),
    [items, dates]
  );

  const overallAdherence = useMemo(() => {
    const totalExp = medicineStats.reduce((s, m) => s + m.expected, 0);
    const totalTkn = medicineStats.reduce((s, m) => s + m.taken, 0);
    return totalExp > 0 ? totalTkn / totalExp : 1;
  }, [medicineStats]);

  const unusedMedicines = useMemo(
    () => medicineStats.filter((m) => m.isUnused),
    [medicineStats]
  );

  // Günlük genel uyum (BarChart için, 0-100 değerler)
  const adherenceData = useMemo(
    () => computeDailyAdherence(items, dates, period),
    [items, dates, period]
  );

  // ── Kilo ─────────────────────────────────────────────────────────────────
  const dateKeys = useMemo(() => dates.map(toKey), [dates]);

  const weightInRange = useMemo(
    () => weightLog.filter((e) => dateKeys.includes(e.date)),
    [weightLog, dateKeys]
  );

  const latestWeight = weightLog.length > 0
    ? weightLog[weightLog.length - 1].value
    : null;

  const weightTrend = useMemo(() => {
    if (weightLog.length < 2) return null;
    return (
      weightLog[weightLog.length - 1].value -
      weightLog[weightLog.length - 2].value
    );
  }, [weightLog]);

  // ── Notlar ───────────────────────────────────────────────────────────────
  const allNotes = useMemo(
    () =>
      items
        .flatMap((item) =>
          (item.notes || []).map((note) => ({
            ...note,
            itemName: item.name,
            itemType: item.type,
          }))
        )
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 30),
    [items]
  );

  return {
    period,
    setPeriod,
    // Su
    waterData,
    waterAvg,
    waterGoalDays,
    dailyWaterGoal,
    // Kalori
    calorieData,
    calorieAvg,
    todayCalories,
    calorieGoal,
    // İlaç
    medicineStats,
    overallAdherence,
    unusedMedicines,
    adherenceData,
    // Kilo
    weightLog,
    weightInRange,
    latestWeight,
    weightTrend,
    // Notlar
    allNotes,
  };
}
