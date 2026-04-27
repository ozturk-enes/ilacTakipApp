import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert, Image, KeyboardAvoidingView, Platform,
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DetailHeader      from "../../src/components/detail/DetailHeader";
import DoseTracker       from "../../src/components/detail/DoseTracker";
import EditFieldModal    from "../../src/components/detail/EditFieldModal";
import FrequencySelector from "../../src/components/detail/FrequencySelector";
import NoteModal         from "../../src/components/detail/NoteModal";
import NoteTimeline      from "../../src/components/detail/NoteTimeline";
import NotifToggle       from "../../src/components/detail/NotifToggle";
import PerDaySection     from "../../src/components/detail/PerDaySection";
import CounterInput      from "../../src/components/home/CounterInput";
import CustomInput       from "../../src/components/home/CustomInput";
import PrimaryButton     from "../../src/components/home/PrimaryButton";
import { useImagePicker }    from "../../src/hooks/useImagePicker";
import { useItemForm }       from "../../src/hooks/useItemForm";
import { useNoteManagement } from "../../src/hooks/useNoteManagement";
import useResponsive         from "../../src/hooks/useResponsive";
import { useTimePicker }     from "../../src/hooks/useTimePicker";
import useAppStore           from "../../src/store/useAppStore";
import { cancelItemNotifications, scheduleItemNotifications } from "../../src/utils/notifications";
import { COLORS } from "../../src/theme/colors";

