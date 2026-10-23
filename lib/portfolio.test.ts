import { describe, it, expect } from 'vitest';
import { getSection, splitPortfolio, bookTileClass, moveWithinSection } from './portfolio';
import type { Photo } from '../types';

const photo = (id: string, overrides: Partial<Photo> = {}): Photo => ({
  id,
  url: `https://x/${id}.webp`,
  alt: 'Pasarela',
  order: 0,
  ...overrides,
});

describe('getSection', () => {
  it('uses the stored section when there is one', () => {
    expect(getSection(photo('a', { alt: 'Polaroid', section: 'book' }))).toBe('book');
  });

  it('treats legacy "Polaroid" photos as digitals', () => {
    expect(getSection(photo('a', { alt: 'Polaroid' }))).toBe('digitals');
  });

  it('defaults everything else to the book', () => {
    expect(getSection(photo('a', { alt: 'Comercial / Pasarela. ' }))).toBe('book');
  });
});

describe('splitPortfolio', () => {
  const photos = [
    photo('d1', { alt: 'Polaroid' }),
    photo('b1'),
    photo('b2'),
    photo('d2', { alt: 'Polaroid' }),
  ];

  it('uses the featured photo as cover and removes it from its section', () => {
    const result = splitPortfolio([...photos, photo('b3', { featured: true })]);
    expect(result.cover?.id).toBe('b3');
    expect(result.book.map(p => p.id)).toEqual(['b1', 'b2']);
  });

  it('falls back to the first book photo when nothing is featured', () => {
    const result = splitPortfolio(photos);
    expect(result.cover?.id).toBe('b1');
    expect(result.book.map(p => p.id)).toEqual(['b2']);
  });

  it('keeps digitals in their own list, in order', () => {
    expect(splitPortfolio(photos).digitals.map(p => p.id)).toEqual(['d1', 'd2']);
  });

  it('can feature a digital without removing the rest', () => {
    const result = splitPortfolio([photo('d1', { alt: 'Polaroid', featured: true }), photo('b1')]);
    expect(result.cover?.id).toBe('d1');
    expect(result.digitals).toEqual([]);
    expect(result.book.map(p => p.id)).toEqual(['b1']);
  });

  it('returns no cover for an empty portfolio', () => {
    expect(splitPortfolio([])).toEqual({ cover: null, book: [], digitals: [] });
  });
});

describe('bookTileClass', () => {
  it('makes the first photo of each group of three the large one', () => {
    expect(bookTileClass(0, 6)).toContain('row-span-2');
    expect(bookTileClass(1, 6)).not.toContain('row-span-2');
    expect(bookTileClass(3, 6)).toContain('row-span-2');
  });

  it('mirrors every other group so the large photo alternates sides', () => {
    expect(bookTileClass(0, 6)).not.toContain('col-start-5');
    expect(bookTileClass(3, 6)).toContain('col-start-5');
  });

  it('lays out an incomplete last group as half-width tiles', () => {
    expect(bookTileClass(3, 5)).toContain('col-span-6');
    expect(bookTileClass(4, 5)).toContain('col-span-6');
    expect(bookTileClass(3, 4)).toContain('col-span-6');
    expect(bookTileClass(3, 4)).toContain('col-start-4');
  });
});

describe('moveWithinSection', () => {
  const all = [
    photo('b1'),
    photo('d1', { alt: 'Polaroid' }),
    photo('b2'),
    photo('d2', { alt: 'Polaroid' }),
    photo('b3'),
  ];
  const ids = (list: Photo[]) => list.map(p => p.id);

  it('swaps a photo with its next neighbour in the same section', () => {
    expect(ids(moveWithinSection(all, 'b1', 1))).toEqual(['b2', 'd1', 'b1', 'd2', 'b3']);
  });

  it('skips photos from the other section', () => {
    expect(ids(moveWithinSection(all, 'd2', -1))).toEqual(['b1', 'd2', 'b2', 'd1', 'b3']);
  });

  it('returns the same order at the edges of a section', () => {
    expect(ids(moveWithinSection(all, 'b3', 1))).toEqual(ids(all));
    expect(ids(moveWithinSection(all, 'd1', -1))).toEqual(ids(all));
  });

  it('does not mutate the input', () => {
    const before = ids(all);
    moveWithinSection(all, 'b1', 1);
    expect(ids(all)).toEqual(before);
  });
});
