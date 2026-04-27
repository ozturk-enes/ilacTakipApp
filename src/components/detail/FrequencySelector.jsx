/**
 * FrequencySelector – Kullanım sıklığı chip'leri + gün seçici.
 * Props:
 *   frequency      string
 *   selectedDays   number[]
 *   themeColor     string
 *   isTablet       bool
 *   onFrequency    (freq: string) => void
 *   onToggleDay    (index: number) => void
 */

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DAYS_SHORT, FREQUENCIES } from "../../constants/schedule";
import { COLORS } from "../../theme/colors";

export default function FrequencySelector({
  frequency,
  selectedDays,
  themeColor,
  isTablet,
  onFrequency,
  onToggleDay,
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.label}>Kullanım Sıklığı</Text>

      {/* Chip'ler */}
      <View style={styles.chipRow}>
        {FREQUENCIES.map((freq) => {
          const active = frequency === freq;
          return (
            <TouchableOpacity
              key={freq}
              style={[styles.chip, active && { backgroundColor: themeColor, borderColor: themeColor }]}
              onPress={() => onFrequency(freq)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{freq}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Gün seçici */}
      {frequency !== "İhtiyaç Halinde" && (
        <View style={styles.dayRow}>
          {DAYS_SHORT.map((day, i) => {
            const selected = frequency === "Her Gün" || selectedDays.includes(i);
            const size = isTablet ? 52 : 44;
            return (
              <TouchableOpacity
                key={i}
                style={[
                  styles.dayCircle,
                  { width: size, height: size, borderRadius: size / 2 },
                  selected && { backgroundColor: themeColor, borderColor: themeColor },
                ]}
                onPress={() => onToggleDay(i)}
              >
                <Text style={[styles.dayText, selected && styles.dayTextActive]}>{day}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section:   { marginBottom: 25 },
  label:     { fontSize: 14, fontWeight: "700", color: COLORS.text, marginBottom: 12, marginLeft: 4 },
  chipRow:   { flexDirection: "row", gap: 10, marginBottom: 15 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 15,
    backgroundColor: "#F0F0F0",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  chipText:       { fontSize: 14, fontWeight: "600", color: COLORS.textLight },
  chipTextActive: { color: "#FFF" },
  dayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  dayCircle: {
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  dayText:       { fontSize: 14, fontWeight: "700", color: COLORS.textLight },
  dayTextActive: { color: "#FFF" },
});
