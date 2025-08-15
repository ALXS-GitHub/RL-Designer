import type { DefaultMaterialType } from '@/constants/materials';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ColorType } from '@/constants/colors';
import { DEFAULT_COLORS } from '@/constants/colors';
import type { ModelType } from '@/constants/models';

interface ModelSettingsState {
    isRotating: boolean;
    setIsRotating: (isRotating: boolean) => void;
    colors: Record<ColorType, string>;
    setColors: (colorType: ColorType, color: string) => void;
    material: DefaultMaterialType;
    setMaterial: (material: DefaultMaterialType) => void;
    universalVariantModel: ModelType;
    setUniversalVariantModel: (model: ModelType) => void;
}

const useModelSettingsStore = create<ModelSettingsState>()(
    persist(
        (set) => ({
            isRotating: true,
            setIsRotating: (isRotating) => set({ isRotating }),
            colors: DEFAULT_COLORS,
            setColors: (colorType, color) => set((state) => ({
                colors: {
                    ...state.colors,
                    [colorType]: color
                }
            })),
            material: 'default',
            setMaterial: (material) => set({ material }),
            universalVariantModel: 'Octane',
            setUniversalVariantModel: (model) => set({ universalVariantModel: model })
        }),
        {
            name: 'model-settings-store'
        }
    )
);

export default useModelSettingsStore;