import React, { useState, useEffect } from 'react';
import useCollection from '@/hooks/useCollection';
import DecalCardCollection from '@/components/DecalCard/DecalCardCollection';
import { Loading, Error } from '@/components';
import type { ElementType } from '@/constants/elements';
import { ELEMENTS } from '@/constants/elements';
import useSelectedElementStore from '@/stores/selectedElementStore';
import ElementTypeSelect from '@/components/DropdownMenu/ElementTypeSelect/ElementTypeSelect';

import './Collection.scss';

const Collection = () => {
  const { selectedElement, setSelectedElement } = useSelectedElementStore();
  const { decals, isLoading, isError } = useCollection();

  if (isLoading) return <Loading />;
  if (isError) return <Error message="Error loading collection" />;

  return (
    <div className="collection">
      <h1>My Collection</h1>
      <ElementTypeSelect
          selectedElement={selectedElement}
          onElementChange={setSelectedElement}
          className="collection__element-select"
        />
      <div className="collection__decals">
      {decals.map((decal) => (
          <DecalCardCollection key={decal.name} decal={decal} />
      ))}
      </div>
      {decals.length === 0 && <div className="collection__empty">No decals found in your collection.</div>}
  </div>
);
};

export default Collection;