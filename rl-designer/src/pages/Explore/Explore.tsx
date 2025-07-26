import React, { useState, useEffect } from 'react';
import './Explore.scss';
import DecalCardExplorer from '@/components/DecalCard/DecalCardExplorer';
import { Loading, Error } from '@/components';
import useSelectedElementStore from '@/stores/selectedElementStore';
import ElementTypeSelect from '@/components/DropdownMenu/ElementTypeSelect/ElementTypeSelect';
import { useExplorerData } from '@/hooks/useExplorer'
import useCollection from '@/hooks/useCollection';
import UpdateAllButton from '@/components/UpdateAllButton/UpdateAllButton';
import DecalsContainer from '@/containers/DecalsContainer/DecalsContainer';

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
    <DecalsContainer>
      <div className="explore">
        <h1>Explore Page</h1>
        <div className="explore__decals">
        {decals.map((decal) => (
            <DecalCardExplorer key={decal.name} decal={decal} />
        ))}
        </div>
        {decals.length === 0 && <div className="explore__empty">No decals found in Explorer.</div>}
      </div>
    </DecalsContainer>
  );
};

export default Explore;