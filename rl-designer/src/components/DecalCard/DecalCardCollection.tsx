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

    const generateItems = (variant: string) => {
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
            <DecalCardDesign decal={decal} generateDropdownItems={generateItems} previewImage={renderImage(decal)} />
        </>
    );
};

export default DecalCardCollection;