import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// 1. DEĞİŞİKLİK: Artık üç dosyayı tek bir satırda "barrel" dosyamızdan çekiyoruz!
import { getTodayCompletedDoses, getTodaySchedule } from "../../store/useAppStore";
import { COLORS, CommonStyles, SIZES } from "../../theme";

export default function ItemCard({ item }) {
  const router = useRouter();

  const isAsNeeded = item.frequency === "İhtiyaç Halinde";
  const { doseCount: todayDoseCount } = getTodaySchedule(item);
  const totalDoses = isAsNeeded ? 0 : todayDoseCount || item.doseCount || 1;
  const todayDoses = getTodayCompletedDoses(item.completedDoses);
  const completedDosesCount = todayDoses.length;

  const isFullyCompleted = !isAsNeeded && completedDosesCount >= totalDoses;
  const progress = isAsNeeded ? 0 : Math.min(completedDosesCount / Math.max(totalDoses, 1), 1);

  const isDarkBg = !isFullyCompleted;

  // Dinamik arka plan rengi belirleme
  const getCardBgColor = () => {
    if (isFullyCompleted) return COLORS.card;
    if (item.type === "İlaç") return COLORS.primary;
    if (item.type === "Takviye") return COLORS.supplement;
  };

  const getShadowColor = () => {
    if (isFullyCompleted) return "#000";
    if (item.type === "İlaç") return COLORS.primary;
    if (item.type === "Takviye") return COLORS.supplement;
    return "#000";
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: getCardBgColor(),
          shadowColor: getShadowColor(),
        },
        isFullyCompleted && styles.cardCompleted,
      ]}
      onPress={() => router.push(`/detail/${item.id}`)}
      activeOpacity={0.85}
    >
      <View style={styles.content}>
        <View
          style={[
            styles.iconContainer,
            item.image
              ? styles.iconContainerWithImage
              : [
                  isDarkBg && { backgroundColor: "rgba(255, 255, 255, 0.25)" },
                  isFullyCompleted && { backgroundColor: "#F8F9FA" },
                ],
          ]}
        >
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              style={styles.itemImage}
              resizeMode="cover"
            />
          ) : (
            <Ionicons
              name={item.type === "İlaç" ? "medical" : "flask"}
              size={SIZES.iconSmall}
              color={isDarkBg ? "white" : COLORS.textLight}
            />
          )}
        </View>

        <View style={styles.info}>
          <Text
            numberOfLines={1}
            style={[
              styles.title,
              isDarkBg && { color: "white" },
              isFullyCompleted && styles.textCompleted,
            ]}
          >
            {item.name}
          </Text>
          <Text
            style={[
              styles.sub,
              isDarkBg && { color: "rgba(255, 255, 255, 0.9)" },
              isFullyCompleted && { color: COLORS.textLight },
            ]}
          >
            {item.dosage}
            {isAsNeeded
              ? " • İhtiyaç Halinde"
              : ` • ${completedDosesCount}/${totalDoses} Doz`}
          </Text>

          {/* Progress Bar */}
          <View
            style={[
              styles.progressContainer,
              isDarkBg
                ? { backgroundColor: "rgba(255, 255, 255, 0.25)" }
                : { backgroundColor: "#F0F0F0" },
            ]}
          >
            <View
              style={[
                styles.progressBar,
                { width: `${progress * 100}%` },
                isDarkBg
                  ? { backgroundColor: "white" }
                  : { backgroundColor: COLORS.success },
              ]}
            />
          </View>
        </View>

        <View style={styles.action}>
          {isFullyCompleted ? (
            <Ionicons
              name="checkmark-circle"
              size={SIZES.iconLarge} // Dinamik ikon boyutu
              color={COLORS.success}
            />
          ) : (
            <View style={styles.arrowIcon}>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

// 4. DEĞİŞİKLİK: Stillerdeki sabit sayılar SIZES ile değiştirildi!
const styles = StyleSheet.create({
  card: {
    padding: SIZES.padding,
    borderRadius: CommonStyles.borderRadius.large,
    ...CommonStyles.cardShadow,
    marginBottom: SIZES.margin,
    width: "100%",
    borderWidth: 1,
    borderColor: "transparent",
  },
  cardCompleted: {
    backgroundColor: "#FFFFFF",
    borderColor: "#F0F0F0",
    shadowOpacity: 0.05,
    elevation: 2,
    opacity: 0.9,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconContainer: {
    width: SIZES.iconBox,
    height: SIZES.iconBox,
    borderRadius: CommonStyles.borderRadius.large,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainerWithImage: {
    width: SIZES.iconBox,
    height: SIZES.iconBox,
    borderRadius: CommonStyles.borderRadius.large,
    overflow: "hidden",
    backgroundColor: "#F0F0F0",
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },
  info: { flex: 1 },
  title: {
    fontSize: SIZES.title, // Temadan geliyor
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.6,
  },
  textCompleted: { color: COLORS.textLight, opacity: 0.6 },
  sub: {
    fontSize: SIZES.subTitle, // Temadan geliyor
    marginTop: 4,
    fontWeight: "700",
  },
  progressContainer: {
    height: 6,
    borderRadius: CommonStyles.borderRadius.small,
    marginTop: 12,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: CommonStyles.borderRadius.small,
  },
  action: {
    marginLeft: 8,
  },
  arrowIcon: {
    width: 32,
    height: 32,
    borderRadius: CommonStyles.borderRadius.medium,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
});
