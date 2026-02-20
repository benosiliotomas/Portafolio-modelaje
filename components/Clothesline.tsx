import React, { useState } from 'react';
import { ClothespinIcon, TrashIcon, PencilIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';
import type { Photo } from '../types';

interface PhotoThumbnailProps {
  photo: Photo;
  index: number;
  totalPhotos: number;
  onSelect: (photo: Photo) => void;
  isAdmin: boolean;
  onDelete: (photoId: string) => void;
  onEdit: (photo: Photo) => void;
  onMoveLeft: (index: number) => void;
  onMoveRight: (index: number) => void;
  isDraggable: boolean;
  isBeingDragged: boolean;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, photo: Photo) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, photo: Photo) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
}

const PhotoThumbnail: React.FC<PhotoThumbnailProps> = ({
  photo, index, totalPhotos, onSelect, isAdmin, onDelete, onEdit, onMoveLeft, onMoveRight,
  isDraggable, isBeingDragged, onDragStart, onDragOver, onDrop, onDragEnd
}) => {
  // Assign a random swing animation based on index
  const swingClass = `animate-swing-${(index % 3) + 1}`;

  return (
    <div
      className={`relative group ${swingClass} origin-top transition-all duration-500 ease-out ${isDraggable ? 'cursor-grab' : 'cursor-pointer'} ${isBeingDragged ? 'opacity-50 scale-95 cursor-grabbing' : 'opacity-100'}`}
      style={{ animationDelay: `${index * 0.2}s` }}
      onClick={() => onSelect(photo)}
      draggable={isDraggable}
      onDragStart={(e) => onDragStart(e, photo)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, photo)}
      onDragEnd={onDragEnd}
    >
      {/* Clip Container */}
      <div className="absolute -top-[2.2rem] left-1/2 -translate-x-1/2 z-20 w-8 h-12 flex items-center justify-center pointer-events-none">
        <ClothespinIcon className="w-full h-full text-amber-900/80 drop-shadow-md" />
      </div>

      {/* Photo Container */}
      <div className="photo-print undeveloped group-hover:developed group-hover:scale-[1.02] group-hover:-translate-y-2 z-10 relative">
        <div className="overflow-hidden bg-neutral-100">
          <img
            src={photo.url}
            alt={photo.alt}
            className="w-48 h-64 md:w-56 md:h-72 object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>
        {/* Subtle Concept Text for Darkroom vibe (Removed per user request to avoid visual discomfort) */}
      </div>
      {isAdmin && (
        <div className="absolute -top-2 -right-4 z-30 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent modal from opening normally
              onEdit(photo);
            }}
            className="p-2 bg-white text-neutral-800 border border-neutral-200 rounded-full shadow-lg hover:bg-neutral-100 transition-colors"
            aria-label="Edit photo details"
            title="Editar detalles"
          >
            <PencilIcon className="h-4 w-4" />
          </button>

          {index > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveLeft(index);
              }}
              className="p-2 bg-white text-neutral-800 border border-neutral-200 rounded-full shadow-lg hover:bg-neutral-100 transition-colors"
              aria-label="Move left"
              title="Mover a la izquierda"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
          )}

          {index < totalPhotos - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveRight(index);
              }}
              className="p-2 bg-white text-neutral-800 border border-neutral-200 rounded-full shadow-lg hover:bg-neutral-100 transition-colors"
              aria-label="Move right"
              title="Mover a la derecha"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent modal from opening
              if (window.confirm('¿Estás seguro de que deseas eliminar esta foto permanentemente?')) {
                onDelete(photo.id);
              }
            }}
            className="p-2 bg-red-50 text-red-600 border border-red-100 rounded-full shadow-lg hover:bg-red-100 transition-colors"
            aria-label="Delete photo"
            title="Eliminar foto"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

interface ClotheslineProps {
  photos: Photo[];
  onSelectPhoto: (photo: Photo) => void;
  onEditPhoto: (photo: Photo) => void;
  isAdmin: boolean;
  onDeletePhoto: (photoId: string) => void;
  onReorderPhotos: (reorderedPhotos: Photo[]) => void;
}

const Clothesline: React.FC<ClotheslineProps> = ({ photos, onSelectPhoto, onEditPhoto, isAdmin, onDeletePhoto, onReorderPhotos }) => {
  const [draggedPhoto, setDraggedPhoto] = useState<Photo | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, photo: Photo) => {
    if (!isAdmin) return;
    e.dataTransfer.setData('text/plain', photo.id);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      setDraggedPhoto(photo);
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropTargetPhoto: Photo) => {
    e.preventDefault();
    if (!draggedPhoto || !isAdmin) return;
    if (draggedPhoto.id === dropTargetPhoto.id) return;

    const draggedIndex = photos.findIndex(p => p.id === draggedPhoto.id);
    const targetIndex = photos.findIndex(p => p.id === dropTargetPhoto.id);

    if (draggedIndex === -1 || targetIndex === -1) return;

    let reordered = [...photos];
    const [draggedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, draggedItem);

    onReorderPhotos(reordered);
    setDraggedPhoto(null);
  };

  const handleDragEnd = () => {
    setDraggedPhoto(null);
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    if (!isAdmin) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= photos.length) return;

    let reordered = [...photos];
    const [movedItem] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, movedItem);

    onReorderPhotos(reordered);
  };

  return (
    <div className="relative w-full py-20 flex justify-center items-start min-h-[60vh] overflow-hidden">
      {/* Main Rope */}
      <div className="absolute top-[5rem] left-0 w-full h-[2px] bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 shadow-[0_5px_15px_rgba(0,0,0,0.05)] z-0"></div>

      {/* Decorative Rope Sag (Optional svg could go here, but a straight taut rope works well for modern darkroom) */}

      <div className="relative flex flex-wrap justify-center gap-x-12 gap-y-24 px-8 pt-4 z-10 w-full max-w-7xl">
        {photos.map((photo, index) => (
          <PhotoThumbnail
            key={photo.id}
            photo={photo}
            index={index}
            totalPhotos={photos.length}
            onSelect={onSelectPhoto}
            onEdit={onEditPhoto}
            isAdmin={isAdmin}
            onDelete={onDeletePhoto}
            onMoveLeft={(idx) => handleMove(idx, -1)}
            onMoveRight={(idx) => handleMove(idx, 1)}
            isDraggable={isAdmin}
            isBeingDragged={draggedPhoto?.id === photo.id}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
          />
        ))}
        {photos.length === 0 && (
          <div className="text-neutral-400 font-light tracking-wide mt-10 animate-pulse">
            La galería está vacía...
          </div>
        )}
      </div>
    </div>
  );
};

export default Clothesline;
