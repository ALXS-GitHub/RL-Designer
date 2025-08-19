import React from 'react';
import type { DecalTextures } from '@/types';
import Placeholder from '@/assets/placeholder.jpg';
import { useExplorerActions } from '@/hooks/useExplorer';
import { useNavigate } from 'react-router-dom'

import DecalCardDesign from "./DecalCardDesign"
import { useCollectionActions } from '@/hooks/useCollection';
import { FaEye, FaDownload, FaSync, FaInfoCircle } from 'react-icons/fa';
import { useDecalInformationModalStore } from '@/stores/decalInformationModalStore';
import useSelectedElementStore from '@/stores/selectedElementStore';
import { ElementsMap } from '@/constants/elementsMap';

interface DecalCardExplorerProps {
  decal: DecalTextures;
}

const DecalCardExplorer: React.FC<DecalCardExplorerProps> = ({ decal }) => {

    const { downloadDecalVariant } = useExplorerActions();
    const { decals: collectionDecals } = useCollectionActions();
    const { openModal: openDecalInformationModal } = useDecalInformationModalStore();
    const navigate = useNavigate();
    const { selectedElement } = useSelectedElementStore();
    const hasModel3D = ElementsMap[selectedElement].hasModel3D;

    const isVariantInstalled = (decalName: string, variant: string) => {
        return collectionDecals.some(d => d.name === decalName && d.variants.some(v => v.variant_name === variant));
    }

    const doesVariantNeedUpdate = (decalName: string, variant: string) => {
        const variant_infos = decal.variants.find(v => v.variant_name === variant);
        if (!variant_infos) return false;
        return collectionDecals.some(d => d.name === decalName && d.variants.some(
            v => v.variant_name === variant
            && v.signature !== variant_infos.signature
        ));
    }

    const renderImage = (variant_name: string) => {
        const variant = decal.variants.find(v => v.variant_name === variant_name);
        if (variant?.preview_path && variant.preview_path.startsWith('http')) {
            return <img src={variant.preview_path} alt={`${decal.name} preview`} className="decal-image" />;
        }
        if (variant?.one_diffuse_skin_path && variant.one_diffuse_skin_path.startsWith('http')) {
            return <img src={variant.one_diffuse_skin_path} alt={`${decal.name} one diffuse skin preview`} className="decal-image" />;
        }

        return <img src={Placeholder} alt="Placeholder image" className="decal-image" />;
    }

    const generateGlobalDropdownItems = (lastHoveredVariant: string) => {
        const items = [];
        items.push({
            children: (
                <div className="global-dropdown information-decal">
                    <FaInfoCircle className="icon" />
                    Information
                </div>
            ),
            onClick: () => {
                openDecalInformationModal({decal, variant_name: lastHoveredVariant});
            },
            });
        if (hasModel3D) {
            items.push({
                children: (
                    <div className="global-dropdown preview-decal">
                        <FaEye className="icon" />
                        Preview
                    </div>
                ),
                onClick: () => {
                    navigate(`/preview/${decal.name}/${lastHoveredVariant || decal.variants[0].variant_name}`);
                },
            });
        }
        items.push({
            children: (
                <div className="global-dropdown download-decal">
                    <FaDownload className="icon" />
                    Install / Update All
                </div>
            ),
            onClick: () => {
                for (const variant of decal.variants) {
                    downloadDecalVariant(decal.name, variant.variant_name);
                }
            }
        });
        return items;
    }

    const generateVariantItems = (variant: string) => {
        const items = [];
        items.push({
            children: (
                <div className="global-dropdown information-decal">
                    <FaInfoCircle className="icon" />
                    Information
                </div>
            ),
            onClick: () => {
                openDecalInformationModal({decal, variant_name: variant});
            },
        });
        if (hasModel3D) {
            items.push({
                children: (
                    <div className="variant-dropdown">
                        <FaEye className="icon" />
                        Preview
                    </div>
                ),
                onClick: () => {
                    navigate(`/preview/${decal.name}/${variant}`);
                },
            })
        }
        items.push({
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
        })
        return items;
    }

    const extraVariantClasses = (variant: string) => {
        let classes = '';
        if (isVariantInstalled(decal.name, variant)) {
            classes += 'installed ';
        }
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

export default DecalCardExplorer;