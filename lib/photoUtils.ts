import type { Photo } from '../types';

export const MODEL_NAME = 'Tomás Benosilio';

// Rendered widths: phone (1 column), tablet/desktop grid, full-screen viewer.
export const VARIANT_WIDTHS = [480, 1080, 2000] as const;

export function targetWidths(originalWidth: number): number[] {
  const widths = VARIANT_WIDTHS.filter(w => w <= originalWidth);
  return widths.length > 0 ? widths : [originalWidth];
}

export function buildSrcSet(photo: Photo): string | undefined {
  if (!photo.variants || photo.variants.length === 0) return undefined;
  return [...photo.variants]
    .sort((a, b) => a.width - b.width)
    .map(v => `${v.url} ${v.width}w`)
    .join(', ');
}

const PLACEHOLDER_LABELS = new Set(['', '.', '-', 'sin título']);

export function photoAltText(photo: Photo, index: number): string {
  const label = photo.alt.trim().replace(/\.+$/, '').trim();
  if (PLACEHOLDER_LABELS.has(label.toLowerCase())) {
    return `${MODEL_NAME}, foto ${index + 1} del portfolio`;
  }
  if (label.toLowerCase() === 'polaroid') {
    return `${MODEL_NAME} — digital (polaroid)`;
  }
  return `${MODEL_NAME} — ${label}`;
}

export function getVisiblePhotos(photos: Photo[], isAdmin: boolean): Photo[] {
  return isAdmin ? photos : photos.filter(p => !p.hidden);
}

export function ageOn(birthDate: Date, today: Date): number {
  const age = today.getFullYear() - birthDate.getFullYear();
  const hadBirthday =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  return hadBirthday ? age : age - 1;
}

export function cmToInches(cm: number): string {
  const halfInches = Math.round((cm / 2.54) * 2) / 2;
  return `${halfInches}"`;
}

export function metersToFeetInches(meters: number): string {
  const totalInches = Math.round((meters * 100) / 2.54);
  return `${Math.floor(totalInches / 12)}'${totalInches % 12}"`;
}
