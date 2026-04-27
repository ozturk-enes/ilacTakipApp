import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useResponsive from "../../hooks/useResponsive";
import { COLORS } from "../../theme/colors";
import { CommonStyles } from "../../theme/commonStyles";

export default function DetailHeader({
  formData,
  themeColor,
  onImagePress,
  onEditName,
  onEditDosage,
  onEditSchedule,
}) {
  const { isTablet } = useResponsive();

  return (
    <View style={[styles.headerArea, { backgroundColor: themeColor }]}>
      <View style={styles.headerInfo}>
        <TouchableOpacity
          style={[
            styles.headerImageContainer,
            isTablet && {
              height: 220,
              borderRadius: CommonStyles.borderRadius.xLarge,
            },
          ]}
          onPress={onImagePress}
          activeOpacity={onImagePress ? 0.8 : 1}
        >
          {formData.image ? (
            <Image
              source={{ uri: formData.image }}
              style={styles.headerImage}
            />
          ) : (
            <View style={styles.headerIconPlaceholder}>
              <Ionicons
                name={formData.type === "İlaç" ? "medical" : "flask"}
                size={isTablet ? 70 : 56}
                color="white"
              />
            </View>
          )}
          {onImagePress && (
            <View style={styles.cameraBtn}>
              <Ionicons name="camera" size={18} color="white" />
            </View>
          )}
        </TouchableOpacity>

        {/* İlaç Adı - tıklanabilir */}
        <TouchableOpacity
          style={styles.editableRow}
          onPress={onEditName}
          activeOpacity={0.7}
        >
          <Text style={styles.headerTitle}>{formData.name}</Text>
          <Ionicons
            name="pencil"
            size={14}
            color="rgba(255,255,255,0.6)"
            style={styles.editIcon}
          />
        </TouchableOpacity>

        {/* Dozaj + Talimat - tıklanabilir */}
        <TouchableOpacity
          style={styles.editableRow}
          onPress={onEditDosage}
          activeOpacity={0.7}
        >
          <Text style={styles.headerSubtitle}>
            {formData.dosage} - {formData.noteText || "Tok Karnına"}
          </Text>
          <Ionicons
            name="pencil"
            size={12}
            color="rgba(255,255,255,0.4)"
            style={styles.editIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Takvim Özeti - tıklanabilir */}
      <TouchableOpacity
        style={styles.summaryBox}
        onPress={onEditSchedule}
        activeOpacity={0.7}
      >
        <Ionicons
          name="calendar-outline"
          size={18}
          color="white"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.summaryText}>
          {formData.frequency === "Her Gün"
            ? "Her Gün"
            : formData.frequency === "Belirli Günler"
              ? `Haftada ${formData.selectedDays.length} Gün`
              : "İhtiyaç Halinde"}
          {formData.frequency !== "İhtiyaç Halinde" &&
            (Object.keys(formData.perDaySchedule ?? {}).length > 0
              ? " · Özel Kullanım"
              : ` · Günde ${formData.doseCount} Kez`)}
        </Text>
        <Ionicons
          name="pencil"
          size={12}
          color="rgba(255,255,255,0.4)"
          style={{ marginLeft: 8 }}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerArea: {
    padding: 25,
    paddingBottom: 40,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
  },
  headerInfo: { alignItems: "center", marginBottom: 25 },
  headerImageContainer: {
    width: "100%",
    height: 180,
    borderRadius: CommonStyles.borderRadius.large,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    overflow: "hidden",
  },
  cameraBtn: {
    position: "absolute",
    bottom: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  headerImage: { width: "100%", height: "100%", resizeMode: "cover" },
  headerIconPlaceholder: { alignItems: "center" },
  editableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
  },
  editIcon: {
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "600",
  },
  summaryBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    alignSelf: "center",
  },
  summaryText: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },
});
