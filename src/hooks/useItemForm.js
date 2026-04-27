import { useState, useEffect } from 'react';
import useAppStore from '../store/useAppStore';
import { useRouter } from 'expo-router';

const timesEqual = (a, b) => {
  if (!a || !b || a.length !== b.length) return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  return sa.every((v, i) => v === sb[i]);
};

export const useItemForm = (initialItem, isNew, initialType) => {
  const router = useRouter();
  const addItem = useAppStore((s) => s.addItem);
  const updateItem = useAppStore((s) => s.updateItem);

  const [differDosesPerDay, setDifferDosesPerDay] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    type: initialType || 'İlaç',
    image: null,
    doseCount: 1,
    frequency: 'Her Gün',
    selectedDays: [0, 1, 2, 3, 4, 5, 6],
    reminderTimes: ['08:00'],
    noteText: '',
    // perDaySchedule: { dayIndex: { doseCount, reminderTimes } }
    perDaySchedule: {},
    notificationsEnabled: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialItem) {
      const defaultDoseCount = initialItem.doseCount || 1;
      const defaultTimes = initialItem.reminderTimes || ['08:00'];
      const perDaySchedule = {};
      let hasDifferentDoses = false;

      if (initialItem.dailySchedule) {
        Object.entries(initialItem.dailySchedule).forEach(([dayIdx, schedule]) => {
          const countDiffers = schedule.doseCount !== defaultDoseCount;
          const timesDiffer = !timesEqual(schedule.times, defaultTimes);
          if (countDiffers || timesDiffer) {
            hasDifferentDoses = true;
            perDaySchedule[parseInt(dayIdx)] = {
              doseCount: schedule.doseCount,
              reminderTimes: schedule.times || defaultTimes,
            };
          }
        });
      }

      const freq = initialItem.frequency || 'Her Gün';
      const selectedDays =
        freq === 'Her Gün'
          ? [0, 1, 2, 3, 4, 5, 6]
          : freq === 'İhtiyaç Halinde'
          ? []
          : initialItem.selectedDays || [];

      setFormData({
        name: initialItem.name,
        dosage: initialItem.dosage,
        type: initialItem.type,
        image: initialItem.image,
        doseCount: defaultDoseCount,
        frequency: freq,
        selectedDays,
        reminderTimes: defaultTimes,
        noteText: '',
        perDaySchedule,
        notificationsEnabled: initialItem.notificationsEnabled ?? false,
      });

      setDifferDosesPerDay(hasDifferentDoses);
    }
  }, [initialItem?.id]);

  const updateFormData = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  };

  // ─── Frequency Chip ──────────────────────────────────────────────────────
  const handleFrequencyChipPress = (freq) => {
    if (freq === 'Her Gün') {
      setFormData((prev) => ({
        ...prev,
        frequency: 'Her Gün',
        selectedDays: [0, 1, 2, 3, 4, 5, 6],
      }));
    } else if (freq === 'İhtiyaç Halinde') {
      setFormData((prev) => ({
        ...prev,
        frequency: 'İhtiyaç Halinde',
        selectedDays: [],
        perDaySchedule: {},
      }));
      setDifferDosesPerDay(false);
    } else {
      setFormData((prev) => ({
        ...prev,
        frequency: 'Belirli Günler',
        selectedDays: prev.selectedDays.length === 7 ? [] : prev.selectedDays,
      }));
    }
  };

  // ─── Smart Day Toggle ────────────────────────────────────────────────────
  const toggleDay = (dayIndex) => {
    setFormData((prev) => {
      const currentDays =
        prev.frequency === 'Her Gün' ? [0, 1, 2, 3, 4, 5, 6] : [...prev.selectedDays];

      let newDays;
      if (currentDays.includes(dayIndex)) {
        newDays = currentDays.filter((d) => d !== dayIndex);
      } else {
        newDays = [...currentDays, dayIndex].sort((a, b) => a - b);
      }

      const newFrequency = newDays.length === 7 ? 'Her Gün' : 'Belirli Günler';
      const newPerDaySchedule = { ...prev.perDaySchedule };
      if (!newDays.includes(dayIndex)) delete newPerDaySchedule[dayIndex];

      return {
        ...prev,
        selectedDays: newDays,
        frequency: newFrequency,
        perDaySchedule: newPerDaySchedule,
      };
    });
  };

  // ─── Global Dose Count ───────────────────────────────────────────────────
  const handleDoseCountChange = (count) => {
    const num = Math.max(1, count);
    const newTimes = [...formData.reminderTimes];
    if (num > newTimes.length) {
      for (let i = newTimes.length; i < num; i++) newTimes.push('12:00');
    } else {
      newTimes.splice(num);
    }
    setFormData((prev) => ({ ...prev, doseCount: num, reminderTimes: newTimes.sort() }));
  };

  // ─── Save Single Day Schedule (atomic – PerDaySection modal tarafından kullanılır) ──
  // { doseCount, reminderTimes } global varsayılanla aynıysa override silinir.
  const saveDaySchedule = (dayIndex, { doseCount, reminderTimes }) => {
    setFormData((prev) => {
      const updated = { ...prev.perDaySchedule };
      const matchesGlobal =
        doseCount === prev.doseCount && timesEqual(reminderTimes, prev.reminderTimes);
      if (matchesGlobal) {
        delete updated[dayIndex];
      } else {
        updated[dayIndex] = { doseCount, reminderTimes: [...reminderTimes].sort() };
      }
      return { ...prev, perDaySchedule: updated };
    });
  };

  // ─── Save ────────────────────────────────────────────────────────────────
  // onBeforeNavigate?: async (savedItem) => void
  // Bildirim planlama gibi async işlemler için detail sayfasından callback geçilebilir.
  const handleSave = (onBeforeNavigate) => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'İlaç adı boş bırakılamaz.';
    if (!formData.dosage.trim()) newErrors.dosage = 'Dozaj bilgisi boş bırakılamaz.';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const activeDays =
      formData.frequency === 'Her Gün' ? [0, 1, 2, 3, 4, 5, 6] : formData.selectedDays;

    let dailySchedule = null;
    const hasOverrides = Object.keys(formData.perDaySchedule).length > 0;

    if (hasOverrides && activeDays.length > 0) {
      dailySchedule = {};
      activeDays.forEach((day) => {
        const override = formData.perDaySchedule[day];
        dailySchedule[day] = {
          doseCount: override?.doseCount ?? formData.doseCount,
          times: override?.reminderTimes ?? formData.reminderTimes,
        };
      });
    }

    // Yeni kayıtlarda id önceden üretilir (bildirim planlamak için gerekli)
    const savedId = isNew
      ? Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
      : initialItem.id;

    const itemData = {
      id: savedId,
      name: formData.name,
      dosage: formData.dosage,
      type: formData.type,
      image: formData.image,
      doseCount: formData.doseCount,
      frequency: formData.frequency,
      selectedDays:
        formData.frequency === 'Her Gün' ? [0, 1, 2, 3, 4, 5, 6] : formData.selectedDays,
      reminderTimes: formData.reminderTimes,
      completedDoses: initialItem?.completedDoses || {},
      dailySchedule,
      notificationsEnabled: formData.notificationsEnabled,
      notificationIds: initialItem?.notificationIds || [],
    };

    if (isNew) addItem(itemData);
    else updateItem(initialItem.id, itemData);

    if (onBeforeNavigate) {
      Promise.resolve(onBeforeNavigate(itemData)).then(() => router.back());
    } else {
      router.back();
    }
  };

  return {
    formData,
    updateFormData,
    errors,
    toggleDay,
    handleFrequencyChipPress,
    handleDoseCountChange,
    saveDaySchedule,
    differDosesPerDay,
    setDifferDosesPerDay,
    handleSave,
    setErrors,
    setFormData,
  };
};
