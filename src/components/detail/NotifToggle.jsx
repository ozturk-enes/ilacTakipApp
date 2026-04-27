/**
 * NotifToggle – Hatırlatıcı bildirim açma/kapama satırı.
 * Props: enabled bool, themeColor string, onToggle fn
 */

import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../theme/colors";

export default function NotifToggle({ enabled, themeColor, onToggle }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onToggle} activeOpacity={0.7}>
      <View style={[styles.iconBox, enabled && { backgroundColor: `${themeColor}18` }]}>
        <Ionicons
          name={enabled ? "notifications" : "notifications-off-outline"}
          size={18}
          color={enabled ? themeColor : COLORS.textLight}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.label, enabled && { color: themeColor }]}>
          Hatırlatıcı Bildirimleri
        </Text>
        <Text style={styles.hint}>
          {enabled ? "Doz saatlerinde bildirim gönderilecek" : "Bildirimler kapalı"}
        </Text>
      </View>
      <View style={[styles.switch, enabled && { backgroundColor: themeColor }]}>
        <View style={[styles.thumb, enabled && styles.thumbOn]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F8F9FA",
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#EDEDF0",
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: "#EDEDF0",
    justifyContent: "center",
    alignItems: "center",
  },
  label: { fontSize: 14, fontWeight: "700", color: COLORS.text },
  hint:  { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  switch: {
    width: 46,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#D1D1D6",
    padding: 3,
    justifyContent: "center",
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  thumbOn: { alignSelf: "flex-end" },
});
