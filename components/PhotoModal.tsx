import React, { useState, useEffect, useRef } from 'react';
import { CloseIcon, ChevronLeftIcon, ChevronRightIcon, PencilIcon } from './icons';
import { buildSrcSet, photoAltText } from '../lib/photoUtils';
import type { Photo } from '../types';

interface PhotoModalProps {
  photo: Photo | null;
  index: number;
  total: number;
  onClose: () => void;
  onUpdateCaption: (photoId: string, caption: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  isReadOnly?: boolean;
  startInEditMode?: boolean;
}

const navButtonClass = 'absolute top-1/2 -translate-y-1/2 z-10 p-3 text-stone hover:text-ink transition-colors duration-150';
const fieldClass = 'w-full px-0 py-2 bg-transparent border-0 border-b border-hairline focus:border-ink focus:outline-none text-ink';

const PhotoModal: React.FC<PhotoModalProps> = ({
  photo, index, total, onClose, onUpdateCaption, onNext, onPrevious, hasNext, hasPrevious, isReadOnly = false, startInEditMode = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editConcept, setEditConcept] = useState('');
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (photo) {
      setIsEditing(startInEditMode);
      setEditConcept(photo.concept || '');
    }
  }, [photo, startInEditMode]);

  const isOpen = photo !== null;

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      previouslyFocused?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (isEditing) return;
      if (e.key === 'ArrowRight' && hasNext) onNext();
      if (e.key === 'ArrowLeft' && hasPrevious) onPrevious();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isEditing, hasNext, hasPrevious, onNext, onPrevious, onClose]);

  if (!photo) return null;

  const caption = photo.concept?.trim();

  const handleSaveDetails = () => {
    onUpdateCaption(photo.id, editConcept);
    setIsEditing(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photoAltText(photo, index)}
      className="fade-in fixed inset-0 z-50 bg-paper flex flex-col"
      onClick={onClose}
    >
      <div className="h-14 shrink-0 flex items-center justify-between px-4 sm:px-8" onClick={(e) => e.stopPropagation()}>
        <span className="eyebrow text-ash">{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
        <div className="flex items-center gap-2">
          {!isReadOnly && !isEditing && (
            <button onClick={() => setIsEditing(true)} className="p-2 text-stone hover:text-ink" aria-label="Editar detalles" title="Editar detalles">
              <PencilIcon className="h-5 w-5" />
            </button>
          )}
          <button ref={closeButtonRef} onClick={onClose} className="p-2 text-stone hover:text-ink" aria-label="Cerrar (Esc)" title="Cerrar (Esc)">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="relative flex-1 min-h-0 flex items-center justify-center px-4 sm:px-20">
        {!isEditing && hasPrevious && (
          <button onClick={(e) => { e.stopPropagation(); onPrevious(); }} className={`${navButtonClass} left-0 sm:left-4`} aria-label="Foto anterior">
            <ChevronLeftIcon className="h-7 w-7" />
          </button>
        )}
        <img
          key={photo.id}
          src={photo.url}
          srcSet={buildSrcSet(photo)}
          sizes="100vw"
          alt={photoAltText(photo, index)}
          referrerPolicy="no-referrer"
          className="fade-in max-h-full max-w-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />
        {!isEditing && hasNext && (
          <button onClick={(e) => { e.stopPropagation(); onNext(); }} className={`${navButtonClass} right-0 sm:right-4`} aria-label="Foto siguiente">
            <ChevronRightIcon className="h-7 w-7" />
          </button>
        )}
      </div>

      <div className="shrink-0 px-4 sm:px-8 py-4 min-h-[3.5rem]" onClick={(e) => e.stopPropagation()}>
        {isEditing ? (
          <form
            className="max-w-xl mx-auto space-y-4"
            onSubmit={(e) => { e.preventDefault(); handleSaveDetails(); }}
          >
            <label className="block">
              <span className="eyebrow text-ash">Pie de foto · desfile, marca, fotógrafo</span>
              <textarea value={editConcept} onChange={(e) => setEditConcept(e.target.value)} rows={2} className={`${fieldClass} resize-none`} />
            </label>
            <div className="flex justify-end gap-6">
              <button type="button" onClick={() => setIsEditing(false)} className="eyebrow text-ash hover:text-ink">Descartar</button>
              <button type="submit" className="eyebrow text-ink border-b border-ink pb-1">Guardar</button>
            </div>
          </form>
        ) : (
          caption && <p className="eyebrow text-stone text-center m-0 whitespace-pre-line">{caption}</p>
        )}
      </div>
    </div>
  );
};

export default PhotoModal;
