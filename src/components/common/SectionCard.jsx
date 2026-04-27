/**
 * SectionCard – Paylaşılan kart wrapper'ı.
 * İkon + başlık içeren beyaz kart. Profil ve özet kartlarında tekrar eden stili soyutlar.
 *
 * Props:
 *   icon       string   – Ionicons adı (opsiyonel)
 *   iconColor  string   – İkon rengi (opsiyonel, default COLORS.primary)
 *   title      string   – Kart başlığı (opsiyonel)
 *   children   ReactNode
 *   style      ViewStyle (opsiyonel)
 */

import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS, withOpacity } from "../../theme/colors";

export default function SectionCard({ icon, iconColor = COLORS.primary, title, action, children, style }) {
  return (
    <View style={[styles.card, style]}>
      {(icon || title) && (
        <View style={styles.header}>
          {icon && (
            <View style={[styles.iconBox, { backgroundColor: withOpacity(iconColor, 0.1) }]}>
              <Ionicons name={icon} size={16} color={iconColor} />
            </View>
          )}
          {title && <Text style={styles.title}>{title}</Text>}
          {action && (
            <TouchableOpacity onPress={action.onPress} hitSlop={8}>
              <Ionicons name="add-circle" size={22} color={iconColor} />
            </TouchableOpacity>
          )}
        </View>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1C1C1E",
  },
});
