import React, { useState, useRef, useEffect } from 'react';
import { FaPalette } from 'react-icons/fa';
import { COLORS } from '@/constants/colors';
import type { ColorType } from '@/constants/colors';
import './ColorPicker.scss';

interface ColorPickerProps {
  selectedColors: Record<ColorType, string>;
  onColorChange: (colorType: ColorType, color: string) => void;
  className?: string;
  position?: 'top' | 'bottom';
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColors,
  onColorChange,
  className = '',
  position = 'top'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempColors, setTempColors] = useState<Record<ColorType, string>>(selectedColors);
  const [activeColorType, setActiveColorType] = useState<ColorType | null>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveColorType(null);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Update temp colors when selected colors change
  useEffect(() => {
    setTempColors(selectedColors);
  }, [selectedColors]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTempColors(selectedColors); // Reset temp colors when opening
      setActiveColorType(null);
    }
  };

  const handleColorTypeSelect = (colorType: ColorType) => {
    setActiveColorType(colorType);
  };

  const handleTempColorChange = (color: string) => {
    if (activeColorType) {
      setTempColors(prev => ({
        ...prev,
        [activeColorType]: color
      }));
    }
  };

  const handleConfirm = () => {
    // Apply all color changes
    Object.entries(tempColors).forEach(([colorType, color]) => {
      if (color !== selectedColors[colorType as ColorType]) {
        onColorChange(colorType as ColorType, color);
      }
    });
    setIsOpen(false);
    setActiveColorType(null);
  };

  const handleCancel = () => {
    setTempColors(selectedColors); // Reset to original colors
    setIsOpen(false);
    setActiveColorType(null);
  };

  // Get the primary color for the trigger preview (main team color)
  const primaryColor = selectedColors.mainTeamColor;

  return (
    <div className={`color-picker ${className}`} ref={colorPickerRef}>
      <button
        className="color-picker__trigger"
        onClick={handleToggle}
        aria-label="Open color picker"
      >
        <div 
          className="color-picker__preview" 
          style={{ backgroundColor: primaryColor }}
        />
        <FaPalette className="color-picker__icon" />
      </button>

      {isOpen && (
        <div className={`color-picker__dropdown color-picker__dropdown--${position}`}>
          <div className="color-picker__panel">
            <div className="color-picker__input-section">
              <label className="color-picker__label">Choose Colors:</label>
              
              <div className="color-picker__color-types">
                {Object.values(COLORS).map((colorType) => (
                  <button
                    key={colorType}
                    type="button"
                    className={`color-picker__color-type${activeColorType === colorType ? ' color-picker__color-type--selected' : ''}`}
                    onClick={() => handleColorTypeSelect(colorType)}
                  >
                    <div 
                      className="color-picker__color-preview"
                      style={{ backgroundColor: tempColors[colorType] }}
                    />
                    {/* TODO : better function to handle spaces in words */}
                    {colorType.charAt(0).toUpperCase() + colorType.slice(1)} 
                  </button>
                ))}
              </div>

              {activeColorType && (
                <div className="color-picker__color-input">
                  <label className="color-picker__input-label">
                    {activeColorType.charAt(0).toUpperCase() + activeColorType.slice(1)} Color:
                  </label>
                  <input
                    type="color"
                    value={tempColors[activeColorType]}
                    onChange={(e) => handleTempColorChange(e.target.value)}
                    className="color-picker__input"
                    title={`Select ${activeColorType.charAt(0).toUpperCase() + activeColorType.slice(1)} color`}
                  />
                  <div className="color-picker__value">{tempColors[activeColorType]}</div>
                </div>
              )}
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