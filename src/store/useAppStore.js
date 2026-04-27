import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Bugünün tarihini YYYY-MM-DD formatında döndürür
const getTodayKey = () => new Date().toISOString().split("T")[0];

// JS gün indexini (0=Pazar) uygulama indexine (0=Pazartesi) çevirir
const getAppDayIndex = () => {
  const jsDay = new Date().getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
};

// Bugünün programını döndürür (dailySchedule varsa gün bazlı, yoksa genel)
export const getTodaySchedule = (item) => {
  if (!item) return { doseCount: 1, times: ["08:00"], isActiveDay: false };

  // İhtiyaç Halinde = planlanmış doz yoktur
  if (item.frequency === "İhtiyaç Halinde") {
    return { doseCount: 0, times: [], isActiveDay: false };
  }

  const appDay = getAppDayIndex();

  if (item.dailySchedule && item.dailySchedule[appDay]) {
    const schedule = item.dailySchedule[appDay];
    return { doseCount: schedule.doseCount, times: schedule.times, isActiveDay: true };
  }

  // dailySchedule var ama bu gün içinde yok → bugün aktif değil
  if (item.dailySchedule) {
    return { doseCount: 0, times: [], isActiveDay: false };
  }

  // Eski sistem: selectedDays kontrolü
  if (item.frequency === "Belirli Günler" && item.selectedDays?.length > 0) {
    const isActiveDay = item.selectedDays.includes(appDay);
    return {
      doseCount: isActiveDay ? item.doseCount : 0,
      times: isActiveDay ? item.reminderTimes : [],
      isActiveDay,
    };
  }

  return { doseCount: item.doseCount, times: item.reminderTimes, isActiveDay: true };
};

// Eski array formatını ({ "tarih": [...] }) obje formatına dönüştürür (migration)
const migrateCompletedDoses = (completedDoses) => {
  if (Array.isArray(completedDoses)) {
    // Eski format: [0, 1, 2] → bugünün tarihine ata
    return completedDoses.length > 0
      ? { [getTodayKey()]: completedDoses }
      : {};
  }
  return completedDoses || {};
};

// Belirli bir gün için tamamlanan dozları döndürür
export const getCompletedDosesForDate = (completedDoses, dateKey) => {
  const migrated = migrateCompletedDoses(completedDoses);
  return migrated[dateKey] || [];
};

// Bugünün tamamlanan dozlarını döndürür
export const getTodayCompletedDoses = (completedDoses) =>
  getCompletedDosesForDate(completedDoses, getTodayKey());

