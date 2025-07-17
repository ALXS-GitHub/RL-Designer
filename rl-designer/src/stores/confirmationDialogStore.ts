import type React from 'react';
import { create } from 'zustand';

interface ConfirmationDialogState {
    isOpen: boolean;
    message: React.ReactNode;
    onConfirm: (() => void);
    onCancel: (() => void);
    openConfirmationDialog: (message: React.ReactNode, onConfirm: () => void, onCancel: () => void) => void;
    closeConfirmationDialog: () => void;
}

export const useConfirmationDialogStore = create<ConfirmationDialogState>((set) => ({
    isOpen: false,
    message: null,
    onConfirm: () => {},
    onCancel: () => {},
    openConfirmationDialog: (message, onConfirm, onCancel) => set({ isOpen: true, message, onConfirm, onCancel }),
    closeConfirmationDialog: () => set({ isOpen: false, message: null, onConfirm: () => {}, onCancel: () => {} }),
}));