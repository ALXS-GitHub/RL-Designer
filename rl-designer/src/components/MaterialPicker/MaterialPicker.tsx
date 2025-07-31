import React, { useState, useRef, useEffect } from 'react';
import { FaCogs } from 'react-icons/fa';
import { DEFAULT_MATERIALS } from '@/constants/materials';
import type { DefaultMaterialType } from '@/constants/materials';
import './MaterialPicker.scss';

interface MaterialPickerProps {
  selectedMaterial: DefaultMaterialType;
  onMaterialChange: (material: DefaultMaterialType) => void;
  className?: string;
  position?: 'top' | 'bottom';
}

const MaterialPicker: React.FC<MaterialPickerProps> = ({
  selectedMaterial,
  onMaterialChange,
  className = '',
  position = 'top'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempMaterial, setTempMaterial] = useState<DefaultMaterialType>(selectedMaterial);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    setTempMaterial(selectedMaterial);
  }, [selectedMaterial]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setTempMaterial(selectedMaterial);
  };

  const handleTempMaterialChange = (material: DefaultMaterialType) => {
    setTempMaterial(material);
  };

  const handleConfirm = () => {
    onMaterialChange(tempMaterial);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempMaterial(selectedMaterial);
    setIsOpen(false);
  };

  return (
    <div className={`material-picker ${className}`} ref={pickerRef}>
      <button
        className="material-picker__trigger"
        onClick={handleToggle}
        aria-label="Open material picker"
      >
        <div className={`material-picker__preview material-picker__preview--${selectedMaterial}`} />
        <FaCogs className="material-picker__icon" />
      </button>

      {isOpen && (
        <div className={`material-picker__dropdown material-picker__dropdown--${position}`}>
          <div className="material-picker__panel">
            <div className="material-picker__input-section">
              <label className="material-picker__label">Choose Material:</label>
              <div className="material-picker__options">
                {Object.values(DEFAULT_MATERIALS).map((mat) => (
                  <button
                    key={mat}
                    type="button"
                    className={`material-picker__option${tempMaterial === mat ? ' material-picker__option--selected' : ''}`}
                    onClick={() => handleTempMaterialChange(mat)}
                  >
                    <span className={`material-picker__preview material-picker__preview--${mat}`} />
                    {mat.charAt(0).toUpperCase() + mat.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="material-picker__actions">
              <button
                type="button"
                className="material-picker__button material-picker__button--cancel"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="material-picker__button material-picker__button--confirm"
                onClick={handleConfirm}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialPicker;