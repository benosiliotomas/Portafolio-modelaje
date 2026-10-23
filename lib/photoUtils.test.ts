import { describe, it, expect } from 'vitest';
import {
  targetWidths,
  buildSrcSet,
  photoAltText,
  getVisiblePhotos,
  ageOn,
  cmToInches,
  metersToFeetInches,
} from './photoUtils';
import type { Photo } from '../types';

const photo = (overrides: Partial<Photo> = {}): Photo => ({
  id: 'p1',
  url: 'https://example.com/full.webp',
  alt: 'Pasarela',
  order: 0,
  ...overrides,
});

describe('targetWidths', () => {
  it('keeps only the widths that do not upscale the original', () => {
    expect(targetWidths(1600)).toEqual([480, 1080]);
  });

  it('returns every width for large originals', () => {
    expect(targetWidths(3182)).toEqual([480, 1080, 2000]);
  });

  it('falls back to the original width when it is smaller than every target', () => {
    expect(targetWidths(300)).toEqual([300]);
  });

  it('includes a width that matches the original exactly', () => {
    expect(targetWidths(1080)).toEqual([480, 1080]);
  });
});

describe('buildSrcSet', () => {
  it('returns undefined when the photo has no variants', () => {
    expect(buildSrcSet(photo())).toBeUndefined();
  });

  it('lists variants from smallest to largest', () => {
    const p = photo({
      variants: [
        { width: 1080, url: 'https://x/1080.webp' },
        { width: 480, url: 'https://x/480.webp' },
      ],
    });
    expect(buildSrcSet(p)).toBe('https://x/480.webp 480w, https://x/1080.webp 1080w');
  });
});

describe('photoAltText', () => {
  it('prefixes a meaningful label with the model name', () => {
    expect(photoAltText(photo({ alt: 'Pasarela / Eyewear editorial. ' }), 0)).toBe(
      'Tomás Benosilio — Pasarela / Eyewear editorial'
    );
  });

  it('uses a numbered fallback for placeholder labels', () => {
    expect(photoAltText(photo({ alt: '.' }), 4)).toBe('Tomás Benosilio, foto 5 del portfolio');
  });

  it('describes generic polaroid labels as digitals', () => {
    expect(photoAltText(photo({ alt: 'Polaroid' }), 0)).toBe('Tomás Benosilio — digital (polaroid)');
  });
});

describe('getVisiblePhotos', () => {
  const photos = [photo({ id: 'a' }), photo({ id: 'b', hidden: true })];

  it('hides photos marked as hidden for visitors', () => {
    expect(getVisiblePhotos(photos, false).map(p => p.id)).toEqual(['a']);
  });

  it('shows every photo to the admin', () => {
    expect(getVisiblePhotos(photos, true).map(p => p.id)).toEqual(['a', 'b']);
  });
});

describe('ageOn', () => {
  const birth = new Date(2006, 10, 6); // 6 Nov 2006

  it('does not count the birthday before it happens', () => {
    expect(ageOn(birth, new Date(2026, 9, 23))).toBe(19);
  });

  it('counts the birthday on the day itself', () => {
    expect(ageOn(birth, new Date(2026, 10, 6))).toBe(20);
  });
});

describe('unit conversion', () => {
  it('converts centimetres to inches with half-inch precision', () => {
    expect(cmToInches(92)).toBe('36"');
    expect(cmToInches(75)).toBe('29.5"');
  });

  it('converts metres to feet and inches', () => {
    expect(metersToFeetInches(1.85)).toBe(`6'1"`);
  });
});
