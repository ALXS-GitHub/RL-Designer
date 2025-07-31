import { MeshPhongMaterial, Texture, MeshStandardMaterial, MeshPhysicalMaterial, DoubleSide, Color, Material } from 'three';

export const DEFAULT_MATERIALS = {
    DEFAULT: 'default',
    METAL: 'metal',
    PLASTIC: 'plastic',
} as const;

export type DefaultMaterialType = (typeof DEFAULT_MATERIALS)[keyof typeof DEFAULT_MATERIALS];

export interface MaterialOptions {
    materialName: string;
    textureMap: Texture;
    color: string;
}

export interface DefaultMaterialProps {
    createMaterial: (options: MaterialOptions) => Material;
}

export const DefaultMaterialMap: Record<DefaultMaterialType, DefaultMaterialProps> = {
    'default': {
        createMaterial: ({ textureMap, color, materialName }) => new MeshPhongMaterial({
            name: materialName,
            map: textureMap,
            color: new Color(color),
            side: DoubleSide,
            transparent: true,
            alphaTest: 0.1,
            shininess: 30,
            specular: new Color(0x222222),
            reflectivity: 0.1
        })
    },
    'metal': {
        createMaterial: ({ textureMap, color, materialName }) => new MeshPhysicalMaterial({
            name: materialName,
            map: textureMap,
            color: new Color(color),
            side: DoubleSide,
            transparent: true,
            alphaTest: 0.1,
            metalness: 0.8,      // High metalness for car paint
            roughness: 0.3,      // Lower roughness for shinier surface
            clearcoat: 1.0,      // Full clearcoat for glossy finish
            clearcoatRoughness: 0.1,
            reflectivity: 0.7,   // Strong reflections
            sheen: 1.0,          // Optional: adds a soft fabric-like sheen
            sheenColor: new Color(color)
        })
    },
    'plastic': {
        createMaterial: ({ textureMap, color, materialName }) => new MeshPhongMaterial({
            name: materialName,
            map: textureMap,
            color: new Color(color),
            shininess: 50,
            specular: new Color(0x555555),
            side: DoubleSide
        })
    }
};