import React, { useState, useEffect } from 'react';
import useCollection from '@/hooks/useCollection';
import DecalCard from '@/components/DecalCard/DecalCard';

import './Collection.scss';

const Collection = () => {
  const { decals, isLoading, isError } = useCollection();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading collection</div>;

  return (
    <div className="collection">
      <h1>My Collection</h1>
      <div className="collection__decals">
      {decals.map((decal) => (
          <DecalCard key={decal.name} decal={decal} />
      ))}
      </div>
      {decals.length === 0 && <div className="collection__empty">No decals found in your collection.</div>}
  </div>
);
};

export default Collection;