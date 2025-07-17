import React, { useState, useEffect } from 'react';
import type { DecalTextures } from '@/types';
import Placeholder from '@/assets/placeholder.jpg';
import { convertFileSrc } from '@tauri-apps/api/core';
import DropdownMenu from '@/components/DropdownMenu/DropdownMenu';
import useCollection from '@/hooks/useCollection';


import './DecalCard.scss';
import { FaEye, FaTrash } from 'react-icons/fa';

interface DecalCardProps {
  decal: DecalTextures;
}

const DecalCard = ({ decal }: DecalCardProps) => {

    const { removeDecalVariant } = useCollection();

    const generateItems = (variant: string) => [
        {
            children: (
                <div className="variant-dropdown">
                    <FaEye className="icon" />
                    Preview
                </div>
            ),
            onClick: () => {
                // Logic to preview the decal
                console.log(`Preview decal ${decal.name}`);
            },
            className: "add-variant",
        },
        {
            children: (
                <div className="variant-dropdown remove-decal">
                    <FaTrash className="icon" />
                    Remove
                </div>
            ),
            onClick: () => {
                removeDecalVariant(decal.name, variant);
            },
            className: "remove-decal",
        },
    ];

    return (
        <div className="decal-card">
            {decal.preview_path ? (
                <img src={convertFileSrc(decal.preview_path)} alt={`${decal.name} preview`} className="decal-image" />
            ) : (
                <img src={Placeholder} alt="Placeholder image" className="decal-image" />
            )}
            <h2>{decal.name}</h2>
            <div className="variants">
                {decal.variants.map((variant) => (
                    <DropdownMenu 
                        key={variant} 
                        items={generateItems(variant)} 
                        button={<div className="variant">{variant}</div>} 
                    />
                ))}
            </div>
        </div>
    )

}

export default DecalCard;
