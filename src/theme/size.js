// src/theme/sizes.js
import { moderateScale, scale } from "react-native-size-matters";

export const SIZES = {
  // Fontlar
  h1: moderateScale(24),
  title: moderateScale(19),
  subTitle: moderateScale(14),

  // İkon ve Kutu Boyutları
  iconBox: scale(56),
  iconSmall: moderateScale(22),
  iconLarge: moderateScale(28),

  // Standart Boşluklar (Padding/Margin)
  padding: moderateScale(20),
  margin: moderateScale(16),
};
