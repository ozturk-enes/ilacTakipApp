/**
 * WaterCard.jsx
 * Su tüketimi kartı + modal (hızlı ekle, özel miktar, günlük hedef ayarı, sıfırla).
 * Günlük hedef bu kart üzerinden ayarlanır; profil sayfasında tekrar edilmez.
 */

import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import useResponsive from "../../hooks/useResponsive";
import useAppStore from "../../store/useAppStore";
import { playWaterSound } from "../../utils/sounds";
import { COLORS } from "../../theme/colors";
import { CommonStyles } from "../../theme/commonStyles";

const GOAL_PRESETS = [1500, 2000, 2500, 3000, 4000];

export default function WaterCard() {
  const waterIntake    = useAppStore((s) => s.waterIntake);
  const dailyWaterGoal = useAppStore((s) => s.dailyWaterGoal);
  const addWater       = useAppStore((s) => s.addWater);
  const resetWater     = useAppStore((s) => s.resetWater);
  const setDailyWaterGoal = useAppStore((s) => s.setDailyWaterGoal);

  const [modalVisible, setModalVisible] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [goalInput, setGoalInput]       = useState("");
  const [showGoalInput, setShowGoalInput] = useState(false);
  const { isTablet } = useResponsive();

  const glassSize = isTablet ? { width: 140, height: 180 } : { width: 110, height: 140 };
  const fillPercentage = Math.min(waterIntake / dailyWaterGoal, 1);

  const waveHeightStyle = useAnimatedStyle(() => ({
    height: withTiming(`${fillPercentage * 100}%`, { duration: 1000 }),
  }));

  const handleAddAmount = (amount) => {
    const val = parseInt(amount);
    if (val > 0) {
      playWaterSound();
      addWater(val);
      setModalVisible(false);
      setCustomAmount("");
    }
  };

  const handleSaveGoal = (value) => {
    const val = parseInt(value);
    if (isNaN(val) || val < 500 || val > 10000) return;
    setDailyWaterGoal(val);
    setShowGoalInput(false);
    setGoalInput("");
  };

  const handleReset = () => {
    resetWater();
    setModalVisible(false);
  };

  const closeModal = () => {
    setModalVisible(false);
    setCustomAmount("");
    setShowGoalInput(false);
    setGoalInput("");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => setModalVisible(true)}>

        {/* Başlık */}
        <View style={styles.header}>
          <View style={styles.iconBox}>
            <Ionicons name="water" size={20} color={COLORS.water} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>Su Tüketimi</Text>
            <Text style={styles.subtitle}>Hedefe dokunarak düzenle</Text>
          </View>
        </View>

        {/* İçerik */}
        <View style={styles.content}>
          {/* Bardak */}
          <View style={styles.glassContainer}>
            <View style={[styles.glass, glassSize]}>
              <Animated.View style={[styles.waterFill, waveHeightStyle]} />
              <Text style={styles.currentAmountText}>{waterIntake}</Text>
              <Text style={styles.mlLabelText}>ml</Text>
            </View>
          </View>

          {/* Hedef & ilerleme */}
          <View style={styles.targetInfo}>
            <Text style={styles.targetLabel}>Günlük Hedef</Text>
            <Text style={styles.targetValue}>{(dailyWaterGoal / 1000).toFixed(1)} L</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressBar, { width: `${fillPercentage * 100}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {Math.round(fillPercentage * 100)}% tamamlandı
            </Text>
          </View>
        </View>

        {/* Hızlı ekle */}
        <TouchableOpacity style={styles.quickAddBtn} onPress={() => { playWaterSound(); addWater(250); }} activeOpacity={0.7}>
          <Ionicons name="add" size={22} color="white" />
          <Text style={styles.quickAddText}>250 ml Ekle</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      {/* ─── Modal ─────────────────────────────────────────────────────── */}
      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={closeModal}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeModal}>
            <TouchableOpacity activeOpacity={1} style={styles.bottomSheet}>
              <View style={styles.sheetHandle} />
              <Text style={styles.modalTitle}>Su Takibi</Text>

              {/* ── Hızlı Ekle ── */}
              <Text style={styles.sectionLabel}>Hızlı Ekle</Text>
              <View style={styles.amountGrid}>
                {[100, 200, 300, 500].map((amount) => (
                  <TouchableOpacity key={amount} style={styles.amountBtn} onPress={() => handleAddAmount(amount)}>
                    <Ionicons name="water-outline" size={18} color={COLORS.water} />
                    <Text style={styles.amountBtnText}>{amount} ml</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* ── Özel Miktar ── */}
              <Text style={styles.sectionLabel}>Özel Miktar</Text>
              <View style={styles.customInputRow}>
                <TextInput
                  style={styles.customInput}
                  placeholder="Örn: 400"
                  placeholderTextColor={COLORS.textLight}
                  keyboardType="numeric"
                  value={customAmount}
                  onChangeText={setCustomAmount}
                  maxLength={4}
                />
                <TouchableOpacity
                  style={[styles.customAddBtn, !customAmount && styles.disabledBtn]}
                  onPress={() => handleAddAmount(customAmount)}
                  disabled={!customAmount}
                >
                  <Text style={styles.customAddBtnText}>Ekle</Text>
                </TouchableOpacity>
              </View>

              {/* ── Günlük Hedef ── */}
              <Text style={styles.sectionLabel}>Günlük Hedef</Text>

              {!showGoalInput ? (
                <View style={styles.goalRow}>
                  <View style={styles.goalDisplay}>
                    <Ionicons name="flag-outline" size={18} color={COLORS.water} />
                    <Text style={styles.goalDisplayText}>
                      Mevcut: <Text style={styles.goalDisplayValue}>{(dailyWaterGoal / 1000).toFixed(1)} L</Text>
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.changeGoalBtn} onPress={() => setShowGoalInput(true)}>
                    <Text style={styles.changeGoalBtnText}>Değiştir</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  {/* Preset hızlı hedefler */}
                  <View style={styles.goalPresets}>
                    {GOAL_PRESETS.map((g) => (
                      <TouchableOpacity
                        key={g}
                        style={[styles.goalPresetBtn, parseInt(goalInput) === g && styles.goalPresetBtnActive]}
                        onPress={() => setGoalInput(String(g))}
                      >
                        <Text style={[styles.goalPresetText, parseInt(goalInput) === g && styles.goalPresetTextActive]}>
                          {(g / 1000).toFixed(1)} L
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {/* Özel hedef girişi */}
                  <View style={styles.customInputRow}>
                    <TextInput
                      style={styles.customInput}
                      placeholder="Özel (ml)"
                      placeholderTextColor={COLORS.textLight}
                      keyboardType="numeric"
                      value={goalInput}
                      onChangeText={setGoalInput}
                      maxLength={5}
                      autoFocus
                    />
                    <TouchableOpacity
                      style={[styles.customAddBtn, { backgroundColor: COLORS.water }, !goalInput && styles.disabledBtn]}
                      onPress={() => handleSaveGoal(goalInput)}
                      disabled={!goalInput}
                    >
                      <Text style={styles.customAddBtnText}>Kaydet</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={styles.cancelGoalBtn} onPress={() => { setShowGoalInput(false); setGoalInput(""); }}>
                    <Text style={styles.cancelGoalText}>İptal</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* ── Sıfırla ── */}
              <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
                <Ionicons name="refresh-outline" size={20} color="#FF6347" />
                <Text style={styles.resetBtnText}>Günlük Veriyi Sıfırla</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeBtn} onPress={closeModal}>
                <Text style={styles.closeBtnText}>Kapat</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 10 },

  /* Kart */
  card: {
    backgroundColor: COLORS.water,
    borderRadius: CommonStyles.borderRadius.xLarge,
    padding: 24,
    shadowColor: COLORS.water,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },

  header: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 },
  iconBox: {
    width: 36,
    height: 36,
    backgroundColor: "white",
    borderRadius: CommonStyles.borderRadius.small,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: { flex: 1 },
  title: { fontSize: 22, fontWeight: "900", color: "white", letterSpacing: -0.5 },
  subtitle: { fontSize: 11, color: "rgba(255,255,255,0.75)", fontWeight: "600", marginTop: 2 },

  content: { flexDirection: "row", alignItems: "center", marginBottom: 25 },

  glassContainer: { flex: 0.45, alignItems: "flex-start" },
  glass: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: CommonStyles.borderRadius.large,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.4)",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  waterFill: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "white", opacity: 0.95 },
  currentAmountText: { fontSize: 28, fontWeight: "900", color: COLORS.water, zIndex: 10 },
  mlLabelText: { fontSize: 14, fontWeight: "800", color: COLORS.water, zIndex: 10, marginTop: -4 },

  targetInfo: { flex: 0.55, paddingLeft: 10 },
  targetLabel: { fontSize: 14, fontWeight: "700", color: "rgba(255,255,255,0.85)", marginBottom: 4 },
  targetValue: { fontSize: 26, fontWeight: "900", color: "white", marginBottom: 12 },
  progressTrack: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: { height: "100%", backgroundColor: "white", borderRadius: 3 },
  progressText: { fontSize: 11, color: "rgba(255,255,255,0.8)", fontWeight: "600", marginTop: 6 },

  quickAddBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    flexDirection: "row",
    paddingVertical: 16,
    borderRadius: CommonStyles.borderRadius.large,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  quickAddText: { color: "white", fontWeight: "900", fontSize: 17 },

  /* Modal */
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  bottomSheet: {
    backgroundColor: "white",
    padding: 24,
    paddingTop: 14,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: "100%",
  },
  sheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#E9ECEF",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 22, fontWeight: "800", color: "#1C1C1E", marginBottom: 20, textAlign: "center" },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.textLight,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
  },

  amountGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  amountBtn: {
    flex: 1,
    minWidth: "22%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F7FF",
    paddingVertical: 12,
    borderRadius: CommonStyles.borderRadius.medium,
    gap: 4,
    borderWidth: 1,
    borderColor: "#E1EFFF",
  },
  amountBtnText: { fontSize: 14, fontWeight: "800", color: COLORS.water },

  customInputRow: { flexDirection: "row", gap: 12, marginBottom: 16, alignItems: "center" },
  customInput: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E9ECEF",
    borderRadius: CommonStyles.borderRadius.medium,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  customAddBtn: {
    backgroundColor: COLORS.water,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: CommonStyles.borderRadius.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  customAddBtnText: { color: "white", fontSize: 15, fontWeight: "800" },
  disabledBtn: { opacity: 0.4 },

  /* Hedef ayarı */
  goalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F0F7FF",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  goalDisplay: { flexDirection: "row", alignItems: "center", gap: 8 },
  goalDisplayText: { fontSize: 14, fontWeight: "600", color: "#1C1C1E" },
  goalDisplayValue: { fontWeight: "900", color: COLORS.water },
  changeGoalBtn: {
    backgroundColor: COLORS.water,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  changeGoalBtnText: { color: "white", fontSize: 13, fontWeight: "800" },

  goalPresets: { flexDirection: "row", gap: 8, marginBottom: 12 },
  goalPresetBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
  },
  goalPresetBtnActive: { backgroundColor: "#E0F0FF" },
  goalPresetText: { fontSize: 13, fontWeight: "700", color: COLORS.textLight },
  goalPresetTextActive: { color: COLORS.water },

  cancelGoalBtn: { alignItems: "center", paddingVertical: 6, marginBottom: 8 },
  cancelGoalText: { fontSize: 14, color: COLORS.textLight, fontWeight: "600" },

  /* Sıfırla & Kapat */
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF5F5",
    paddingVertical: 16,
    borderRadius: CommonStyles.borderRadius.medium,
    gap: 10,
    borderWidth: 1,
    borderColor: "#FFE3E3",
    marginTop: 4,
    marginBottom: 12,
  },
  resetBtnText: { fontSize: 15, fontWeight: "800", color: "#FF6347" },
  closeBtn: { paddingVertical: 10, alignItems: "center" },
  closeBtnText: { fontSize: 16, fontWeight: "700", color: COLORS.textLight },
});
