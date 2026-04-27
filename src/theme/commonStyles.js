// src/theme/commonStyles.js
import { moderateScale } from "react-native-size-matters";
import { COLORS } from "./colors";

export const CommonStyles = {
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonShadow: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },
  // BURAYI GÜNCELLEDİK! Artık tabletlerde kıvrımlar da orantılı büyüyecek.
  borderRadius: {
    small: moderateScale(10),
    medium: moderateScale(16),
    large: moderateScale(24),
    xLarge: moderateScale(30),
    circle: 999, // Tam yuvarlak için bu sabit kalmalı, sorun yok.
  },
};
