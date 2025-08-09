import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
// import the glb loader if needed
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import fbx loader
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { TextureLoader, Mesh, Group, Box3, Vector3, DoubleSide, MeshPhongMaterial, ShaderMaterial, Color, Texture, Material, ShaderLib, UniformsUtils, UniformsLib, Vector2, MeshPhysicalMaterial } from 'three';
import useModelSettingsStore from '@/stores/modelSettingsStore';
import { resolvePath } from '@/utils/files';
import { shaderSkinPatch } from './patches/shaderSkinPatch';
import type { ModelPartType } from '@/types/modelParts';
import { MODEL_PART_TEXTURE_MAP } from '@/types/modelParts';
import type { ModelData, ModelDataPaths, ModelDataConfig, ModelDataSetup } from '@/types/modelData';
import { DefaultMaterialMap } from '@/constants/materials';

export interface Model3DProps {
    modelDataPaths: ModelDataPaths;
    modelDataConfig?: ModelDataConfig;
    modelDataSetup: ModelDataSetup;
    onError: (error: string) => void;
}

// Custom shader for color replacement with lighting
const createColorReplacementShader = (
    materialName: string,
    modelData: ModelData
) => {
  const material = DefaultMaterialMap[modelData.material].createMaterial({
    materialName: materialName,
    textureMap: modelData.decalTexture,
    color: modelData.colors.mainTeamColor,
  });

    material.onBeforeCompile = (shader) => {
      shader.uniforms.skinTexture = { value: modelData.skinTexture };
      shader.uniforms.mainTeamColor = { value: new Color(modelData.colors.mainTeamColor) };
      shader.uniforms.windowsColor = { value: new Color('#87CEEB') };
      shader.uniforms.curvatureTexture = { value: modelData.curvatureTexture };
      shader.uniforms.carColor = { value: new Color(modelData.colors.carColor) };

      // Apply the skin patch to the shader
      shaderSkinPatch(shader);
    };
    return material;
};

// Helper function to determine if material should be processed
const getMaterialType = (materialName: string): ModelPartType | null => {
  if (!materialName) return null;

  const targetNamesMap: Record<ModelPartType, string[]> = {
    body: ['body', 'decal', 'default'],
    ball: ['ball'],
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
  let material: Material;
  if (materialType === 'body' && modelData.skinTexture) {
    material = createColorReplacementShader(materialName, modelData);
  } else if (materialType === 'body') {
    material = DefaultMaterialMap[modelData.material].createMaterial({
      materialName: materialName,
      textureMap: modelData.decalTexture,
      color: modelData.colors.mainTeamColor,
    });
  } else {
    material = DefaultMaterialMap['default'].createMaterial({
      materialName: materialName,
      textureMap: modelData[MODEL_PART_TEXTURE_MAP[materialType]],
      color: null,
    });
  }

  return material;
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
  modelDataSetup,
  onError
}) => {
  const {
      modelPath,
      decalTexturePath,
      skinTexturePath,
      chassisTexturePath,
      wheelTexturePath,
      tireTexturePath,
      curvatureTexturePath,
  } = modelDataPaths;
  const { forceRotation = false } = modelDataConfig;
  const meshRef = useRef<Group>(null);
  const [normalizedScale, setNormalizedScale] = useState(1);
  const [modelCenter, setModelCenter] = useState(new Vector3(0, 0, 0));
  
  const { colors, isRotating, material } = useModelSettingsStore();

  // Always call hooks unconditionally
  const obj = useLoader(FBXLoader, modelPath, (loader) => {    
    loader.manager.onError = (url) => {
      console.error('OBJ loader error:', url);
      onError(`Failed to load model from path: ${modelPath}`);
    };
  });
  const default_obj = obj.clone();
  
  // Always call useLoader for texture, but handle null texturePath
  const decalTexture = useLoader(
    TextureLoader, 
    decalTexturePath ? resolvePath(decalTexturePath) : '/models/placeholder.png'
  );
  decalTexture.channel = modelDataSetup.decalTextureUV || 0; // Set UV channel for decal texture

  const skinTexture = useLoader(
    TextureLoader,
    skinTexturePath ? resolvePath(skinTexturePath) : '/models/textures/skins/default_body_skin.png'
  );

  const chassisTexture = useLoader(
    TextureLoader,
    // ! as for now the chassis is in the the public we don't use resolvePath
    chassisTexturePath ? resolvePath(chassisTexturePath) : '/models/placeholder.png'
  );
  
  const wheelTexture = useLoader(
    TextureLoader,
    wheelTexturePath ? wheelTexturePath : '/models/placeholder.png'
  );
  
  const tireTexture = useLoader(
    TextureLoader,
    tireTexturePath ? tireTexturePath : '/models/placeholder.png'
  );
  
  const curvatureTexture = useLoader(
    TextureLoader,
    curvatureTexturePath ? resolvePath(curvatureTexturePath) : '/models/placeholder.png'
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
    const { scale, center } = calculateModelNormalization(default_obj);
    setNormalizedScale(scale);
    setModelCenter(center);

    const modelData: ModelData = {
      obj: obj,
      decalTexture: decalTexture ? decalTexture : null,
      skinTexture: skinTexturePath ? skinTexture : null,
      chassisTexture: chassisTexturePath ? chassisTexture : null,
      wheelTexture: wheelTexturePath ? wheelTexture : null,
      tireTexture: tireTexturePath ? tireTexture : null,
      curvatureTexture: curvatureTexturePath ? curvatureTexture : null,
      colors: colors,
      material: material,
    }

    // Apply materials to object
    applyMaterialsToObject(modelData);

    // Cleanup function
    return () => {
      disposeObjectMaterials(obj);
    };
  }, [obj, decalTexture, skinTexture, decalTexturePath, skinTexturePath, colors, chassisTexturePath, chassisTexture, wheelTexturePath, wheelTexture, tireTexturePath, tireTexture, curvatureTexturePath, curvatureTexture, material]);

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
