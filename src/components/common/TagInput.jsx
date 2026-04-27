/**
 * TagInput – Serbest metin etiket girişi.
 * Kullanıcı metin yazar, "Ekle" butonuna basar veya Return'e basar → etiket oluşur.
 * Her etikette × butonu ile silme desteği.
 *
 * Props:
 *   tags        string[]          – Mevcut etiketler
 *   onChange    (tags: string[]) => void
 *   placeholder string            – Input placeholder
 *   color       string            – Etiket rengi (opsiyonel)
 */

import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS, withOpacity } from "../../theme/colors";

export default function TagInput({
  tags = [],
  onChange,
  placeholder = "Yazın ve ekleyin…",
  color = "#FF6B6B",
}) {
  const [inputValue, setInputValue] = useState("");

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || tags.includes(trimmed)) {
      setInputValue("");
      return;
    }
    onChange([...tags, trimmed]);
    setInputValue("");
  };

  const removeTag = (tag) => {
    onChange(tags.filter((t) => t !== tag));
  };

  return (
    <View>
      {/* Input satırı */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder={placeholder}
          placeholderTextColor="#BDBDBD"
          returnKeyType="done"
          onSubmitEditing={addTag}
          blurOnSubmit={false}
        />
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: color }, !inputValue.trim() && styles.addBtnDisabled]}
          onPress={addTag}
          disabled={!inputValue.trim()}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Etiket listesi */}
      {tags.length > 0 && (
        <View style={styles.tagsWrap}>
          {tags.map((tag) => (
            <View key={tag} style={[styles.tag, { backgroundColor: withOpacity(color, 0.1), borderColor: color }]}>
              <Text style={[styles.tagText, { color }]}>{tag}</Text>
              <TouchableOpacity onPress={() => removeTag(tag)} hitSlop={6}>
                <Ionicons name="close" size={13} color={color} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {tags.length === 0 && (
        <Text style={styles.emptyHint}>Henüz hastalık eklenmedi</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#F4F4F6",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  addBtnDisabled: {
    opacity: 0.35,
  },
  tagsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  tagText: {
    fontSize: 13,
    fontWeight: "700",
  },
  emptyHint: {
    fontSize: 12,
    color: "#BDBDBD",
    fontWeight: "500",
    marginTop: 10,
    marginLeft: 4,
  },
});
