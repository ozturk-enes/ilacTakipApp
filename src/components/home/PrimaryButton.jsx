import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';
import { CommonStyles } from '../../theme/commonStyles';

export default function PrimaryButton({ title, onPress, style = {}, disabled = false }) {
  return (
    <TouchableOpacity 
      style={[
        styles.btn, 
        style, 
        disabled && styles.disabledBtn
      ]} 
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: CommonStyles.borderRadius.large,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    ...CommonStyles.buttonShadow,
  },
  text: {
    color: 'white',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  disabledBtn: {
    opacity: 0.6
  }
});
