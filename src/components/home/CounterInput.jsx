import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../theme/colors";
import { CommonStyles } from "../../theme/commonStyles";

export default function CounterInput({
  label,
  value,
  onIncrease,
  onDecrease,
  min = 1,
}) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.counter}>
        <TouchableOpacity
          style={styles.btn}
          onPress={onDecrease}
          disabled={value <= min}
        >
          <Ionicons
            name="remove"
            size={24}
            color={value <= min ? COLORS.textLight : COLORS.primary}
          />
        </TouchableOpacity>

        <View style={styles.valueContainer}>
          <Text style={styles.value}>{value}</Text>
        </View>

        <TouchableOpacity style={styles.btn} onPress={onIncrease}>
          <Ionicons name="add" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: "100%",
  },
  label: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 10,
    marginLeft: 4,
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8F9FA",
    padding: 6,
    borderRadius: CommonStyles.borderRadius.medium,
    borderWidth: 1,
    borderColor: "#F1F3F5",
    height: 56,
  },
  btn: {
    width: 44,
    height: 44,
    backgroundColor: 'white',
    borderRadius: CommonStyles.borderRadius.small,
    justifyContent: 'center',
    alignItems: 'center',
    ...CommonStyles.shadow,
  },
  valueContainer: {
    minWidth: 45,
    alignItems: "center",
  },
  value: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: -0.5,
  },
});
