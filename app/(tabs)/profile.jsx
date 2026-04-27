/**
 * profile.jsx – Profil Sayfası
 *
 * Bölümler:
 *   1. Profil avatarı
 *   2. Kişisel bilgiler (ad, soyad, kronik hastalık serbest giriş)
 *   3. Bugünkü özet (ilaç, takviye, doz, su)
 *   4. Ayarlar (bildirimler)
 *   5. Veri yönetimi
 *   6. Uygulama hakkında
 *
 * Not: Günlük su hedefi home sayfasındaki WaterCard üzerinden ayarlanır.
 */

import { Ionicons } from "@expo/vector-icons";
import {
  Alert,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PersonalInfoCard from "../../src/components/profile/PersonalInfoCard";
import ProfileAvatar    from "../../src/components/profile/ProfileAvatar";
import SettingsMenuItem from "../../src/components/profile/SettingsMenuItem";
import TodaySummaryCard from "../../src/components/profile/TodaySummaryCard";
import { useProfile }   from "../../src/hooks/useProfile";
import useAppStore      from "../../src/store/useAppStore";
import useResponsive    from "../../src/hooks/useResponsive";
import { COLORS, withOpacity } from "../../src/theme/colors";

function SectionLabel({ title }) {
  return <Text style={styles.sectionLabel}>{title}</Text>;
}

function SettingsCard({ children }) {
  return <View style={styles.settingsCard}>{children}</View>;
}

export default function Profile() {
  const {
    userProfile,
    handleUpdateProfile,
    medicineCount,
    supplementCount,
    totalDoses,
    completedDoses,
    waterIntake,
    dailyWaterGoal,
    resetAll,
  } = useProfile();

  const notificationsEnabled = useAppStore((s) =>
    s.items.some((i) => i.notificationsEnabled)
  );

  const { isTablet, contentMaxWidth } = useResponsive();
  const avatarSize = isTablet ? 120 : 96;

  const handleResetAll = () => {
    Alert.alert(
      "Tüm Verileri Sıfırla",
      "İlaçlar, takviyeler, su ve sağlık kayıtlarınızın tamamı silinecek. Bu işlem geri alınamaz.",
      [
        { text: "Vazgeç", style: "cancel" },
        { text: "Sıfırla", style: "destructive", onPress: () => resetAll() },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { maxWidth: contentMaxWidth, alignSelf: "center", width: "100%" },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* ══ BÖLÜM 1: Avatar ══════════════════════════════════════════ */}
        <ProfileAvatar
          firstName={userProfile.firstName}
          lastName={userProfile.lastName}
          size={avatarSize}
        />

        {/* ══ BÖLÜM 2: Kişisel Bilgiler ════════════════════════════════ */}
        <SectionLabel title="KİŞİSEL BİLGİLER" />
        <PersonalInfoCard
          firstName={userProfile.firstName}
          lastName={userProfile.lastName}
          hasChronicDisease={userProfile.hasChronicDisease}
          chronicDiseases={userProfile.chronicDiseases}
          onSave={handleUpdateProfile}
        />

        {/* ══ BÖLÜM 3: Bugünkü Özet ════════════════════════════════════ */}
        <SectionLabel title="BUGÜNÜN ÖZETİ" />
        <TodaySummaryCard
          medicineCount={medicineCount}
          supplementCount={supplementCount}
          completedDoses={completedDoses}
          totalDoses={totalDoses}
          waterIntake={waterIntake}
          dailyWaterGoal={dailyWaterGoal}
        />

        {/* ══ BÖLÜM 4: Ayarlar ═════════════════════════════════════════ */}
        <SectionLabel title="AYARLAR" />
        <SettingsCard>
          <SettingsMenuItem
            icon="notifications-outline"
            iconColor={COLORS.supplement}
            label="Hatırlatıcı Bildirimleri"
            sublabel={notificationsEnabled ? "En az bir ilaçta açık" : "Tüm ilaçlarda kapalı"}
            isLast
            rightContent={
              <View
                style={[
                  styles.notifBadge,
                  {
                    backgroundColor: notificationsEnabled
                      ? withOpacity(COLORS.success, 0.12)
                      : "#F0F0F0",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.notifBadgeText,
                    { color: notificationsEnabled ? COLORS.success : COLORS.textLight },
                  ]}
                >
                  {notificationsEnabled ? "Açık" : "Kapalı"}
                </Text>
              </View>
            }
          />
        </SettingsCard>

        {/* ══ BÖLÜM 5: Veri Yönetimi ════════════════════════════════════ */}
        <SectionLabel title="VERİ YÖNETİMİ" />
        <SettingsCard>
          <SettingsMenuItem
            icon="trash-outline"
            iconColor={COLORS.primary}
            label="Tüm Verileri Sıfırla"
            sublabel="İlaçlar, takviyeler ve sağlık kayıtları"
            onPress={handleResetAll}
            danger
            isLast
          />
        </SettingsCard>

        {/* ══ BÖLÜM 6: Hakkında ════════════════════════════════════════ */}
        <SectionLabel title="UYGULAMA" />
        <SettingsCard>
          <SettingsMenuItem
            icon="information-circle-outline"
            iconColor={COLORS.textLight}
            label="Versiyon"
            sublabel="ilacTakip v1.0.0"
            rightContent={<View />}
            isLast
          />
        </SettingsCard>

        {/* Su hedefi hakkında bilgi notu */}
        <View style={styles.infoNote}>
          <Ionicons name="information-circle-outline" size={14} color={COLORS.water} />
          <Text style={styles.infoNoteText}>
            Günlük su hedefini Ana Sayfa'daki su kartından ayarlayabilirsin.
          </Text>
        </View>

        <View style={styles.footer}>
          <Ionicons name="heart" size={14} color={COLORS.primary} />
          <Text style={styles.footerText}>Sağlığınızı takip etmek için buradayız.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F9" },
  scroll: { padding: 16, paddingBottom: 24 },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.textLight,
    letterSpacing: 0.6,
    marginTop: 24,
    marginBottom: 10,
    marginLeft: 4,
  },

  settingsCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  notifBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  notifBadgeText: { fontSize: 12, fontWeight: "700" },

  infoNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 20,
    marginHorizontal: 4,
    backgroundColor: withOpacity("#4FACFE", 0.08),
    borderRadius: 12,
    padding: 12,
  },
  infoNoteText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.water,
    fontWeight: "600",
    lineHeight: 17,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 20,
    opacity: 0.6,
  },
  footerText: { fontSize: 12, color: COLORS.textLight, fontWeight: "600" },
});
