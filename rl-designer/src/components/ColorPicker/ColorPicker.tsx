import React, { useState, useRef, useEffect } from 'react';
import { FaPalette } from 'react-icons/fa';
import './ColorPicker.scss';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  className?: string;
  position?: 'top' | 'bottom';
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorChange,
  className = '',
  position = 'top'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempColor, setTempColor] = useState(selectedColor);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
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

  // Update temp color when selected color changes
  useEffect(() => {
    setTempColor(selectedColor);
  }, [selectedColor]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTempColor(selectedColor); // Reset temp color when opening
    }
  };

  const handleTempColorChange = (color: string) => {
    setTempColor(color);
  };

  const handleConfirm = () => {
    onColorChange(tempColor);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempColor(selectedColor); // Reset to original color
    setIsOpen(false);
  };

  return (
    <div className={`color-picker ${className}`} ref={colorPickerRef}>
      <button
        className="color-picker__trigger"
        onClick={handleToggle}
        aria-label="Open color picker"
      >
        <div 
          className="color-picker__preview" 
          style={{ backgroundColor: selectedColor }}
        />
        <FaPalette className="color-picker__icon" />
      </button>

      {isOpen && (
        <div className={`color-picker__dropdown color-picker__dropdown--${position}`}>
          <div className="color-picker__panel">
            <div className="color-picker__input-section">
              <label className="color-picker__label">Choose Color:</label>
              <input
                type="color"
                value={tempColor}
                onChange={(e) => handleTempColorChange(e.target.value)}
                className="color-picker__input"
                title="Select custom color"
              />
              <div className="color-picker__value">{tempColor}</div>
            </div>
            
            <div className="color-picker__actions">
              <button
                type="button"
                className="color-picker__button color-picker__button--cancel"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="color-picker__button color-picker__button--confirm"
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

export default ColorPicker;