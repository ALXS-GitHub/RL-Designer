import React, { useState, useEffect, useRef } from 'react';
import './DropdownMenu.scss';
import type { DropdownItem } from './Dropdown';
import Dropdown from './Dropdown';

export interface DropdownMenuProps {
  items: DropdownItem[];
  button?: React.ReactNode;
  dropdownAtCursor?: boolean;
  className?: string;
  dropdownClassName?: string;
  onOpen?: () => void;
  // Add external control props
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ 
  items, 
  button,
  dropdownAtCursor = false,
  className = '',
  dropdownClassName = '',
  onOpen,
  isOpen: externalIsOpen,
  setIsOpen: externalSetIsOpen
 }) => {
  // Use internal state if external control is not provided
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Determine which state to use
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalSetIsOpen || setInternalIsOpen;

  const toggleDropdown = (event: React.MouseEvent) => {
    if (dropdownAtCursor) {
      // Capture cursor position relative to the viewport
      setCursorPosition({
        x: event.clientX,
        y: event.clientY
      });
    }

    if (!isOpen && onOpen) {
      onOpen();
    }

    setIsOpen(!isOpen);
  };

  // Calculate dropdown position based on cursor position and viewport boundaries
  const getDropdownStyle = (): React.CSSProperties => {
    if (!dropdownAtCursor || !isOpen) return {};
    
    const dropdownWidth = 0; // Estimated dropdown width
    const dropdownHeight = 0; // Estimated height based on items
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let left = cursorPosition.x;
    let top = cursorPosition.y;
    
    // Adjust horizontal position if dropdown would go off-screen
    if (left + dropdownWidth > viewportWidth) {
      left = cursorPosition.x - dropdownWidth;
    }
    
    // Adjust vertical position if dropdown would go off-screen
    if (top + dropdownHeight > viewportHeight) {
      top = cursorPosition.y - dropdownHeight;
    }
    
    // Ensure dropdown doesn't go off the left edge
    if (left < 8) {
      left = 8; // Small margin from edge
    }
    
    // Ensure dropdown doesn't go off the top edge
    if (top < 8) {
      top = 8; // Small margin from edge
    }
    
    return {
      position: 'fixed' as const,
      left: `${left}px`,
      top: `${top}px`,
      zIndex: 1000,
    };
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen && dropdownAtCursor) {
        // Close dropdown on scroll
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      if (dropdownAtCursor) {
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll, { passive: true });
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isOpen, dropdownAtCursor, setIsOpen]);

  return (
    <div className={`dropdown-menu ${className} ${dropdownAtCursor ? 'dropdown-menu--cursor' : ''}`} ref={dropdownRef}>
      <div onClick={toggleDropdown}>
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
        <div 
          className={`dropdown-menu__content-wrapper ${dropdownAtCursor ? 'dropdown-menu__content-wrapper--cursor' : ''}`}
          style={dropdownAtCursor ? getDropdownStyle() : {}}
        >
          <Dropdown items={items} setIsOpen={setIsOpen} className={dropdownClassName} />
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;