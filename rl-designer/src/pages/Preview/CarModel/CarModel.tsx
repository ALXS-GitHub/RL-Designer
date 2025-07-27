import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { TextureLoader, Mesh, Group, Box3, Vector3, DoubleSide, ShaderMaterial, Color } from 'three';
import { convertFileSrc } from '@tauri-apps/api/core';
import LoadingSpinner from '@/components/Loading/LoadingSpinner';
import { Loading, Error } from '@/components'
import useModelSettingsStore from '@/stores/modelSettingsStore';
import { resolveImagePath } from '@/utils/images';

import './CarPreview.scss';

interface CarModelProps {
  modelPath: string;
  texturePath?: string;
  skinPath?: string;
  onError: (error: string) => void;
  forceRotation?: boolean;
  mainTeamColor?: string;
}

interface CarPreviewProps {
  modelPath: string;
  texturePath?: string;
  skinPath?: string;
  className?: string;
  forceRotation?: boolean;
  mainTeamColor?: string;
}

// Custom shader for color replacement
const createColorReplacementShader = (
  decalTexture: any,
  skinTexture: any,
  mainTeamColor: string = '#FFFFFF'
) => {
  return new ShaderMaterial({
    uniforms: {
      decalTexture: { value: decalTexture },
      skinTexture: { value: skinTexture },
      mainTeamColor: { value: new Color(mainTeamColor) },
      windowsColor: { value: new Color('#87CEEB') }, // Default sky blue for windows
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D decalTexture;
      uniform sampler2D skinTexture;
      uniform vec3 mainTeamColor;
      uniform vec3 windowsColor;
      
      varying vec2 vUv;
      
      void main() {
        vec4 decalColor = texture2D(decalTexture, vUv);
        vec4 skinColor = texture2D(skinTexture, vUv);
        
        vec3 finalColor = decalColor.rgb;
        float alpha = decalColor.a;
        
        // Check skin color to determine what to replace
        // Main Team Color: Transparent red (#FF000000)
        if (skinColor.r > 0.9 && skinColor.g < 0.1 && skinColor.b < 0.1 && skinColor.a < 0.1) {
          finalColor = mainTeamColor;
        }
        // Secondary Color: Red (#FF0000) - for future implementation
        else if (skinColor.r > 0.9 && skinColor.g < 0.1 && skinColor.b < 0.1 && skinColor.a > 0.9) {
          // Keep secondary color unchanged for now, or implement secondary color logic
          finalColor = decalColor.rgb;
        }
        // Decal Color: Dark red (#2b0000) - keep original decal color
        else if (skinColor.r > 0.15 && skinColor.r < 0.18 && skinColor.g < 0.05 && skinColor.b < 0.05) {
          finalColor = decalColor.rgb;
        }
        // Windows Color: Blue (#0000FF)
        else if (skinColor.b > 0.9 && skinColor.r < 0.1 && skinColor.g < 0.1) {
          finalColor = windowsColor;
        }
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
    side: DoubleSide,
    transparent: true
  });
};

const CarModel: React.FC<CarModelProps> = ({ 
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

  console.log(`Loading model from path: ${modelPath}`);
  console.log(`Texture path: ${texturePath}`);
  console.log(`Skin path: ${skinPath}`);
  
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

  console.log(`Decal texture loaded from: ${texturePath}`, decalTexture);

  const skinTexture = useLoader(
    TextureLoader,
    skinPath ? resolveImagePath(skinPath) : '/models/skins/default_body_skin.png'
  );

  console.log(`Skin texture loaded from: ${skinPath}`, skinTexture);

  // Auto-rotate the model
  useFrame((state, delta) => {
    if (meshRef.current && (isRotating || forceRotation)) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  // Normalize the model and apply texture
  useEffect(() => {
    if (obj) {
      // Calculate bounding box
      const box = new Box3().setFromObject(obj);
      const size = box.getSize(new Vector3());
      const center = box.getCenter(new Vector3());

      // Find the largest dimension
      const maxDimension = Math.max(size.x, size.y, size.z);
      
      // Calculate scale factor to normalize largest dimension to 1
      const scale = maxDimension > 0 ? 1 / maxDimension : 1;
      
      setNormalizedScale(scale);
      setModelCenter(center);

      // console.log(`Model dimensions: ${size.x.toFixed(2)} x ${size.y.toFixed(2)} x ${size.z.toFixed(2)}`);
      // console.log(`Max dimension: ${maxDimension.toFixed(2)}, Scale factor: ${scale.toFixed(4)}`);
      // console.log(`Model center: ${center.x.toFixed(2)}, ${center.y.toFixed(2)}, ${center.z.toFixed(2)}`);

      if (decalTexture && texturePath) {
        obj.traverse((child) => {
          if (child instanceof Mesh) {
            if (child.material) {
              const shouldApplyToMaterial = (materialName?: string) => {
                return materialName?.toLowerCase().includes('body') || 
                       materialName?.toLowerCase().includes('decal') ||
                       materialName?.toLowerCase().includes('ball') ||
                       materialName?.toLowerCase().includes('default') ||
                       !materialName;
              };

              if (Array.isArray(child.material)) {
                child.material.forEach((mat, index) => {
                  mat.dispose?.();
                  if (shouldApplyToMaterial(mat.name)) {
                    if (skinTexture && skinPath) {
                      // Use custom shader for color replacement
                      child.material[index] = createColorReplacementShader(
                        decalTexture,
                        skinTexture,
                        mainTeamColor
                      );
                    } else {
                      // No skin texture, just apply decal with white tint
                      mat.side = DoubleSide;
                      mat.map = decalTexture;
                      mat.color = new Color(mainTeamColor);
                      mat.needsUpdate = true;
                    }
                  }
                });
              } else {
                child.material.dispose?.();
                if (shouldApplyToMaterial(child.material.name)) {
                  if (skinTexture && skinPath) {
                    // Use custom shader for color replacement
                    child.material = createColorReplacementShader(
                      decalTexture,
                      skinTexture,
                      mainTeamColor
                    );
                  } else {
                    // No skin texture, just apply decal with white tint
                    child.material.side = DoubleSide;
                    child.material.map = decalTexture;
                    child.material.color = new Color(mainTeamColor);
                    child.material.needsUpdate = true;
                  }
                }
              }
            }
          }
        });
      }
    }
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

// Error Boundary Component for handling useLoader errors
const CarModelWithErrorBoundary: React.FC<CarModelProps> = (props) => {
  return (
    <Suspense fallback={null}>
      <CarModel {...props} />
    </Suspense>
  );
};

const CarPreview: React.FC<CarPreviewProps> = ({ 
  modelPath, 
  texturePath, 
  skinPath,
  className = '',
  forceRotation = false,
  mainTeamColor = '#FFFFFF'
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleModelError = (errorMessage: string) => {
    console.error('3D Model loading error:', errorMessage);
    setError(errorMessage);
    setIsLoading(false);
  };

  // Create a unique key based on the texture and skin paths to force re-render
  const componentKey = `${texturePath}-${skinPath}-${mainTeamColor}`;

  // Show error outside of Canvas
  if (error) {
    return (
      <div className={`car-preview ${className}`}>
          <div className="car-preview__error">
            <Error message={error} />
          </div>
      </div>
    );
  }

  return (
      <div className={`car-preview ${className}`}>
        {isLoading && (
          <div className="car-preview__loading">
            <LoadingSpinner size={48} />
            <p>Loading 3D model...</p>
          </div>
        )}

        <Canvas
          key={componentKey}
          className="car-preview__canvas"
          onCreated={handleLoadingComplete}
        >
          <PerspectiveCamera makeDefault position={[0.8, 0.5, 0.8]} />
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={0.5}
            maxDistance={20}
            target={[0, 0, 0]}
          />
          
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={0.8}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-5, 5, 5]} intensity={0.3} />
          
          {/* Environment for reflections */}
          <Environment preset="studio" />
          
          <CarModelWithErrorBoundary
            modelPath={modelPath}
            texturePath={texturePath}
            skinPath={skinPath}
            onError={handleModelError}
            forceRotation={forceRotation}
            mainTeamColor={mainTeamColor}
          />
        </Canvas>
      </div>

  );
};

export default CarPreview;