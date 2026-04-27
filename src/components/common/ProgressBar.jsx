import { StyleSheet, View } from "react-native";

export default function ProgressBar({ value, color, height = 7 }) {
  const pct = Math.min(Math.max(value, 0), 1) * 100;
  return (
    <View style={[styles.bg, { height }]}>
      <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color, height }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  bg:   { backgroundColor: "#F0F0F0", borderRadius: 6, overflow: "hidden" },
  fill: { borderRadius: 6 },
});
