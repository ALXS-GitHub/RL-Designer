import React from 'react';
import type { DecalTextures } from '@/types';
import Placeholder from '@/assets/placeholder.jpg';
import { useExplorerActions } from '@/hooks/useExplorer';

import DecalCardDesign from "./DecalCardDesign"
import useCollection from '@/hooks/useCollection';
import { FaEye, FaDownload, FaSync } from 'react-icons/fa';

interface DecalCardExplorerProps {
  decal: DecalTextures;
}

const DecalCardExplorer: React.FC<DecalCardExplorerProps> = ({ decal }) => {

    const { downloadDecalVariant } = useExplorerActions();
    const { decals: collectionDecals } = useCollection();

    const isVariantInstalled = (decalName: string, variant: string) => {
        return collectionDecals.some(d => d.name === decalName && d.variants.includes(variant));
    }

    const renderImage = (decal: DecalTextures) => {
        if (decal.preview_path && decal.preview_path.startsWith('http')) {
            return <img src={decal.preview_path} alt={`${decal.name} preview`} className="decal-image" />;
        }
        return <img src={Placeholder} alt="Placeholder image" className="decal-image" />;
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
                children: isVariantInstalled(decal.name, variant) ? (
                    <div className="variant-dropdown update-decal">
                        <FaSync className="icon" />
                        Update
                    </div>
                ) : (
                    <div className="variant-dropdown download-decal">
                        <FaDownload className="icon" />
                        Download
                    </div>
                ),
                onClick: () => {
                    // Logic to download the decal
                    downloadDecalVariant(decal.name, variant);
                    console.log(`Download decal ${decal.name}`);
                },
            }
        ];
        return items;
    }

    const extraVariantClasses = (variant: string) => {
        return isVariantInstalled(decal.name, variant) ? 'installed' : '';
    }

    return (
        <>
            <DecalCardDesign decal={decal} generateVariantDropdownItems={generateVariantItems} previewImage={renderImage(decal)} extraVariantClasses={extraVariantClasses} />
        </>
    );
};

export default DecalCardExplorer;