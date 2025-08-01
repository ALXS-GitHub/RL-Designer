import { MeshPhongMaterial, Texture, MeshStandardMaterial, MeshPhysicalMaterial, DoubleSide, Color, Material, Vector2 } from 'three';

export const DEFAULT_MATERIALS = {
    DEFAULT: 'default',
    METAL: 'metal',
    PLASTIC: 'plastic',
    GLASS: 'glass',
    CARBON: 'carbon',
    RUBBER: 'rubber',
    STEEL: 'steel',
    CHROME: 'chrome',
    MATTE: 'matte',
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
    },
    'glass': {
        createMaterial: ({ textureMap, color, materialName }) => new MeshPhysicalMaterial({
            name: materialName,
            map: textureMap,
            color: new Color(color).lerp(new Color('#e0f7fa'), 0.5),
            side: DoubleSide,
            transparent: true,
            opacity: 0.25,
            transmission: 1.0,
            thickness: 0.5,
            roughness: 0.05,
            metalness: 0.0,
            reflectivity: 0.8,
            clearcoat: 1.0,
            clearcoatRoughness: 0.05
        })
    },
    'carbon': {
        createMaterial: ({ textureMap, color, materialName }) => new MeshStandardMaterial({
            name: materialName,
            map: textureMap,
            color: new Color(color).lerp(new Color('#222'), 0.7),
            side: DoubleSide,
            metalness: 0.6,
            roughness: 0.4,
            normalScale: new Vector2(1, 1),
            envMapIntensity: 0.5
        })
    },
    'rubber': {
        createMaterial: ({ textureMap, color, materialName }) => new MeshStandardMaterial({
            name: materialName,
            map: textureMap,
            color: new Color(color).lerp(new Color('#222'), 0.5),
            side: DoubleSide,
            metalness: 0.0,
            roughness: 0.95,
            envMapIntensity: 0.1
        })
    },
    'steel': {
        createMaterial: ({ textureMap, color, materialName }) => new MeshPhysicalMaterial({
            name: materialName,
            map: textureMap,
            color: new Color(color).lerp(new Color('#b0b0b0'), 0.5), // more metallic gray
            side: DoubleSide,
            metalness: 1.0,
            roughness: 0.2,
            reflectivity: 1.0,
            clearcoat: 0.7,
            clearcoatRoughness: 0.1
        })
    },
    'chrome': {
        createMaterial: ({ textureMap, color, materialName }) => new MeshPhysicalMaterial({
            name: materialName,
            map: textureMap,
            color: new Color(color).lerp(new Color('#e0e0e0'), 0.7),
            side: DoubleSide,
            metalness: 1.0,
            roughness: 0.05,
            reflectivity: 1.0,
            clearcoat: 1.0,
            clearcoatRoughness: 0.05
        })
    },
    'matte': {
        createMaterial: ({ textureMap, color, materialName }) => new MeshStandardMaterial({
            name: materialName,
            map: textureMap,
            color: new Color(color),
            side: DoubleSide,
            metalness: 0.05,
            roughness: 0.98,
            envMapIntensity: 0.05
        })
    }
};