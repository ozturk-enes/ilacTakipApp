/**
 * BarChart.jsx
 *
 * Genel amaçlı çubuk grafik bileşeni. SVG gerektirmez; saf View
 * katmanlarıyla çalışır. Haftalık (7 çubuk) ve aylık (30 çubuk)
 * görünümlerini destekler.
 *
 * Props:
 *   data        [{ value, label, isToday? }]   – her çubuk için veri
 *   maxValue    number (opsiyonel, hesaplanır)
 *   height      number – grafik yüksekliği (px)
 *   color       string – aktif çubuk rengi
 *   goalLine    number – hedef çizgisi değeri (opsiyonel)
 */

import { StyleSheet, Text, View } from "react-native";

export default function BarChart({
  data = [],
  maxValue,
  height = 90,
  color = "#4FACFE",
  goalLine,
}) {
  if (!data.length) return null;

  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1);
  // 30 çubukta etiket yoğunluğunu azalt
  const labelStep = data.length > 14 ? 7 : 1;

  return (
    <View>
      {/* Çubuklar */}
      <View style={[styles.chartArea, { height }]}>
        {data.map((item, i) => {
          const barH = max > 0 ? Math.max(3, (item.value / max) * height) : 3;
          const isActive = item.isToday || i === data.length - 1;
          return (
            <View
              key={i}
              style={[styles.track, { height, backgroundColor: color + "18" }]}
            >
              <View
                style={[
                  styles.bar,
                  {
                    height: barH,
                    backgroundColor: isActive ? color : color + "70",
                    borderRadius: data.length > 14 ? 3 : 6,
                  },
                ]}
              />
            </View>
          );
        })}

        {/* Hedef çizgisi */}
        {goalLine != null && max > 0 && (
          <View
            pointerEvents="none"
            style={[
              styles.goalLine,
              { bottom: (goalLine / max) * height },
            ]}
          />
        )}
      </View>

      {/* Etiketler */}
      <View style={styles.labelRow}>
        {data.map((item, i) => (
          <Text
            key={i}
            style={[
              styles.label,
              item.isToday && { fontWeight: "800", color: color },
              i % labelStep !== 0 && i !== data.length - 1 && styles.labelHidden,
            ]}
          >
            {item.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chartArea: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 3,
    position: "relative",
  },
  track: {
    flex: 1,
    borderRadius: 6,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  bar: {
    width: "100%",
  },
  goalLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 1,
    backgroundColor: "#34C759",
    opacity: 0.7,
  },
  labelRow: {
    flexDirection: "row",
    gap: 3,
    marginTop: 6,
  },
  label: {
    flex: 1,
    textAlign: "center",
    fontSize: 10,
    color: "#9E9E9E",
    fontWeight: "600",
  },
  labelHidden: {
    opacity: 0,
  },
});
