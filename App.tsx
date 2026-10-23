import React, { useState, useEffect, useCallback } from 'react';
import Header, { Page } from './components/Header';
import Intro from './components/Intro';
import Gallery from './components/Gallery';
import PhotoModal from './components/PhotoModal';
import ModelData from './components/ModelData';
import Contact from './components/Contact';
import AdminPanel from './components/AdminPanel';
import LoginModal from './components/LoginModal';
import { useAuth } from './contexts/AuthContext';
import { getVisiblePhotos } from './lib/photoUtils';
import { profile } from './data/profile';
import type { Photo } from './types';
import {
  subscribeToPhotos,
  addPhoto,
  deletePhoto,
  updatePhotoDetails,
  updatePhotosOrder,
  setPhotoHidden,
} from './services/photoService';

// The admin entry point is not linked anywhere: open /admin directly.
const isAdminRoute = window.location.pathname.replace(/\/+$/, '') === '/admin';

const errorMessage = (err: unknown, fallback: string): string =>
  err instanceof Error && err.message ? err.message : fallback;

const App: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [activePage, setActivePage] = useState<Page>('gallery');

  const { isAdmin, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(isAdminRoute);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = subscribeToPhotos((newPhotos) => {
      setPhotos(newPhotos);
      setIsLoading(false);
      // We don't clear the error here, so a config warning can persist
    }, (err) => {
      setError(err.message);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const visiblePhotos = getVisiblePhotos(photos, isAdmin);

  const handleNavigate = (page: Page) => {
    setActivePage(page);
    window.scrollTo({ top: 0 });
  };

  const handleSelectPhoto = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsEditingPhoto(false);
  };

  const handleEditPhotoTrigger = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsEditingPhoto(true);
  };

  const handleCloseModal = useCallback(() => {
    setSelectedPhoto(null);
    setIsEditingPhoto(false);
  }, []);

  const handleAddPhoto = async (photoData: { alt: string; image: Blob }) => {
    try {
      await addPhoto(photoData);
    } catch (err: unknown) {
      console.error("Failed to add photo:", err);
      setError(errorMessage(err, "No se pudo subir la foto."));
      throw err;
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    const photoToDelete = photos.find(p => p.id === photoId);
    if (!photoToDelete) return;

    try {
      await deletePhoto(photoToDelete);
    } catch (err: unknown) {
      console.error("Failed to delete photo:", err);
      setError(errorMessage(err, "No se pudo eliminar la foto."));
    }
  };

  const handleUpdatePhotoDetails = async (photoId: string, alt: string, concept: string) => {
    try {
      await updatePhotoDetails(photoId, alt, concept);
      setPhotos(prevPhotos =>
        prevPhotos.map(p => p.id === photoId ? { ...p, alt, concept } : p)
      );
    } catch (err: unknown) {
      console.error("Failed to update photo details:", err);
      setError(errorMessage(err, "No se pudieron guardar los detalles."));
    }
  };

  const handleToggleHidden = async (photo: Photo) => {
    try {
      await setPhotoHidden(photo.id, !photo.hidden);
    } catch (err: unknown) {
      console.error("Failed to toggle photo visibility:", err);
      setError(errorMessage(err, "No se pudo cambiar la visibilidad de la foto."));
    }
  };

  const handleReorderPhotos = async (reorderedPhotos: Photo[]) => {
    setPhotos(reorderedPhotos);
    try {
      await updatePhotosOrder(reorderedPhotos);
    } catch (err: unknown) {
      console.error("Failed to reorder photos:", err);
      setError(errorMessage(err, "No se pudo guardar el nuevo orden."));
    }
  };

  const currentIndex = selectedPhoto ? visiblePhotos.findIndex(p => p.id === selectedPhoto.id) : -1;
  const hasNext = currentIndex !== -1 && currentIndex < visiblePhotos.length - 1;
  const hasPrevious = currentIndex > 0;

  const handleNextPhoto = useCallback(() => {
    if (hasNext) {
      setSelectedPhoto(visiblePhotos[currentIndex + 1]);
      setIsEditingPhoto(false);
    }
  }, [currentIndex, visiblePhotos, hasNext]);

  const handlePreviousPhoto = useCallback(() => {
    if (hasPrevious) {
      setSelectedPhoto(visiblePhotos[currentIndex - 1]);
      setIsEditingPhoto(false);
    }
  }, [currentIndex, visiblePhotos, hasPrevious]);

  const renderContent = () => {
    switch (activePage) {
      case 'gallery':
        return (
          <>
            <Intro onContact={() => handleNavigate('contact')} />
            <Gallery
              photos={visiblePhotos}
              onSelectPhoto={handleSelectPhoto}
              onEditPhoto={handleEditPhotoTrigger}
              isAdmin={isAdmin}
              onDeletePhoto={handleDeletePhoto}
              onReorderPhotos={handleReorderPhotos}
              onToggleHidden={handleToggleHidden}
            />
          </>
        );
      case 'model-data':
        return <ModelData />;
      case 'contact':
        return <Contact />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header activePage={activePage} onNavigate={handleNavigate} />

      <main className="flex-1">
        {isAdmin && activePage === 'gallery' && (
          <AdminPanel onPhotoAdded={handleAddPhoto} />
        )}

        {error && (
          <div className="max-w-4xl mx-auto my-6 px-4">
            <div className="border-l-2 border-clay bg-surface text-stone p-4" role="alert">
              <p className="eyebrow text-clay m-0 mb-1">Aviso para el administrador</p>
              <p className="m-0 text-sm">{error}</p>
            </div>
          </div>
        )}

        {isLoading ? (
          <p className="eyebrow text-center py-20 text-ash">Cargando…</p>
        ) : (
          renderContent()
        )}
      </main>

      {activePage === 'gallery' && (
        <PhotoModal
          photo={selectedPhoto}
          index={currentIndex}
          total={visiblePhotos.length}
          onClose={handleCloseModal}
          onUpdateDetails={handleUpdatePhotoDetails}
          onNext={handleNextPhoto}
          onPrevious={handlePreviousPhoto}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
          isReadOnly={!isAdmin}
          startInEditMode={isEditingPhoto}
        />
      )}

      {isLoginModalOpen && !isAdmin && <LoginModal onClose={() => setIsLoginModalOpen(false)} />}

      <footer className="border-t border-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex items-center justify-between gap-4">
          <p className="eyebrow text-ash m-0">&copy; {new Date().getFullYear()} {profile.name}</p>
          {isAdmin && (
            <button onClick={logout} className="eyebrow text-ash hover:text-ink">
              Cerrar sesión
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default App;
