import React, { useState, useEffect, useRef } from 'react';
import PreviewLoader from '../../components/Model3D/Model3DLoader';
import { useParams } from 'react-router-dom';
import useModelSettingsStore from '@/stores/modelSettingsStore';
import Button from '@/components/Button/Button';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import ColorPicker from '@/components/ColorPicker/ColorPicker';
import MaterialPicker from '@/components/MaterialPicker/MaterialPicker'

import './Preview.scss';

const Preview: React.FC = () => {
  const { decal, variant_name } = useParams<{ decal: string; variant_name: string }>();
  const { isRotating, setIsRotating, colors, setColors, material, setMaterial } = useModelSettingsStore();
  const [selectedVariantName, setSelectedVariantName] = useState(variant_name);
  const previewLoaderRef = useRef<any>(null);

  const handleChangeVariant = (dir: -1 | 1) => {
    const newVariant = previewLoaderRef.current?.onChangeVariant(dir);
    if (newVariant) {
      setSelectedVariantName(newVariant);
    }
  };
  useEffect(() => {
    setSelectedVariantName(variant_name);
  }, [variant_name]);
  return (
    <div className="preview">
      <div className="preview__header">
        <h3 className="preview__title">{decal}</h3>
        <div className="preview__variant">
          <Button
            className="preview__variant-change"
            onClick={() => handleChangeVariant(-1)}
          >
            <FaArrowLeft />
          </Button>
          <span className="preview__variant-name">{selectedVariantName}</span>
          <Button
            className="preview__variant-change"
            onClick={() => handleChangeVariant(1)}
          >
            <FaArrowRight />
          </Button>
        </div>
      </div>
      <div className="preview__viewport">
        <PreviewLoader decal={decal} variant_name={selectedVariantName} ref={previewLoaderRef} />
      </div>
      <div className="preview__controls">
        <p className="preview__instructions">
          Drag to rotate • Scroll to zoom • Right-click to pan
        </p>
        <div className="preview__actions">
            <ColorPicker
              selectedColors={colors}
              onColorChange={setColors}
              className="preview__color-picker"
            />
            <MaterialPicker
              selectedMaterial={material}
              onMaterialChange={setMaterial}
              className="preview__material-picker"
            />
            <Button 
              className="preview__rotate-toggle" 
              onClick={() => setIsRotating(!isRotating)} 
              size='small'
            >
              {isRotating ? 'Stop Rotation' : 'Start Rotation'}
            </Button>
          </div>
      </div>
    </div>
  );
};

export default Preview;