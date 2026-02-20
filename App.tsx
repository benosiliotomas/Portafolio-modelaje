import React, { useState, useEffect, useCallback } from 'react';
import Header, { Page } from './components/Header';
import Clothesline from './components/Clothesline';
import PhotoModal from './components/PhotoModal';
import ModelData from './components/ModelData';
import Contact from './components/Contact';
import AdminPanel from './components/AdminPanel';
import LoginModal from './components/LoginModal';
import { useAuth } from './contexts/AuthContext';
import type { Photo } from './types';
import { 
  subscribeToPhotos,
  addPhoto,
  deletePhoto,
  updatePhotoConcept,
  updatePhotoDetails,
  updatePhotosOrder,
} from './services/photoService';

const App: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false); // New state to trigger edit mode in modal
  const [activePage, setActivePage] = useState<Page>('gallery');
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isAdmin, logout } = useAuth();
  
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

  const handleSelectPhoto = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsEditingPhoto(false); // Default to view mode
  };

  const handleEditPhotoTrigger = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsEditingPhoto(true); // Open directly in edit mode
  };

  const handleCloseModal = () => {
    setSelectedPhoto(null);
    setIsEditingPhoto(false);
  };

  const handleAddPhoto = async (photoData: { alt: string; image: Blob }) => {
    try {
      await addPhoto(photoData);
    } catch (err: any) {
      console.error("Failed to add photo:", err);
      setError(err.message || "Failed to add photo.");
      throw err;
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    const photoToDelete = photos.find(p => p.id === photoId);
    if (!photoToDelete) return;

    try {
      await deletePhoto(photoToDelete);
    } catch (err: any) {
      console.error("Failed to delete photo:", err);
      setError(err.message || "Failed to delete photo.");
    }
  };

  const handleUpdateConcept = async (photoId: string, concept: string) => {
    try {
      await updatePhotoConcept(photoId, concept);
      setPhotos(prevPhotos => 
        prevPhotos.map(p => p.id === photoId ? { ...p, concept } : p)
      );
    } catch (err: any)      {
      console.error("Failed to update concept:", err);
      setError(err.message || "Failed to update concept.");
    }
  };

  const handleUpdatePhotoDetails = async (photoId: string, alt: string, concept: string) => {
    try {
      await updatePhotoDetails(photoId, alt, concept);
      setPhotos(prevPhotos => 
        prevPhotos.map(p => p.id === photoId ? { ...p, alt, concept } : p)
      );
    } catch (err: any) {
      console.error("Failed to update photo details:", err);
      setError(err.message || "Failed to update photo details.");
    }
  };
  
  const handleReorderPhotos = async (reorderedPhotos: Photo[]) => {
    setPhotos(reorderedPhotos);
    try {
      await updatePhotosOrder(reorderedPhotos);
    } catch (err: any) {
      console.error("Failed to reorder photos:", err);
      setError(err.message || "Failed to save new order.");
    }
  };

  const currentIndex = selectedPhoto ? photos.findIndex(p => p.id === selectedPhoto.id) : -1;
  const hasNext = currentIndex !== -1 && currentIndex < photos.length - 1;
  const hasPrevious = currentIndex > 0;

  const handleNextPhoto = useCallback(() => {
    if (hasNext) {
       setSelectedPhoto(photos[currentIndex + 1]);
       setIsEditingPhoto(false); // Reset edit mode on nav
    }
  }, [currentIndex, photos, hasNext]);

  const handlePreviousPhoto = useCallback(() => {
    if (hasPrevious) {
      setSelectedPhoto(photos[currentIndex - 1]);
      setIsEditingPhoto(false); // Reset edit mode on nav
    }
  }, [currentIndex, photos, hasPrevious]);

  const renderContent = () => {
    switch (activePage) {
      case 'gallery':
        return (
          <Clothesline 
            photos={photos} 
            onSelectPhoto={handleSelectPhoto}
            onEditPhoto={handleEditPhotoTrigger}
            isAdmin={isAdmin}
            onDeletePhoto={handleDeletePhoto}
            onReorderPhotos={handleReorderPhotos}
          />
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
    <div className="min-h-screen">
      <Header activePage={activePage} onNavigate={setActivePage} />

      <main>
        {isAdmin && activePage === 'gallery' && (
          <AdminPanel onPhotoAdded={handleAddPhoto} />
        )}
        
        {error && (
            <div className="max-w-4xl mx-auto my-6 px-4">
              <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-800 p-4 rounded-md" role="alert">
                <p className="font-bold">Aviso para el administrador</p>
                <p>{error}</p>
              </div>
            </div>
        )}

        {isLoading ? (
          <p className="text-center py-20 text-stone-500 animate-pulse">Cargando portafolio...</p>
        ) : (
          renderContent()
        )}
      </main>
      
      {activePage === 'gallery' && (
        <PhotoModal 
          photo={selectedPhoto} 
          onClose={handleCloseModal}
          onUpdateConcept={handleUpdateConcept}
          onUpdateDetails={handleUpdatePhotoDetails}
          onNext={handleNextPhoto}
          onPrevious={handlePreviousPhoto}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
          isReadOnly={!isAdmin}
          startInEditMode={isEditingPhoto}
        />
      )}

      {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} />}
      
      <footer className="text-center p-6 text-stone-500 font-light text-sm">
        <p>Portfolio Concept &copy; {new Date().getFullYear()}. All rights reserved.</p>
        <div className="mt-2">
          {isAdmin ? (
            <button onClick={logout} className="text-stone-500 hover:text-stone-800 hover:underline">
              Cerrar sesión
            </button>
          ) : (
            <button onClick={() => setIsLoginModalOpen(true)} className="text-stone-500 hover:text-stone-800 hover:underline">
              Admin Login
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default App;