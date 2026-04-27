import { useWindowDimensions } from "react-native";

/**
 * Responsive yardımcı hook.
 * Tablet / telefon ayrımı ve içerik için maksimum genişlik sağlar.
 * Değerler render sırasında hesaplanır; cihaz döndürülünce otomatik günceller.
 */
export default function useResponsive() {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 768;
  const isLargeTablet = width >= 1024;
  const isLandscape = width > height;
  // Form/kart container'larının max genişliği
  const contentMaxWidth = isLargeTablet ? 720 : isTablet ? 600 : width;

  return {
    width,
    height,
    isTablet,
    isLargeTablet,
    isLandscape,
    contentMaxWidth,
  };
}
