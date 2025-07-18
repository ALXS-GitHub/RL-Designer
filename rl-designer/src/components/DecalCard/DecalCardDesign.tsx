import React, { useState, useEffect } from 'react';
import type { DecalTextures } from '@/types';
import Placeholder from '@/assets/placeholder.jpg';
import { convertFileSrc } from '@tauri-apps/api/core';
import DropdownMenu from '@/components/DropdownMenu/DropdownMenu';
import useCollection from '@/hooks/useCollection';
import { useExplorer } from '@/hooks/useExplorer';
import type { DropdownItem } from '../DropdownMenu/Dropdown';


import './DecalCard.scss';
import { FaEye, FaTrash, FaDownload, FaSync } from 'react-icons/fa';

interface DecalCardProps {
  decal: DecalTextures;
  previewImage: React.ReactNode;
  generateDropdownItems?: (variant: string) => DropdownItem[];
  extraVariantClasses?: (variant: string) => string;
}

// TODO for better management, the decalCard design should have its own component, and 
// we should make two separate components to manage the logic for collection vs git.
const DecalCard = ({ 
    decal,
    previewImage,
    generateDropdownItems = (variant: string) => [],
    extraVariantClasses = (variant: string) => '',
}: DecalCardProps) => {

    return (
        <div className="decal-card">
            {previewImage}
            <h2>{decal.name}</h2>
            <div className="variants">
                {decal.variants.map((variant) => (
                    <DropdownMenu 
                        key={variant} 
                        items={generateDropdownItems(variant)}
                        button={
                        <div className={`variant ${extraVariantClasses ? extraVariantClasses(variant) : ''}`}>
                            {variant}
                        </div>
                    } 
                    />
                ))}
            </div>
        </div>
    )

}

export default DecalCard;
