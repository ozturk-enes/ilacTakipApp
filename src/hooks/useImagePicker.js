import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

export const useImagePicker = (initialImage = null) => {
  const [image, setImage] = useState(initialImage);
  const [error, setError] = useState(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setError("Galeri izni gerekiyor.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]) {
      setImage(result.assets[0].uri);
      setError(null);
    }
  };

  return { image, pickImage, error, setImage, setError };
};