const useAppStore = create(
  persist(
    (set) => ({
      // ── Kullanıcı profili ──────────────────────────────────────────────
      userProfile: {
        firstName: "",
        lastName: "",
        hasChronicDisease: false,
        chronicDiseases: [],       // string[]
      },
      updateUserProfile: (patch) =>
        set((state) => ({
          userProfile: { ...state.userProfile, ...patch },
        })),

      // Aktif kategori state'i
      activeCategory: "Tümü",
      setActiveCategory: (category) => set({ activeCategory: category }),

      // Su takibi state'i
      waterIntake: 0,
      waterDate: "",             // Son sıfırlama günü — YYYY-MM-DD
      dailyWaterGoal: 3000,
      waterHistory: {},          // { "YYYY-MM-DD": ml }
      addWater: (amount) =>
        set((state) => {
          const today = getTodayKey();
          const newIntake = state.waterIntake + amount;
          return {
            waterIntake: newIntake,
            waterDate: today,
            waterHistory: { ...state.waterHistory, [today]: newIntake },
          };
        }),
      resetWater: () => set({ waterIntake: 0, waterDate: getTodayKey() }),
      setDailyWaterGoal: (ml) => set({ dailyWaterGoal: ml }),
      // Yeni güne geçildiğinde su sayacını sıfırla — app açılışında çağrılır
      checkAndResetWater: () =>
        set((state) => {
          const today = getTodayKey();
          if (state.waterDate === today) return {};
          return { waterIntake: 0, waterDate: today };
        }),

      // Kalori takibi
      calorieGoal: 2000,                // kcal
      calorieLog: {},                   // { "YYYY-MM-DD": { consumed, goal } }
      logCalories: (consumed) =>
        set((state) => {
          const today = getTodayKey();
          return {
            calorieLog: {
              ...state.calorieLog,
              [today]: { consumed: Number(consumed), goal: state.calorieGoal },
            },
          };
        }),
      setCalorieGoal: (goal) => set({ calorieGoal: Number(goal) }),

      // Kilo takibi
      weightLog: [],                    // [{ id, date, value }]
      addWeightEntry: (value) =>
        set((state) => {
          const entry = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
            date: getTodayKey(),
            value: parseFloat(value),
          };
          return {
            weightLog: [...state.weightLog, entry].sort((a, b) =>
              a.date.localeCompare(b.date)
            ),
          };
        }),
      deleteWeightEntry: (entryId) =>
        set((state) => ({
          weightLog: state.weightLog.filter((e) => e.id !== entryId),
        })),

      // İlaç ve Takviye listesi
      items: [],

      // Yeni öğe eklemek için
      // newItem.id varsa kullanılır (bildirim planlamak için önce id bilinmeli)
      addItem: (newItem) =>
        set((state) => ({
          items: [
            ...state.items,
            {
              frequency: "Her Gün",
              selectedDays: [],
              reminderTimes: ["08:00"],
              doseCount: 1,
              dailySchedule: null,
              image: null,
              notificationsEnabled: false,
              notificationIds: [],      // [{ scheduleId, notifId }]
              ...newItem,
              // Bunlar her zaman temiz başlar (newItem'dan gelmez)
              id:
                newItem.id ||
                Date.now().toString(36) +
                  Math.random().toString(36).substr(2, 5),
              completedDoses: newItem.completedDoses || {},
              notes: newItem.notes || [],
            },
          ],
        })),

      // Detay sayfasından gelen güncellemeleri kaydetmek için
      updateItem: (id, updatedData) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updatedData } : item,
          ),
        })),

      // Yeni not/yorum eklemek için
      addNote: (itemId, noteText) =>
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === itemId) {
              const newNote = {
                id:
                  Date.now().toString(36) +
                  Math.random().toString(36).substr(2, 5),
                text: noteText,
                timestamp: new Date().toISOString(),
              };
              return {
                ...item,
                notes: [newNote, ...(item.notes || [])],
              };
            }
            return item;
          }),
        })),

      // Dozaj durumunu değiştir - tarih bazlı (İçildi/İçilmedi)
      toggleDose: (id, index) =>
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === id) {
              const today = getTodayKey();
              const migrated = migrateCompletedDoses(item.completedDoses);
              const todayDoses = migrated[today] || [];
              const isAlreadyCompleted = todayDoses.includes(index);

              return {
                ...item,
                completedDoses: {
                  ...migrated,
                  [today]: isAlreadyCompleted
                    ? todayDoses.filter((i) => i !== index)
                    : [...todayDoses, index],
                },
              };
            }
            return item;
          }),
        })),

      // Bildirim ID'lerini kaydet (planlama sonrası çağrılır)
      setNotificationIds: (id, notificationIds) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, notificationIds } : item
          ),
        })),

      // Öğeyi silmek için
      deleteItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      // Tüm verileri sıfırla (profil ekranından kullanılır)
      resetAll: () =>
        set({ items: [], waterIntake: 0, waterHistory: {}, calorieLog: {}, weightLog: [] }),
    }),
    {
      name: "ilacTakip-storage-v1",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        items: state.items,
        waterIntake: state.waterIntake,
        waterDate: state.waterDate,
        dailyWaterGoal: state.dailyWaterGoal,
        waterHistory: state.waterHistory,
        calorieGoal: state.calorieGoal,
        calorieLog: state.calorieLog,
        weightLog: state.weightLog,
        userProfile: state.userProfile,
      }),
    },
  ),
);

export default useAppStore;
