import React, { useEffect, useState } from 'react';
import Portfolio from './components/Portfolio';
import { fetchPublicPhotos } from './services/firestoreRest';
import type { Photo } from './types';

const PublicApp: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchPublicPhotos()
      .then((result) => {
        if (!cancelled) setPhotos(result);
      })
      .catch((err: unknown) => {
        console.error('Failed to load photos:', err);
        if (!cancelled) setError('No se pudieron cargar las fotos. Probá recargar la página.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return <Portfolio photos={photos} isLoading={isLoading} error={error} />;
};

export default PublicApp;
