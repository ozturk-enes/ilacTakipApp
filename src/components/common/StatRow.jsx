/**
 * StatRow – 3 sütunlu istatistik satırı.
 * Props: items: [{ value, label, color?, onPress? }]
 */

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../theme/colors";

export default function StatRow({ items }) {
  return (
    <View style={styles.row}>
      {items.map((item, i) => (
        <View key={i} style={styles.wrapper}>
          {i > 0 && <View style={styles.divider} />}
          <TouchableOpacity
            style={styles.item}
            onPress={item.onPress}
            disabled={!item.onPress}
            activeOpacity={item.onPress ? 0.7 : 1}
          >
            <Text style={[styles.value, item.color && { color: item.color }]}>
              {item.value}
            </Text>
            <Text style={[styles.label, item.labelColor && { color: item.labelColor }]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginTop: 14,
    backgroundColor: "#F8F9FA",
    borderRadius: 14,
    padding: 12,
  },
  wrapper: { flex: 1, flexDirection: "row" },
  divider: { width: 1, backgroundColor: "#EBEBEB", marginVertical: 4 },
  item: { flex: 1, alignItems: "center" },
  value: { fontSize: 17, fontWeight: "900", color: COLORS.text },
  label: { fontSize: 10, color: COLORS.textLight, marginTop: 2, fontWeight: "600", textAlign: "center" },
});
