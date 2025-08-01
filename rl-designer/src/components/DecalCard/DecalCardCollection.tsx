import React from 'react';
import type { DecalTextures } from '@/types';
import { useNavigate } from 'react-router-dom';
import Placeholder from '@/assets/placeholder.jpg';
import { convertFileSrc } from '@tauri-apps/api/core';
import useCollection from '@/hooks/useCollection';

import DecalCardDesign from "./DecalCardDesign"
import { FaEye, FaTrash } from 'react-icons/fa';
import { useConfirmationDialogStore } from '@/stores/confirmationDialogStore';

interface DecalCardCollectionProps {
  decal: DecalTextures;
}

const DecalCardCollection: React.FC<DecalCardCollectionProps> = ({ decal }) => {

    const { removeDecalVariant } = useCollection();
    const { openConfirmationDialog } = useConfirmationDialogStore();

    const navigate = useNavigate();

    // TODO update this to change the image on hover variants
    const renderImage = (variant_name: string) => {
        const variant = decal.variants.find(v => v.variant_name === variant_name);
        if (variant?.preview_path) {
            return <img src={convertFileSrc(variant.preview_path)} alt={`${decal.name} preview`} className="decal-image" />;
        }

        return <img src={Placeholder} alt="Placeholder image" className="decal-image" />;
    }

    const generateGlobalDropdownItems = (lastHoveredVariant?: string) => {
        const items = [
            {
                children: (
                    <div className="global-dropdown preview-decal">
                        <FaEye className="icon" />
                        Preview
                    </div>
                ),
                onClick: () => {
                    navigate(`/preview/${decal.name}/${lastHoveredVariant || decal.variants[0].variant_name}`);
                },
            },
            {
                children: (
                    <div className="global-dropdown remove-decal">
                        <FaTrash className="icon" />
                        Remove All
                    </div>
                ),
                onClick: () => {
                    // Logic to remove the decal
                    openConfirmationDialog(
                        `Are you sure you want to remove all variants for decal ${decal.name}?`,
                        () => {
                            for (const variant of decal.variants) {
                                removeDecalVariant(decal.name, variant.variant_name);
                            }
                        },
                        () => {}
                    );
                },
            }
        ];
        return items;
    }

    const generateVariantItems = (variant: string) => {
        const items = [
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
                    navigate(`/preview/${decal.name}/${variant}`);
                },
            },
            {
                children: (
                    <div className="variant-dropdown remove-decal">
                        <FaTrash className="icon" />
                        Remove
                    </div>
                ),
                onClick: () => {
                    openConfirmationDialog(
                        `Are you sure you want to remove the decal ${decal.name} (${variant})?`,
                        () => {
                            removeDecalVariant(decal.name, variant);
                        },
                        () => {}
                    );
                },
            }
        ];
        return items;
    }
    return (
        <>
            <DecalCardDesign 
                decal={decal} 
                generateGlobalDropdownItems={generateGlobalDropdownItems}
                generateVariantDropdownItems={generateVariantItems} 
                previewImage={renderImage} 
            />
        </>
    );
};

export default DecalCardCollection;