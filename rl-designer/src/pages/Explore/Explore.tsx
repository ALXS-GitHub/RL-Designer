import React, { useState, useEffect } from 'react';
import './Explore.scss';
import DecalCardExplorer from '@/components/DecalCard/DecalCardExplorer';
import { Loading, Error } from '@/components';
import useSelectedElementStore from '@/stores/selectedElementStore';
import ElementTypeSelect from '@/components/DropdownMenu/ElementTypeSelect/ElementTypeSelect';
import { useExplorerData } from '@/hooks/useExplorer'
import useCollection from '@/hooks/useCollection';
import UpdateAllButton from '@/components/UpdateAllButton/UpdateAllButton';

const Explore = () => {

  useCollection(); // Ensure collection store is initialized
  const { selectedElement, setSelectedElement } = useSelectedElementStore();
  const { decals, isLoading, isError } = useExplorerData();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error message={isError.message} />;
  }

  return (
    <div className="explore">
      <h1>Explore Page</h1>
      <ElementTypeSelect
          selectedElement={selectedElement}
          onElementChange={setSelectedElement}
          className="explore__element-select"
        />
        <UpdateAllButton className="explore__update-all-button" />
      <div className="explore__decals">
      {decals.map((decal) => (
          <DecalCardExplorer key={decal.name} decal={decal} />
      ))}
      </div>
      {decals.length === 0 && <div className="explore__empty">No decals found in Explorer.</div>}
    </div>
  );
};

export default Explore;