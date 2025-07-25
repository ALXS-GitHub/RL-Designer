import React from 'react';
import DropdownMenu from '@/components/DropdownMenu/DropdownMenu';
import type { DropdownItem } from '@/components/DropdownMenu/Dropdown';
import type { ElementType } from '@/constants/elements';
import { ELEMENTS } from '@/constants/elements';
import './ElementTypeSelect.scss';

interface ElementTypeSelectProps {
  selectedElement: ElementType;
  onElementChange: (element: ElementType) => void;
  className?: string;
  disabled?: boolean;
  showLabel?: boolean;
  customLabels?: Partial<Record<ElementType, string>>;
}

const ElementTypeSelect: React.FC<ElementTypeSelectProps> = ({
  selectedElement,
  onElementChange,
  className = '',
  disabled = false,
  showLabel = true,
  customLabels = {}
}) => {
  
  const getElementLabel = (element: ElementType): string => {
    if (customLabels[element]) {
      return customLabels[element]!;
    }
    return `${element.charAt(0).toUpperCase() + element.slice(1)} Decals`;
  };

  const getCurrentLabel = (): string => {
    return getElementLabel(selectedElement);
  };

  const dropdownItems: DropdownItem[] = Object.values(ELEMENTS).map((element: ElementType) => ({
    children: (
      <div className="element-select__item">
        <span className="element-select__item-label">
          {getElementLabel(element)}
        </span>
        {element === selectedElement && (
          <span className="element-select__item-check">✓</span>
        )}
      </div>
    ),
    onClick: () => onElementChange(element),
    className: element === selectedElement ? 'element-select__item--selected' : ''
  }));

  const customButton = (
    <div className={`element-select__button ${disabled ? 'element-select__button--disabled' : ''}`}>
      {showLabel && (
        <span className="element-select__label">Type:</span>
      )}
      <span className="element-select__current">
        {getCurrentLabel()}
      </span>
      <span className="element-select__arrow">▼</span>
    </div>
  );

  if (disabled) {
    return (
      <div className={`element-select element-select--disabled ${className}`}>
        {customButton}
      </div>
    );
  }

  return (
    <div className={`element-select ${className}`}>
      <DropdownMenu 
        items={dropdownItems}
        button={customButton}
      />
    </div>
  );
};

export default ElementTypeSelect;