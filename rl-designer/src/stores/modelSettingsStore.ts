import { create } from 'zustand';

interface ModelSettingsState {
    isRotating: boolean;
    setIsRotating: (isRotating: boolean) => void;
}

const useModelSettingsStore = create<ModelSettingsState>((set) => ({
    isRotating: true,
    setIsRotating: (isRotating) => set({ isRotating }),
}));

export default useModelSettingsStore;