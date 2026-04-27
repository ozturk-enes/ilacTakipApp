/**
 * PerDaySection
 *
 * "Güne Göre Farklı Program" toggle + gün kartları + gün düzenleme modal'ı.
 *
 * Tasarım prensibi:
 *   • Toggle kapalıyken: sadece başlık satırı görünür (compact).
 *   • Toggle açıkken: aktif günler için küçük, dokunulabilir kart sırası gösterilir.
 *     – Global varsayılanla aynı gün → açık gri kart
 *     – Override'ı olan gün → tema rengiyle vurgulu kart + rozet
 *   • Herhangi bir karta tıklandığında alt modal açılır:
 *     – Gün adı başlığı
 *     – Doz sayacı (CounterInput)
 *     – DoseTracker stiliyle saat kartları (büyük dokunma alanı)
 *     – "Varsayılana Dön" (override varsa)
 *     – "Kaydet" butonu
 */

import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import useResponsive from '../../hooks/useResponsive';
import { COLORS, withOpacity } from '../../theme/colors';

const DAYS_SHORT = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const DAYS_FULL  = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
const DOSE_ICONS = ['sunny-outline', 'partly-sunny-outline', 'moon-outline'];

const timesEqual = (a, b) => {
  if (!a || !b || a.length !== b.length) return false;
  return [...a].sort().every((v, i) => v === [...b].sort()[i]);
};

