import React, { useState, useEffect } from 'react';
import { useCollectionActions } from '@/hooks/useCollection';
import DecalCardCollection from '@/components/DecalCard/DecalCardCollection';
import { Loading, Error } from '@/components';
import type { ElementType } from '@/constants/elements';
import { ELEMENTS } from '@/constants/elements';
import useSelectedElementStore from '@/stores/selectedElementStore';
import ElementTypeSelect from '@/components/DropdownMenu/ElementTypeSelect/ElementTypeSelect';
import UpdateAllButton from '@/components/UpdateAllButton/UpdateAllButton';
import DecalsContainer from '@/containers/DecalsContainer/DecalsContainer';
import usePageStore from '@/stores/pageStore'
import { useExplorerData } from '@/hooks/useExplorer';

import './Collection.scss';

const Collection = () => {

  const { setLastPage } = usePageStore();

  const { decals } = useCollectionActions();
  useExplorerData(); // load the decals from the explorer

    useEffect(() => {
      setLastPage('collection');
    }, []);

  // if (!decals || decals.length === 0) return <Loading />;

  return (
    <DecalsContainer>
      <div className="collection">
        <h1>My Collection</h1>
        <div className="collection__decals">
        {decals.map((decal) => (
            <DecalCardCollection key={decal.name} decal={decal} />
        ))}
        </div>
        {decals.length === 0 && <div className="collection__empty">No decals found in your collection.</div>}
    </div>
  </DecalsContainer>
);
};

export default Collection;