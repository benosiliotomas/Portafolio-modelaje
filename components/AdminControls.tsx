import React from 'react';
import { TrashIcon, PencilIcon, ChevronLeftIcon, ChevronRightIcon, EyeIcon, EyeSlashIcon, StarIcon, ArrowsRightLeftIcon } from './icons';
import { getSection } from '../lib/portfolio';
import { isUnderSized } from '../lib/photoUtils';
import type { Photo, PhotoSection } from '../types';

export interface AdminActions {
  onUpdateCaption: (photoId: string, caption: string) => void;
  onDelete: (photo: Photo) => void;
  onToggleHidden: (photo: Photo) => void;
  onMove: (photo: Photo, direction: -1 | 1) => void;
  onSetSection: (photo: Photo, section: PhotoSection) => void;
  onSetFeatured: (photo: Photo) => void;
}

interface AdminControlsProps {
  photo: Photo;
  actions: AdminActions;
  onEdit: (photo: Photo) => void;
  canMovePrevious: boolean;
  canMoveNext: boolean;
}

const controlClass = 'p-2 bg-surface text-ink border border-hairline hover:bg-paper transition-colors duration-150';

const AdminControls: React.FC<AdminControlsProps> = ({ photo, actions, onEdit, canMovePrevious, canMoveNext }) => {
  const otherSection: PhotoSection = getSection(photo) === 'book' ? 'digitals' : 'book';
  const otherLabel = otherSection === 'book' ? 'book' : 'digitals';

  return (
    <>
      {isUnderSized(photo) && (
        <span
          className="eyebrow absolute bottom-2 right-2 z-10 bg-clay text-surface px-2 py-1"
          title="Se guardó en menor resolución que el original. Volvé a subirla desde el archivo original y borrá esta."
        >
          Volver a subir
        </span>
      )}
      <div className="absolute top-2 right-2 z-10 flex flex-wrap justify-end gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150">
        <button onClick={() => onEdit(photo)} className={controlClass} aria-label="Editar detalles" title="Editar detalles">
          <PencilIcon className="h-4 w-4" />
        </button>
        {!photo.featured && (
          <button onClick={() => actions.onSetFeatured(photo)} className={controlClass} aria-label="Usar como portada" title="Usar como portada">
            <StarIcon className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={() => actions.onSetSection(photo, otherSection)}
          className={controlClass}
          aria-label={`Pasar a ${otherLabel}`}
          title={`Pasar a ${otherLabel}`}
        >
          <ArrowsRightLeftIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => actions.onToggleHidden(photo)}
          className={controlClass}
          aria-label={photo.hidden ? 'Mostrar en el portfolio' : 'Ocultar del portfolio'}
          title={photo.hidden ? 'Mostrar en el portfolio' : 'Ocultar del portfolio'}
        >
          {photo.hidden ? <EyeIcon className="h-4 w-4" /> : <EyeSlashIcon className="h-4 w-4" />}
        </button>
        {canMovePrevious && (
          <button onClick={() => actions.onMove(photo, -1)} className={controlClass} aria-label="Mover antes" title="Mover antes">
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
        )}
        {canMoveNext && (
          <button onClick={() => actions.onMove(photo, 1)} className={controlClass} aria-label="Mover después" title="Mover después">
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={() => {
            if (window.confirm('¿Eliminar esta foto para siempre? Si solo querés sacarla del portfolio, usá "Ocultar".')) {
              actions.onDelete(photo);
            }
          }}
          className={`${controlClass} text-clay`}
          aria-label="Eliminar foto"
          title="Eliminar foto"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </>
  );
};

export default AdminControls;
