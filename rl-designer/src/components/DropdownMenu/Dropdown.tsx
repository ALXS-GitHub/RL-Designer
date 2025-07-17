import React, { useState, useEffect, useRef } from 'react';

export interface DropdownItem {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

export interface DropdownProps {
  items: DropdownItem[];
  setIsOpen?: (isOpen: boolean) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ 
    items,
    setIsOpen,
}) => {

    const handleItemClick = (action: () => void) => {
        action();
        setIsOpen?.(false);
    };

    return (
    <div className="dropdown-menu__content" role="menu">
        {items.map((item, index) => (
        <div
            key={index}
            className={`dropdown-menu__item ${item.className || ''}`}
            onClick={() => handleItemClick(item.onClick)}
            role="menuitem"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleItemClick(item.onClick)}
        >
            {item.children}
        </div>
        ))}
    </div>
    );
}

export default Dropdown;

