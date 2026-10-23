import React, { useEffect, useState } from 'react';
import Portfolio from '../components/Portfolio';
import type { AdminActions } from '../components/AdminControls';
import AdminPanel from './AdminPanel';
import LoginModal from './LoginModal';
import { AuthProvider, useAuth } from './AuthContext';
import { moveWithinSection } from '../lib/portfolio';
import type { Photo } from '../types';
import {
  subscribeToPhotos,
  addPhoto,
  deletePhoto,
  updatePhotoDetails,
  updatePhotosOrder,
  setPhotoHidden,
  setPhotoSection,
  setFeaturedPhoto,
} from '../services/photoService';

const errorMessage = (err: unknown, fallback: string): string =>
  err instanceof Error && err.message ? err.message : fallback;

const AdminPortfolio: React.FC = () => {
  const { logout } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => subscribeToPhotos((next) => {
    setPhotos(next);
    setIsLoading(false);
  }, (err) => {
    setError(err.message);
    setIsLoading(false);
  }), []);

  const run = (fallback: string) => async (operation: () => Promise<void>) => {
    try {
      await operation();
    } catch (err: unknown) {
      console.error(fallback, err);
      setError(errorMessage(err, fallback));
    }
  };

  const actions: AdminActions = {
    onUpdateDetails: (id, alt, concept) =>
      run('No se pudieron guardar los detalles.')(() => updatePhotoDetails(id, alt, concept)),
    onDelete: (photo) => run('No se pudo eliminar la foto.')(() => deletePhoto(photo)),
    onToggleHidden: (photo) =>
      run('No se pudo cambiar la visibilidad de la foto.')(() => setPhotoHidden(photo.id, !photo.hidden)),
    onSetSection: (photo, section) =>
      run('No se pudo cambiar la sección de la foto.')(() => setPhotoSection(photo.id, section)),
    onSetFeatured: (photo) =>
      run('No se pudo elegir la portada.')(() => setFeaturedPhoto(photos, photo.id)),
    onMove: (photo, direction) => {
      const reordered = moveWithinSection(photos, photo.id, direction);
      if (reordered === photos) return;
      setPhotos(reordered);
      run('No se pudo guardar el nuevo orden.')(() => updatePhotosOrder(reordered));
    },
  };

  const handleAddPhoto: React.ComponentProps<typeof AdminPanel>['onPhotoAdded'] = async (photoData) => {
    try {
      await addPhoto(photoData);
    } catch (err: unknown) {
      console.error('Failed to add photo:', err);
      setError(errorMessage(err, 'No se pudo subir la foto.'));
      throw err;
    }
  };

  return (
    <Portfolio
      photos={photos}
      isLoading={isLoading}
      error={error}
      admin={actions}
      adminPanel={<AdminPanel onPhotoAdded={handleAddPhoto} />}
      footerAction={
        <button onClick={logout} className="eyebrow text-ash hover:text-ink">Cerrar sesión</button>
      }
    />
  );
};

const AdminGate: React.FC = () => {
  const { isAdmin, isReady } = useAuth();
  if (!isReady) return <p className="eyebrow text-center py-20 text-ash">Cargando…</p>;
  if (!isAdmin) return <LoginModal onClose={() => window.location.assign('/')} />;
  return <AdminPortfolio />;
};

const AdminApp: React.FC = () => (
  <AuthProvider>
    <AdminGate />
  </AuthProvider>
);

export default AdminApp;
