import React, { useState, useEffect, useRef } from 'react';
import type { DecalTextures } from '@/types';
import DropdownMenu from '@/components/DropdownMenu/DropdownMenu';
import Dropdown from '@/components/DropdownMenu/Dropdown';
import type { DropdownItem } from '../DropdownMenu/Dropdown';


import './DecalCard.scss';

interface DecalCardProps {
  decal: DecalTextures;
  previewImage: React.ReactNode;
  generateGlobalDropdownItems?: () => DropdownItem[];
  generateVariantDropdownItems?: (variant: string) => DropdownItem[];
  extraVariantClasses?: (variant: string) => string;
}

// TODO : add the card click to download all variants
const DecalCard = ({ 
    decal,
    previewImage,
    generateGlobalDropdownItems = () => [],
    generateVariantDropdownItems = (variant: string) => [],
    extraVariantClasses = (variant: string) => '',
}: DecalCardProps) => {

    const [parentDropdownOpen, setParentDropdownOpen] = useState(false);

    const stopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent the click from bubbling up
    }

    const handleChildDropdownOpen = () => {
        // Close parent dropdown when any child dropdown opens
        setParentDropdownOpen(false);
    };

    return (
        <DropdownMenu
        isOpen={parentDropdownOpen}
        setIsOpen={setParentDropdownOpen}
        button={<div className="decal-card">
            {previewImage}
            <h2>{decal.name}</h2>
            <div className="variants" onClick={stopPropagation}>
                {decal.variants.map((variant) => (
                    <DropdownMenu 
                        key={variant} 
                        onOpen={handleChildDropdownOpen}
                        items={generateVariantDropdownItems(variant)}
                        button={
                        <div className={`variant ${extraVariantClasses ? extraVariantClasses(variant) : ''}`}>
                            {variant}
                        </div>
                    } 
                    />
                ))}
            </div>
        </div>}
        items={generateGlobalDropdownItems()}
        dropdownAtCursor
    />
    );

}

export default DecalCard;
