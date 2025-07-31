import type { DefaultMaterialType } from '@/constants/materials';
import { create } from 'zustand';

interface ModelSettingsState {
    isRotating: boolean;
    setIsRotating: (isRotating: boolean) => void;
    mainTeamColor: string;
    setMainTeamColor: (color: string) => void;
    material: DefaultMaterialType;
    setMaterial: (material: DefaultMaterialType) => void;
}

const useModelSettingsStore = create<ModelSettingsState>((set) => ({
    isRotating: true,
    setIsRotating: (isRotating) => set({ isRotating }),
    mainTeamColor: '#FFFFFF',
    setMainTeamColor: (color) => set({ mainTeamColor: color }),
    material: 'default',
    setMaterial: (material) => set({ material })
}));

export default useModelSettingsStore;