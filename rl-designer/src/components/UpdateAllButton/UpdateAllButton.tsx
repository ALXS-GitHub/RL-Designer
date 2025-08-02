import React, { useEffect } from 'react';

import './UpdateAllButton.scss'
import useCollection from '@/hooks/useCollection';
import { useExplorerData, useExplorerActions } from '@/hooks/useExplorer';
import Button from '@/components/Button/Button';
import useSelectedElementStore from '@/stores/selectedElementStore';
import LoadingSpinner from '@/components/Loading/LoadingSpinner';

interface UpdateAllButtonProps {
    className?: string;
}

const UpdateAllButton: React.FC<UpdateAllButtonProps> = ({ className }) => {

    const { selectedElement } = useSelectedElementStore();

    const { decals: collectionDecals } = useCollection();
    const { decals: explorerDecals } = useExplorerData();
    const { downloadDecalVariant } = useExplorerActions();

    const [updatableDecals, setUpdatableDecals] = React.useState<{ name: string, variant_name: string }[]>([]);

    const handleUpdateAll = async () => {
        for (const { name, variant_name } of updatableDecals) {
            downloadDecalVariant(name, variant_name);
        }
    };

    useEffect(() => {
        if (!collectionDecals || !explorerDecals) return;
        if (collectionDecals.length === 0 || explorerDecals.length === 0) return;
        const newUpdatableDecals: { name: string, variant_name: string }[] = [];
        collectionDecals.forEach(collectionDecal => {
            const matchingExplorerDecal = explorerDecals.find(
                explorerDecal => explorerDecal.name === collectionDecal.name
            );

            if (matchingExplorerDecal) {
                // Find variants in explorer that are in collection
                matchingExplorerDecal.variants.forEach(variant => {
                    if (collectionDecal.variants.some(
                        collectionVariant => collectionVariant.variant_name === variant.variant_name
                        && collectionVariant.signature !== variant.signature
                    )) {
                        newUpdatableDecals.push({
                            name: collectionDecal.name,
                            variant_name: variant.variant_name
                        });
                    }
                });
            }
        });

        setUpdatableDecals(newUpdatableDecals);
    }, [collectionDecals, explorerDecals]);

    return (
        <div className={`update-all-button ${className}`}>
            <Button
                onClick={handleUpdateAll}
                disabled={updatableDecals.length === 0}
                className="update-all-button__btn"
                size="small"
            >
                {!updatableDecals || updatableDecals.length === 0 ? <LoadingSpinner size={24} /> : (
                    <div >
                        Update All {
                            selectedElement.charAt(0).toUpperCase() + selectedElement.slice(1)
                    } Decals ({updatableDecals.length})
                    </div>
                )}
            </Button>
        </div>
    )

}

export default UpdateAllButton;