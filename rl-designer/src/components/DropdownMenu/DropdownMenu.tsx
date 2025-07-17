import React, { useState, useEffect, useRef } from 'react';
import './DropdownMenu.scss';
import type { DropdownItem } from './Dropdown';
import Dropdown from './Dropdown';

export interface DropdownMenuProps {
  items: DropdownItem[];
  button?: React.ReactNode;
}


const DropdownMenu: React.FC<DropdownMenuProps> = ({ items, button }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="dropdown-menu" ref={dropdownRef}>
      <div
        // className="dropdown-menu__toggle"
        onClick={toggleDropdown}
      >
        { button ? (
          button
        ) : (
          <div className="dropdown-menu__toggle-icon">
            <span className="dropdown-menu__toggle-line"></span>
            <span className="dropdown-menu__toggle-line"></span>
            <span className="dropdown-menu__toggle-line"></span>
          </div>
        )}
      </div>
      {isOpen && items.length > 0 && (
        <Dropdown items={items} setIsOpen={setIsOpen} />
      )}
    </div>
  );
};

export default DropdownMenu;