/**
 * SettingsMenuItem.jsx
 * Ayarlar menüsünde tekrar eden satır bileşeni.
 *
 * Props:
 *   icon        string  – Ionicons adı
 *   iconColor   string
 *   label       string  – ana etiket
 *   sublabel    string? – opsiyonel açıklama
 *   onPress     fn
 *   rightContent  ReactNode? – sağ taraf override (yoksa chevron)
 *   danger      bool?   – kırmızı etiket rengi
 *   isLast      bool?   – alt sınır gizle
 */
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../theme/colors";

export default function SettingsMenuItem({
  icon,
  iconColor = COLORS.primary,
  label,
  sublabel,
  onPress,
  rightContent,
  danger = false,
  isLast = false,
}) {
  return (
    <TouchableOpacity
      style={[styles.row, isLast && styles.rowLast]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconBox, { backgroundColor: iconColor + "18" }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>

      <View style={styles.labelBox}>
        <Text style={[styles.label, danger && { color: COLORS.primary }]}>
          {label}
        </Text>
        {sublabel ? <Text style={styles.sublabel}>{sublabel}</Text> : null}
      </View>

      {rightContent !== undefined ? (
        rightContent
      ) : (
        <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F4F4F6",
  },
  rowLast: { borderBottomWidth: 0 },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  labelBox: { flex: 1 },
  label: { fontSize: 15, fontWeight: "600", color: "#1C1C1E" },
  sublabel: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
});
