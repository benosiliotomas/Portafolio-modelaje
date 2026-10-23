import React, { useState } from 'react';
import { TrashIcon, PencilIcon, ChevronLeftIcon, ChevronRightIcon, EyeIcon, EyeSlashIcon } from './icons';
import { buildSrcSet, photoAltText } from '../lib/photoUtils';
import type { Photo } from '../types';

// Matches the grid below: 1 column on phones, 2 on tablets, 3 on desktop.
const GRID_SIZES = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw';
const EAGER_COUNT = 2;

interface AdminControlsProps {
  photo: Photo;
  index: number;
  totalPhotos: number;
  onEdit: (photo: Photo) => void;
  onToggleHidden: (photo: Photo) => void;
  onMove: (index: number, direction: -1 | 1) => void;
  onDelete: (photoId: string) => void;
}

const controlClass = 'p-2 bg-surface text-ink border border-hairline hover:bg-paper transition-colors duration-150';

const AdminControls: React.FC<AdminControlsProps> = ({ photo, index, totalPhotos, onEdit, onToggleHidden, onMove, onDelete }) => (
  <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150">
    <button onClick={() => onEdit(photo)} className={controlClass} aria-label="Editar detalles" title="Editar detalles">
      <PencilIcon className="h-4 w-4" />
    </button>
    <button
      onClick={() => onToggleHidden(photo)}
      className={controlClass}
      aria-label={photo.hidden ? 'Mostrar en el portfolio' : 'Ocultar del portfolio'}
      title={photo.hidden ? 'Mostrar en el portfolio' : 'Ocultar del portfolio'}
    >
      {photo.hidden ? <EyeIcon className="h-4 w-4" /> : <EyeSlashIcon className="h-4 w-4" />}
    </button>
    {index > 0 && (
      <button onClick={() => onMove(index, -1)} className={controlClass} aria-label="Mover antes" title="Mover antes">
        <ChevronLeftIcon className="h-4 w-4" />
      </button>
    )}
    {index < totalPhotos - 1 && (
      <button onClick={() => onMove(index, 1)} className={controlClass} aria-label="Mover después" title="Mover después">
        <ChevronRightIcon className="h-4 w-4" />
      </button>
    )}
    <button
      onClick={() => {
        if (window.confirm('¿Eliminar esta foto para siempre? Si solo querés sacarla del portfolio, usá "Ocultar".')) {
          onDelete(photo.id);
        }
      }}
      className={`${controlClass} text-clay`}
      aria-label="Eliminar foto"
      title="Eliminar foto"
    >
      <TrashIcon className="h-4 w-4" />
    </button>
  </div>
);

interface GalleryProps {
  photos: Photo[];
  onSelectPhoto: (photo: Photo) => void;
  onEditPhoto: (photo: Photo) => void;
  isAdmin: boolean;
  onDeletePhoto: (photoId: string) => void;
  onReorderPhotos: (reorderedPhotos: Photo[]) => void;
  onToggleHidden: (photo: Photo) => void;
}

const Gallery: React.FC<GalleryProps> = ({ photos, onSelectPhoto, onEditPhoto, isAdmin, onDeletePhoto, onReorderPhotos, onToggleHidden }) => {
  const [draggedPhotoId, setDraggedPhotoId] = useState<string | null>(null);

  const moveTo = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= photos.length || fromIndex === toIndex) return;
    const reordered = [...photos];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    onReorderPhotos(reordered);
  };

  const handleDrop = (targetId: string) => {
    if (!isAdmin || !draggedPhotoId) return;
    moveTo(photos.findIndex(p => p.id === draggedPhotoId), photos.findIndex(p => p.id === targetId));
    setDraggedPhotoId(null);
  };

  if (photos.length === 0) {
    return <p className="eyebrow text-ash text-center py-20">La galería está vacía</p>;
  }

  return (
    <section aria-label="Book" className="max-w-7xl mx-auto px-0 sm:px-8 pb-[var(--space-section)]">
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 list-none p-0 m-0">
        {photos.map((photo, index) => (
          <li
            key={photo.id}
            className={`relative group ${photo.hidden ? 'opacity-40' : ''} ${draggedPhotoId === photo.id ? 'opacity-50' : ''}`}
            draggable={isAdmin}
            onDragStart={(e) => {
              e.dataTransfer.effectAllowed = 'move';
              setDraggedPhotoId(photo.id);
            }}
            onDragOver={(e) => isAdmin && e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleDrop(photo.id);
            }}
            onDragEnd={() => setDraggedPhotoId(null)}
          >
            <button
              onClick={() => onSelectPhoto(photo)}
              className="block w-full aspect-[4/5] overflow-hidden bg-hairline"
              aria-label={`Ver ${photoAltText(photo, index)} en grande`}
            >
              <img
                src={photo.variants ? photo.variants[0].url : photo.url}
                srcSet={buildSrcSet(photo)}
                sizes={GRID_SIZES}
                alt={photoAltText(photo, index)}
                width={photo.width ?? 800}
                height={photo.height ?? 1000}
                loading={index < EAGER_COUNT ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.015]"
              />
            </button>
            {photo.hidden && (
              <span className="eyebrow absolute bottom-2 left-2 bg-surface text-ink px-2 py-1">Oculta</span>
            )}
            {isAdmin && (
              <AdminControls
                photo={photo}
                index={index}
                totalPhotos={photos.length}
                onEdit={onEditPhoto}
                onToggleHidden={onToggleHidden}
                onMove={(i, direction) => moveTo(i, i + direction)}
                onDelete={onDeletePhoto}
              />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Gallery;
