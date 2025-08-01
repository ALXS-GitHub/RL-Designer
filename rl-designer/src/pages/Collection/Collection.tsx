import React, { useState, useEffect } from 'react';
import useCollection from '@/hooks/useCollection';
import DecalCardCollection from '@/components/DecalCard/DecalCardCollection';
import { Loading, Error } from '@/components';
import type { ElementType } from '@/constants/elements';
import { ELEMENTS } from '@/constants/elements';
import useSelectedElementStore from '@/stores/selectedElementStore';
import ElementTypeSelect from '@/components/DropdownMenu/ElementTypeSelect/ElementTypeSelect';
import UpdateAllButton from '@/components/UpdateAllButton/UpdateAllButton';
import DecalsContainer from '@/containers/DecalsContainer/DecalsContainer';
import usePageStore from '@/stores/pageStore'

import './Collection.scss';

const Collection = () => {

  const { setLastPage } = usePageStore();

  const { decals, isLoading, isError } = useCollection();

    useEffect(() => {
      setLastPage('collection');
    }, []);

  if (isLoading) return <Loading />;
  if (isError) return <Error message="Error loading collection" />;

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