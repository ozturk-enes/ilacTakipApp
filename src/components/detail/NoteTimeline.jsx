import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../theme/colors";

export default function NoteTimeline({ notes, themeColor, onAddPress }) {
  return (
    <View style={styles.timelineSection}>
      <View style={styles.timelineHeader}>
        <Text style={styles.sectionTitle}>Durum Günlüğü</Text>
        <TouchableOpacity
          style={[
            styles.addNoteFloatingBtn,
            { backgroundColor: themeColor },
          ]}
          onPress={onAddPress}
        >
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addNoteBtnText}>Not Ekle</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.timeline}>
        {notes?.map((note, index) => (
          <View key={note.id} style={styles.timelineItem}>
            <View style={styles.timelineLine}>
              <View
                style={[
                  styles.timelineDot,
                  { backgroundColor: themeColor },
                ]}
              />
              {index !== notes.length - 1 && (
                <View style={styles.timelineConnector} />
              )}
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineDate}>
                {new Date(note.timestamp).toLocaleDateString("tr-TR")} -{" "}
                {new Date(note.timestamp).toLocaleTimeString("tr-TR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
              <Text style={styles.timelineText}>{note.text}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  timelineSection: { marginBottom: 30 },
  timelineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 15,
  },
  addNoteFloatingBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 5,
  },
  addNoteBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },
  timeline: { paddingLeft: 10 },
  timelineItem: { flexDirection: "row", minHeight: 60 },
  timelineLine: { width: 20, alignItems: "center" },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    zIndex: 1,
  },
  timelineConnector: { width: 2, flex: 1, backgroundColor: "#F0F0F0" },
  timelineContent: { flex: 1, paddingLeft: 15, paddingBottom: 20 },
  timelineDate: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: "600",
    marginBottom: 4,
  },
  timelineText: { fontSize: 14, color: COLORS.text, lineHeight: 20 },
});
