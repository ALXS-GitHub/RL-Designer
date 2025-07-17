// src/stores/notificationStore.ts
import { create } from 'zustand';
import { toast } from 'react-toastify';
import type { ToastOptions, Id } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type NotificationType = 'info' | 'success' | 'warn' | 'error';

interface Notification {
  id: Id;
  message: string;
  type: NotificationType;
  timestamp: number;
}

interface NotificationStore {
  notifications: Notification[];
  
  // Core notification methods
  notify: (message: string, type: NotificationType, options?: ToastOptions) => Id;
  info: (message: string, options?: ToastOptions) => Id;
  success: (message: string, options?: ToastOptions) => Id;
  warn: (message: string, options?: ToastOptions) => Id;
  error: (message: string, options?: ToastOptions) => Id;
  
  // Optional: manage notifications
  dismiss: (id: Id) => void;
  dismissAll: () => void;
}

// Default toast options
const defaultOptions: ToastOptions = {
  position: 'bottom-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  className: 'journal-notification',
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  
  notify: (message, type, options = {}) => {
    const toastOptions = { ...defaultOptions, ...options };
    let id: Id;
    
    switch (type) {
      case 'info':
        id = toast.info(message, toastOptions);
        break;
      case 'success':
        id = toast.success(message, toastOptions);
        break;
      case 'warn':
        id = toast.warn(message, toastOptions);
        break;
      case 'error':
        id = toast.error(message, toastOptions);
        break;
      default:
        id = toast(message, toastOptions);
    }
    
    // Store the notification in our state
    const newNotification = {
      id,
      message,
      type,
      timestamp: Date.now(),
    };
    
    set(state => ({
      notifications: [...state.notifications, newNotification]
    }));
    
    return id;
  },
  
  info: (message, options) => get().notify(message, 'info', options),
  success: (message, options) => get().notify(message, 'success', options),
  warn: (message, options) => get().notify(message, 'warn', options),
  error: (message, options) => get().notify(message, 'error', options),
  
  dismiss: (id) => {
    toast.dismiss(id);
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },
  
  dismissAll: () => {
    toast.dismiss();
    set({ notifications: [] });
  },
}));