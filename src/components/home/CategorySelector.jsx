import { Ionicons } from "@expo/vector-icons";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import useAppStore from "../../store/useAppStore";
import { COLORS } from "../../theme/colors";
import { CommonStyles } from "../../theme/commonStyles";

const CATEGORIES = [
  { id: "Tümü", label: "Tümü", icon: "apps", color: COLORS.all },
  { id: "İlaç", label: "İlaç", icon: "medical", color: COLORS.primary },
  { id: "Takviye", label: "Takviye", icon: "flask", color: COLORS.supplement },
  { id: "Su", label: "Su", icon: "water", color: COLORS.water },
];

export default function CategorySelector() {
  const activeCategory = useAppStore((s) => s.activeCategory);
  const setActiveCategory = useAppStore((s) => s.setActiveCategory);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.tab,
                isActive && {
                  backgroundColor: cat.color,
                  borderColor: cat.color,
                  shadowColor: cat.color,
                },
              ]}
              onPress={() => setActiveCategory(cat.id)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconContainer,
                  isActive && styles.activeIconContainer,
                ]}
              >
                <Ionicons
                  name={cat.icon}
                  size={18}
                  color={isActive ? "white" : COLORS.textLight}
                />
              </View>
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF", // Ana Sayfa Header'ı ile uyumlu tam beyaz
    paddingVertical: 12,
  },
  scroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF", // Beyaz zemin
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: CommonStyles.borderRadius.large,
    borderWidth: 1,
    borderColor: "#F0F0F0", // Daha hafif ve modern gri
    ...CommonStyles.shadow,
    gap: 8,
  },
  activeIconContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: CommonStyles.borderRadius.medium,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "600",
  },
  activeTabText: {
    color: "white",
    fontWeight: "bold",
  },
});
