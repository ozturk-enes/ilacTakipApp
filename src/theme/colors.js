export const COLORS = {
  primary: "#FF5A5F",    // İlaç - Kırmızımsı
  supplement: "#FFB347", // Takviye - Turuncu/Sarı
  all: "#6C5CE7",        // Tümü - Mor
  background: "#F7F7F9",
  card: "#FFFFFF",
  text: "#222222",
  textLight: "#717171",
  water: "#4FACFE",      // Su - Mavi
  calorie: "#FF9500",    // Kalori - Turuncu
  weight: "#AF52DE",     // Kilo - Mor
  border: "#EBEBEB",
  success: "#34C759",    // Tamamlanan dozlar için yeşil
};

// Hex renk koduna opacity ekler: withOpacity(COLORS.primary, 0.08) → "#FF5A5F15"
export const withOpacity = (hexColor, opacity) => {
  const hex = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, "0");
  return hexColor + hex;
};