export default function Detail() {
  const { id, type: initialType } = useLocalSearchParams();
  const router = useRouter();
  const deleteItem         = useAppStore((s) => s.deleteItem);
  const toggleDose         = useAppStore((s) => s.toggleDose);
  const setNotificationIds = useAppStore((s) => s.setNotificationIds);
  const items              = useAppStore((s) => s.items);
  const { isTablet, contentMaxWidth } = useResponsive();

  const isNew = id === "new";
  const item  = isNew ? null : items.find((i) => i.id === id);

  const {
    formData, updateFormData, errors,
    toggleDay, handleFrequencyChipPress, handleDoseCountChange,
    saveDaySchedule, differDosesPerDay, setDifferDosesPerDay, handleSave,
  } = useItemForm(item, isNew, initialType);

  const { image, pickImage } = useImagePicker(formData.image);

  const { showPicker, setShowPicker, onTimeChange } = useTimePicker(
    (newTime, index) => {
      const times = [...formData.reminderTimes];
      times[index] = newTime;
      updateFormData("reminderTimes", times.sort());
    },
  );

  const { isAddingNote, noteModalVisible, setNoteModalVisible, handleAddNote } =
    useNoteManagement(id, () => formData.noteText, () => updateFormData("noteText", ""));

  const [editField, setEditField] = useState(null);

  useEffect(() => {
    if (image && image !== formData.image) updateFormData("image", image);
  }, [image]);

  // Bildirim planla/iptal et — kaydet callback'i her iki modda aynı
  const handleSaveWithNotif = () =>
    handleSave(async (savedItem) => {
      if (savedItem.notificationsEnabled) {
        const ids = await scheduleItemNotifications(savedItem);
        setNotificationIds(savedItem.id, ids);
      } else {
        await cancelItemNotifications(savedItem);
      }
    });

  const handleDelete = () =>
    Alert.alert("Sil", "Bu kaydı silmek istediğinizden emin misiniz?", [
      { text: "İptal", style: "cancel" },
      { text: "Sil", style: "destructive", onPress: () => { deleteItem(id); router.back(); } },
    ]);

  const themeColor = formData.type === "İlaç" ? COLORS.primary : COLORS.supplement;

  // Edit modunda bugünün aktif saatlerini hesapla
  const todayAppDay = (() => { const j = new Date().getDay(); return j === 0 ? 6 : j - 1; })();
  const isActiveDayForEdit = !isNew &&
    formData.frequency !== "İhtiyaç Halinde" &&
    (formData.frequency === "Her Gün" || (formData.selectedDays ?? []).includes(todayAppDay));
  const editModeTimes = !isNew && differDosesPerDay && formData.perDaySchedule?.[todayAppDay]?.reminderTimes?.length > 0
    ? formData.perDaySchedule[todayAppDay].reminderTimes
    : formData.reminderTimes;

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: isNew ? `${formData.type} Ekle` : "Düzenle",
          headerShown: true,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: isNew ? "#FFF" : themeColor },
          headerTintColor: isNew ? COLORS.text : "#FFF",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 15 }}>
              <Ionicons name="arrow-back" size={24} color={isNew ? COLORS.text : "#FFF"} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 15 }}>
              <Text style={{ color: isNew ? themeColor : "#FFF", fontWeight: "700", fontSize: 16 }}>
                İptal
              </Text>
            </TouchableOpacity>
          ),
        }}
      />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[styles.content, { maxWidth: contentMaxWidth, alignSelf: "center", width: "100%" }]}
          showsVerticalScrollIndicator={false}
        >

          {/* ───────────────── YENİ EKLEME MODU ───────────────── */}
          {isNew && (
            <View style={styles.form}>

              {/* Fotoğraf */}
              <View style={styles.imageContainer}>
                <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                  {formData.image ? (
                    <Image source={{ uri: formData.image }} style={styles.image} />
                  ) : (
                    <View style={[styles.imagePlaceholder, { backgroundColor: themeColor + "12" }]}>
                      <Ionicons name={formData.type === "İlaç" ? "medical" : "flask"} size={72} color={themeColor} />
                    </View>
                  )}
                  <View style={[styles.cameraBtn, { backgroundColor: themeColor }]}>
                    <Ionicons name="camera" size={20} color="white" />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.formSection}>
                <CustomInput
                  label="İsim"
                  value={formData.name}
                  onChangeText={(v) => updateFormData("name", v)}
                  placeholder="Örn: C Vitamini, Parasetamol"
                  error={errors.name}
                />

                <FrequencySelector
                  frequency={formData.frequency}
                  selectedDays={formData.selectedDays}
                  themeColor={themeColor}
                  isTablet={isTablet}
                  onFrequency={handleFrequencyChipPress}
                  onToggleDay={toggleDay}
                />

                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <CustomInput
                      label="Dozaj"
                      value={formData.dosage}
                      onChangeText={(v) => updateFormData("dosage", v)}
                      placeholder="Örn: 500"
                      error={errors.dosage}
                      keyboardType="numeric"
                      suffix="mg"
                    />
                  </View>
                  {formData.frequency !== "İhtiyaç Halinde" && (
                    <View style={{ flex: 1 }}>
                      <CounterInput
                        label="Günlük Kullanım"
                        value={formData.doseCount}
                        onIncrease={() => handleDoseCountChange(formData.doseCount + 1)}
                        onDecrease={() => handleDoseCountChange(formData.doseCount - 1)}
                      />
                    </View>
                  )}
                </View>

                <PerDaySection
                  formData={formData}
                  themeColor={themeColor}
                  differDosesPerDay={differDosesPerDay}
                  onToggle={() => setDifferDosesPerDay((v) => !v)}
                  onSaveDaySchedule={saveDaySchedule}
                />
              </View>

              {formData.frequency !== "İhtiyaç Halinde" && (
                <DoseTracker
                  reminderTimes={formData.reminderTimes}
                  item={item}
                  isNew={isNew}
                  themeColor={themeColor}
                  onTimePress={(i) => setShowPicker(i)}
                  onToggleDose={(i) => toggleDose(id, i)}
                />
              )}

              <View style={styles.notesSection}>
                <Text style={styles.label}>Kullanma Talimatı / Notlar</Text>
                <CustomInput
                  value={formData.noteText}
                  onChangeText={(v) => updateFormData("noteText", v)}
                  placeholder="Örn: Sabahları tok karın ile alınmalıdır"
                  multiline
                  style={styles.noteInput}
                />
              </View>

              <NotifToggle
                enabled={formData.notificationsEnabled}
                themeColor={themeColor}
                onToggle={() => updateFormData("notificationsEnabled", !formData.notificationsEnabled)}
              />

              <PrimaryButton title="Kaydet" onPress={handleSaveWithNotif} style={[styles.saveButton, { backgroundColor: themeColor }]} />
            </View>
          )}

          {/* ───────────────── DÜZENLEME MODU ───────────────── */}
          {!isNew && (
            <>
              <DetailHeader
                formData={formData}
                themeColor={themeColor}
                onImagePress={pickImage}
                onEditName={() => setEditField("name")}
                onEditDosage={() => setEditField("dosage")}
                onEditSchedule={() => setEditField("schedule")}
              />

              <View style={[styles.form, styles.formWithHeader]}>
                <DoseTracker
                  reminderTimes={editModeTimes}
                  item={item}
                  isNew={isNew}
                  themeColor={themeColor}
                  onTimePress={(i) => setShowPicker(i)}
                  onToggleDose={(i) => toggleDose(id, i)}
                  isActiveDay={isActiveDayForEdit}
                />

                <NoteTimeline
                  notes={item?.notes}
                  themeColor={themeColor}
                  onAddPress={() => setNoteModalVisible(true)}
                />

                <NotifToggle
                  enabled={formData.notificationsEnabled}
                  themeColor={themeColor}
                  onToggle={() => updateFormData("notificationsEnabled", !formData.notificationsEnabled)}
                />

                <PrimaryButton title="Değişiklikleri Kaydet" onPress={handleSaveWithNotif} style={[styles.saveButton, { backgroundColor: themeColor }]} />

                <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
                  <Ionicons name="trash-outline" size={18} color={themeColor} />
                  <Text style={[styles.deleteBtnText, { color: themeColor }]}>İlacı Sil</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <EditFieldModal
        visible={editField !== null}
        field={editField}
        formData={formData}
        themeColor={themeColor}
        onClose={() => setEditField(null)}
        onUpdate={updateFormData}
        onToggleDay={toggleDay}
        onDoseCountChange={handleDoseCountChange}
        onFrequencyChipPress={handleFrequencyChipPress}
        saveDaySchedule={saveDaySchedule}
        differDosesPerDay={differDosesPerDay}
        onSetDifferDosesPerDay={setDifferDosesPerDay}
        errors={errors}
      />

      <NoteModal
        visible={noteModalVisible}
        onClose={() => setNoteModalVisible(false)}
        noteText={formData.noteText}
        onChangeText={(v) => updateFormData("noteText", v)}
        onSave={handleAddNote}
        isAdding={isAddingNote}
        themeColor={themeColor}
      />

      {showPicker !== null && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={true}
          onChange={(e, date) => onTimeChange(e, date, showPicker)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  content:   { paddingBottom: 60 },
  form:      { padding: 20 },
  formWithHeader: { marginTop: -20 },

  imageContainer: { alignItems: "center", marginBottom: 30 },
  imagePicker: {
    width: "100%", height: 200,
    backgroundColor: "#1A1A1A",
    borderRadius: 30, overflow: "hidden",
    justifyContent: "center", alignItems: "center",
  },
  image:            { width: "100%", height: "100%", resizeMode: "cover" },
  imagePlaceholder: { alignItems: "center" },
  cameraBtn: {
    position: "absolute", bottom: 15, right: 15,
    width: 40, height: 40, borderRadius: 20,
    justifyContent: "center", alignItems: "center",
    borderWidth: 3, borderColor: "#1A1A1A",
  },

  formSection: { marginBottom: 20, marginTop: 20 },
  row:         { flexDirection: "row", alignItems: "flex-start", gap: 15 },
  label:       { fontSize: 14, fontWeight: "700", color: COLORS.text, marginBottom: 12, marginLeft: 4 },
  notesSection:{ marginBottom: 30 },
  noteInput:   { backgroundColor: "#FFF", minHeight: 100, borderRadius: 20 },
  saveButton:  { marginTop: 10, borderRadius: 24 },
  deleteBtn:   { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 25 },
  deleteBtnText: { fontWeight: "700", fontSize: 15 },
});
