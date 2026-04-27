import { Ionicons } from "@expo/vector-icons";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CustomInput from "../home/CustomInput";
import { COLORS } from "../../theme/colors";

export default function NoteModal({
  visible,
  onClose,
  noteText,
  onChangeText,
  onSave,
  isAdding,
  themeColor,
}) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.bottomSheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.modalTitle}>Ne hissettiniz?</Text>

          <View style={styles.dateTimeDisplay}>
            <Ionicons
              name="time-outline"
              size={18}
              color={COLORS.textLight}
            />
            <Text style={styles.dateTimeText}>
              {new Date().toLocaleString("tr-TR")}
            </Text>
          </View>

          <CustomInput
            value={noteText}
            onChangeText={onChangeText}
            placeholder="Baş ağrısı, mide bulantısı vb..."
            multiline
            style={styles.modalNoteInput}
          />

          <TouchableOpacity
            style={[
              styles.modalSaveBtn,
              { backgroundColor: themeColor },
              isAdding && styles.disabledBtn,
            ]}
            onPress={onSave}
            disabled={isAdding}
          >
            <Text style={styles.modalSaveBtnText}>Kaydet</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.modalCancelBtn} onPress={onClose}>
            <Text style={styles.modalCancelBtnText}>İptal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    paddingBottom: 40,
  },
  sheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 15,
    textAlign: "center",
  },
  dateTimeDisplay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
  },
  dateTimeText: { fontSize: 14, color: COLORS.textLight, fontWeight: "600" },
  modalNoteInput: {
    backgroundColor: "#F5F5F5",
    minHeight: 120,
    borderRadius: 20,
    marginBottom: 25,
  },
  modalSaveBtn: {
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
  },
  modalSaveBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  modalCancelBtn: { alignItems: "center", marginTop: 15 },
  modalCancelBtnText: {
    color: COLORS.textLight,
    fontSize: 15,
    fontWeight: "600",
  },
  disabledBtn: { opacity: 0.5 },
});
