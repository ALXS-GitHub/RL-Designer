import React from 'react';
import type { DecalTextures } from '@/types';
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

    const renderImage = (decal: DecalTextures) => {
        if (decal.preview_path) {
            return <img src={convertFileSrc(decal.preview_path)} alt={`${decal.name} preview`} className="decal-image" />;
        }
        return <img src={Placeholder} alt="Placeholder image" className="decal-image" />;
    }

    const generateGlobalDropdownItems = () => {
        const items = [
            {
                children: (
                    <div className="global-dropdown preview-decal">
                        <FaEye className="icon" />
                        Preview
                    </div>
                ),
                onClick: () => {
                    // Logic to preview the decal
                    console.log(`Preview decal ${decal.name}`);
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
                                removeDecalVariant(decal.name, variant);
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
                previewImage={renderImage(decal)} 
            />
        </>
    );
};

export default DecalCardCollection;