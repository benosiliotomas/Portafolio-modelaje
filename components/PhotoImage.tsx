import React from 'react';
import { buildSrcSet, photoAltText } from '../lib/photoUtils';
import type { Photo } from '../types';

interface PhotoImageProps {
  photo: Photo;
  index: number;
  /** Rendered width hint for srcset, e.g. "(min-width: 640px) 66vw, 100vw". */
  sizes: string;
  priority?: boolean;
  className?: string;
}

const PhotoImage: React.FC<PhotoImageProps> = ({ photo, index, sizes, priority = false, className = '' }) => (
  <img
    src={photo.variants ? photo.variants[0].url : photo.url}
    srcSet={buildSrcSet(photo)}
    sizes={sizes}
    alt={photoAltText(photo, index)}
    width={photo.width ?? 800}
    height={photo.height ?? 1000}
    loading={priority ? 'eager' : 'lazy'}
    fetchPriority={priority ? 'high' : 'auto'}
    decoding="async"
    referrerPolicy="no-referrer"
    className={`w-full h-full object-cover ${className}`}
  />
);

export default PhotoImage;
