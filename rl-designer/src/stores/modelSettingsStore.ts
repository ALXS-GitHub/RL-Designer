import { create } from 'zustand';

interface ModelSettingsState {
    isRotating: boolean;
    setIsRotating: (isRotating: boolean) => void;
    color: string;
    setColor: (color: string) => void;
}

const useModelSettingsStore = create<ModelSettingsState>((set) => ({
    isRotating: true,
    setIsRotating: (isRotating) => set({ isRotating }),
    color: '#FFFFFF',
    setColor: (color) => set({ color }),
}));

export default useModelSettingsStore;