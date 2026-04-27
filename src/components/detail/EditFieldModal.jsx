import { Ionicons } from "@expo/vector-icons";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomInput from "../home/CustomInput";
import CounterInput from "../home/CounterInput";
import PerDaySection from "./PerDaySection";
import useResponsive from "../../hooks/useResponsive";
import { DAYS_SHORT as DAYS, FREQUENCIES } from "../../constants/schedule";
import { COLORS } from "../../theme/colors";

export default function EditFieldModal({
  visible,
  field,
  formData,
  themeColor,
  onClose,
  onUpdate,
  onToggleDay,
  onDoseCountChange,
  onFrequencyChipPress,
  saveDaySchedule,
  differDosesPerDay,
  onSetDifferDosesPerDay,
  errors,
}) {
  const { isTablet } = useResponsive();

  const renderContent = () => {
    switch (field) {
      case "name":
        return (
          <>
            <Text style={styles.modalTitle}>İlaç Adı</Text>
            <CustomInput
              value={formData.name}
              onChangeText={(val) => onUpdate("name", val)}
              placeholder="Örn: C Vitamini, Parasetamol"
              error={errors?.name}
            />
          </>
        );

      case "dosage":
        return (
          <>
            <Text style={styles.modalTitle}>Dozaj & Talimat</Text>
            <CustomInput
              label="Dozaj"
              value={formData.dosage}
              onChangeText={(val) => onUpdate("dosage", val)}
              placeholder="Örn: 500"
              error={errors?.dosage}
              keyboardType="numeric"
              suffix="mg"
            />
            <CustomInput
              label="Kullanma Talimatı"
              value={formData.noteText}
              onChangeText={(val) => onUpdate("noteText", val)}
              placeholder="Örn: Tok karnına alınmalıdır"
              multiline
              style={styles.noteInput}
            />
          </>
        );

      case "schedule":
        return (
          <>
            <Text style={styles.modalTitle}>Kullanım Programı</Text>

            {/* Sıklık Çipleri */}
            <Text style={styles.label}>Kullanım Sıklığı</Text>
            <View style={styles.chipContainer}>
              {FREQUENCIES.map((freq) => (
                <TouchableOpacity
                  key={freq}
                  style={[
                    styles.chip,
                    formData.frequency === freq && {
                      backgroundColor: themeColor,
                      borderColor: themeColor,
                    },
                  ]}
                  onPress={() => onFrequencyChipPress(freq)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      formData.frequency === freq && styles.activeChipText,
                    ]}
                  >
                    {freq}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Gün seçici: Her Gün ve Belirli Günler için göster */}
            {formData.frequency !== "İhtiyaç Halinde" && (
              <View style={styles.dayPickerContainer}>
                {DAYS.map((day, index) => {
                  const selected =
                    formData.frequency === "Her Gün" ||
                    formData.selectedDays.includes(index);
                  const size = isTablet ? 52 : 44;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.dayCircle,
                        { width: size, height: size, borderRadius: size / 2 },
                        selected && {
                          backgroundColor: themeColor,
                          borderColor: themeColor,
                        },
                      ]}
                      onPress={() => onToggleDay(index)}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          selected && styles.activeDayText,
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* Günlük Kullanım – İhtiyaç Halinde'de gizlenir */}
            {formData.frequency !== "İhtiyaç Halinde" && (
              <View style={{ marginTop: 10 }}>
                <CounterInput
                  label="Günlük Kullanım"
                  value={formData.doseCount}
                  onIncrease={() => onDoseCountChange(formData.doseCount + 1)}
                  onDecrease={() => onDoseCountChange(formData.doseCount - 1)}
                />
              </View>
            )}

            {/* Güne Göre Farklı Program */}
            <PerDaySection
              formData={formData}
              themeColor={themeColor}
              differDosesPerDay={differDosesPerDay}
              onToggle={() => onSetDifferDosesPerDay((v) => !v)}
              onSaveDaySchedule={saveDaySchedule}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          style={styles.bottomSheet}
          activeOpacity={1}
          onPress={() => {}}
        >
          <View style={styles.sheetHandle} />
          <ScrollView showsVerticalScrollIndicator={false}>
            {renderContent()}
          </ScrollView>
          <TouchableOpacity
            style={[styles.doneBtn, { backgroundColor: themeColor }]}
            onPress={onClose}
          >
            <Text style={styles.doneBtnText}>Tamam</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 25,
    paddingTop: 12,
    paddingBottom: 40,
    maxHeight: "85%",
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
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
    marginLeft: 4,
  },
  chipContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 15,
    backgroundColor: "#F0F0F0",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  chipText: { fontSize: 14, fontWeight: "600", color: COLORS.textLight },
  activeChipText: { color: "#FFFFFF" },
  dayPickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    marginBottom: 15,
  },
  dayCircle: {
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  dayText: { fontSize: 14, fontWeight: "700", color: COLORS.textLight },
  activeDayText: { color: "#FFFFFF" },
  noteInput: {
    backgroundColor: "#F5F5F5",
    minHeight: 80,
    borderRadius: 16,
  },
  doneBtn: {
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
  },
  doneBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});
