/**
 * notifications.js
 *
 * Bildirim planlama / iptal etme yardımcı fonksiyonları.
 * Backend-uyumlu payload yapısı kullanır (medicineId, scheduleId, doseIndex…)
 * böylece ileride Supabase / Firebase'e geçişte sadece bu dosya güncellenir.
 */

import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

// ─── Foreground gösterim davranışı ─────────────────────────────────────────
export async function setupNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "İlaç Hatırlatıcılar",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      // res/raw/medicine_notification.wav → EAS Build tarafından kopyalanır
      sound: "medicine_notification",
    });
  }
}

// ─── İzin isteme ───────────────────────────────────────────────────────────
export async function requestNotificationPermissions() {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === "granted") return true;

  const { status } = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowBadge: true, allowSound: true },
  });
  return status === "granted";
}

// ─── Gün index dönüşümü ────────────────────────────────────────────────────
// Uygulama: Pzt=0 … Paz=6
// expo-notifications weekday: Paz=1, Pzt=2 … Cmt=7
const appDayToWeekday = (appDay) => (appDay === 6 ? 1 : appDay + 2);

// ─── Backend-uyumlu payload ────────────────────────────────────────────────
/**
 * @example
 * {
 *   medicineId:   "k8x2abc",
 *   scheduleId:   "k8x2abc_day2_dose1",
 *   doseIndex:    1,
 *   time:         "14:00",
 *   dayIndex:     2,          // null → her gün
 *   medicineName: "C Vitamini",
 *   deepLink:     "/detail/k8x2abc"
 * }
 */
const buildPayload = (item, doseIndex, time, dayIndex = null) => ({
  medicineId: item.id,
  scheduleId: `${item.id}_day${dayIndex ?? "all"}_dose${doseIndex}`,
  doseIndex,
  time,
  dayIndex,
  medicineName: item.name,
  deepLink: `/detail/${item.id}`,
});

// ─── Tek bildirim planla ───────────────────────────────────────────────────
async function scheduleOne(item, doseIndex, time, trigger) {
  const payload = buildPayload(item, doseIndex, time, trigger.weekday ?? null);

  const notifId = await Notifications.scheduleNotificationAsync({
    content: {
      title: `💊 ${item.name}`,
      body: `${time} — ${doseIndex + 1}. doz zamanı geldi.`,
      data: payload,
      // iOS: bundled ses dosyası; Android: channel sound kullanılır
      sound: "medicine_notification.wav",
    },
    trigger,
  });

  return { scheduleId: payload.scheduleId, notifId };
}

// ─── İlaca ait TÜM bildirimleri planla ────────────────────────────────────
/**
 * Kaydedilmiş tüm eski bildirimler iptal edilip yeniden planlanır (idempotent).
 * @returns {Promise<Array<{scheduleId: string, notifId: string}>>}
 */
export async function scheduleItemNotifications(item) {
  if (!item.notificationsEnabled) return [];
  if (item.frequency === "İhtiyaç Halinde") return [];

  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return [];

  // Eski bildirimleri temizle (idempotency)
  await cancelItemNotifications(item);

  const notificationIds = [];

  // ── dailySchedule varsa → güne özel haftalık tekrar ──────────────────
  if (item.dailySchedule) {
    for (const [dayStr, schedule] of Object.entries(item.dailySchedule)) {
      const weekday = appDayToWeekday(parseInt(dayStr, 10));
      for (let i = 0; i < schedule.times.length; i++) {
        const [hour, minute] = schedule.times[i].split(":").map(Number);
        const result = await scheduleOne(item, i, schedule.times[i], {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday,
          hour,
          minute,
        });
        notificationIds.push(result);
      }
    }
    return notificationIds;
  }

  // ── Her Gün → günlük tekrar ───────────────────────────────────────────
  if (item.frequency === "Her Gün") {
    for (let i = 0; i < item.reminderTimes.length; i++) {
      const [hour, minute] = item.reminderTimes[i].split(":").map(Number);
      const result = await scheduleOne(item, i, item.reminderTimes[i], {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      });
      notificationIds.push(result);
    }
    return notificationIds;
  }

  // ── Belirli Günler → seçili her gün için haftalık tekrar ─────────────
  if (item.frequency === "Belirli Günler") {
    for (const appDay of item.selectedDays) {
      const weekday = appDayToWeekday(appDay);
      for (let i = 0; i < item.reminderTimes.length; i++) {
        const [hour, minute] = item.reminderTimes[i].split(":").map(Number);
        const result = await scheduleOne(item, i, item.reminderTimes[i], {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday,
          hour,
          minute,
        });
        notificationIds.push(result);
      }
    }
  }

  return notificationIds;
}

// ─── İlaca ait tüm bildirimleri iptal et ──────────────────────────────────
export async function cancelItemNotifications(item) {
  if (!item.notificationIds?.length) return;
  await Promise.all(
    item.notificationIds.map(({ notifId }) =>
      Notifications.cancelScheduledNotificationAsync(notifId).catch(() => {})
    )
  );
}
