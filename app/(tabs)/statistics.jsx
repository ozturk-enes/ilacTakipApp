import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BarChart    from "../../src/components/stats/BarChart";
import EntryModal  from "../../src/components/common/EntryModal";
import ProgressBar from "../../src/components/common/ProgressBar";
import SectionCard from "../../src/components/common/SectionCard";
import StatRow     from "../../src/components/common/StatRow";
import { useHealthStats } from "../../src/hooks/useHealthStats";
import useAppStore        from "../../src/store/useAppStore";
import { COLORS }         from "../../src/theme/colors";

// ─── Yerel yardımcı bileşenler ─────────────────────────────────────────────

function PeriodTab({ label, active, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.periodBtn, active && { backgroundColor: COLORS.primary }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={[styles.periodBtnText, active && { color: "#FFF" }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function SummaryChip({ icon, value, label, color }) {
  return (
    <View style={[styles.summaryChip, { borderColor: color + "30" }]}>
      <View style={[styles.summaryIconBox, { backgroundColor: color + "18" }]}>
        <Ionicons name={icon} size={16} color={color} />
      </View>
      <Text style={[styles.summaryValue, { color }]}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

// ─── Yardımcı fonksiyonlar ──────────────────────────────────────────────────

const pct        = (v) => `${Math.round(v * 100)}%`;
const adherColor = (r) => r >= 0.8 ? COLORS.success : r >= 0.5 ? COLORS.calorie : COLORS.primary;
const fmtDate    = (iso) => {
  const d = new Date(iso);
  return `${d.toLocaleDateString("tr-TR")} ${d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}`;
};
const fmtShort   = (dateStr) =>
  new Date(dateStr + "T00:00:00").toLocaleDateString("tr-TR", { day: "2-digit", month: "short" });

// ─── Ana Sayfa ──────────────────────────────────────────────────────────────

export default function Statistics() {
  const {
    period, setPeriod,
    waterData, waterAvg, waterGoalDays, dailyWaterGoal,
    calorieData, calorieAvg, todayCalories, calorieGoal,
    medicineStats, overallAdherence, unusedMedicines, adherenceData,
    weightLog, latestWeight, weightTrend,
    allNotes,
  } = useHealthStats();

  const logCalories       = useAppStore((s) => s.logCalories);
  const setCalorieGoal    = useAppStore((s) => s.setCalorieGoal);
  const addWeightEntry    = useAppStore((s) => s.addWeightEntry);
  const deleteWeightEntry = useAppStore((s) => s.deleteWeightEntry);

  const [calorieModal, setCalorieModal] = useState(false);
  const [weightModal,  setWeightModal]  = useState(false);
  const [goalModal,    setGoalModal]    = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Başlık ── */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.pageTitle}>İstatistikler</Text>
            <Text style={styles.pageSubtitle}>Sağlık & İlaç Geçmişi</Text>
          </View>
          <Ionicons name="stats-chart" size={28} color={COLORS.primary} />
        </View>

        {/* ── Periyot Seçici ── */}
        <View style={styles.periodRow}>
          <PeriodTab label="Bu Hafta" active={period === "week"}  onPress={() => setPeriod("week")} />
          <PeriodTab label="Bu Ay"    active={period === "month"} onPress={() => setPeriod("month")} />
        </View>

        {/* ── Özet Şeridi ── */}
        <View style={styles.summaryRow}>
          <SummaryChip icon="medical" value={pct(overallAdherence)}                    label="İlaç Uyumu" color={adherColor(overallAdherence)} />
          <SummaryChip icon="water"   value={`${(waterAvg / 1000).toFixed(1)}L`}       label="Ort. Su"    color={COLORS.water} />
          <SummaryChip icon="flame"   value={calorieAvg > 0 ? `${calorieAvg}` : "—"}  label="Ort. kcal"  color={COLORS.calorie} />
        </View>

        {/* ══ Su Takibi ════════════════════════════════════════════════════ */}
        <SectionCard icon="water" iconColor={COLORS.water} title="Su Takibi">
          <BarChart
            data={waterData}
            height={80}
            color={COLORS.water}
            goalLine={dailyWaterGoal}
            maxValue={Math.max(dailyWaterGoal * 1.2, ...waterData.map((d) => d.value), 1)}
          />
          <StatRow items={[
            { value: `${(waterAvg / 1000).toFixed(1)} L`, label: "Günlük Ort.",    color: COLORS.water },
            { value: `${waterGoalDays}/${waterData.length}`, label: "Hedefe Ulaşılan", color: COLORS.success },
            { value: `${(dailyWaterGoal / 1000).toFixed(1)} L`, label: "Günlük Hedef" },
          ]} />
        </SectionCard>

        {/* ══ Kalori Takibi ════════════════════════════════════════════════ */}
        <SectionCard icon="flame" iconColor={COLORS.calorie} title="Kalori Takibi" action={{ onPress: () => setCalorieModal(true) }}>
          <BarChart
            data={calorieData.map((d) => ({ ...d, value: d.consumed }))}
            height={80}
            color={COLORS.calorie}
            goalLine={calorieGoal}
            maxValue={Math.max(calorieGoal * 1.2, ...calorieData.map((d) => d.consumed), 1)}
          />
          <StatRow items={[
            { value: todayCalories > 0 ? `${todayCalories}` : "—", label: "Bugün (kcal)", color: COLORS.calorie },
            { value: calorieAvg > 0 ? `${calorieAvg}` : "—",       label: "Günlük Ort." },
            { value: `${calorieGoal}`, label: "Hedef ✎", color: COLORS.calorie, labelColor: COLORS.calorie, onPress: () => setGoalModal(true) },
          ]} />
        </SectionCard>

        {/* ══ Kilo Takibi ══════════════════════════════════════════════════ */}
        <SectionCard icon="scale-outline" iconColor={COLORS.weight} title="Kilo Takibi" action={{ onPress: () => setWeightModal(true) }}>
          <View style={styles.weightSummary}>
            <Text style={[styles.weightValue, { color: COLORS.weight }]}>
              {latestWeight != null ? `${latestWeight} kg` : "—"}
            </Text>
            {weightTrend != null && (
              <View style={styles.trendBadge}>
                <Ionicons
                  name={weightTrend > 0 ? "arrow-up" : "arrow-down"}
                  size={12}
                  color={weightTrend > 0 ? COLORS.primary : COLORS.success}
                />
                <Text style={[styles.trendText, { color: weightTrend > 0 ? COLORS.primary : COLORS.success }]}>
                  {weightTrend > 0 ? "+" : ""}{weightTrend.toFixed(1)} kg
                </Text>
              </View>
            )}
          </View>

          {weightLog.length === 0 ? (
            <Text style={styles.emptyText}>Henüz kilo kaydı yok. + butonu ile ekleyin.</Text>
          ) : (
            <View style={styles.weightList}>
              {[...weightLog].reverse().slice(0, 7).map((entry) => (
                <View key={entry.id} style={styles.weightEntry}>
                  <Text style={styles.weightEntryDate}>{fmtShort(entry.date)}</Text>
                  <Text style={[styles.weightEntryVal, { color: COLORS.weight }]}>{entry.value} kg</Text>
                  <TouchableOpacity
                    onPress={() => Alert.alert("Kaydı Sil", "Bu kilo kaydını silmek istiyor musunuz?", [
                      { text: "İptal", style: "cancel" },
                      { text: "Sil", style: "destructive", onPress: () => deleteWeightEntry(entry.id) },
                    ])}
                  >
                    <Ionicons name="trash-outline" size={14} color="#BDBDBD" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </SectionCard>

        {/* ══ İlaç Uyumu ═══════════════════════════════════════════════════ */}
        <SectionCard icon="medical" iconColor={COLORS.primary} title="İlaç Uyumu">
          {adherenceData.length > 0 && medicineStats.length > 0 && (
            <>
              <BarChart data={adherenceData} height={80} color={adherColor(overallAdherence)} maxValue={100} />
              <View style={styles.adherenceLegend}>
                <View style={styles.adherenceLegendDot} />
                <Text style={styles.adherenceLegendText}>Her çubuk o günkü genel doz uyumunu gösterir (%)</Text>
              </View>
            </>
          )}

          {unusedMedicines.length > 0 && (
            <View style={styles.warningBox}>
              <Ionicons name="warning-outline" size={16} color={COLORS.calorie} />
              <Text style={styles.warningText}>
                {unusedMedicines.length} ilaç bu dönemde hiç kullanılmadı:{" "}
                <Text style={{ fontWeight: "800" }}>{unusedMedicines.map((m) => m.name).join(", ")}</Text>
              </Text>
            </View>
          )}

          {medicineStats.length === 0 ? (
            <Text style={styles.emptyText}>Henüz ilaç eklenmedi.</Text>
          ) : (
            medicineStats.map((m) => {
              const typeColor = m.type === "İlaç" ? COLORS.primary : COLORS.supplement;
              const rateColor = adherColor(m.rate);
              return (
                <View key={m.id} style={styles.medicineRow}>
                  <View style={[styles.medIconBox, { backgroundColor: typeColor + "18" }]}>
                    <Ionicons name={m.type === "İlaç" ? "medical" : "flask"} size={13} color={typeColor} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.medicineNameRow}>
                      <Text style={styles.medicineName} numberOfLines={1}>{m.name}</Text>
                      <Text style={[styles.medicineRate, { color: rateColor }]}>{pct(m.rate)}</Text>
                    </View>
                    <ProgressBar value={m.rate} color={rateColor} />
                    <Text style={styles.medicineSub}>{m.taken}/{m.expected} doz alındı</Text>
                  </View>
                </View>
              );
            })
          )}

          {medicineStats.length > 0 && (
            <StatRow items={[
              { value: pct(overallAdherence), label: "Genel Uyum",    color: adherColor(overallAdherence) },
              { value: `${medicineStats.filter((m) => m.rate >= 0.8).length}`, label: "İyi Uyum", color: COLORS.success },
              { value: `${unusedMedicines.length}`, label: "Kullanılmayan", color: COLORS.primary },
            ]} />
          )}
        </SectionCard>

        {/* ══ Son Notlar ═══════════════════════════════════════════════════ */}
        <SectionCard icon="document-text-outline" iconColor={COLORS.textLight} title="Son Notlar & Yan Etkiler">
          {allNotes.length === 0 ? (
            <Text style={styles.emptyText}>Henüz not eklenmedi.</Text>
          ) : (
            allNotes.map((note) => {
              const noteColor = note.itemType === "İlaç" ? COLORS.primary : COLORS.supplement;
              return (
                <View key={note.id} style={[styles.noteCard, { borderLeftColor: noteColor }]}>
                  <View style={styles.noteHeaderRow}>
                    <View style={[styles.noteBadge, { backgroundColor: noteColor + "12" }]}>
                      <Ionicons name={note.itemType === "İlaç" ? "medical" : "flask"} size={12} color={noteColor} />
                      <Text style={[styles.noteBadgeText, { color: noteColor }]}>{note.itemName}</Text>
                    </View>
                    <Text style={styles.noteDate}>{fmtDate(note.timestamp)}</Text>
                  </View>
                  <Text style={styles.noteText}>{note.text}</Text>
                </View>
              );
            })
          )}
        </SectionCard>

      </ScrollView>

      <EntryModal
        visible={calorieModal} onClose={() => setCalorieModal(false)}
        title="Kalori Girişi" placeholder="1800" unit="kcal"
        hint={`Günlük hedef: ${calorieGoal} kcal`}
        onSave={(v) => logCalories(v)}
      />
      <EntryModal
        visible={goalModal} onClose={() => setGoalModal(false)}
        title="Günlük Kalori Hedefi" placeholder="2000" unit="kcal"
        hint="Yeni günlük kalori hedefinizi girin"
        onSave={(v) => setCalorieGoal(v)}
      />
      <EntryModal
        visible={weightModal} onClose={() => setWeightModal(false)}
        title="Kilo Kaydı" placeholder="75.5" unit="kg"
        hint={latestWeight ? `Son kayıt: ${latestWeight} kg` : "İlk kilonuzu girin"}
        onSave={(v) => addWeightEntry(v)}
      />
    </SafeAreaView>
  );
}

// ─── Stiller ───────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F9" },
  scroll:    { padding: 16, paddingBottom: 24, gap: 14 },

  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  pageTitle:    { fontSize: 26, fontWeight: "900", color: COLORS.text, letterSpacing: -0.5 },
  pageSubtitle: { fontSize: 13, color: COLORS.textLight, marginTop: 2, fontWeight: "600" },

  periodRow: {
    flexDirection: "row", gap: 8,
    backgroundColor: "#EDEDF0", borderRadius: 14, padding: 4,
  },
  periodBtn:     { flex: 1, paddingVertical: 9, borderRadius: 11, alignItems: "center" },
  periodBtnText: { fontSize: 13, fontWeight: "700", color: COLORS.textLight },

  summaryRow:    { flexDirection: "row", gap: 8 },
  summaryChip: {
    flex: 1, backgroundColor: "#FFF", borderRadius: 16, borderWidth: 1,
    padding: 12, alignItems: "center", gap: 4,
    shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  summaryIconBox: { width: 32, height: 32, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  summaryValue:   { fontSize: 17, fontWeight: "900", letterSpacing: -0.3 },
  summaryLabel:   { fontSize: 10, color: COLORS.textLight, fontWeight: "600", textAlign: "center" },

  warningBox: {
    flexDirection: "row", alignItems: "flex-start", gap: 8,
    backgroundColor: "#FFF8ED", borderRadius: 12, padding: 12,
    marginBottom: 12, borderWidth: 1, borderColor: "#FFE0A0",
  },
  warningText: { flex: 1, fontSize: 12, color: "#996600", lineHeight: 18 },

  medicineRow:    { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  medIconBox:     { width: 28, height: 28, borderRadius: 8, justifyContent: "center", alignItems: "center" },
  medicineNameRow:{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  medicineName:   { fontSize: 13, fontWeight: "700", color: COLORS.text, flex: 1, marginRight: 8 },
  medicineRate:   { fontSize: 13, fontWeight: "900" },
  medicineSub:    { fontSize: 11, color: COLORS.textLight, marginTop: 3, fontWeight: "600" },

  weightSummary:   { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  weightValue:     { fontSize: 34, fontWeight: "900", letterSpacing: -1 },
  trendBadge:      { flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: "#F4F4F6", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  trendText:       { fontSize: 12, fontWeight: "800" },
  weightList:      { gap: 6 },
  weightEntry:     { flexDirection: "row", alignItems: "center", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#F4F4F6" },
  weightEntryDate: { flex: 1, fontSize: 13, color: COLORS.textLight, fontWeight: "600" },
  weightEntryVal:  { fontSize: 15, fontWeight: "800", marginRight: 12 },

  adherenceLegend:    { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8, marginBottom: 14 },
  adherenceLegendDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.textLight, opacity: 0.5 },
  adherenceLegendText:{ fontSize: 11, color: COLORS.textLight, fontWeight: "600", flex: 1 },

  noteCard:      { backgroundColor: "#F8F9FA", borderRadius: 14, padding: 12, marginBottom: 8, borderLeftWidth: 3 },
  noteHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  noteBadge:     { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  noteBadgeText: { fontSize: 11, fontWeight: "700" },
  noteDate:      { fontSize: 10, color: COLORS.textLight },
  noteText:      { fontSize: 13, color: COLORS.text, lineHeight: 19 },

  emptyText: { fontSize: 13, color: COLORS.textLight, textAlign: "center", padding: 12, fontWeight: "600" },
});
