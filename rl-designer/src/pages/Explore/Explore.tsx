import React, { useState, useEffect } from 'react';
import './Explore.scss';
import { getDecalsFromGitHub } from '@/services/explorer';
import type { DecalTextures } from '@/types';
import DecalCardExplorer from '@/components/DecalCard/DecalCardExplorer';
import { useQuery } from '@tanstack/react-query';
import { Loading, Error } from '@/components';

const Explore = () => {
  const [decals, setDecals] = useState<DecalTextures[]>([]);

  const { data: decalsData, error: decalsError, isLoading: decalsLoading } = useQuery({
    queryKey: ['decals'],
    queryFn: getDecalsFromGitHub,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (decalsData) {
      setDecals(decalsData.decals);
    }
  }, [decalsData]);

  if (decalsLoading) {
    return <Loading />;
  }

  if (decalsError) {
    return <Error message={decalsError.message} />;
  }

  return (
    <div className="explore">
      <h1>Explore Page</h1>
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