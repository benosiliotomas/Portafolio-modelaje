import { describe, it, expect } from 'vitest';
import { pickUgcPhotos, ugcMailto } from './ugc';
import type { Photo } from '../types';

const photo = (id: string, alt: string, overrides: Partial<Photo> = {}): Photo => ({ id, url: `u/${id}`, alt, order: 0, ...overrides });

describe('pickUgcPhotos', () => {
  const photos = [
    photo('runway', 'Pasarela: Gala/Alta Costura'),
    photo('lifestyle', 'Commercial/lifestyle'),
    photo('body', 'Bodyshot comercial'),
    photo('hidden', 'Comercial', { hidden: true }),
    photo('mixed', 'Comercial / Pasarela. '),
  ];

  it('keeps commercial and lifestyle photos, in order', () => {
    expect(pickUgcPhotos(photos).map(p => p.id)).toEqual(['lifestyle', 'body', 'mixed']);
  });

  it('never shows hidden photos', () => {
    expect(pickUgcPhotos(photos).map(p => p.id)).not.toContain('hidden');
  });

  it('caps the strip at three photos', () => {
    const many = Array.from({ length: 5 }, (_, i) => photo(`c${i}`, 'Comercial'));
    expect(pickUgcPhotos(many)).toHaveLength(3);
  });
});

describe('ugcMailto', () => {
  it('pre-fills a UGC subject line', () => {
    expect(ugcMailto('a@b.com')).toBe('mailto:a@b.com?subject=Consulta%20UGC');
  });
});
