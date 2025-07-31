import type { Texture } from "three/src/textures/Texture.js";
import type { ModelData } from "./modelData";

export const MODEL_PARTS = {
    body: 'body',
    ball: 'ball',
    chassis: 'chassis',
    wheel: 'wheel',
    tire: 'tire',
} as const;

export type ModelPartType = (typeof MODEL_PARTS)[keyof typeof MODEL_PARTS];

 
// Helper type: Only keys of ModelData whose value is Texture or Texture | undefined
type TextureKeys<T> = {
  [K in keyof T]: T[K] extends Texture | undefined ? K : never
}[keyof T];

export const MODEL_PART_TEXTURE_MAP: Record<ModelPartType, TextureKeys<ModelData>> = {
  body: "decalTexture",
  ball: "decalTexture",
  chassis: "chassisTexture",
  wheel: "wheelTexture",
  tire: "tireTexture",
};