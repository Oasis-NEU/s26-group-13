import { create } from 'zustand';

const useToastStore = create((set) => ({
  message: '',
  open: false,
  severity: 'success', // 'success' | 'error' | 'info'
  onUndo: null,

  showToast: (message, severity = 'success', onUndo = null) =>
    set({ message, severity, open: true, onUndo }),

  hideToast: () => set({ open: false, onUndo: null }),
}));

export default useToastStore;
