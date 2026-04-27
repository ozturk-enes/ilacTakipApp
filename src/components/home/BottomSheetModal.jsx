import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

const { width } = Dimensions.get('window');

export default function BottomSheetModal({ isVisible, onClose, title, children }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.bottomSheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.modalTitle}>{title}</Text>
          
          {children}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    justifyContent: 'flex-end' 
  },
  bottomSheet: { 
    backgroundColor: 'white', 
    padding: 30, 
    paddingTop: 15,
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24, 
    width: '100%', 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3
  },
  sheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#E9ECEF',
    borderRadius: 3,
    marginBottom: 25
  },
  modalTitle: { 
    fontSize: 22, 
    fontWeight: '800',
    fontFamily: "Inter_700Bold",
    marginBottom: 35, 
    color: COLORS.text,
    letterSpacing: -0.5
  },
});
