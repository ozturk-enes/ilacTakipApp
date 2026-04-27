import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../theme/colors";
import { CommonStyles } from "../../theme/commonStyles";

export default function TimeSelectorRow({
  label,
  time,
  onPress,
  icon = "time-outline",
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={20} color={COLORS.primary} />
      </View>
      <Text style={styles.text}>
        {label}: {time}
      </Text>
      <Ionicons name="create-outline" size={20} color={COLORS.textLight} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "white",
    padding: 16,
    borderRadius: CommonStyles.borderRadius.medium,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F1F3F5",
    ...CommonStyles.shadow,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: CommonStyles.borderRadius.small,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "600",
  },
});
