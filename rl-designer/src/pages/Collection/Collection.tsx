import React, { useState, useEffect } from 'react';
import useCollection from '@/hooks/useCollection';
import DecalCardCollection from '@/components/DecalCard/DecalCardCollection';
import { Loading, Error } from '@/components';

import './Collection.scss';

const Collection = () => {
  const { decals, isLoading, isError } = useCollection();

  if (isLoading) return <Loading />;
  if (isError) return <Error message="Error loading collection" />;

  return (
    <div className="collection">
      <h1>My Collection</h1>
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