import { create } from 'zustand';

interface ModelSettingsState {
    isRotating: boolean;
    setIsRotating: (isRotating: boolean) => void;
    mainTeamColor: string;
    setMainTeamColor: (color: string) => void;
}

const useModelSettingsStore = create<ModelSettingsState>((set) => ({
    isRotating: true,
    setIsRotating: (isRotating) => set({ isRotating }),
    mainTeamColor: '#FFFFFF',
    setMainTeamColor: (color) => set({ mainTeamColor: color }),
}));

export default useModelSettingsStore;