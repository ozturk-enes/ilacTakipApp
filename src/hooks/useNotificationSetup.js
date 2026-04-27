import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { setupNotificationHandler } from "../utils/notifications";

export function useNotificationSetup() {
  const router = useRouter();

  useEffect(() => {
    let subscription;

    (async () => {
      // Android channel kurulumu dahil — await ile garantili tamamla
      await setupNotificationHandler();

      // Cold start: uygulama kapalıyken tıklanan bildirim
      const response = await Notifications.getLastNotificationResponseAsync();
      const coldId = response?.notification?.request?.content?.data?.medicineId;
      if (coldId) router.push(`/detail/${coldId}`);
    })();

    // Uygulama açıkken / arka planda tıklanan bildirim
    subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const medicineId = response.notification.request.content.data?.medicineId;
        if (medicineId) router.push(`/detail/${medicineId}`);
      }
    );

    return () => subscription?.remove();
  }, []);
}
