/**
 * EntryModal – Sayısal değer giriş bottom sheet modalı.
 * Kalori, kilo, hedef gibi tek sayı gerektiren girişlerde kullanılır.
 *
 * Props:
 *   visible     bool
 *   onClose     () => void
 *   title       string
 *   placeholder string
 *   unit        string       – "kcal", "kg", "ml" vb.
 *   hint        string       – opsiyonel açıklama
 *   onSave      (num) => void
 *   children    ReactNode    – opsiyonel ek içerik (hızlı seçim chip'leri vb.)
 */

import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../../theme/colors";

export default function EntryModal({
  visible,
  onClose,
  title,
  placeholder,
  unit,
  hint,
  onSave,
  children,
}) {
  const [value, setValue] = useState("");

  const handleSave = () => {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
      Alert.alert("Geçersiz değer", "Lütfen geçerli bir sayı girin.");
      return;
    }
    onSave(num);
    setValue("");
    onClose();
  };

  const handleClose = () => {
    setValue("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={handleClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>{title}</Text>
          {hint && <Text style={styles.hint}>{hint}</Text>}

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={setValue}
              placeholder={placeholder}
              keyboardType="decimal-pad"
              autoFocus
              placeholderTextColor="#BDBDBD"
            />
            <Text style={styles.unit}>{unit}</Text>
          </View>

          {children}

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Kaydet</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 30,
  },
  handle: {
    width: 40, height: 5, backgroundColor: "#E0E0E0",
    borderRadius: 3, alignSelf: "center", marginBottom: 20,
  },
  title: { fontSize: 20, fontWeight: "800", color: COLORS.text, marginBottom: 4 },
  hint:  { fontSize: 13, color: COLORS.textLight, marginBottom: 16, fontWeight: "600" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F4F6",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.text,
    paddingVertical: 14,
    letterSpacing: -0.5,
  },
  unit: { fontSize: 16, color: COLORS.textLight, fontWeight: "700" },
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveBtnText: { color: "#FFF", fontSize: 16, fontWeight: "800" },
});
