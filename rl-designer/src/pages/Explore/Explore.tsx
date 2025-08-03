import React, { useState, useEffect } from 'react';
import './Explore.scss';
import DecalCardExplorer from '@/components/DecalCard/DecalCardExplorer';
import { Loading, Error } from '@/components';
import useSelectedElementStore from '@/stores/selectedElementStore';
import ElementTypeSelect from '@/components/DropdownMenu/ElementTypeSelect/ElementTypeSelect';
import { useExplorerActions } from '@/hooks/useExplorer'
import UpdateAllButton from '@/components/UpdateAllButton/UpdateAllButton';
import DecalsContainer from '@/containers/DecalsContainer/DecalsContainer';
import usePageStore from '@/stores/pageStore'

const Explore = () => {

  const { setLastPage } = usePageStore();
  const { decals } = useExplorerActions();

  useEffect(() => {
    setLastPage('explorer');
  }, []);

  return (
    <DecalsContainer showLoading={true}>
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