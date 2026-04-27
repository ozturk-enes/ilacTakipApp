/**
 * ProfileAvatar.jsx
 * Kullanıcı avatarı – baş harfler veya isim gösterimi.
 */

import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../theme/colors";

export default function ProfileAvatar({
  firstName = "",
  lastName = "",
  size = 100,
}) {
  const initials =
    ((firstName[0] ?? "") + (lastName[0] ?? "")).toUpperCase() || "?";

  const displayName =
    firstName || lastName ? `${firstName} ${lastName}`.trim() : "Kullanıcı";

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.avatarRing,
          { width: size + 8, height: size + 8, borderRadius: (size + 8) / 2 },
        ]}
      >
        <View
          style={[
            styles.initialsCircle,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          <Text style={[styles.initials, { fontSize: size * 0.32 }]}>
            {initials}
          </Text>
        </View>
      </View>

      <Text style={styles.displayName}>{displayName}</Text>
      <Text style={styles.hint}>Aşağıdan kişisel bilgilerini düzenleyebilirsin</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: "center", paddingTop: 10, paddingBottom: 4 },

  avatarRing: {
    borderWidth: 3,
    borderColor: COLORS.primary + "30",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  initialsCircle: {
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  initials: { color: "#FFF", fontWeight: "900", letterSpacing: -1 },

  displayName: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1C1C1E",
    letterSpacing: -0.5,
  },
  hint: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 6,
    fontWeight: "500",
    textAlign: "center",
  },
});
