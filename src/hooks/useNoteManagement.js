import { useState } from "react";
import useAppStore from "../store/useAppStore";

export const useNoteManagement = (itemId, getNoteText, clearNoteText) => {
  const addNote = useAppStore((s) => s.addNote);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [noteError, setNoteError] = useState(null);

  const handleAddNote = () => {
    const text = getNoteText();
    if (!text.trim()) {
      setNoteError("Lütfen bir not girin.");
      return;
    }

    setIsAddingNote(true);
    addNote(itemId, text.trim());
    clearNoteText();
    setIsAddingNote(false);
    setNoteModalVisible(false);
    setNoteError(null);
  };

  return {
    isAddingNote,
    noteModalVisible,
    setNoteModalVisible,
    handleAddNote,
    noteError,
    setNoteError,
  };
};
