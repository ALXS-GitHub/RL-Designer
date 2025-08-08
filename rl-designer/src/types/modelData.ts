import type { ColorType } from "@/constants/colors";
import type { DefaultMaterialType } from "@/constants/materials";
import type { Object3DEventMap } from "three/src/core/Object3D.js";
import type { Group } from "three/src/objects/Group.js";
import type { Texture } from "three/src/textures/Texture.js";

export interface ModelData {
    obj: Group<Object3DEventMap>,
    decalTexture?: Texture,
    skinTexture?: Texture,
    chassisTexture?: Texture,
    wheelTexture?: Texture,
    tireTexture?: Texture,
    curvatureTexture?: Texture,
    colors: Record<ColorType, string>,
    material: DefaultMaterialType,
}

export interface ModelDataPaths {
    modelPath: string;
    decalTexturePath?: string;
    skinTexturePath?: string;
    chassisTexturePath?: string;
    wheelTexturePath?: string;
    tireTexturePath?: string;
    curvatureTexturePath?: string;
}

export interface ModelDataConfig {
    forceRotation?: boolean;
    // ! some settings are handled in the settings store
}

export interface ModelDataSetup {
    decalTextureUV: number;
}