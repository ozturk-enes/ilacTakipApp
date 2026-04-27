/**
 * PersonalInfoCard.jsx
 * Ad / Soyad düzenlemesi ve Kronik Hastalık yönetimi.
 * Kronik hastalıklar serbest metin + etiket sistemiyle girilir.
 */

import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import SectionCard from "../common/SectionCard";
import TagInput from "../common/TagInput";
import { COLORS, withOpacity } from "../../theme/colors";

export default function PersonalInfoCard({
  firstName,
  lastName,
  hasChronicDisease,
  chronicDiseases,
  onSave,
}) {
  const [localFirst, setLocalFirst]         = useState(firstName);
  const [localLast, setLocalLast]           = useState(lastName);
  const [localHas, setLocalHas]             = useState(hasChronicDisease);
  const [localDiseases, setLocalDiseases]   = useState(chronicDiseases);
  const [dirty, setDirty]                   = useState(false);

  useEffect(() => {
    setLocalFirst(firstName);
    setLocalLast(lastName);
    setLocalHas(hasChronicDisease);
    setLocalDiseases(chronicDiseases);
    setDirty(false);
  }, [firstName, lastName, hasChronicDisease, chronicDiseases.join(",")]);

  const mark = () => setDirty(true);

  const handleSave = () => {
    onSave({
      firstName: localFirst.trim(),
      lastName: localLast.trim(),
      hasChronicDisease: localHas,
      chronicDiseases: localHas ? localDiseases : [],
    });
    setDirty(false);
  };

  return (
    <SectionCard icon="person" iconColor={COLORS.primary} title="Kişisel Bilgiler">

      {/* Ad / Soyad */}
      <View style={styles.row}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Ad</Text>
          <TextInput
            style={styles.input}
            value={localFirst}
            onChangeText={(v) => { setLocalFirst(v); mark(); }}
            placeholder="Adınız"
            placeholderTextColor="#BDBDBD"
            returnKeyType="next"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Soyad</Text>
          <TextInput
            style={styles.input}
            value={localLast}
            onChangeText={(v) => { setLocalLast(v); mark(); }}
            placeholder="Soyadınız"
            placeholderTextColor="#BDBDBD"
            returnKeyType="done"
          />
        </View>
      </View>

      {/* Kronik Hastalık Toggle */}
      <TouchableOpacity
        style={styles.toggleRow}
        onPress={() => { setLocalHas((v) => !v); mark(); }}
        activeOpacity={0.7}
      >
        <View style={styles.toggleLeft}>
          <View style={[styles.toggleIconBox, localHas && { backgroundColor: withOpacity("#FF6B6B", 0.12) }]}>
            <Ionicons
              name="heart-circle-outline"
              size={18}
              color={localHas ? "#FF6B6B" : COLORS.textLight}
            />
          </View>
          <View>
            <Text style={[styles.toggleLabel, localHas && { color: "#FF6B6B" }]}>
              Kronik Hastalık
            </Text>
            <Text style={styles.toggleHint}>
              {localHas
                ? localDiseases.length > 0
                  ? localDiseases.slice(0, 2).join(", ") +
                    (localDiseases.length > 2 ? ` +${localDiseases.length - 2}` : "")
                  : "Hastalıklarını aşağıya ekle"
                : "Kronik hastalığım yok"}
            </Text>
          </View>
        </View>
        <View style={[styles.switch, localHas && { backgroundColor: "#FF6B6B" }]}>
          <View style={[styles.switchThumb, localHas && styles.switchThumbOn]} />
        </View>
      </TouchableOpacity>

      {/* Serbest metin etiket girişi */}
      {localHas && (
        <View style={styles.tagSection}>
          <Text style={styles.tagHint}>Hastalık adını yazıp "+" butonuna bas</Text>
          <TagInput
            tags={localDiseases}
            onChange={(tags) => { setLocalDiseases(tags); mark(); }}
            placeholder="Örn: Diyabet, Hipertansiyon…"
            color="#FF6B6B"
          />
        </View>
      )}

      {/* Kaydet butonu – sadece değişiklik varsa */}
      {dirty && (
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
          <Ionicons name="checkmark" size={16} color="#FFF" />
          <Text style={styles.saveBtnText}>Kaydet</Text>
        </TouchableOpacity>
      )}
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 12, marginBottom: 14 },
  inputGroup: { flex: 1 },
  inputLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textLight,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#F4F4F6",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: "600",
    color: "#1C1C1E",
  },

  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    padding: 14,
    marginBottom: 4,
  },
  toggleLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  toggleIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EDEDF0",
    justifyContent: "center",
    alignItems: "center",
  },
  toggleLabel: { fontSize: 14, fontWeight: "700", color: "#1C1C1E" },
  toggleHint: { fontSize: 12, color: COLORS.textLight, marginTop: 2, fontWeight: "500" },

  switch: {
    width: 46,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#D1D1D6",
    padding: 3,
    justifyContent: "center",
  },
  switchThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  switchThumbOn: { alignSelf: "flex-end" },

  tagSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  tagHint: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: "600",
    marginBottom: 10,
    marginLeft: 2,
  },

  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 13,
  },
  saveBtnText: { color: "#FFF", fontSize: 14, fontWeight: "800" },
});
