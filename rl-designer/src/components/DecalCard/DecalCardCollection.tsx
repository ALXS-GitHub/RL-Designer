import React from 'react';
import type { DecalTextures } from '@/types';
import { useNavigate } from 'react-router-dom';
import Placeholder from '@/assets/placeholder.jpg';
import { convertFileSrc } from '@tauri-apps/api/core';
import { useCollectionActions } from '@/hooks/useCollection';
import { useExplorerActions } from '@/hooks/useExplorer';
import DecalCardDesign from "./DecalCardDesign"
import { FaEye, FaTrash, FaSync, FaInfoCircle } from 'react-icons/fa';
import { useConfirmationDialogStore } from '@/stores/confirmationDialogStore';
import { useDecalInformationModalStore } from '@/stores/decalInformationModalStore';

interface DecalCardCollectionProps {
  decal: DecalTextures;
}

const DecalCardCollection: React.FC<DecalCardCollectionProps> = ({ decal }) => {

    const { removeDecalVariant } = useCollectionActions();
    const { decals: explorerDecals, downloadDecalVariant } = useExplorerActions();
    const { openConfirmationDialog } = useConfirmationDialogStore();
    const { openModal: openDecalInformationModal } = useDecalInformationModalStore();

    const navigate = useNavigate();

    const isVariantInExplorer = (decalName: string, variant: string) => {
        return explorerDecals.some(d => d.name === decalName && d.variants.some(v => v.variant_name === variant));
    }

    const doesVariantNeedUpdate = (decalName: string, variant: string) => {
        const variant_infos = decal.variants.find(v => v.variant_name === variant);
        if (!variant_infos) return false;
        return explorerDecals.some(d => d.name === decalName && d.variants.some(
            v => v.variant_name === variant
            && v.signature !== variant_infos.signature
        ));
    }

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
                    <div className="global-dropdown information-decal">
                        <FaInfoCircle className="icon" />
                        Information
                    </div>
                ),
                onClick: () => {
                    openDecalInformationModal({decal, variant_name: lastHoveredVariant});
                },
            },
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
                    <div className="global-dropdown update-decal">
                        <FaSync className="icon" />
                        Update All
                    </div>
                ),
                onClick: () => {
                    for (const variant of decal.variants) {
                        downloadDecalVariant(decal.name, variant.variant_name);
                    }
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
                    <div className="global-dropdown information-decal">
                        <FaInfoCircle className="icon" />
                        Information
                    </div>
                ),
                onClick: () => {
                    openDecalInformationModal({decal, variant_name: variant});
                },
            },
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

        if (isVariantInExplorer(decal.name, variant)) {
            items.splice(1, 0, {
                children: (
                    <div className="variant-dropdown update-decal">
                        <FaSync className="icon" />
                        Update
                    </div>
                ),
                onClick: () => {
                    downloadDecalVariant(decal.name, variant);
                },
            });
        }

        return items;
    }

    const extraVariantClasses = (variant: string) => {
        let classes = '';
        if (doesVariantNeedUpdate(decal.name, variant)) {
            classes += 'needs-update ';
        }
        return classes;
    }

    return (
        <>
            <DecalCardDesign 
                decal={decal} 
                generateGlobalDropdownItems={generateGlobalDropdownItems}
                generateVariantDropdownItems={generateVariantItems} 
                previewImage={renderImage} 
                extraVariantClasses={extraVariantClasses}
            />
        </>
    );
};

export default DecalCardCollection;