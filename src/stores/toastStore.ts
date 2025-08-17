import { create } from 'zustand';
import { Toast, ToastType } from '../components/Toast';

interface ToastState {
  toasts: Toast[];
}

interface ToastActions {
  addToast: (type: ToastType, message: string, requestId?: string, duration?: number) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastState & ToastActions>((set, get) => ({
  toasts: [],

  addToast: (type, message, requestId, duration = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      type,
      message,
      requestId,
      duration,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto-cleanup old toasts (keep max 5)
    const { toasts } = get();
    if (toasts.length > 5) {
      set((state) => ({
        toasts: state.toasts.slice(-5),
      }));
    }
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },
}));

// Convenience functions
export const showSuccess = (message: string, requestId?: string) => {
  useToastStore.getState().addToast('success', message, requestId);
};

export const showError = (message: string, requestId?: string) => {
  useToastStore.getState().addToast('error', message, requestId);
};

export const showInfo = (message: string, requestId?: string) => {
  useToastStore.getState().addToast('info', message, requestId);
};
