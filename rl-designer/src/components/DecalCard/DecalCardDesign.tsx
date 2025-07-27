import React, { useState, useEffect, useRef } from 'react';
import type { DecalTextures } from '@/types';
import DropdownMenu from '@/components/DropdownMenu/DropdownMenu';
import Dropdown from '@/components/DropdownMenu/Dropdown';
import type { DropdownItem } from '../DropdownMenu/Dropdown';
import PreviewLoader from '@/pages/Preview/PreviewLoader';
import { FaEllipsisH } from 'react-icons/fa';


import './DecalCard.scss';

interface DecalCardProps {
  decal: DecalTextures;
  previewImage: (variant_name: string) => React.ReactNode;
  generateGlobalDropdownItems?: (lastHoveredVariant?: string) => DropdownItem[];
  generateVariantDropdownItems?: (variant: string) => DropdownItem[];
  extraVariantClasses?: (variant: string) => string;
}

// TODO : add the card click to download all variants
const DecalCard = ({ 
    decal,
    previewImage,
    generateGlobalDropdownItems = (lastHoveredVariant?: string) => [],
    generateVariantDropdownItems = (variant_name: string) => [],
    extraVariantClasses = (variant_name: string) => '',
}: DecalCardProps) => {

    if (!decal || decal.variants.length === 0) {
        console.warn('DecalCard received an empty decal or no variants:', decal);
        throw new Error('DecalCard received an empty decal or no variants');
    }

    const [lastHoveredVariant, setLastHoveredVariant] = useState<string>(decal.variants[0].variant_name);
    const [isHovering, setIsHovering] = useState(false);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const stopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent the click from bubbling up
    }

    const handleCardHover = () => {
        // Clear any existing timeout
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
        
        // Set a timeout to enable hovering after 100ms
        hoverTimeoutRef.current = setTimeout(() => {
            setIsHovering(true);
        }, 100);
    }

    const handleVariantHover = (variantName: string) => {
        setLastHoveredVariant(variantName);
    };

    const handleCardHoverEnd = () => {
        // Clear the timeout if user stops hovering before 100ms
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
        
        setIsHovering(false);
    }

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="decal-card">
            <div
                className={`decal-card__container ${isHovering ? 'hovered' : ''}`}
                onMouseEnter={handleCardHover}
                onMouseLeave={handleCardHoverEnd}
            >
                <div className="decal-card__preview">
                    {isHovering ? (
                        <PreviewLoader 
                            key={lastHoveredVariant}
                            decal={decal.name} 
                            variant_name={lastHoveredVariant} 
                            className="decal-card__preview-image"
                            forceRotation={true}
                        />
                    ) : (
                        previewImage(lastHoveredVariant)
                    )}
                </div>
                <h2>{decal.name}</h2>
                <div className="variants" onClick={stopPropagation}>
                        <DropdownMenu
                            items={generateGlobalDropdownItems(lastHoveredVariant)}
                            button={
                                <div className="decal-card__global-dropdown-button">
                                    <FaEllipsisH />
                                </div>
                            }
                        />
                    {decal.variants.map((variant) => (
                        <DropdownMenu 
                            key={variant.variant_name} 
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
            </div>
        </div>
    );

}

export default DecalCard;
