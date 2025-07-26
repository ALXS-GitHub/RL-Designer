import React, { useState, useEffect, useRef } from 'react';
import type { DecalTextures } from '@/types';
import DropdownMenu from '@/components/DropdownMenu/DropdownMenu';
import Dropdown from '@/components/DropdownMenu/Dropdown';
import type { DropdownItem } from '../DropdownMenu/Dropdown';


import './DecalCard.scss';

interface DecalCardProps {
  decal: DecalTextures;
  previewImage: (variant_name: string) => React.ReactNode;
  generateGlobalDropdownItems?: () => DropdownItem[];
  generateVariantDropdownItems?: (variant: string) => DropdownItem[];
  extraVariantClasses?: (variant: string) => string;
}

// TODO : add the card click to download all variants
const DecalCard = ({ 
    decal,
    previewImage,
    generateGlobalDropdownItems = () => [],
    generateVariantDropdownItems = (variant_name: string) => [],
    extraVariantClasses = (variant_name: string) => '',
}: DecalCardProps) => {

    if (!decal || decal.variants.length === 0) {
        console.warn('DecalCard received an empty decal or no variants:', decal);
        throw new Error('DecalCard received an empty decal or no variants');
    }

    const [parentDropdownOpen, setParentDropdownOpen] = useState(false);
    const [lastHoveredVariant, setLastHoveredVariant] = useState<string>(decal.variants[0].variant_name);

    const stopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent the click from bubbling up
    }

    const handleVariantHover = (variantName: string) => {
        setLastHoveredVariant(variantName);
    };

    const handleChildDropdownOpen = () => {
        // Close parent dropdown when any child dropdown opens
        setParentDropdownOpen(false);
    };

    return (
        <DropdownMenu
        isOpen={parentDropdownOpen}
        setIsOpen={setParentDropdownOpen}
        button={<div className="decal-card">
            {previewImage(lastHoveredVariant)}
            <h2>{decal.name}</h2>
            <div className="variants" onClick={stopPropagation}>
                {decal.variants.map((variant) => (
                    <DropdownMenu 
                        key={variant.variant_name} 
                        onOpen={handleChildDropdownOpen}
                        items={generateVariantDropdownItems(variant.variant_name)}
                        button={
                        <div 
                            className={`variant ${extraVariantClasses ? extraVariantClasses(variant.variant_name) : ''}`}
                            onMouseEnter={() => handleVariantHover(variant.variant_name)}
                        >
                            {variant.variant_name}
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
