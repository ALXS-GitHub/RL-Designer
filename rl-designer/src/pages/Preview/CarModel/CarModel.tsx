import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { TextureLoader, Mesh, Group, Box3, Vector3, DoubleSide } from 'three';
import { convertFileSrc } from '@tauri-apps/api/core';
import LoadingSpinner from '@/components/Loading/LoadingSpinner';
import { Loading, Error } from '@/components'
import useModelSettingsStore from '@/stores/modelSettingsStore';
import { resolveImagePath } from '@/utils/images';

import './CarPreview.scss';

interface CarModelProps {
  modelPath: string;
  texturePath?: string;
  onError: (error: string) => void;
  forceRotation?: boolean;
}

interface CarPreviewProps {
  modelPath: string;
  texturePath?: string;
  className?: string;
  forceRotation?: boolean;
}

const CarModel: React.FC<CarModelProps> = ({ modelPath, texturePath, onError, forceRotation }) => {
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
  const texture = useLoader(
    TextureLoader, 
    resolveImagePath(texturePath)
  );

  // Auto-rotate the model
  useFrame((state, delta) => {
    if (meshRef.current && (isRotating || forceRotation)) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  console.log("rendering : ", obj, texture, texturePath)

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

      // Apply texture to the model (only if we have a real texture path)
      if (texture && texturePath) {
        obj.traverse((child) => {
          if (child instanceof Mesh) {
            // Apply texture to materials that should receive the decal
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((mat) => {
                  mat.side = DoubleSide;
                  if (mat.name?.toLowerCase().includes('body') || 
                      mat.name?.toLowerCase().includes('decal') ||
                      mat.name?.toLowerCase().includes('ball') ||
                      mat.name?.toLowerCase().includes('default') ||
                      !mat.name) {
                    mat.map = texture;
                    mat.needsUpdate = true;
                  }
                });
              } else {
                child.material.side = DoubleSide;
                if (child.material.name?.toLowerCase().includes('body') || 
                  child.material.name?.toLowerCase().includes('decal') ||
                  child.material.name?.toLowerCase().includes('ball') ||
                  child.material.name?.toLowerCase().includes('default') ||
                  !child.material.name) {
                child.material.map = texture;
                child.material.needsUpdate = true;
              }
              }
            }
          }
        });
      }
    }
  }, [obj, texture, texturePath]);

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
  className = '',
  forceRotation = false
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
            onError={handleModelError}
            forceRotation={forceRotation}
          />
        </Canvas>
      </div>

  );
};

export default CarPreview;