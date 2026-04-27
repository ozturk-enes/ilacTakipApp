/**
 * googleAuth.js  –  Google Sign-In katmanı
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ŞUAN: STUB modunda — UI çalışır, gerçek auth yapılmaz.
 * ──────────────────────────────────────────────────────────────────────────
 *
 * ETKİNLEŞTİRMEK İÇİN:
 *   1. `npm install expo-auth-session expo-crypto`
 *   2. app.json  →  "scheme": "ilactakip"  (zaten var)
 *   3. Google Cloud Console → OAuth 2.0 Client ID oluştur
 *      - Android  : SHA-1 fingerprint + paket adı
 *      - iOS      : Bundle ID
 *      - Web      : Authorized redirect URI = https://auth.expo.io/@username/ilactakip
 *   4. Aşağıdaki STUB bloğunu kaldırıp ACTIVE bloğunu yorum satırından çıkar.
 *   5. `eas build` ile native build al (Expo Go'da çalışmaz).
 */

// ─── Client ID'ler (doldurun) ──────────────────────────────────────────────
export const GOOGLE_CLIENT_IDS = {
  androidClientId: "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
  iosClientId:     "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
  webClientId:     "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
};

// ══ STUB (şu an aktif) ════════════════════════════════════════════════════
export function useGoogleAuth() {
  return {
    /** null → auth hazır değil, gerçek impla geçince request objesi olacak */
    request: null,
    /** Çağrıldığında "Yakında" alert'i gösterir */
    promptAsync: async () => {
      const { Alert } = require("react-native");
      Alert.alert(
        "Google Girişi",
        "Google ile giriş özelliği yakında eklenecek.\n\nKurulum için src/utils/googleAuth.js dosyasına bakın.",
        [{ text: "Tamam" }]
      );
    },
    /** response şimdilik her zaman null */
    response: null,
  };
}

export async function fetchGoogleUserInfo(accessToken) {
  const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  return {
    name:  data.name        ?? "",
    email: data.email       ?? "",
    photo: data.picture     ?? null,
    firstName: data.given_name  ?? "",
    lastName:  data.family_name ?? "",
  };
}

// ══ ACTIVE (expo-auth-session kurulunca bu bloğu kullan) ══════════════════
//
// import * as Google     from "expo-auth-session/providers/google";
// import * as WebBrowser from "expo-web-browser";
// WebBrowser.maybeCompleteAuthSession();
//
// export function useGoogleAuth() {
//   const [request, response, promptAsync] = Google.useAuthRequest(GOOGLE_CLIENT_IDS);
//   return { request, response, promptAsync };
// }
