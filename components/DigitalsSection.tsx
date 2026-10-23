import React from 'react';
import PhotoImage from './PhotoImage';
import { SectionHeading } from './BookSection';
import type { Photo } from '../types';

interface DigitalsSectionProps {
  photos: Photo[];
  onOpen: (photo: Photo) => void;
  renderControls?: (photo: Photo, index: number) => React.ReactNode;
}

const captionFor = (photo: Photo, index: number): string =>
  photo.concept?.trim() || `Digital ${String(index + 1).padStart(2, '0')}`;

// Digitals are what the industry calls "polaroids", so this is the one place the polaroid frame belongs.
const DigitalsSection: React.FC<DigitalsSectionProps> = ({ photos, onOpen, renderControls }) => {
  if (photos.length === 0) return null;

  return (
    <section id="digitals" aria-labelledby="digitals-heading" className="max-w-7xl mx-auto px-4 sm:px-8 pt-[var(--space-section)] scroll-mt-14">
      <div className="-mx-4 sm:mx-0">
        <SectionHeading id="digitals-heading" number="02" title="Digitals" count={photos.length} />
      </div>
      <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 list-none p-0 m-0">
        {photos.map((photo, index) => (
          <li key={photo.id} className={`relative group ${photo.hidden ? 'opacity-40' : ''}`}>
            <button
              onClick={() => onOpen(photo)}
              className="block w-full bg-surface border border-hairline p-[4%] pb-0 text-left hover:border-ash transition-colors duration-150"
              aria-label={`Ver ${captionFor(photo, index)} en grande`}
            >
              <div className="aspect-[4/5] overflow-hidden bg-hairline">
                <PhotoImage photo={photo} index={index} sizes="(min-width: 1024px) 22vw, 46vw" />
              </div>
              <span className="eyebrow block text-stone py-[9%] truncate">{captionFor(photo, index)}</span>
            </button>
            {photo.hidden && <span className="eyebrow absolute top-3 left-3 bg-surface text-ink px-2 py-1">Oculta</span>}
            {renderControls?.(photo, index)}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default DigitalsSection;
