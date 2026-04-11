import { create } from 'zustand';

const useToastStore = create((set) => ({
  message: '',
  open: false,
  severity: 'success', // 'success' | 'error' | 'info'

  showToast: (message, severity = 'success') =>
    set({ message, severity, open: true }),

  hideToast: () =>
    set({ open: false }),
}));

export default useToastStore;
