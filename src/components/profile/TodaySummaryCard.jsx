/**
 * TodaySummaryCard.jsx
 * Bugünkü ilaç/takviye/doz/su özetini kart olarak gösterir.
 */

import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import ProgressBar from "../common/ProgressBar";
import SectionCard from "../common/SectionCard";
import { COLORS } from "../../theme/colors";

function StatCell({ icon, iconColor, value, label }) {
  return (
    <View style={styles.cell}>
      <View style={[styles.cellIcon, { backgroundColor: iconColor + "18" }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <Text style={styles.cellValue}>{value}</Text>
      <Text style={styles.cellLabel}>{label}</Text>
    </View>
  );
}

function ProgressRow({ label, percent, color, sublabel }) {
  return (
    <View style={styles.progressBlock}>
      <View style={styles.progressRowHeader}>
        <Text style={styles.progressLabel}>{label}</Text>
        <Text style={[styles.progressPct, { color }]}>%{percent}</Text>
      </View>
      <ProgressBar value={percent / 100} color={color} />
      {sublabel && <Text style={styles.progressSub}>{sublabel}</Text>}
    </View>
  );
}

export default function TodaySummaryCard({
  medicineCount,
  supplementCount,
  completedDoses,
  totalDoses,
  waterIntake,
  dailyWaterGoal,
}) {
  const dosePercent  = totalDoses === 0 ? 0 : Math.round(Math.min(completedDoses / totalDoses, 1) * 100);
  const waterPercent = dailyWaterGoal === 0 ? 0 : Math.round(Math.min(waterIntake / dailyWaterGoal, 1) * 100);

  return (
    <SectionCard icon="today-outline" iconColor={COLORS.success} title="Bugünkü Özet">

      {/* 3 stat hücresi */}
      <View style={styles.statsRow}>
        <StatCell icon="medical"          iconColor={COLORS.primary}    value={medicineCount}              label="İlaç"    />
        <View style={styles.divider} />
        <StatCell icon="flask"            iconColor={COLORS.supplement} value={supplementCount}            label="Takviye" />
        <View style={styles.divider} />
        <StatCell icon="checkmark-circle" iconColor={COLORS.success}    value={`${completedDoses}/${totalDoses}`} label="Doz" />
      </View>

      {/* İlerleme çubukları */}
      <ProgressRow
        label="Doz Uyumu"
        percent={dosePercent}
        color={dosePercent >= 80 ? COLORS.success : COLORS.primary}
      />
      <ProgressRow
        label="Su Tüketimi"
        percent={waterPercent}
        color={COLORS.water}
        sublabel={`${waterIntake} / ${dailyWaterGoal} ml`}
      />
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  cell: { flex: 1, alignItems: "center", gap: 4 },
  cellIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  cellValue: { fontSize: 17, fontWeight: "900", color: "#1C1C1E" },
  cellLabel: { fontSize: 11, color: COLORS.textLight, fontWeight: "600" },
  divider: { width: 1, height: 44, backgroundColor: "#EBEBEB" },

  progressBlock: { marginBottom: 10 },
  progressRowHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  progressLabel: { fontSize: 12, fontWeight: "700", color: COLORS.textLight },
  progressPct: { fontSize: 12, fontWeight: "800" },
  progressSub: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 4,
    fontWeight: "600",
    textAlign: "right",
  },
});
