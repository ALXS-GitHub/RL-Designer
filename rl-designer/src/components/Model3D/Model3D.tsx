import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { TextureLoader, Mesh, Group, Box3, Vector3, DoubleSide, MeshPhongMaterial, ShaderMaterial, Color, Texture, Material, ShaderLib, UniformsUtils, UniformsLib } from 'three';
import useModelSettingsStore from '@/stores/modelSettingsStore';
import { resolveImagePath } from '@/utils/images';
import { colorReplacementVertexShader, colorReplacementFragmentShader } from '@/shaders/index';

export interface Model3DProps {
    modelPath: string;
    texturePath?: string;
    skinPath?: string;
    onError: (error: string) => void;
    forceRotation?: boolean;
    mainTeamColor?: string;
}

// Custom shader for color replacement with lighting
const createColorReplacementShader = (
    decalTexture: Texture,
    skinTexture: Texture,
    mainTeamColor: string = '#FFFFFF'
) => {
  // Clone the Phong shader's uniforms
  const uniforms = UniformsUtils.clone(ShaderLib.phong.uniforms);

  // Add your custom uniforms
  uniforms.decalTexture = { value: decalTexture };
  uniforms.skinTexture = { value: skinTexture };
  uniforms.mainTeamColor = { value: new Color(mainTeamColor) };
  uniforms.windowsColor = { value: new Color('#87CEEB') };

  const newUniforms = UniformsUtils.merge([
    UniformsLib["lights"],
    uniforms,
  ]);

  return new ShaderMaterial({
    uniforms: newUniforms,
    vertexShader: colorReplacementVertexShader,
    fragmentShader: colorReplacementFragmentShader,
    side: DoubleSide,
    transparent: true,
    lights: true,
  });
};

// Helper function to determine if material should be processed
const shouldApplyToMaterial = (materialName?: string): boolean => {
  if (!materialName) return true;
  
  const targetNames = ['body', 'decal', 'ball', 'default'];
  return targetNames.some(name => 
    materialName.toLowerCase().includes(name)
  );
};

// Helper function to create appropriate material based on skin availability
const createMaterial = (
  decalTexture: Texture,
  skinTexture: Texture | null,
  skinPath: string | undefined,
  mainTeamColor: string
): Material => {
  if (skinTexture && skinPath) {
    return createColorReplacementShader(decalTexture, skinTexture, mainTeamColor);
  } else {
    return new MeshPhongMaterial({
      map: decalTexture,
      color: new Color(mainTeamColor),
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

// Helper function to process array of materials
const processArrayMaterials = (
  child: Mesh,
  decalTexture: Texture,
  skinTexture: Texture | null,
  skinPath: string | undefined,
  mainTeamColor: string
): void => {
  if (!Array.isArray(child.material)) return;

  child.material.forEach((mat, index) => {
    if (shouldApplyToMaterial(mat.name)) {
      // Dispose old material
      disposeMaterial(child.material[index]);
      
      // Create and assign new material
      child.material[index] = createMaterial(
        decalTexture,
        skinTexture,
        skinPath,
        mainTeamColor
      );
    }
  });
};

// Helper function to process single material
const processSingleMaterial = (
  child: Mesh,
  decalTexture: Texture,
  skinTexture: Texture | null,
  skinPath: string | undefined,
  mainTeamColor: string
): void => {
  if (Array.isArray(child.material)) return;

  if (shouldApplyToMaterial(child.material.name)) {
    // Dispose old material
    const oldMaterial = child.material;
    disposeMaterial(oldMaterial);
    
    // Create and assign new material
    child.material = createMaterial(
      decalTexture,
      skinTexture,
      skinPath,
      mainTeamColor
    );
  }
};

// Helper function to apply materials to object
const applyMaterialsToObject = (
  obj: Group,
  decalTexture: Texture,
  skinTexture: Texture | null,
  skinPath: string | undefined,
  mainTeamColor: string
): void => {
  obj.traverse((child) => {
    if (!(child instanceof Mesh) || !child.material) return;

    if (Array.isArray(child.material)) {
      processArrayMaterials(child, decalTexture, skinTexture, skinPath, mainTeamColor);
    } else {
      processSingleMaterial(child, decalTexture, skinTexture, skinPath, mainTeamColor);
    }
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
  modelPath, 
  texturePath, 
  skinPath,
  onError, 
  forceRotation,
  mainTeamColor = '#FFFFFF'
}) => {
  const meshRef = useRef<Group>(null);
  const [normalizedScale, setNormalizedScale] = useState(1);
  const [modelCenter, setModelCenter] = useState(new Vector3(0, 0, 0));
  
  const { isRotating } = useModelSettingsStore();

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
    resolveImagePath(texturePath)
  );

  const skinTexture = useLoader(
    TextureLoader,
    skinPath ? resolveImagePath(skinPath) : '/models/skins/default_body_skin.png'
  );

  // Auto-rotate the model
  useFrame((state, delta) => {
    if (meshRef.current && (isRotating || forceRotation)) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  // Normalize the model and apply texture
  useEffect(() => {
    if (!obj || !decalTexture || !texturePath) return;

    // Calculate model normalization
    const { scale, center } = calculateModelNormalization(obj);
    setNormalizedScale(scale);
    setModelCenter(center);

    // Apply materials to object
    applyMaterialsToObject(
      obj,
      decalTexture,
      skinTexture,
      skinPath,
      mainTeamColor
    );

    // Cleanup function
    return () => {
      disposeObjectMaterials(obj);
    };
  }, [obj, decalTexture, skinTexture, texturePath, skinPath, mainTeamColor]);

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
