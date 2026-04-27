let _sound = null;

export async function playWaterSound() {
  try {
    // Lazy import: native modül yoksa (eski dev build) sessizce geçer
    const { Audio } = await import("expo-av");
    if (!_sound) {
      const { sound } = await Audio.loadAsync(
        require("../../assets/sounds/water_drink.wav")
      );
      _sound = sound;
    }
    await _sound.setPositionAsync(0);
    await _sound.playAsync();
  } catch (_) {}
}