export default function PerDaySection({
  formData,
  themeColor,
  differDosesPerDay,
  onToggle,
  onSaveDaySchedule,
}) {
  const { isTablet } = useResponsive();

  /* ─── Day edit modal state ─────────────────────────────────────────── */
  const [editingDay, setEditingDay]     = useState(null);   // dayIdx | null
  const [localCount, setLocalCount]     = useState(1);
  const [localTimes, setLocalTimes]     = useState([]);
  const [showTimePicker, setShowTimePicker] = useState(null); // timeIdx | null

  /* ─── Helpers ──────────────────────────────────────────────────────── */
  const activeDays =
    formData.frequency === 'Her Gün' ? [0, 1, 2, 3, 4, 5, 6] : formData.selectedDays;

  // Birden fazla aktif gün yoksa gösterme
  if (activeDays.length <= 1 || formData.frequency === 'İhtiyaç Halinde') return null;

  const getDayData = (dayIdx) => {
    const override = formData.perDaySchedule?.[dayIdx];
    return {
      doseCount:     override?.doseCount     ?? formData.doseCount,
      reminderTimes: override?.reminderTimes ?? formData.reminderTimes,
      hasOverride:   !!override,
    };
  };

  /* ─── Modal open / close ───────────────────────────────────────────── */
  const openDayModal = (dayIdx) => {
    const { doseCount, reminderTimes } = getDayData(dayIdx);
    setLocalCount(doseCount);
    setLocalTimes([...reminderTimes]);
    setEditingDay(dayIdx);
  };

  const closeDayModal = () => {
    setEditingDay(null);
    setShowTimePicker(null);
  };

  /* ─── Local count change (adjusts times array) ─────────────────────── */
  const handleLocalCountChange = (count) => {
    const num = Math.max(1, count);
    const times = [...localTimes];
    if (num > times.length) {
      while (times.length < num) times.push('12:00');
    } else {
      times.splice(num);
    }
    setLocalCount(num);
    setLocalTimes([...times].sort());
  };

  /* ─── Save day changes (atomic) ────────────────────────────────────── */
  const handleSave = () => {
    onSaveDaySchedule(editingDay, {
      doseCount: localCount,
      reminderTimes: [...localTimes].sort(),
    });
    closeDayModal();
  };

  /* ─── Reset to global default ──────────────────────────────────────── */
  const handleResetToDefault = () => {
    setLocalCount(formData.doseCount);
    setLocalTimes([...formData.reminderTimes]);
  };

  /* ─── How many days have overrides (badge on toggle) ───────────────── */
  const overrideCount = Object.keys(formData.perDaySchedule ?? {}).filter((k) =>
    activeDays.includes(parseInt(k))
  ).length;

  const cardSize = isTablet ? 68 : 56;

  return (
    <View style={styles.wrapper}>
      {/* ── Toggle row ── */}
      <TouchableOpacity
        style={styles.toggleRow}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.toggleIconBox,
            differDosesPerDay && { backgroundColor: withOpacity(themeColor, 0.12) },
          ]}
        >
          <Ionicons
            name="calendar-outline"
            size={18}
            color={differDosesPerDay ? themeColor : COLORS.textLight}
          />
        </View>

        <View style={styles.toggleTextBox}>
          <Text
            style={[
              styles.toggleLabel,
              differDosesPerDay && { color: themeColor },
            ]}
          >
            Güne Göre Farklı Program
          </Text>
          <Text style={styles.toggleHint}>
            {differDosesPerDay && overrideCount > 0
              ? `${overrideCount} günde özel program`
              : 'Her gün için ayrı doz ve saat'}
          </Text>
        </View>

        {/* iOS-style switch */}
        <View
          style={[
            styles.switch,
            differDosesPerDay && { backgroundColor: themeColor },
          ]}
        >
          <View
            style={[
              styles.switchThumb,
              differDosesPerDay && styles.switchThumbOn,
            ]}
          />
        </View>
      </TouchableOpacity>

      {/* ── Day cards ── */}
      {differDosesPerDay && (
        <View style={styles.cardsWrapper}>
          <View style={styles.cardsRow}>
            {activeDays.map((dayIdx) => {
              const { doseCount, hasOverride } = getDayData(dayIdx);
              return (
                <TouchableOpacity
                  key={dayIdx}
                  style={[
                    styles.dayCard,
                    {
                      height: cardSize,
                      backgroundColor: hasOverride
                        ? withOpacity(themeColor, 0.10)
                        : '#F4F4F6',
                      borderColor: hasOverride ? themeColor : 'transparent',
                      borderWidth: hasOverride ? 1.5 : 0,
                    },
                  ]}
                  onPress={() => openDayModal(dayIdx)}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.dayCardName,
                      { color: hasOverride ? themeColor : COLORS.textLight },
                    ]}
                  >
                    {DAYS_SHORT[dayIdx]}
                  </Text>
                  <Text
                    style={[
                      styles.dayCardDose,
                      { color: hasOverride ? themeColor : COLORS.text },
                    ]}
                  >
                    {doseCount}×
                  </Text>
                  {hasOverride && (
                    <View style={[styles.overrideDot, { backgroundColor: themeColor }]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={styles.cardsHint}>
            Güne dokunarak doz ve saati özelleştir
          </Text>
        </View>
      )}

      {/* ── Day Edit Modal ── */}
      <Modal
        visible={editingDay !== null}
        animationType="slide"
        transparent
        onRequestClose={closeDayModal}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={closeDayModal}
        >
          <TouchableOpacity
            style={[styles.sheet, isTablet && styles.sheetTablet]}
            activeOpacity={1}
            onPress={() => {}}
          >
            {/* Handle */}
            <View style={styles.handle} />

            {/* Header */}
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetTitle}>
                  {editingDay !== null ? DAYS_FULL[editingDay] : ''} Programı
                </Text>
                {editingDay !== null && getDayData(editingDay).hasOverride && (
                  <Text style={[styles.sheetSubtitle, { color: themeColor }]}>
                    Özel program aktif
                  </Text>
                )}
              </View>
              <TouchableOpacity onPress={closeDayModal} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
              {/* Dose counter */}
              <Text style={styles.sectionLabel}>Günlük Kullanım</Text>
              <View style={styles.counterRow}>
                <TouchableOpacity
                  style={[
                    styles.counterBtn,
                    localCount <= 1 && styles.counterBtnDisabled,
                  ]}
                  onPress={() => handleLocalCountChange(localCount - 1)}
                  disabled={localCount <= 1}
                >
                  <Ionicons
                    name="remove"
                    size={22}
                    color={localCount <= 1 ? '#CCC' : themeColor}
                  />
                </TouchableOpacity>

                <View style={styles.counterValueBox}>
                  <Text style={styles.counterValue}>{localCount}</Text>
                  <Text style={styles.counterUnit}>doz / gün</Text>
                </View>

                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => handleLocalCountChange(localCount + 1)}
                >
                  <Ionicons name="add" size={22} color={themeColor} />
                </TouchableOpacity>
              </View>

              {/* Time cards */}
              <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Doz Saatleri</Text>
              {localTimes.map((time, tIdx) => (
                <TouchableOpacity
                  key={tIdx}
                  style={styles.timeCard}
                  onPress={() => setShowTimePicker(tIdx)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.timeIconBox,
                      { backgroundColor: withOpacity(themeColor, 0.08) },
                    ]}
                  >
                    <Ionicons
                      name={DOSE_ICONS[tIdx % 3]}
                      size={isTablet ? 22 : 18}
                      color={themeColor}
                    />
                  </View>
                  <View style={styles.timeInfo}>
                    <Text style={styles.timeDoseLabel}>{tIdx + 1}. Doz</Text>
                    <Text style={styles.timeValue}>{time}</Text>
                  </View>
                  <View style={styles.timeEditBadge}>
                    <Ionicons name="pencil-sharp" size={13} color={themeColor} />
                    <Text style={[styles.timeEditText, { color: themeColor }]}>
                      Düzenle
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}

              {/* Reset button – only when override exists */}
              {editingDay !== null && getDayData(editingDay).hasOverride && (
                <TouchableOpacity
                  style={styles.resetBtn}
                  onPress={handleResetToDefault}
                  activeOpacity={0.7}
                >
                  <Ionicons name="refresh-outline" size={16} color={COLORS.textLight} />
                  <Text style={styles.resetBtnText}>Varsayılana Dön</Text>
                </TouchableOpacity>
              )}

              <View style={{ height: 16 }} />
            </ScrollView>

            {/* Save button */}
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: themeColor }]}
              onPress={handleSave}
            >
              <Text style={styles.saveBtnText}>Kaydet</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Time picker (native) – inside Modal so z-order is correct */}
        {showTimePicker !== null && (
          <DateTimePicker
            value={(() => {
              const [h, m] = (localTimes[showTimePicker] || '08:00').split(':');
              const d = new Date();
              d.setHours(parseInt(h), parseInt(m), 0, 0);
              return d;
            })()}
            mode="time"
            is24Hour
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(e, date) => {
              if (Platform.OS !== 'ios') setShowTimePicker(null);
              if (date) {
                const hh = date.getHours().toString().padStart(2, '0');
                const mm = date.getMinutes().toString().padStart(2, '0');
                const newTimes = [...localTimes];
                newTimes[showTimePicker] = `${hh}:${mm}`;
                setLocalTimes([...newTimes].sort());
              }
              if (Platform.OS === 'ios') setShowTimePicker(null);
            }}
          />
        )}
      </Modal>
    </View>
  );
}

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  wrapper: {
    marginTop: 4,
    marginBottom: 12,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#EDEDF0',
  },

  /* Toggle row */
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
  },
  toggleIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EDEDF0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleTextBox: { flex: 1 },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  toggleHint: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  switch: {
    width: 46,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D1D1D6',
    padding: 3,
    justifyContent: 'center',
  },
  switchThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
  },
  switchThumbOn: { alignSelf: 'flex-end' },

  /* Day cards */
  cardsWrapper: {
    borderTopWidth: 1,
    borderTopColor: '#EDEDF0',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  dayCard: {
    flex: 1,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
    position: 'relative',
  },
  dayCardName: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  dayCardDose: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  overrideDot: {
    position: 'absolute',
    top: 5,
    right: 7,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  cardsHint: {
    fontSize: 11,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 8,
  },

  /* Modal overlay */
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 34,
    maxHeight: '88%',
  },
  sheetTablet: {
    marginHorizontal: 60,
    borderRadius: 28,
    marginBottom: 40,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 18,
  },

  /* Sheet header */
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  sheetSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 3,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Section label */
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textLight,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },

  /* Counter */
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F6',
    borderRadius: 18,
    padding: 6,
  },
  counterBtn: {
    width: 52,
    height: 52,
    backgroundColor: '#FFF',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  counterBtnDisabled: { opacity: 0.4 },
  counterValueBox: {
    flex: 1,
    alignItems: 'center',
  },
  counterValue: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: -1,
  },
  counterUnit: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: -2,
  },

  /* Time cards */
  timeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  timeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeInfo: {
    flex: 1,
    marginLeft: 14,
  },
  timeDoseLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  timeValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
    marginTop: 1,
  },
  timeEditBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F4F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  timeEditText: {
    fontSize: 12,
    fontWeight: '700',
  },

  /* Reset button */
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    marginTop: 4,
  },
  resetBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
  },

  /* Save button */
  saveBtn: {
    paddingVertical: 17,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 14,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.2,
  },
});
