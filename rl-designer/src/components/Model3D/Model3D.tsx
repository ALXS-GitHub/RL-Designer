import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { TextureLoader, Mesh, Group, Box3, Vector3, DoubleSide, MeshPhongMaterial, ShaderMaterial, Color, Texture, Material, ShaderLib, UniformsUtils, UniformsLib, Vector2, MeshPhysicalMaterial } from 'three';
import useModelSettingsStore from '@/stores/modelSettingsStore';
import { resolveImagePath } from '@/utils/images';
import { shaderSkinPatch } from './patches/shaderSkinPatch';
import type { ModelPartType } from '@/types/modelParts';
import { MODEL_PART_TEXTURE_MAP } from '@/types/modelParts';
import type { ModelData, ModelDataPaths, ModelDataConfig } from '@/types/modelData';

export interface Model3DProps {
    modelDataPaths: ModelDataPaths;
    modelDataConfig?: ModelDataConfig;
    onError: (error: string) => void;
}

// Custom shader for color replacement with lighting
const createColorReplacementShader = (
    materialName: string,
    modelData: ModelData
) => {
  const material = new MeshPhongMaterial({
      name: materialName,
      map: modelData.decalTexture,
      color: new Color(modelData.mainTeamColor),
      side: DoubleSide,
      transparent: true,
      alphaTest: 0.1,
      shininess: 30,           // Controls the size of the specular highlight (0-100+)
      specular: new Color(0xffffff), // Color of the specular reflection (subtle gray)
      reflectivity: 0.1,       // How much the material reflects the environment
    });

    // TODO : add setting for switching before predefined materials
  //   const material = new MeshPhysicalMaterial({
  //   map: decalTexture,
  //   color: new Color(mainTeamColor),
  //   side: DoubleSide,
  //   transparent: true,
  //   alphaTest: 0.1,
  //   metalness: 0.8,      // High metalness for car paint
  //   roughness: 0.3,      // Lower roughness for shinier surface
  //   clearcoat: 1.0,      // Full clearcoat for glossy finish
  //   clearcoatRoughness: 0.1,
  //   reflectivity: 0.7,   // Strong reflections
  //   sheen: 1.0,          // Optional: adds a soft fabric-like sheen
  //   sheenColor: new Color(mainTeamColor)
  // });

    material.onBeforeCompile = (shader) => {
      shader.uniforms.skinTexture = { value: modelData.skinTexture };
      shader.uniforms.mainTeamColor = { value: new Color(modelData.mainTeamColor) };
      shader.uniforms.windowsColor = { value: new Color('#87CEEB') };

      // Apply the skin patch to the shader
      shaderSkinPatch(shader);
    };
    return material;
};

// Helper function to determine if material should be processed
const getMaterialType = (materialName: string): ModelPartType | null => {
  if (!materialName) return null;

  const targetNamesMap: Record<ModelPartType, string[]> = {
    body: ['body', 'decal', 'ball', 'default'],
    chassis: ['chassis'],
    wheel: ['wheel'],
    tire: ['tire'],
  };
  for (const [key, names] of Object.entries(targetNamesMap) as [ModelPartType, string[]][]) {
    if (names.some(name => materialName.toLowerCase().includes(name))) {
      return key;
    }
  }
  return null;
};

// Helper function to create appropriate material based on skin availability
const createMaterial = (
  materialName: string,
  materialType: ModelPartType,
  modelData: ModelData
): Material => {
  if (materialType === 'body' && modelData.skinTexture) {
    return createColorReplacementShader(materialName, modelData);
  } else {
    return new MeshPhongMaterial({
      name: materialName,
      map: modelData[MODEL_PART_TEXTURE_MAP[materialType]],
      // color: new Color(modelData.mainTeamColor),
      side: DoubleSide,
      transparent: true,
      alphaTest: 0.1,
      // Add shininess properties
      shininess: 30,           // Controls the size of the specular highlight (0-100+)
      specular: new Color(0x222222), // Color of the specular reflection (subtle gray)
      reflectivity: 0.1        // How much the material reflects the environment
    });
  }
};

// Helper function to safely dispose material
const disposeMaterial = (material: Material): void => {
  if (material && material.dispose) {
    material.dispose();
  }
};

// Helper function to process materials
const processMaterials = (
  child: Mesh,
  modelData: ModelData
): void => {
  const process = (mat: Material, index?: number) => {
    const materialName = mat.name;
    const materialType = getMaterialType(materialName);
    if (materialType) {
      disposeMaterial(mat);
      const newMaterial = createMaterial(
        materialName,
        materialType,
        modelData
      );
      if (Array.isArray(child.material) && typeof index === 'number') {
        child.material[index] = newMaterial;
      } else {
        child.material = newMaterial;
      }
    }
  };

  if (Array.isArray(child.material)) {
    child.material.forEach(process);
  } else {
    process(child.material);
  }
};

