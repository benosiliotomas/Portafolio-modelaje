import type { Photo } from '../types';

export const MODEL_NAME = 'Tomás Benosilio';

// Rendered widths: phone (1 column), tablet/desktop grid, full-screen viewer.
export const VARIANT_WIDTHS = [480, 1080, 2000] as const;

/**
 * Sizes to generate for an upload. The largest is always the original width (capped at
 * 2000px), so a 724px photo is kept at 724px rather than stopping at the 480px step.
 */
export function targetWidths(originalWidth: number): number[] {
  const largest = Math.min(originalWidth, VARIANT_WIDTHS[VARIANT_WIDTHS.length - 1]);
  const smaller = VARIANT_WIDTHS.filter(w => w < largest);
  return [...smaller, largest];
}

export function buildSrcSet(photo: Photo): string | undefined {
  if (!photo.variants || photo.variants.length === 0) return undefined;
  return [...photo.variants]
    .sort((a, b) => a.width - b.width)
    .map(v => `${v.url} ${v.width}w`)
    .join(', ');
}

const PLACEHOLDER_LABELS = new Set(['', '.', '-', 'sin título']);

/** Collapses line breaks and strips invisible marks (e.g. U+200E pasted from Instagram). */
const singleLine = (text: string): string =>
  text.replace(/[​-‏⁠﻿]/g, '').replace(/\s+/g, ' ').trim();

/**
 * Text for screen readers and image search. The admin only writes a caption, so the caption
 * describes the photo; the older separate description field is the fallback for earlier uploads.
 */
export function photoAltText(photo: Photo, index: number): string {
  const caption = singleLine(photo.concept ?? '');
  if (caption) return `${MODEL_NAME} — ${caption}`;

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

/**
 * True for photos uploaded before the size fix: their largest stored version is smaller than
 * the original allowed (e.g. a 724px photo kept only at 480px). The admin shows a re-upload hint.
 */
export function isUnderSized(photo: Photo): boolean {
  if (!photo.width || !photo.variants?.length) return false;
  const expected = Math.min(photo.width, VARIANT_WIDTHS[VARIANT_WIDTHS.length - 1]);
  return Math.max(...photo.variants.map(v => v.width)) < expected;
}
