import { useState } from 'react';

export const useTimePicker = (onTimeSelected) => {
  const [showPicker, setShowPicker] = useState(null);

  const onTimeChange = (event, selectedDate, index) => {
    setShowPicker(null);
    if (selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      const newTime = `${hours}:${minutes}`;
      onTimeSelected(newTime, index);
    }
  };

  return { showPicker, setShowPicker, onTimeChange };
};
