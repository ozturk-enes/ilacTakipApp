import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomSheetModal from "../../src/components/home/BottomSheetModal";
import CategorySelector from "../../src/components/home/CategorySelector";
import ItemCard from "../../src/components/home/ItemCard";
import WaterCard from "../../src/components/home/WaterCard";
import useResponsive from "../../src/hooks/useResponsive";
import useAppStore, {
  getTodayCompletedDoses,
} from "../../src/store/useAppStore";
import { COLORS, withOpacity } from "../../src/theme/colors";
import { CommonStyles } from "../../src/theme/commonStyles";

const HEADER_HEIGHT = 75; // Kategori barının yüksekliği

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const activeCategory = useAppStore((s) => s.activeCategory);
  const items = useAppStore((s) => s.items);
  const [modalVisible, setModalVisible] = useState(false);
  const { isTablet, contentMaxWidth, width } = useResponsive();

  const filteredItems =
    activeCategory === "Tümü"
      ? items
      : items.filter((item) => item.type === activeCategory);

  const sortedItems = [...filteredItems].sort((a, b) => {
    const aDone = getTodayCompletedDoses(a.completedDoses).length;
    const bDone = getTodayCompletedDoses(b.completedDoses).length;
    const isACompleted = aDone >= (a.doseCount || 1);
    const isBCompleted = bDone >= (b.doseCount || 1);

    if (isACompleted && !isBCompleted) return 1;
    if (!isACompleted && isBCompleted) return -1;
    return 0;
  });

  const handleAddNew = (type) => {
    setModalVisible(false);
    router.push({
      pathname: "/detail/new",
      params: { type },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Sabit Kategori Filtre Barı — top:0'dan başlar, paddingTop ile status bar'ı örter */}
      <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
        <CategorySelector />
      </View>

      <FlatList
          data={activeCategory === "Su" ? [] : sortedItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ItemCard item={item} />}
          contentContainerStyle={[
            styles.list,
            {
              paddingTop: insets.top + HEADER_HEIGHT + 10,
              maxWidth: contentMaxWidth,
              alignSelf: "center",
              width: "100%",
            },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            activeCategory !== "Su" ? (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="medkit-outline"
                  size={isTablet ? 72 : 56}
                  color={COLORS.textLight}
                />
                <Text
                  style={[styles.emptyTitle, { fontSize: isTablet ? 20 : 17 }]}
                >
                  Henüz ilaç veya takviye eklemediniz
                </Text>
                <Text style={styles.emptySub}>
                  Sağ alttaki + butonuna basarak başlayın
                </Text>
              </View>
            ) : null
          }
          ListHeaderComponent={
            <View>{activeCategory === "Su" ? <WaterCard /> : null}</View>
          }
          ListFooterComponent={activeCategory !== "Su" ? <WaterCard /> : null}
        />

        <TouchableOpacity
          style={[
            styles.fab,
            {
              width: isTablet ? 68 : 56,
              height: isTablet ? 68 : 56,
              bottom: isTablet ? 40 : 30,
              right: isTablet
                ? Math.max((width - contentMaxWidth) / 2 + 20, 40)
                : 20,
            },
          ]}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={isTablet ? 34 : 28} color="white" />
        </TouchableOpacity>

        <BottomSheetModal
          isVisible={modalVisible}
          onClose={() => setModalVisible(false)}
          title="Ne eklemek istersiniz?"
        >
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => handleAddNew("İlaç")}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.modalIconBg,
                  { backgroundColor: withOpacity(COLORS.primary, 0.08) },
                ]}
              >
                <Ionicons name="medical" size={32} color={COLORS.primary} />
              </View>
              <Text style={styles.modalBtnText}>İlaç</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => handleAddNew("Takviye")}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.modalIconBg,
                  { backgroundColor: withOpacity(COLORS.supplement, 0.08) },
                ]}
              >
                <Ionicons name="flask" size={32} color={COLORS.supplement} />
              </View>
              <Text style={styles.modalBtnText}>Takviye</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    ...CommonStyles.shadow,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 5,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
    gap: 10,
  },
  emptyTitle: {
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 12,
  },
  emptySub: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  fab: {
    position: "absolute",
    backgroundColor: COLORS.primary,
    borderRadius: CommonStyles.borderRadius.large,
    justifyContent: "center",
    alignItems: "center",
    ...CommonStyles.buttonShadow,
    zIndex: 999,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 60,
    marginBottom: 20,
    width: "100%",
  },
  modalBtn: {
    alignItems: "center",
    gap: 15,
  },
  modalIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBtnText: {
    fontWeight: "700",
    color: COLORS.text,
    fontSize: 17,
  },
});
