import type { Photo, PhotoSection } from '../types';

export interface PortfolioSections {
  cover: Photo | null;
  book: Photo[];
  digitals: Photo[];
}

// Photos uploaded before sections existed were labelled "Polaroid" when they were digitals.
export function getSection(photo: Photo): PhotoSection {
  if (photo.section) return photo.section;
  return photo.alt.trim().toLowerCase() === 'polaroid' ? 'digitals' : 'book';
}

export function splitPortfolio(photos: Photo[]): PortfolioSections {
  const book = photos.filter(p => getSection(p) === 'book');
  const cover = photos.find(p => p.featured) ?? book[0] ?? null;
  const withoutCover = (list: Photo[]) => list.filter(p => p.id !== cover?.id);
  return {
    cover,
    book: withoutCover(book),
    digitals: withoutCover(photos.filter(p => getSection(p) === 'digitals')),
  };
}

/**
 * Editorial rhythm for the book on tablet/desktop: groups of three, one large photo
 * (8 of 12 columns, two rows) beside two small ones, alternating sides. Phones get
 * a single column. An incomplete last group falls back to half-width tiles.
 */
export function bookTileClass(index: number, total: number): string {
  const fullGroupsEnd = Math.floor(total / 3) * 3;

  if (index >= fullGroupsEnd) {
    const leftover = total - fullGroupsEnd;
    return leftover === 1
      ? 'col-span-12 sm:col-span-6 sm:col-start-4 aspect-[4/5]'
      : 'col-span-12 sm:col-span-6 aspect-[4/5]';
  }

  const mirrored = Math.floor(index / 3) % 2 === 1;
  const isLarge = index % 3 === 0;
  if (isLarge) {
    return `col-span-12 sm:col-span-8 sm:row-span-2 aspect-[4/5] sm:aspect-auto${mirrored ? ' sm:col-start-5' : ''}`;
  }
  return `col-span-12 sm:col-span-4 aspect-[4/5]${mirrored ? ' sm:col-start-1' : ''}`;
}

/** Swaps a photo with its neighbour in the same section, keeping the global order otherwise intact. */
export function moveWithinSection(photos: Photo[], photoId: string, direction: -1 | 1): Photo[] {
  const fromIndex = photos.findIndex(p => p.id === photoId);
  if (fromIndex === -1) return photos;
  const section = getSection(photos[fromIndex]);

  let toIndex = fromIndex + direction;
  while (toIndex >= 0 && toIndex < photos.length && getSection(photos[toIndex]) !== section) {
    toIndex += direction;
  }
  if (toIndex < 0 || toIndex >= photos.length) return photos;

  const reordered = [...photos];
  [reordered[fromIndex], reordered[toIndex]] = [reordered[toIndex], reordered[fromIndex]];
  return reordered;
}
