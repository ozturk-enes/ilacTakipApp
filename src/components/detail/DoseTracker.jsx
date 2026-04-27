import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useResponsive from "../../hooks/useResponsive";
import { getTodayCompletedDoses } from "../../store/useAppStore";
import { COLORS, withOpacity } from "../../theme/colors";

const DOSE_ICONS = ["sunny-outline", "partly-sunny-outline", "moon-outline"];

export default function DoseTracker({
  reminderTimes,
  item,
  isNew,
  themeColor,
  onTimePress,
  onToggleDose,
  isActiveDay = true,
}) {
  const { isTablet } = useResponsive();
  const todayCompleted = item
    ? getTodayCompletedDoses(item.completedDoses)
    : [];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {isNew ? "Doz Saatleri" : "Doz Takibi"}
      </Text>
      {/* Edit modunda bugün aktif gün değilse bilgi mesajı göster */}
      {!isNew && !isActiveDay && (
        <View style={styles.inactiveDay}>
          <Ionicons name="calendar-outline" size={20} color={COLORS.textLight} />
          <Text style={styles.inactiveDayText}>
            Bugün bu ilaç için planlanmış doz yok.
          </Text>
        </View>
      )}
      {reminderTimes.map((time, index) => {
        const isDone = todayCompleted.includes(index);
        return (
          <View
            key={index}
            style={[styles.doseCard, isDone && styles.doseCardDone]}
          >
            {/* Saat Değiştirme Alanı (Sol ve Orta) */}
            <TouchableOpacity
              style={[styles.timePressArea, isNew && { flex: 1 }]}
              onPress={() => onTimePress(index)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.doseIconBox,
                  isTablet && { width: 56, height: 56, borderRadius: 28 },
                  {
                    backgroundColor: isDone
                      ? withOpacity(COLORS.success, 0.08)
                      : withOpacity(themeColor, 0.06),
                  },
                ]}
              >
                <Ionicons
                  name={DOSE_ICONS[index % 3]}
                  size={isTablet ? 24 : 20}
                  color={isDone ? COLORS.success : themeColor}
                />
              </View>
              <View style={styles.doseInfo}>
                <Text style={styles.doseNumber}>{index + 1}. Doz</Text>
                <View style={styles.timeRow}>
                  <Text style={styles.doseTime}>{time}</Text>
                  <Ionicons
                    name="pencil-sharp"
                    size={12}
                    color={COLORS.textLight}
                    style={{ marginLeft: 6, marginTop: 2 }}
                  />
                </View>
              </View>
              {isNew && (
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={COLORS.textLight}
                  style={{ marginLeft: "auto" }}
                />
              )}
            </TouchableOpacity>

            {/* Doz İşaretleme Alanı (Sağ) */}
            {!isNew && (
              <TouchableOpacity
                style={styles.checkPressArea}
                onPress={() => onToggleDose(index)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkbox,
                    isDone && {
                      backgroundColor: themeColor,
                      borderColor: themeColor,
                    },
                  ]}
                >
                  {isDone && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 25,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 15,
  },
  doseCard: {
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: "white",
    borderRadius: 24,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    overflow: "hidden",
  },
  doseCardDone: { backgroundColor: "#F9F9F9" },
  inactiveDay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  inactiveDayText: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: "600",
    flex: 1,
  },
  timePressArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  checkPressArea: {
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    borderLeftWidth: 1,
    borderLeftColor: "#F5F5F5",
  },
  doseIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  doseInfo: { flex: 1, marginLeft: 15 },
  doseNumber: { fontSize: 16, fontWeight: "700", color: COLORS.text },
  timeRow: { flexDirection: "row", alignItems: "center" },
  doseTime: { fontSize: 14, color: COLORS.textLight, marginTop: 2 },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
});
