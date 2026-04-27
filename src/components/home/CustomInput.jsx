import { StyleSheet, Text, TextInput, View } from "react-native";
import { COLORS } from "../../theme/colors";
import { CommonStyles } from "../../theme/commonStyles";

export default function CustomInput({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  multiline = false,
  style = {},
  keyboardType = "default",
  suffix = null,
}) {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            error && styles.errorInput,
            suffix && { paddingRight: 45 },
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textLight}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "center"}
          keyboardType={keyboardType}
        />
        {suffix && (
          <View style={styles.suffixContainer}>
            <Text style={styles.suffixText}>{suffix}</Text>
          </View>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
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
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    height: 56,
    borderRadius: CommonStyles.borderRadius.medium,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: "#F1F3F5",
    ...CommonStyles.shadow,
  },
  suffixContainer: {
    position: "absolute",
    right: 16,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  suffixText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textLight,
  },
  multilineInput: {
    minHeight: 100,
    height: "auto",
    paddingTop: 14,
    paddingVertical: 14,
  },
  errorInput: {
    borderColor: "#FF6347",
    borderWidth: 1.5,
  },
  errorText: {
    color: "#FF6347",
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: "500",
  },
});
