import { create } from "zustand";
import type { DecalTextures, VariantFrontInfo } from "@/types";

export interface CollectionState {
    decals: DecalTextures[];
    setDecals: (decals: DecalTextures[]) => void;
    addVariant: (decal: string, variant: VariantFrontInfo) => void;
    updateOrAddVariant: (decal: string, variant: VariantFrontInfo) => void; // same as addVariant but replaces the variant if exists
    removeVariant: (decal: string, variant_name: string) => void;
    addDecal: (decal: DecalTextures) => void;
    removeDecal: (decal: DecalTextures) => void;
}

const createCollectionStore = () => {
    return create<CollectionState>((set) => ({
        decals: [],
        setDecals: (decals) => set({ decals }),
        addVariant: (decal, variant) => set((state) => {
            const decalExists = state.decals.some(d => d.name === decal);
            
            if (decalExists) {
                return {
                    decals: state.decals.map(d =>
                        d.name === decal 
                            ? { 
                                ...d, 
                                variants: d.variants.some(v => v.variant_name === variant.variant_name) 
                                    ? d.variants 
                                    : [...d.variants, variant] 
                            } 
                            : d
                    )
                };
            } else {
                return {
                    decals: [...state.decals, { name: decal, variants: [variant] }]
                };
            }
        }),
        updateOrAddVariant: (decal, variant) => set((state) => {
            const decalExists = state.decals.some(d => d.name === decal);
            
            if (decalExists) {
                return {
                    decals: state.decals.map(d =>
                        d.name === decal 
                            ? { 
                                ...d, 
                                variants: d.variants.some(v => v.variant_name === variant.variant_name)
                                    ? d.variants.map(v => v.variant_name === variant.variant_name ? variant : v) // Update existing
                                    : [...d.variants, variant] // Add new variant
                            } 
                            : d
                    )
                };
            } else {
                return {
                    decals: [...state.decals, { name: decal, variants: [variant] }]
                };
            }
        }),
        removeVariant: (decal, variant_name) => set((state) => {
            const updatedDecals = state.decals.map(d =>
                d.name === decal ? { ...d, variants: d.variants.filter(v => v.variant_name !== variant_name) } : d
            );
            
            // Remove any decals that now have empty variant arrays
            return {
                decals: updatedDecals.filter(d => d.variants.length > 0)
            };
        }),
        addDecal: (decal) => set((state) => ({ decals: [...state.decals, decal] })),
        removeDecal: (decal) => set((state) => ({ decals: state.decals.filter((d) => d !== decal) })),
    }));
}

export const useCarCollectionStore = createCollectionStore();
export const useBallCollectionStore = createCollectionStore();
export const useBoostMeterCollectionStore = createCollectionStore();

export const useExplorerStore = createCollectionStore();