// Helper function to apply materials to object
const applyMaterialsToObject = (
  modelData: ModelData
): void => {
  modelData.obj.traverse((child) => {
    if (!(child instanceof Mesh) || !child.material) return;
    processMaterials(child, modelData);
  });
};

// Helper function to calculate model normalization
const calculateModelNormalization = (obj: Group) => {
  const box = new Box3().setFromObject(obj);
  const size = box.getSize(new Vector3());
  const center = box.getCenter(new Vector3());
  const maxDimension = Math.max(size.x, size.y, size.z);
  const scale = maxDimension > 0 ? 1 / maxDimension : 1;
  
  return { scale, center };
};

// Helper function to dispose all materials in object
const disposeObjectMaterials = (obj: Group): void => {
  obj.traverse((child) => {
    if (!(child instanceof Mesh) || !child.material) return;

    if (Array.isArray(child.material)) {
      child.material.forEach(disposeMaterial);
    } else {
      disposeMaterial(child.material);
    }
  });
};

const Model3D: React.FC<Model3DProps> = ({ 
  modelDataPaths,
  modelDataConfig = {},
  onError
}) => {
  const {
      modelPath,
      decalTexturePath,
      skinTexturePath,
      chassisTexturePath,
      wheelTexturePath,
      tireTexturePath,
  } = modelDataPaths;
  const { forceRotation = false } = modelDataConfig;
  const meshRef = useRef<Group>(null);
  const [normalizedScale, setNormalizedScale] = useState(1);
  const [modelCenter, setModelCenter] = useState(new Vector3(0, 0, 0));
  
  const { mainTeamColor, isRotating } = useModelSettingsStore();

  // Always call hooks unconditionally
  const obj = useLoader(OBJLoader, modelPath, (loader) => {    
    loader.manager.onError = (url) => {
      console.error('OBJ loader error:', url);
      onError(`Failed to load model from path: ${modelPath}`);
    };
  });

  // Always call useLoader for texture, but handle null texturePath
  const decalTexture = useLoader(
    TextureLoader, 
    resolveImagePath(decalTexturePath)
  );

  const skinTexture = useLoader(
    TextureLoader,
    skinTexturePath ? resolveImagePath(skinTexturePath) : '/models/skins/default_body_skin.png'
  );

  const chassisTexture = useLoader(
    TextureLoader,
    // ! as for now the chassis is in the the public we don't use resolveImagePath
    chassisTexturePath ? chassisTexturePath : '/models/placeholder.png'
  );

  const wheelTexture = useLoader(
    TextureLoader,
    wheelTexturePath ? wheelTexturePath : '/models/placeholder.png'
  );
  const tireTexture = useLoader(
    TextureLoader,
    tireTexturePath ? tireTexturePath : '/models/placeholder.png'
  );

  // Auto-rotate the model
  useFrame((state, delta) => {
    if (meshRef.current && (isRotating || forceRotation)) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  // Normalize the model and apply texture
  useEffect(() => {
    if (!obj || !decalTexture || !decalTexturePath) return;

    // Calculate model normalization
    const { scale, center } = calculateModelNormalization(obj);
    setNormalizedScale(scale);
    setModelCenter(center);

    const modelData: ModelData = {
      obj: obj,
      decalTexture: decalTexture,
      skinTexture: skinTexturePath ? skinTexture : null,
      chassisTexture: chassisTexturePath ? chassisTexture : null,
      wheelTexture: wheelTexturePath ? wheelTexture : null,
      tireTexture: tireTexturePath ? tireTexture : null,
      mainTeamColor: mainTeamColor,
    }

    // Apply materials to object
    applyMaterialsToObject(modelData);

    // Cleanup function
    return () => {
      disposeObjectMaterials(obj);
    };
  }, [obj, decalTexture, skinTexture, decalTexturePath, skinTexturePath, mainTeamColor, chassisTexturePath, chassisTexture, wheelTexturePath, wheelTexture, tireTexturePath, tireTexture]);

  // Check if model loaded successfully
  if (!obj || obj.children.length === 0) {
    onError(`Failed to load model from path: ${modelPath}`);
  }

  return (
    <group 
      ref={meshRef} 
      scale={[normalizedScale, normalizedScale, normalizedScale]}
      position={[-modelCenter.x * normalizedScale, -modelCenter.y * normalizedScale, -modelCenter.z * normalizedScale]}
    >
      <primitive object={obj} />
    </group>
  );
};

export default Model3D;
