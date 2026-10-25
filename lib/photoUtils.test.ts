import { describe, it, expect } from 'vitest';
import {
  targetWidths,
  buildSrcSet,
  photoAltText,
  getVisiblePhotos,
  ageOn,
  cmToInches,
  metersToFeetInches,
  isUnderSized,
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
  it('keeps the original width as the largest size, so nothing above 1080px is lost', () => {
    expect(targetWidths(1600)).toEqual([480, 1080, 1600]);
  });

  it('keeps a mid-size photo at full resolution instead of shrinking it to 480px', () => {
    expect(targetWidths(724)).toEqual([480, 724]);
    expect(targetWidths(900)).toEqual([480, 900]);
  });

  it('caps large originals at 2000px', () => {
    expect(targetWidths(3182)).toEqual([480, 1080, 2000]);
    expect(targetWidths(2000)).toEqual([480, 1080, 2000]);
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
  it('describes the photo with its caption, on one line', () => {
    expect(photoAltText(photo({ alt: '', concept: 'Desfile 15 años de Suma Models. \nMarca: Lobo Gris.' }), 0)).toBe(
      'Tomás Benosilio — Desfile 15 años de Suma Models. Marca: Lobo Gris.'
    );
  });

  it('ignores invisible characters pasted into a caption', () => {
    expect(photoAltText(photo({ alt: '', concept: '\u200e Sastrería. Marca: Inti Huatana.' }), 0)).toBe(
      'Tomás Benosilio — Sastrería. Marca: Inti Huatana.'
    );
  });

  it('prefers the caption over the old description field', () => {
    expect(photoAltText(photo({ alt: 'Pasarela', concept: 'Marca: Tecnióptica.' }), 0)).toBe('Tomás Benosilio — Marca: Tecnióptica.');
  });

  it('numbers photos that have neither caption nor description', () => {
    expect(photoAltText(photo({ alt: '', concept: '' }), 2)).toBe('Tomás Benosilio, foto 3 del portfolio');
  });

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

describe('isUnderSized', () => {
  const withVariants = (width: number, widths: number[]) =>
    photo({ width, variants: widths.map(w => ({ width: w, url: `u/${w}` })) });

  it('flags photos whose largest stored size is below what the original allowed', () => {
    expect(isUnderSized(withVariants(724, [480]))).toBe(true);
    expect(isUnderSized(withVariants(1365, [480, 1080]))).toBe(true);
  });

  it('accepts photos stored at full size or at the 2000px cap', () => {
    expect(isUnderSized(withVariants(724, [480, 724]))).toBe(false);
    expect(isUnderSized(withVariants(3182, [480, 1080, 2000]))).toBe(false);
  });

  it('ignores photos without size information', () => {
    expect(isUnderSized(photo())).toBe(false);
  });
});
