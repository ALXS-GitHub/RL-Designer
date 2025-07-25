import { create } from "zustand";
import type { DecalTextures } from "@/types";

export interface CollectionState {
    decals: DecalTextures[];
    setDecals: (decals: DecalTextures[]) => void;
    addVariant: (decal: string, variant: string) => void;
    removeVariant: (decal: string, variant: string) => void;
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
                                variants: d.variants.includes(variant) 
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
        removeVariant: (decal, variant) => set((state) => {
            const updatedDecals = state.decals.map(d =>
                d.name === decal ? { ...d, variants: d.variants.filter(v => v !== variant) } : d
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