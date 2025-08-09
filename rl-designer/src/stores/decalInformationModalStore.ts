import type { DecalTextures, DecalVariant, VariantFrontInfo } from '@/types';
import type React from 'react';
import { create } from 'zustand';

interface DecalInformationModalState {
    isOpen: boolean;
    decalVariant: DecalVariant | null;
    openModal: (decalVariant: DecalVariant | null) => void;
    closeModal: () => void;
}

export const useDecalInformationModalStore = create<DecalInformationModalState>((set) => ({
    isOpen: false,
    decalVariant: null,
    openModal: (decalVariant) => set({ isOpen: true, decalVariant: decalVariant }),
    closeModal: () => set({ isOpen: false, decalVariant: null }),
}));