import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import LoadingSpinner from '@/components/Loading/LoadingSpinner';
import { Error } from '@/components'
import Model3D from './Model3D';
import type { Model3DProps } from './Model3D';

import './Model3DPreview.scss'
import type { ModelDataConfig, ModelDataPaths, ModelDataSetup } from '@/types/modelData';

interface Model3DPreviewProps {
    modelDataPaths: ModelDataPaths;
    modelDataConfig?: ModelDataConfig;
    modelDataSetup: ModelDataSetup;
    className?: string;
}

// Error Boundary Component for handling useLoader errors
const Model3DWithErrorBoundary: React.FC<Model3DProps> = (props) => {
  return (
    <Suspense fallback={null}>
      <Model3D {...props} />
    </Suspense>
  );
};

const Model3DPreview: React.FC<Model3DPreviewProps> = ({
  modelDataPaths,
  modelDataConfig,
  modelDataSetup,
  className = '',
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
  const componentKey = Object.entries(modelDataPaths)
    .map(([key, value]) => `${key}:${value}`)
    .join('-');

  // Show error outside of Canvas
  if (error) {
    return (
      <div className={`model3D-preview ${className}`}>
          <div className="model3D-preview__error">
            <Error message={error} />
          </div>
      </div>
    );
  }

  return (
      <div className={`model3D-preview ${className}`}>
        {isLoading && (
          <div className="model3D-preview__loading">
            <LoadingSpinner size={48} />
            <p>Loading 3D model...</p>
          </div>
        )}

        <Canvas
          key={componentKey}
          className="model3D-preview__canvas"
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
          <ambientLight intensity={0.6} color="#ffffff" />
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={0.8}
            color="#ffffff"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <directionalLight 
            position={[-3, 2, 3]} 
            intensity={0.4}
            color="#ffffff"
          />
          <pointLight position={[-5, 5, 5]} intensity={0.2} color="#ffffff" />
          
          {/* Environment for reflections */}
          {/* <Environment preset="sunset" /> */}
          <Environment preset='warehouse' />

          <Model3DWithErrorBoundary
            modelDataPaths={modelDataPaths}
            modelDataConfig={modelDataConfig}
            modelDataSetup={modelDataSetup}
            onError={handleModelError}
          />
        </Canvas>
      </div>

  );
};

export default Model3DPreview;