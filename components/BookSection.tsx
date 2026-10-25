import React from 'react';
import PhotoImage from './PhotoImage';
import { bookTileClass } from '../lib/portfolio';
import type { Photo } from '../types';

interface PhotoSectionProps {
  photos: Photo[];
  onOpen: (photo: Photo) => void;
  /** Admin-only overlay for each photo. */
  renderControls?: (photo: Photo, index: number) => React.ReactNode;
}

export const SectionHeading: React.FC<{ id: string; number: string; title: string }> = ({ id, number, title }) => (
  <div className="flex items-baseline justify-between gap-4 px-4 sm:px-0 mb-8 sm:mb-10">
    <h2 id={id} className="text-4xl sm:text-5xl text-ink m-0">
      <span className="eyebrow text-ash align-middle mr-4">{number}</span>
      {title}
    </h2>
  </div>
);

const BookSection: React.FC<PhotoSectionProps> = ({ photos, onOpen, renderControls }) => {
  if (photos.length === 0) return null;

  return (
    <section id="book" aria-labelledby="book-heading" className="max-w-7xl mx-auto sm:px-8 pt-[var(--space-section)] scroll-mt-14">
      <SectionHeading id="book-heading" number="01" title="Book" />
      <ul className="grid grid-cols-12 grid-flow-row-dense gap-3 list-none p-0 m-0">
        {photos.map((photo, index) => (
          <li key={photo.id} className={`relative group bg-hairline overflow-hidden ${bookTileClass(index, photos.length)} ${photo.hidden ? 'opacity-40' : ''}`}>
            <button onClick={() => onOpen(photo)} className="block w-full h-full" aria-label="Ver foto en grande">
              <PhotoImage
                photo={photo}
                index={index + 1}
                sizes={index % 3 === 0 ? '(min-width: 640px) 66vw, 100vw' : '(min-width: 640px) 33vw, 100vw'}
                className="transition-transform duration-300 ease-out group-hover:scale-[1.015]"
              />
            </button>
            {photo.hidden && <span className="eyebrow absolute bottom-2 left-2 bg-surface text-ink px-2 py-1">Oculta</span>}
            {renderControls?.(photo, index)}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default BookSection;
